import test from "node:test";
import assert from "node:assert/strict";
import {
  calendarDay,
  changeTravel,
  initialStay,
  nights,
  validateStep,
  validateStay,
  type Stay,
} from "../lib/booking/model";
import { demoAdapter } from "../lib/booking/adapter";
const valid: Stay = {
  ...initialStay,
  arrival: "2030-06-10",
  departure: "2030-06-13",
  category: "Touristischer Stellplatz",
  length: "6.5",
  name: "Alex Beispiel",
  email: "alex@example.com",
  consent: true,
};
test("Local calendar nights remain correct across both daylight saving changes", () => {
  assert.equal(nights("2026-10-24", "2026-10-27"), 3);
  assert.equal(nights("2026-03-28", "2026-03-31"), 3);
  assert.equal(nights("2028-02-28", "2028-03-01"), 2);
});
test("Reject impossible, past, same-day and reversed dates without changing the stay", () => {
  assert.ok(Number.isNaN(calendarDay("2026-02-30")));
  for (const departure of ["2030-06-10", "2030-06-09", "bad"])
    assert.ok(validateStep({ ...valid, departure }, 0, "2026-09-30").departure);
  assert.ok(
    validateStep({ ...valid, arrival: "2026-09-29" }, 0, "2026-09-30").arrival,
  );
  assert.equal(valid.departure, "2030-06-13");
});
test("Children require ages only when selected; boundaries remain valid", () => {
  assert.deepEqual(validateStep(valid, 1), {});
  assert.ok(validateStep({ ...valid, children: 1, ages: [""] }, 1)["age-0"]);
  assert.deepEqual(
    validateStep({ ...valid, children: 2, ages: ["0", "17"] }, 1),
    {},
  );
  assert.ok(validateStep({ ...valid, children: 1, ages: ["18"] }, 1)["age-0"]);
});
test("Changing travel type resets incompatible category and dimensions, preserving other inputs", () => {
  const changed = changeTravel(valid, "Zelt");
  assert.equal(changed.category, "");
  assert.equal(changed.length, "");
  assert.equal(changed.arrival, valid.arrival);
  assert.equal(changed.name, valid.name);
  assert.ok(validateStep(changed, 2).category);
  assert.ok(
    validateStep({ ...changed, category: "Zeltplatz", length: "3" }, 2).width,
  );
  assert.deepEqual(
    validateStep(
      { ...changed, category: "Zeltplatz", length: "3", width: "2.5" },
      2,
    ),
    {},
  );
});
test("Required contact and demo acknowledgement are validated", () => {
  const errors = validateStep(
    { ...valid, name: "", email: "bad", consent: false },
    4,
  );
  assert.deepEqual(Object.keys(errors).sort(), ["consent", "email", "name"]);
  assert.deepEqual(validateStay(valid), {});
});
test("Mock adapter has no network effects; failures retain input and success cannot claim a booking", async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    throw new Error("Network forbidden");
  };
  try {
    const snapshot = structuredClone(valid);
    await assert.rejects(
      demoAdapter.submit(valid, { simulateError: true }),
      /Simulierter Versandfehler/,
    );
    assert.deepEqual(valid, snapshot);
    const result = await demoAdapter.submit(valid);
    assert.equal(result.mode, "demo");
    assert.equal(result.sent, false);
    assert.match(result.reference, /^DEMO-/);
    assert.equal(requests, 0);
  } finally {
    globalThis.fetch = original;
  }
});
