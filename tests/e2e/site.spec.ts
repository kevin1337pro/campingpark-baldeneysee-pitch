import { test, expect, type Page } from "@playwright/test";
const next = (page: Page) =>
  page.getByRole("button", { name: "Weiter", exact: true }).click();
async function dates(page: Page) {
  await page.getByLabel("Anreise", { exact: true }).fill("2030-06-10");
  await page.getByLabel("Abreise", { exact: true }).fill("2030-06-13");
  await next(page);
}
async function category(page: Page) {
  await page.getByRole("radio", { name: /Touristischer Stellplatz/ }).check();
  await page.getByLabel("Fahrzeuglänge in Metern").fill("6.5");
  await next(page);
}
test("390px complete stay, back/edit, conditional child age, error and retry, no network send", async ({
  page,
}) => {
  const writes: string[] = [];
  const errors: string[] = [];
  page.on("request", (r) => {
    if (!["GET", "HEAD"].includes(r.method())) writes.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/anfragen");
  await dates(page);
  await next(page);
  await page.getByRole("button", { name: "Zurück", exact: true }).click();
  await page.getByRole("button", { name: "Erwachsene erhöhen" }).click();
  await page.getByRole("button", { name: "Kinder erhöhen" }).click();
  await next(page);
  await expect(page.locator(".error-summary")).toContainText("Alter");
  await page.getByLabel("Kind 1", { exact: true }).selectOption("7");
  await next(page);
  await category(page);
  await page
    .getByLabel("Gewünschtes Anreisefenster")
    .selectOption("15:00–18:00 Uhr");
  await page
    .getByLabel("Wünsche & Hinweise")
    .fill("Möglichst kurzer Weg zum Eingang.");
  await next(page);
  await page.getByRole("button", { name: "Beispieldaten einsetzen" }).click();
  await page.getByRole("checkbox", { name: /Ich habe verstanden/ }).check();
  await next(page);
  await expect(
    page.getByText("3 Erwachsene · 1 Kind (Alter: 7)", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reisezeit bearbeiten" }).click();
  await expect(page.getByLabel("Abreise", { exact: true })).toHaveValue(
    "2030-06-13",
  );
  await page.getByRole("button", { name: "6 Prüfen & abschließen" }).click();
  await page.getByText("Demo-Funktion: Fehlerfall testen").click();
  await page
    .getByRole("checkbox", { name: "Versandfehler simulieren" })
    .check();
  await page.getByRole("button", { name: "Anfrage als Demo testen" }).click();
  await expect(page.locator(".error-summary")).toContainText(
    "Simulierter Versandfehler",
  );
  await expect(
    page.getByText("Alex Beispiel · alex@example.com"),
  ).toBeVisible();
  await page
    .getByRole("checkbox", { name: "Versandfehler simulieren" })
    .uncheck();
  await page.screenshot({
    path: "docs/screenshots/anfrage-mobile-pruefen.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Anfrage als Demo testen" })
    .dblclick();
  await expect(
    page.getByRole("heading", { name: "Demo abgeschlossen." }),
  ).toBeVisible();
  await expect(
    page.getByText("Es wurde keine Anfrage versendet.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/DEMO-/)).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/demo-abschluss-mobile.png",
    fullPage: true,
  });
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
});
test("invalid dates, missing category and contact errors prevent progress", async ({
  page,
}) => {
  await page.goto("/anfragen");
  await page.getByLabel("Anreise", { exact: true }).fill("2030-06-10");
  await page.getByLabel("Abreise", { exact: true }).fill("2030-06-09");
  await next(page);
  await expect(page.locator(".error-summary")).toContainText(
    "Abreise muss nach",
  );
  await page.getByLabel("Abreise", { exact: true }).fill("2030-06-13");
  await next(page);
  await next(page);
  await next(page);
  await expect(page.locator(".error-summary")).toContainText("Kategorie");
  await category(page);
  await next(page);
  await next(page);
  await expect(page.locator(".error-summary")).toContainText(
    "gültige E-Mail-Adresse",
  );
  await expect(page.locator(".error-summary")).toContainText("Demo-Hinweis");
});
test("travel changes reset incompatible dimensions; data survives navigation", async ({
  page,
}) => {
  await page.goto("/anfragen");
  await dates(page);
  await next(page);
  await category(page);
  await page.getByRole("button", { name: "2 Reiseart & Gäste" }).click();
  await page.getByRole("radio", { name: "Zelt", exact: true }).check();
  await expect(page.locator(".form-notice")).toContainText("Reiseart geändert");
  await next(page);
  await expect(page.getByLabel("Zeltlänge in Metern")).toHaveValue("");
  await expect(
    page.getByRole("radio", { name: /Zeltplatz/ }),
  ).not.toBeChecked();
  await page.getByRole("radio", { name: /Zeltplatz/ }).check();
  await page.getByLabel("Zeltlänge in Metern").fill("3");
  await page.getByLabel("Zeltbreite in Metern").fill("2.5");
  await next(page);
  await expect(
    page.getByRole("heading", { name: "Was dürfen wir wissen?" }),
  ).toBeVisible();
});
test("mobile and desktop, all supplied photos, no horizontal overflow, menu/FAQ and metadata", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/");
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
        .toBeGreaterThan(0);
    }
    await expect(page.locator("main img")).toHaveCount(7);
    await page.locator("#campingtag").scrollIntoViewIfNeeded();
    await expect(page.locator(".camping-scene")).toHaveAttribute(
      "data-time",
      "24.00",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page
      .locator("summary")
      .filter({ hasText: "Was kostet mein Aufenthalt?" })
      .click();
    await expect(
      page.getByText(
        "Die vollständigen Tarife sind für dieses Konzept noch nicht bestätigt.",
        { exact: false },
      ),
    ).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/screenshots/startseite-${width}-viewport.png`,
    });
    await page.screenshot({
      path: `docs/screenshots/startseite-${width}.png`,
      fullPage: true,
    });
    await expect(page.locator("meta[name=robots]")).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  await page
    .getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("link", { name: "Camping", exact: true })
    .click();
  await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeVisible();
});
test("animation: 24 seconds, pause/restart, scene actions and mobile framing", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#campingtag").scrollIntoViewIfNeeded();
  const film = page.locator(".camping-film");
  await film.scrollIntoViewIfNeeded();
  const scene = page.locator(".camping-scene");
  await expect(scene).toHaveAttribute("data-layout", "mobile");
  await expect(scene).toHaveAttribute("viewBox", "0 0 640 800");
  await page.getByRole("button", { name: "Noch einmal ansehen" }).click();
  await page.waitForTimeout(4200);
  await page.getByRole("button", { name: "Animation pausieren" }).click();
  const paused = await scene.getAttribute("data-time");
  await page.waitForTimeout(350);
  expect(await scene.getAttribute("data-time")).toBe(paused);
  await page.screenshot({
    path: "docs/screenshots/animation-04-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Animation abspielen" }).click();
  await page.waitForTimeout(7800);
  await expect(page.locator(".camper")).toHaveCount(2);
  await expect(page.locator(".tent")).toBeVisible();
  await page.getByRole("button", { name: "Animation pausieren" }).click();
  await film.screenshot({ path: "docs/screenshots/animation-12-mobile.png" });
  await page.getByRole("button", { name: "Animation abspielen" }).click();
  await page.waitForTimeout(12500);
  await expect(scene).toHaveAttribute("data-time", "24.00");
  await expect(
    page.getByText("Deine Auszeit wartet.", { exact: true }),
  ).toBeVisible();
  await film.screenshot({ path: "docs/screenshots/animation-24-mobile.png" });
  await page
    .getByRole("button", { name: "Alternative mit Laterne ansehen" })
    .click();
  await expect(
    page.getByRole("button", { name: "Feuer-Konzept ansehen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Noch einmal ansehen" }).click();
  await expect
    .poll(async () => Number(await scene.getAttribute("data-time")))
    .toBeLessThan(3);
});
test("reduced motion renders completed static evening; keyboard controls remain available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#campingtag").scrollIntoViewIfNeeded();
  const film = page.locator(".camping-film");
  await film.scrollIntoViewIfNeeded();
  await expect(page.locator(".camping-scene")).toHaveAttribute(
    "data-time",
    "24.00",
  );
  await expect(
    page.getByText("Statisches Abendmotiv · reduzierte Bewegung"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Animation pausieren" }),
  ).toHaveCount(0);
  await film.screenshot({
    path: "docs/screenshots/animation-reduced-motion.png",
  });
  await page.waitForTimeout(250);
  await expect(page.locator(".camping-scene")).toHaveAttribute(
    "data-time",
    "24.00",
  );
});

test("the entire request works using only Tab, Enter, Space and typing", async ({
  page,
}) => {
  const tabTo = async (locator: ReturnType<Page["locator"]>) => {
    for (let i = 0; i < 100; i++) {
      if (await locator.evaluate((el) => el === document.activeElement)) return;
      await page.keyboard.press("Tab");
    }
    throw new Error("Control is not keyboard reachable");
  };
  const activate = async (
    locator: ReturnType<Page["locator"]>,
    key = "Enter",
  ) => {
    await tabTo(locator);
    await page.keyboard.press(key);
  };
  await page.goto("/");
  await activate(page.getByRole("link", { name: "Deine Auszeit planen" }));
  await expect(
    page.getByRole("heading", { name: "Wann zieht es dich raus?" }),
  ).toBeVisible();
  await activate(page.getByRole("button", { name: "Nächster Monat" }));
  const month = await page.locator(".calendar-header strong").innerText();
  await activate(
    page.getByRole("button", { name: `1. ${month}`, exact: true }),
  );
  await activate(
    page.getByRole("button", { name: `4. ${month}`, exact: true }),
  );
  await activate(page.getByRole("button", { name: "Weiter", exact: true }));
  await expect(
    page.getByRole("heading", { name: "Wer kommt mit?" }),
  ).toBeFocused();
  await activate(page.getByRole("button", { name: "Erwachsene erhöhen" }));
  await activate(page.getByRole("button", { name: "Weiter", exact: true }));
  await activate(
    page.getByRole("radio", { name: "Touristischer Stellplatz" }),
    "Space",
  );
  await tabTo(page.getByLabel("Fahrzeuglänge in Metern"));
  await page.keyboard.type("6.5");
  await activate(page.getByRole("button", { name: "Weiter", exact: true }));
  await activate(page.getByRole("button", { name: "Weiter", exact: true }));
  await activate(page.getByRole("button", { name: "Beispieldaten einsetzen" }));
  await activate(
    page.getByRole("checkbox", { name: /Ich habe verstanden/ }),
    "Space",
  );
  await activate(page.getByRole("button", { name: "Weiter", exact: true }));
  await activate(page.getByRole("button", { name: "Anfrage als Demo testen" }));
  await expect(
    page.getByRole("heading", { name: "Demo abgeschlossen." }),
  ).toBeFocused();
});
