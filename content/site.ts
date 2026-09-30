export type Verification =
  "Betreiber bestätigt" | "aus Website-Suchindex" | "Drittquelle" | "offen";
export type Fact = {
  value: string | null;
  source: string | null;
  checkedAt: string;
  status: Verification;
};
const checkedAt = "2026-09-30";
export const facts: Record<string, Fact> = {
  name: {
    value: "Campingpark Baldeneysee",
    source: "https://campingpark-baldeneysee.de/Home-Wie-Wo-Was",
    checkedAt,
    status: "aus Website-Suchindex",
  },
  location: {
    value: "Essen, am südlichen Seeufer",
    source: "https://campingpark-baldeneysee.de/Home-Wie-Wo-Was",
    checkedAt,
    status: "aus Website-Suchindex",
  },
  address: {
    value: "Hardenbergufer 369, 45239 Essen-Fischlaken",
    source: "https://www.pincamp.de/campingplaetze/campingpark-baldeneysee",
    checkedAt,
    status: "Drittquelle",
  },
  phone: {
    value: "0201 402007",
    source: "https://www.pincamp.de/campingplaetze/campingpark-baldeneysee",
    checkedAt,
    status: "Drittquelle",
  },
  email: {
    value: "cpl-erdhuetter@t-online.de",
    source: "https://www.pincamp.de/campingplaetze/campingpark-baldeneysee",
    checkedAt,
    status: "Drittquelle",
  },
  arrival: {
    value: "11:30–13:00 und 15:00–18:00 Uhr",
    source: "https://campingpark-baldeneysee.de/Home-Wie-Wo-Was",
    checkedAt,
    status: "aus Website-Suchindex",
  },
  confirmation: {
    value: "Eine schriftliche E-Mail-Zusage des Betreibers ist erforderlich.",
    source: "https://campingpark-baldeneysee.de/Preise-Buchung-Anfahrt",
    checkedAt,
    status: "aus Website-Suchindex",
  },
  tariffs: { value: null, source: null, checkedAt, status: "offen" },
  pets: { value: null, source: null, checkedAt, status: "offen" },
  fire: { value: null, source: null, checkedAt, status: "offen" },
  accessibility: { value: null, source: null, checkedAt, status: "offen" },
  categories: { value: null, source: null, checkedAt, status: "offen" },
  departure: { value: null, source: null, checkedAt, status: "offen" },
};
export const mode = "demo" as const;
export const priceStatus = "Preis wird mit deinem Angebot bestätigt";
export const travelTypes = ["Wohnmobil", "Wohnwagen", "Zelt"] as const;
export type TravelType = (typeof travelTypes)[number];
export const categories: Record<TravelType, string[]> = {
  Wohnmobil: ["Touristischer Stellplatz"],
  Wohnwagen: ["Touristischer Stellplatz"],
  Zelt: ["Zeltplatz"],
};
