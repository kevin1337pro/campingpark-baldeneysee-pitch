import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
function run(cmd, args, cwd = process.cwd(), capture = false) {
  const commandArgs = cmd === "git"
    ? ["-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential", ...args]
    : args;
  const r = spawnSync(cmd, commandArgs, {
    cwd,
    stdio: capture ? "pipe" : "inherit",
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (r.status !== 0)
    throw new Error(
      `${cmd} ${args.join(" ")} failed${capture ? ": " + r.stderr : ""}`,
    );
  return r.stdout?.trim() ?? "";
}
const source = process.cwd();
const remote = run("git", ["remote", "get-url", "origin"], source, true);
const name = run("git", ["config", "user.name"], source, true);
const email = run("git", ["config", "user.email"], source, true);
run(process.execPath, ["scripts/build-pages.mjs"]);
const checkout = mkdtempSync(join(tmpdir(), "baldeneysee-pages-"));
try {
  const exists = run(
    "git",
    ["ls-remote", "--heads", remote, "gh-pages"],
    source,
    true,
  );
  if (exists)
    run("git", [
      "clone",
      "--branch",
      "gh-pages",
      "--single-branch",
      "--depth",
      "1",
      remote,
      checkout,
    ]);
  else {
    run("git", ["init", "-b", "gh-pages"], checkout);
    run("git", ["remote", "add", "origin", remote], checkout);
  }
  run("git", ["config", "user.name", name], checkout);
  run("git", ["config", "user.email", email], checkout);
  for (const file of readdirSync(checkout))
    if (file !== ".git")
      rmSync(join(checkout, file), { recursive: true, force: true });
  cpSync(join(source, "out"), checkout, { recursive: true });
  run("git", ["add", "--all"], checkout);
  if (run("git", ["status", "--porcelain"], checkout, true)) {
    const sha = run("git", ["rev-parse", "--short", "HEAD"], source, true);
    run("git", ["commit", "--quiet", "-m", `Publish demo from ${sha}`], checkout);
    run("git", ["push", "origin", "HEAD:gh-pages"], checkout);
  } else console.log("GitHub Pages output is already current.");
} finally {
  rmSync(checkout, { recursive: true, force: true });
}
