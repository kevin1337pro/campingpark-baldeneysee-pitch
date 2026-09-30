"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BusFront,
  Caravan,
  Tent,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ChevronLeft,
  MapPin,
  CalendarDays,
  Users,
  RotateCcw,
} from "lucide-react";
import Calendar from "./Calendar";
import Photo from "@/components/site/Photo";
import {
  categories,
  priceStatus,
  travelTypes,
  type TravelType,
} from "@/content/site";
import {
  initialStay,
  localToday,
  nights,
  prettyDate,
  validateStep,
  changeTravel,
  type Stay,
  type FormErrors,
} from "@/lib/booking/model";
import { demoAdapter, type DemoResult } from "@/lib/booking/adapter";
const steps = [
  "Reisezeit",
  "Reiseart & Gäste",
  "Dein Aufenthalt",
  "Wünsche & Anreise",
  "Kontakt",
  "Prüfen & abschließen",
];
const titles = [
  "Wann zieht es dich raus?",
  "Wer kommt mit?",
  "Ein Platz für deine Auszeit.",
  "Was dürfen wir wissen?",
  "Wie erreichen wir dich?",
  "Alles so, wie du es möchtest?",
];
const subtitles = [
  "Wähle deine An- und Abreise. Ein paar freie Tage können viel verändern.",
  "Wähle deine Reiseart und die Gäste, die dich begleiten.",
  "Die Maße helfen später dabei, einen passenden Platz zu finden.",
  "Hier ist Platz für deine Wünsche. Alle Angaben sind freiwillig.",
  "Für die Demo reichen die vorbereiteten Beispieldaten.",
  "Prüfe deinen Wunschaufenthalt. Du kannst jede Angabe noch ändern.",
];
const icons = { Wohnmobil: BusFront, Wohnwagen: Caravan, Zelt: Tent };
function Counter({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="counter" id={id}>
      <div>
        <strong>{label}</strong>
        <p>{hint}</p>
      </div>
      <div className="counter-controls">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          aria-label={`${label} verringern`}
        >
          <Minus size={17} />
        </button>
        <output aria-live="polite" aria-label={`Anzahl ${label}`}>
          {value}
        </output>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          aria-label={`${label} erhöhen`}
        >
          <Plus size={17} />
        </button>
      </div>
    </div>
  );
}
export default function BookingFlow({ initial }: { initial?: Partial<Stay> }) {
  const [stay, setStay] = useState<Stay>({ ...initialStay, ...initial });
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [failure, setFailure] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<DemoResult | null>(null);
  const [mobileDetails, setMobileDetails] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const numNights = nights(stay.arrival, stay.departure);
  const update = <K extends keyof Stay>(key: K, value: Stay[K]) => {
    setStay((s) => ({ ...s, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
    setSubmitError("");
  };
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, result]);
  function go(to: number) {
    setErrors({});
    setSubmitError("");
    setStep(to);
    setMobileDetails(false);
  }
  function setTravel(travel: TravelType) {
    if (travel === stay.travel) return;
    setStay((s) => changeTravel(s, travel));
    setNotice(
      "Reiseart geändert. Bitte wähle die Kategorie und gib die passenden Maße neu an.",
    );
    setErrors({});
  }
  function showErrors(next: FormErrors) {
    setErrors(next);
    requestAnimationFrame(() => errorBox.current?.focus());
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busyRef.current) return;
    const next = validateStep(stay, step);
    if (Object.keys(next).length) {
      showErrors(next);
      return;
    }
    if (step < 5) {
      setFurthest(Math.max(furthest, step + 1));
      go(step + 1);
      return;
    }
    for (let i = 0; i < 5; i++) {
      const errors = validateStep(stay, i);
      if (Object.keys(errors).length) {
        setStep(i);
        showErrors(errors);
        return;
      }
    }
    busyRef.current = true;
    setBusy(true);
    // Keep the previous error in place while retrying so double taps cannot hit a shifted link.
    try {
      const response = await demoAdapter.submit(stay, {
        simulateError: failure,
      });
      setResult(response);
      setStay((s) => ({
        ...s,
        name: "",
        email: "",
        notes: "",
        consent: false,
      }));
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Die Demo konnte nicht abgeschlossen werden. Bitte versuche es erneut.",
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function err(id: string) {
    return errors[id] ? (
      <span className="field-error" id={`${id}-error`}>
        {errors[id]}
      </span>
    ) : null;
  }
  function fieldProps(id: string) {
    const labels: Record<string, string> = {
      arrival: "Anreise",
      departure: "Abreise",
      name: "Vor- und Nachname",
      email: "E-Mail-Adresse",
      consent:
        "Ich habe verstanden, dass dies eine Demo ist und keine Anfrage verschickt wird.",
      length:
        (stay.travel === "Zelt"
          ? "Zeltlänge"
          : stay.travel === "Wohnwagen"
            ? "Gesamtlänge inkl. Deichsel"
            : "Fahrzeuglänge") + " in Metern",
      width: "Zeltbreite in Metern",
      category: categories[stay.travel][0],
    };
    return {
      id,
      "aria-label": id.startsWith("age-")
        ? `Kind ${Number(id.slice(4)) + 1}`
        : labels[id],
      "aria-invalid": Boolean(errors[id]),
      "aria-describedby": errors[id] ? `${id}-error` : undefined,
    };
  }
  const summary = (
    <>
      <div className="summary-location">
        <MapPin size={15} /> Campingpark Baldeneysee
      </div>
      <h3>Deine kleine Auszeit</h3>
      <dl>
        <div>
          <dt>
            <CalendarDays size={17} /> Reisezeit
          </dt>
          <dd>
            {stay.arrival ? prettyDate(stay.arrival) : "Noch offen"}
            <br />
            {stay.departure ? `bis ${prettyDate(stay.departure)}` : ""}
            <strong>
              {numNights > 0
                ? `${numNights} ${numNights === 1 ? "Nacht" : "Nächte"}`
                : "Zeitraum auswählen"}
            </strong>
          </dd>
        </div>
        <div>
          <dt>
            <Users size={17} /> Mit dabei
          </dt>
          <dd>
            {stay.adults} Erwachsene
            {stay.children > 0
              ? `, ${stay.children} ${stay.children === 1 ? "Kind" : "Kinder"}`
              : ""}
            <br />
            {stay.travel}
          </dd>
        </div>
        {stay.category && (
          <div>
            <dt>Wunschkategorie</dt>
            <dd>
              {stay.category}
              <small>Demo-Kategorie, keine Verfügbarkeitszusage</small>
            </dd>
          </div>
        )}
      </dl>
      <div className="price-status">
        <span>Dein Preis</span>
        <strong>{priceStatus}</strong>
        <p>Keine Liveverfügbarkeit. Keine Zahlung.</p>
      </div>
      <div className="summary-trust">
        <ShieldCheck size={20} />
        <span>
          Demo ohne Versand.
          <br />
          Deine Eingaben bleiben nur in dieser Sitzung.
        </span>
      </div>
    </>
  );
  if (result)
    return (
      <div className="completion">
        <span className="success-icon">
          <Check size={32} />
        </span>
        <span className="eyebrow">NUR EIN TEST. ABER EIN GUTER ANFANG.</span>
        <h1 ref={heading} tabIndex={-1}>
          Demo abgeschlossen.
        </h1>
        <p className="success-message">Es wurde keine Anfrage versendet.</p>
        <p>
          Dein Platz wurde nicht reserviert. Bei einer echten Anfrage würde der
          Campingpark deinen Aufenthalt prüfen und sich mit einem Angebot bei
          dir melden.
        </p>
        <div className="success-stay">
          <strong>
            {prettyDate(stay.arrival)} – {prettyDate(stay.departure)}
          </strong>
          <span>
            {numNights} Nächte · {stay.adults} Erwachsene
            {stay.children ? ` · ${stay.children} Kinder` : ""} · {stay.travel}
          </span>
          <span>{priceStatus}</span>
          <small>
            Demo-Referenz: {result.reference} · keine Buchungsnummer
          </small>
        </div>
        <p className="fineprint">
          Die eingegebenen Kontaktdaten und die Bemerkung wurden aus dem
          Formularzustand entfernt.
        </p>
        <div className="completion-actions">
          <Link className="button" href="/">
            Zurück an den See
          </Link>
          <button
            className="button outline"
            onClick={() => {
              setStay({ ...initialStay });
              setResult(null);
              setFailure(false);
              setFurthest(0);
              go(0);
            }}
          >
            <RotateCcw size={16} /> Demo neu starten
          </button>
        </div>
        <Link className="text-link" href="/pitch">
          Zur Präsentationsroute
        </Link>
      </div>
    );
  return (
    <div className="booking-page">
      <div className="booking-top">
        <Link href="/" className="back-link">
          <ChevronLeft size={17} /> Zurück an den See
        </Link>
        <span className="demo-pill">Demo · kein Versand</span>
      </div>
      <div className="booking-intro">
        <span className="eyebrow">DEINE AUSZEIT BEGINNT HIER</span>
        <h1>
          Ein paar Tage <em>für dich.</em>
        </h1>
        <p>In sechs kleinen Schritten zu deinem Wunschaufenthalt.</p>
      </div>
      <nav aria-label="Fortschritt der Anfrage" className="step-nav">
        <ol>
          {steps.map((name, i) => (
            <li
              key={name}
              className={i === step ? "current" : i < step ? "done" : ""}
            >
              <button
                type="button"
                disabled={i > furthest || busy}
                aria-label={`${i + 1} ${name}`}
                aria-current={step === i ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span>{i < step ? <Check size={15} /> : i + 1}</span>
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className="booking-layout">
        <form className="booking-form" noValidate onSubmit={submit}>
          <span className="step-kicker">
            SCHRITT {step + 1} VON 6 · {steps[step].toUpperCase()}
          </span>
          <h2 ref={heading} tabIndex={-1}>
            {titles[step]}
          </h2>
          <p className="step-description">{subtitles[step]}</p>
          {Object.keys(errors).length > 0 && (
            <div
              className="error-summary"
              ref={errorBox}
              tabIndex={-1}
              role="alert"
            >
              <strong>Bitte prüfe diese Angaben:</strong>
              <ul>
                {Object.entries(errors).map(([id, message]) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(id)?.focus();
                      }}
                    >
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step === 0 && (
            <>
              <div className="field-grid">
                <label htmlFor="arrival">
                  Anreise
                  <input
                    {...fieldProps("arrival")}
                    type="date"
                    min={localToday()}
                    value={stay.arrival}
                    onChange={(e) => update("arrival", e.target.value)}
                  />
                  {err("arrival")}
                </label>
                <label htmlFor="departure">
                  Abreise
                  <input
                    {...fieldProps("departure")}
                    type="date"
                    min={stay.arrival || localToday()}
                    value={stay.departure}
                    onChange={(e) => update("departure", e.target.value)}
                  />
                  {err("departure")}
                </label>
              </div>
              <Calendar
                arrival={stay.arrival}
                departure={stay.departure}
                onChange={(arrival, departure) => {
                  setStay((s) => ({ ...s, arrival, departure }));
                  setErrors({});
                }}
              />
              {numNights > 0 && (
                <div className="nights-label">
                  <WavesIcon />
                  {numNights} {numNights === 1 ? "Nacht" : "Nächte"} zum
                  Durchatmen
                </div>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <fieldset className="travel-options">
                <legend>Deine Reiseart</legend>
                {travelTypes.map((travel) => {
                  const Icon = icons[travel];
                  return (
                    <label
                      className={stay.travel === travel ? "selected" : ""}
                      key={travel}
                    >
                      <input
                        type="radio"
                        name="travel"
                        value={travel}
                        checked={stay.travel === travel}
                        onChange={() => setTravel(travel)}
                      />
                      <Icon size={36} strokeWidth={1.3} />
                      <span>{travel}</span>
                    </label>
                  );
                })}
              </fieldset>
              <p className="fineprint">
                Reisearten als Demo-Auswahl. Das tatsächliche Angebot wird noch
                bestätigt.
              </p>
              {notice && (
                <p className="form-notice" role="status">
                  {notice}
                </p>
              )}
              <Counter
                id="adults"
                label="Erwachsene"
                hint="Ab 18 Jahren · mindestens eine Person"
                value={stay.adults}
                min={1}
                max={12}
                onChange={(v) => update("adults", v)}
              />
              <Counter
                id="children"
                label="Kinder"
                hint="Unter 18 Jahren"
                value={stay.children}
                min={0}
                max={8}
                onChange={(v) =>
                  setStay((s) => ({
                    ...s,
                    children: v,
                    ages: Array.from({ length: v }, (_, i) => s.ages[i] ?? ""),
                  }))
                }
              />
              {stay.children > 0 && (
                <div className="child-ages">
                  <p>Wie alt sind die Kinder bei der Anreise?</p>
                  <div className="field-grid">
                    {stay.ages.map((age, i) => (
                      <label key={i} htmlFor={`age-${i}`}>
                        Kind {i + 1}
                        <select
                          {...fieldProps(`age-${i}`)}
                          value={age}
                          onChange={(e) => {
                            const ages = [...stay.ages];
                            ages[i] = e.target.value;
                            update("ages", ages);
                          }}
                        >
                          <option value="">Alter wählen</option>
                          {Array.from({ length: 18 }, (_, n) => (
                            <option key={n} value={n}>
                              {n === 0
                                ? "Unter 1 Jahr"
                                : `${n} ${n === 1 ? "Jahr" : "Jahre"}`}
                            </option>
                          ))}
                        </select>
                        {err(`age-${i}`)}
                      </label>
                    ))}
                  </div>
                  <p className="fineprint">
                    Die Altersangaben dienen der späteren Angebotsprüfung.
                    Tarifgruppen sind noch offen.
                  </p>
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <fieldset className="category-options">
                <legend>Wunschkategorie</legend>
                {categories[stay.travel].map((category) => (
                  <label
                    key={category}
                    className={stay.category === category ? "selected" : ""}
                  >
                    <input
                      {...fieldProps("category")}
                      type="radio"
                      name="category"
                      checked={stay.category === category}
                      onChange={() => update("category", category)}
                    />
                    <span>
                      <strong>{category}</strong>
                      <small>
                        Beispielkategorie · Lage und Verfügbarkeit werden nicht
                        zugesagt.
                      </small>
                    </span>
                  </label>
                ))}
              </fieldset>
              {err("category")}
              <div className="field-grid dimensions">
                <label htmlFor="length">
                  {stay.travel === "Zelt"
                    ? "Zeltlänge"
                    : stay.travel === "Wohnwagen"
                      ? "Gesamtlänge inkl. Deichsel"
                      : "Fahrzeuglänge"}{" "}
                  in Metern
                  <input
                    {...fieldProps("length")}
                    type="number"
                    inputMode="decimal"
                    min="0.1"
                    max="30"
                    step="0.1"
                    placeholder={
                      stay.travel === "Zelt" ? "z. B. 3,0" : "z. B. 6,5"
                    }
                    value={stay.length}
                    onChange={(e) => update("length", e.target.value)}
                  />
                  {err("length")}
                </label>
                {stay.travel === "Zelt" && (
                  <label htmlFor="width">
                    Zeltbreite in Metern
                    <input
                      {...fieldProps("width")}
                      type="number"
                      inputMode="decimal"
                      min="0.1"
                      max="20"
                      step="0.1"
                      placeholder="z. B. 2,5"
                      value={stay.width}
                      onChange={(e) => update("width", e.target.value)}
                    />
                    {err("width")}
                  </label>
                )}
              </div>
              <div className="form-note">
                Ein Platz am Wasser oder eine bestimmte Parzelle wird mit dieser
                Auswahl nicht reserviert. Deine Wünsche kannst du im nächsten
                Schritt ergänzen.
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <label className="field-label" htmlFor="arrivalWindow">
                Gewünschtes Anreisefenster <span>(optional)</span>
                <select
                  id="arrivalWindow"
                  value={stay.arrivalWindow}
                  onChange={(e) => update("arrivalWindow", e.target.value)}
                >
                  <option value="">Noch offen</option>
                  <option>11:30–13:00 Uhr</option>
                  <option>15:00–18:00 Uhr</option>
                  <option>Andere Uhrzeit – bitte abstimmen</option>
                </select>
              </label>
              <p className="fineprint">
                Zeiten aus dem Website-Suchindex. Eine Bestätigung durch den
                Campingpark ist noch nötig.
              </p>
              <label className="field-label" htmlFor="notes">
                Wünsche & Hinweise <span>(optional)</span>
                <textarea
                  id="notes"
                  rows={5}
                  maxLength={1500}
                  value={stay.notes}
                  placeholder="Zum Beispiel besondere Anforderungen an den Zugang oder deine geplante Ankunft …"
                  onChange={(e) => update("notes", e.target.value)}
                />
              </label>
              <p className="fineprint">
                Bitte keine vertraulichen oder medizinischen Angaben eintragen.
                Beschreibe nur, was du vor Ort benötigst.
              </p>
              <div className="form-note">
                Wünsche sind unverbindlich. Zusatzleistungen, Haustierregeln und
                barrierefreie Einrichtungen sind noch nicht bestätigt und werden
                hier nicht angeboten.
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <button
                type="button"
                className="sample-button"
                onClick={() => {
                  setStay((s) => ({
                    ...s,
                    name: "Alex Beispiel",
                    email: "alex@example.com",
                  }));
                  setErrors({});
                }}
              >
                Beispieldaten einsetzen
              </button>
              <label className="field-label" htmlFor="name">
                Vor- und Nachname
                <input
                  {...fieldProps("name")}
                  autoComplete="off"
                  maxLength={100}
                  value={stay.name}
                  placeholder="Alex Beispiel"
                  onChange={(e) => update("name", e.target.value)}
                />
                {err("name")}
              </label>
              <label className="field-label" htmlFor="email">
                E-Mail-Adresse
                <input
                  {...fieldProps("email")}
                  type="email"
                  autoComplete="off"
                  maxLength={254}
                  value={stay.email}
                  placeholder="alex@example.com"
                  onChange={(e) => update("email", e.target.value)}
                />
                {err("email")}
              </label>
              <label className="checkbox-label">
                <input
                  {...fieldProps("consent")}
                  type="checkbox"
                  checked={stay.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span>
                  Ich habe verstanden, dass dies eine Demo ist und keine Anfrage
                  verschickt wird.
                </span>
              </label>
              {err("consent")}
              <div className="form-note">
                <ShieldCheck size={20} />
                <div>
                  Kein Konto nötig. Kontaktangaben werden nur vorübergehend im
                  Formular gehalten, nicht an den Betreiber übertragen und nicht
                  dauerhaft im Browser gespeichert. Beim Neuladen gehen die
                  Eingaben verloren.{" "}
                  <Link href="/konzept" target="_blank">
                    Mehr zum Demo-Datenschutz
                  </Link>
                </div>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <div className="review-list">
                {[
                  {
                    label: "Reisezeit",
                    value: `${prettyDate(stay.arrival)} bis ${prettyDate(stay.departure)} · ${numNights} Nächte`,
                    to: 0,
                  },
                  {
                    label: "Reiseart & Gäste",
                    value: `${stay.travel} · ${stay.adults} Erwachsene${stay.children ? ` · ${stay.children} ${stay.children === 1 ? "Kind" : "Kinder"} (Alter: ${stay.ages.join(", ")})` : ""}`,
                    to: 1,
                  },
                  {
                    label: "Wunschaufenthalt",
                    value: `${stay.category} · ${stay.length} m${stay.travel === "Zelt" ? ` × ${stay.width} m` : ""} · Demo-Kategorie`,
                    to: 2,
                  },
                  {
                    label: "Wünsche & Anreise",
                    value: `${stay.arrivalWindow || "Anreisefenster noch offen"}${stay.notes ? " · " + stay.notes : " · Keine weiteren Wünsche"}`,
                    to: 3,
                  },
                  {
                    label: "Kontakt",
                    value: `${stay.name} · ${stay.email}`,
                    to: 4,
                  },
                ].map((row) => (
                  <div className="review-row" key={row.label}>
                    <div>
                      <h3>{row.label}</h3>
                      <p>{row.value}</p>
                    </div>
                    <button
                      disabled={busy}
                      type="button"
                      onClick={() => go(row.to)}
                      aria-label={`${row.label} bearbeiten`}
                    >
                      Bearbeiten
                    </button>
                  </div>
                ))}
              </div>
              <div className="review-price">
                <span>PREIS & VERBINDLICHKEIT</span>
                <h3>{priceStatus}</h3>
                <p>
                  Es liegt kein Preisangebot vor. In dieser Demo werden weder
                  Plätze reserviert noch Zahlungen oder Anfragen ausgelöst.
                </p>
              </div>
              <div className="form-note">
                <ShieldCheck size={22} />
                <div>
                  <strong>Und danach?</strong>
                  <br />
                  In einem echten Anfrageprozess prüft der Campingpark deine
                  Angaben und antwortet persönlich. Eine Reservierung setzt
                  seine schriftliche Zusage voraus.
                </div>
              </div>
              <details className="demo-tools">
                <summary>Demo-Funktion: Fehlerfall testen</summary>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={failure}
                    disabled={busy}
                    onChange={(e) => setFailure(e.target.checked)}
                  />
                  <span>Versandfehler simulieren</span>
                </label>
                <p>Auch dieser Test führt keine Netzwerkübertragung aus.</p>
              </details>
            </>
          )}
          {submitError && (
            <div className="error-summary" role="alert">
              {submitError}
            </div>
          )}
          <div className="form-actions">
            {step > 0 ? (
              <button
                type="button"
                className="back-button"
                disabled={busy}
                onClick={() => go(step - 1)}
              >
                <ChevronLeft size={17} /> Zurück
              </button>
            ) : (
              <span className="fineprint">Ohne Konto. Ohne Verpflichtung.</span>
            )}
            <button type="submit" className="button" disabled={busy}>
              {busy
                ? "Demo wird geprüft …"
                : step === 5
                  ? "Anfrage als Demo testen"
                  : "Weiter"}
            </button>
          </div>
          <p className="form-bottom-note">
            {step === 5
              ? "Es wird keine Anfrage versendet."
              : "Du kannst deine Angaben jederzeit im Ablauf ändern."}
          </p>
        </form>
        <aside className="booking-summary" aria-label="Zusammenfassung">
          <Photo
            name="01-tau-am-see"
            alt="Tautropfen im warmen Morgenlicht am See."
          />
          <div>{summary}</div>
        </aside>
      </div>
      <div className="mobile-summary">
        <button
          type="button"
          aria-expanded={mobileDetails}
          aria-controls="mobile-summary-content"
          onClick={() => setMobileDetails(!mobileDetails)}
        >
          <span>
            <strong>
              {numNights ? `${numNights} Nächte` : "Deine Auszeit"} ·{" "}
              {stay.adults + stay.children} Gäste
            </strong>
            <small>Preis mit Angebot</small>
          </span>
          <span>{mobileDetails ? "Details schließen" : "Details ansehen"}</span>
        </button>
        {mobileDetails && <div id="mobile-summary-content">{summary}</div>}
      </div>
      <p className="booking-legal">
        Website-Konzept von Phinix.Media ·{" "}
        <Link href="/konzept">Demo-Hinweise & Quellen</Link>
      </p>
    </div>
  );
}
function WavesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M2 9c4-6 7 6 11 0s6 0 9 0M2 16c4-6 7 6 11 0s6 0 9 0" />
    </svg>
  );
}
