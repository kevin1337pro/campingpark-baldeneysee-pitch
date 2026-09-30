import { categories, type TravelType } from "@/content/site";
export type Stay = {
  arrival: string;
  departure: string;
  travel: TravelType;
  adults: number;
  children: number;
  ages: string[];
  category: string;
  length: string;
  width: string;
  arrivalWindow: string;
  notes: string;
  name: string;
  email: string;
  consent: boolean;
};
export type FormErrors = Record<string, string>;
export const initialStay: Stay = {
  arrival: "",
  departure: "",
  travel: "Wohnmobil",
  adults: 2,
  children: 0,
  ages: [],
  category: "",
  length: "",
  width: "",
  arrivalWindow: "",
  notes: "",
  name: "",
  email: "",
  consent: false,
};
export function localToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(
    new Date(),
  );
}
export function calendarDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const [y, m, d] = value.split("-").map(Number);
  const time = Date.UTC(y, m - 1, d);
  return new Date(time).toISOString().slice(0, 10) === value
    ? time / 86400000
    : NaN;
}
export function nights(arrival: string, departure: string) {
  const n = calendarDay(departure) - calendarDay(arrival);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
export function prettyDate(value: string) {
  const d = calendarDay(value);
  return Number.isFinite(d)
    ? new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(d * 86400000))
    : "Noch offen";
}
export function changeTravel(stay: Stay, travel: TravelType): Stay {
  return { ...stay, travel, category: "", length: "", width: "" };
}
export function validateStep(
  stay: Stay,
  step: number,
  today = localToday(),
): FormErrors {
  const errors: FormErrors = {};
  if (step === 0) {
    if (!Number.isFinite(calendarDay(stay.arrival)))
      errors.arrival = "Bitte wähle ein gültiges Anreisedatum.";
    else if (stay.arrival < today)
      errors.arrival = "Die Anreise darf nicht in der Vergangenheit liegen.";
    if (!Number.isFinite(calendarDay(stay.departure)))
      errors.departure = "Bitte wähle ein gültiges Abreisedatum.";
    else if (
      Number.isFinite(calendarDay(stay.arrival)) &&
      calendarDay(stay.departure) <= calendarDay(stay.arrival)
    )
      errors.departure =
        "Die Abreise muss nach der Anreise liegen. Bitte wähle mindestens eine Nacht.";
  }
  if (step === 1) {
    if (!Number.isInteger(stay.adults) || stay.adults < 1 || stay.adults > 12)
      errors.adults = "Bitte wähle mindestens eine erwachsene Person.";
    if (
      !Number.isInteger(stay.children) ||
      stay.children < 0 ||
      stay.children > 8
    )
      errors.children = "Bitte prüfe die Kinderzahl.";
    for (let i = 0; i < stay.children; i++) {
      if (
        stay.ages[i] === undefined ||
        stay.ages[i] === "" ||
        !Number.isInteger(Number(stay.ages[i])) ||
        Number(stay.ages[i]) < 0 ||
        Number(stay.ages[i]) > 17
      )
        errors[`age-${i}`] = "Bitte gib das Alter bei Anreise an (0–17 Jahre).";
    }
  }
  if (step === 2) {
    if (!categories[stay.travel].includes(stay.category))
      errors.category = "Bitte wähle eine Kategorie für deine Demo-Anfrage.";
    if (
      !stay.length ||
      !Number.isFinite(Number(stay.length)) ||
      Number(stay.length) <= 0 ||
      Number(stay.length) > 30
    )
      errors.length = "Bitte gib eine Länge zwischen 0,1 und 30 Metern an.";
    if (
      stay.travel === "Zelt" &&
      (!stay.width ||
        !Number.isFinite(Number(stay.width)) ||
        Number(stay.width) <= 0 ||
        Number(stay.width) > 20)
    )
      errors.width = "Bitte gib eine Breite zwischen 0,1 und 20 Metern an.";
  }
  if (step === 4) {
    if (stay.name.trim().length < 2)
      errors.name = "Bitte gib einen Namen mit mindestens zwei Zeichen an.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stay.email))
      errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
    if (!stay.consent) errors.consent = "Bitte bestätige den Demo-Hinweis.";
  }
  return errors;
}
export function validateStay(stay: Stay, today = localToday()) {
  return [0, 1, 2, 3, 4].reduce<FormErrors>(
    (all, s) => ({ ...all, ...validateStep(stay, s, today) }),
    {},
  );
}
