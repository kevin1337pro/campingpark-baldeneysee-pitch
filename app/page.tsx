import Link from "next/link";
import {
  MapPin,
  Waves,
  Tent,
  Caravan,
  BusFront,
  Bike,
  Footprints,
  Compass,
  Sun,
  Check,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Photo from "@/components/site/Photo";
import HeroSearch from "@/components/site/HeroSearch";
import CampingDay from "@/components/animation/CampingStory";
const travel = [
  {
    name: "Wohnmobil",
    icon: BusFront,
    description:
      "Dein Zuhause fährt mit. Du bestimmst, wann der Alltag Pause macht.",
    number: "01",
  },
  {
    name: "Wohnwagen",
    icon: Caravan,
    description:
      "Ankommen, die Tür öffnen und endlich wieder mehr draußen sein.",
    number: "02",
  },
  {
    name: "Zelt",
    icon: Tent,
    description:
      "Wenig Gepäck. Viel Natur. Und ein neuer Blick auf die kleinen Dinge.",
    number: "03",
  },
];
const faqs = [
  [
    "Wie funktioniert die Anfrage?",
    "Du wählst Reisezeit, Gäste und Reiseart. In dieser Demo wird nichts versendet. Bei einer späteren echten Anfrage prüft der Campingpark deinen Wunschaufenthalt; erst seine schriftliche Zusage schafft Klarheit.",
  ],
  [
    "Was kostet mein Aufenthalt?",
    "Die vollständigen Tarife sind für dieses Konzept noch nicht bestätigt. Deshalb zeigen wir keine Beispielpreise als echte Angebote. Der Preis wird mit deinem Angebot bestätigt.",
  ],
  [
    "Kann ich einen Platz direkt am Wasser wählen?",
    "Eine konkrete Lage oder Parzelle wird in dieser Demo nicht zugesagt. Wünsche kannst du unverbindlich angeben. Die verfügbaren Kategorien werden vor einem Livebetrieb mit dem Campingpark abgestimmt.",
  ],
  [
    "Dürfen Hunde mitkommen oder darf ich ein Feuer machen?",
    "Haustier- und Feuerregeln sind noch offen. Die Animation zeigt eine kreative Campinggeschichte und keine bestätigte Erlaubnis für Lagerfeuer auf diesem Platz. Bitte die geltenden Regeln direkt mit dem Campingpark klären.",
  ],
  [
    "Was gilt für Anreise und Barrierefreiheit?",
    "Im bisherigen Website-Suchindex werden 11:30–13:00 und 15:00–18:00 Uhr als Anreisefenster genannt. Bitte vor der Fahrt bestätigen lassen. Besondere Anforderungen kannst du in der Anfrage beschreiben; passende Einrichtungen werden hier nicht zugesagt.",
  ],
];
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero">
          <Photo
            name="04-wasser-und-licht"
            alt="Goldene Abendsonne spiegelt sich in kleinen Wellen, rechts ein Schilfhalm."
            priority
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <div className="eyebrow">
              <MapPin size={15} /> ESSEN · AM BALDENEYSEE
            </div>
            <h1>
              Weniger Alltag.
              <br />
              <em>Mehr See.</em>
            </h1>
            <p>
              Die Füße im Gras. Den Kopf im Freien.
              <br />
              Deine kleine Auszeit am südlichen Seeufer.
            </p>
            <Link href="/anfragen" className="button light">
              Deine Auszeit planen
            </Link>
          </div>
          <div className="hero-foot">
            <span>
              <Waves size={21} /> Einfach mal draußen sein.
            </span>
            <span>KI-Stimmungsmotiv · keine Platzaufnahme</span>
          </div>
        </section>
        <HeroSearch />
        <section className="section feeling">
          <div className="feeling-intro">
            <span className="eyebrow">DAS GUTE LIEGT SO NAH</span>
            <h2>
              Weniger müssen.
              <br />
              <em>Mehr genießen.</em>
            </h2>
            <p>
              Ein Kaffee im Morgenlicht. Zeit, die sich nicht nach Uhrzeit
              anfühlt. Und das gute Gefühl, für ein paar Tage draußen zu Hause
              zu sein.
            </p>
          </div>
          <figure className="coffee">
            <Photo
              name="02-kaffee-am-ufer"
              alt="Dampfender Emaillebecher auf einem Holztisch vor einem See im Morgenlicht."
            />
            <figcaption>01 / Der Tag darf langsam anfangen.</figcaption>
          </figure>
          <figure className="dew">
            <Photo
              name="01-tau-am-see"
              alt="Tautropfen auf Grashalmen und einem Blatt vor einem See im Sonnenaufgang."
            />
            <figcaption>02 / Die kleinen Dinge wieder sehen.</figcaption>
          </figure>
          <div className="feeling-quote">
            <Sun size={33} strokeWidth={1} />
            <p>
              Kein großer Plan.
              <br />
              Nur ein richtig
              <br />
              <em>guter Moment.</em>
            </p>
          </div>
        </section>
        <section className="camping-section" id="camping">
          <div className="section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">DEINE ART, DRAUSSEN ZU SEIN</span>
                <h2>
                  Was kommt <em>mit?</em>
                </h2>
              </div>
              <p>
                Ob auf Rädern oder unter Zeltstoff –<br />
                deine Auszeit beginnt mit dir.
              </p>
            </div>
            <div className="travel-grid">
              {travel.map(({ name, icon: Icon, description, number }) => (
                <Link
                  className="travel-card"
                  key={name}
                  href={`/anfragen?travel=${name}`}
                >
                  <div className="travel-top">
                    <Icon size={55} strokeWidth={1} />
                    <span>{number}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <span className="text-link">
                    Aufenthalt mit {name} planen
                  </span>
                </Link>
              ))}
            </div>
            <p className="fineprint">
              Beispielhafte Reisearten für dieses Konzept. Angebot und
              Kategorien vor echtem Betrieb bestätigen.
            </p>
            <div className="camping-detail">
              <Photo
                name="03-zelt-im-morgenlicht"
                alt="Tautropfen und Reißverschluss auf olivgrünem Zeltstoff."
              />
              <Photo
                name="05-campingstuhl-detail"
                alt="Holzarmlehne und cremefarbener Stoff eines Campingstuhls mit Decke am Wasser."
              />
              <span>
                Einfach ankommen.
                <br />
                Und bleiben wollen.
              </span>
            </div>
          </div>
        </section>
        <section className="section animation-section" id="campingtag">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                EIN KLEINER TAG. EIN GROSSES GEFÜHL.
              </span>
              <h2>
                Ankommen. Aufbauen.
                <br />
                <em>Abschalten.</em>
              </h2>
            </div>
            <p>
              Vom ersten Ankommen
              <br />
              bis zum letzten Abendlicht.
            </p>
          </div>
          <CampingDay />
        </section>
        <section className="lake-section" id="see">
          <div className="lake-image">
            <Photo
              name="04-wasser-und-licht"
              alt="Lichtreflexe und sanfte Wellen auf einem See im Abendlicht."
            />
          </div>
          <div className="lake-copy">
            <span className="eyebrow">BALDENEYSEE · ESSEN</span>
            <h2>
              Ein See.
              <br />
              So viele{" "}
              <em>
                kleine
                <br />
                Möglichkeiten.
              </em>
            </h2>
            <p>
              Mal dem Ufer folgen. Mal die Richtung wechseln. Oder einfach dort
              bleiben, wo es gerade schön ist.
            </p>
            <div className="activity">
              <Footprints />
              <div>
                <h3>Schritt für Schritt rauskommen</h3>
                <p>Ein Spaziergang als kleiner Tapetenwechsel.</p>
              </div>
            </div>
            <div className="activity">
              <Bike />
              <div>
                <h3>Den Tag ins Rollen bringen</h3>
                <p>Die Umgebung mit dem Fahrrad entdecken.</p>
              </div>
            </div>
            <div className="activity">
              <Compass />
              <div>
                <h3>Neugierig bleiben</h3>
                <p>Zeit für einen Ausflug in und um Essen.</p>
              </div>
            </div>
            <span className="fineprint">
              Regionale Inspiration · konkrete Routen vor Ort prüfen
            </span>
          </div>
        </section>
        <section className="section info-section" id="infos">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GUT ZU WISSEN</span>
              <h2>
                Weniger Fragen.
                <br />
                <em>Mehr Vorfreude.</em>
              </h2>
            </div>
            <p>
              Die wichtigsten Informationen
              <br />
              für deine kleine Auszeit.
            </p>
          </div>
          <div className="info-grid">
            <div className="arrival-card">
              <Sun size={30} strokeWidth={1.2} />
              <h3>In Ruhe ankommen.</h3>
              <span className="eyebrow">ANREISEFENSTER</span>
              <p className="arrival-times">
                11:30–13:00 Uhr
                <br />
                15:00–18:00 Uhr
              </p>
              <p>
                Aus dem bisherigen Website-Suchindex. Bitte vor deiner Anreise
                bestätigen lassen.
              </p>
              <div className="arrival-note">
                <Check size={17} /> Eine Reservierung braucht die schriftliche
                Zusage des Campingparks.
              </div>
            </div>
            <div className="faq">
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="closing">
          <Photo
            name="06-laterne-blaue-stunde"
            alt="Warm leuchtende Campinglaterne auf einem Holztisch am See in der blauen Stunde."
          />
          <div className="closing-shade" />
          <div>
            <span className="eyebrow">DER ALLTAG KANN KURZ WARTEN</span>
            <h2>
              Ein paar Tage draußen
              <br />
              <em>beginnen hier.</em>
            </h2>
            <Link className="button light" href="/anfragen">
              Aufenthalt anfragen
            </Link>
            <p>Unverbindlich. Ohne Konto. Erst einmal als Demo.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
