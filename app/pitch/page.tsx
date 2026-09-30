import Link from "next/link";
import Header from "@/components/site/Header";
import Photo from "@/components/site/Photo";
export const metadata = { title: "Die 3-Minuten-Vorführung · Phinix.Media" };
export default function Pitch() {
  return (
    <>
      <Header />
      <main className="pitch-page" id="main">
        <div className="pitch-hero">
          <Photo
            name="06-laterne-blaue-stunde"
            alt="Eine Campinglaterne leuchtet in der blauen Stunde."
          />
          <div>
            <span className="eyebrow">PHINIX.MEDIA · PRÄSENTATIONSROUTE</span>
            <h1>
              Vom Seegefühl
              <br />
              <em>zur klaren Anfrage.</em>
            </h1>
            <p>Eine Vorführung für Kevin. Ungefähr drei Minuten.</p>
            <Link className="button light" href="/">
              Demo öffnen
            </Link>
          </div>
        </div>
        <div className="document-page">
          <section>
            <h2>Der Einstieg</h2>
            <blockquote>
              „Ich bin Kevin von Phinix.Media. Für Ihren Campingpark habe ich
              einen Website-Entwurf vorbereitet, der das Gefühl am See und eine
              einfache mobile Anfrage verbindet. Ich würde Ihnen gern kurz
              zeigen, wie das aussehen könnte und hören, was Ihnen bei
              Reservierungen wichtig ist.“
            </blockquote>
          </section>
          <div className="pitch-stages">
            {[
              {
                time: "0:00–0:35",
                title: "Das Gefühl am See",
                body: "Die mobile Startseite und die Nahaufnahmen zeigen. Die Bilder sind Stimmungsmotive und können später durch freigegebene Platzfotos ergänzt werden.",
                href: "/",
                cta: "Startseite zeigen",
              },
              {
                time: "0:35–1:10",
                title: "Ein Tag zum Wiedererkennen",
                body: "Die 24-Sekunden-Campinggeschichte starten. Das Paar kommt an, baut auf und findet zur Ruhe. Die Feuerregel ist offen; die Laterne ist direkt als Alternative anwählbar.",
                href: "/#campingtag",
                cta: "Campingtag zeigen",
              },
              {
                time: "1:10–2:10",
                title: "Aus einem Wunsch wird eine klare Anfrage",
                body: "Drei Nächte, zwei Erwachsene, Wohnmobil und 6,5 Meter Länge wählen. Einmal zurückgehen und Gäste ändern. Beispieldaten einsetzen. Anschließend die Zusammenfassung zeigen.",
                href: "/anfragen",
                cta: "Anfrage vorführen",
              },
              {
                time: "2:10–3:00",
                title: "Gemeinsam den echten Ablauf klären",
                body: "Den Demo-Abschluss zeigen: Es wurde nichts versendet. Fragen, welche Angaben, Regeln und Schnittstellen der Campingpark für eine verlässliche Zusage braucht.",
                href: "/konzept",
                cta: "Offene Angaben ansehen",
              },
            ].map((s) => (
              <section key={s.time}>
                <span>{s.time}</span>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                  <Link className="text-link" href={s.href}>
                    {s.cta}
                  </Link>
                </div>
              </section>
            ))}
          </div>
          <section>
            <h2>Der praktische Nutzen</h2>
            <p>
              Reisezeit, Gäste, Reiseart, Maße und Wünsche liegen in einem
              geordneten Datensatz vor. Weniger Rückfragen ist ein zu prüfendes
              Ziel, kein bereits gemessenes Ergebnis. Der Entwurf behauptet
              keine Probleme oder Leistungsverluste der bestehenden Website.
            </p>
          </section>
          <section>
            <h2>Die nächsten Entscheidungen</h2>
            <ol>
              <li>
                Website und echten Anfrageprozess mit bestätigten Inhalten
                abstimmen.
              </li>
              <li>
                Bei Bedarf ein vorhandenes Reservierungssystem integrieren.
              </li>
              <li>
                Sofortbuchung und Zahlung erst mit verlässlichem Bestand und
                vollständigen Tarifen planen.
              </li>
            </ol>
            <p>
              Ein verbindliches Angebot für die Umsetzung folgt aus Umfang und
              Schnittstellen. Diese Demo löst keine Kontaktaufnahme aus.
            </p>
          </section>
          <Link className="button" href="/">
            Zur Website-Demo
          </Link>
        </div>
      </main>
    </>
  );
}
