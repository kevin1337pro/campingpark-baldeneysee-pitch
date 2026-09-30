import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { facts } from "@/content/site";
export const metadata = { title: "Hinweise & Quellen · Phinix.Media Konzept" };
const names: Record<string, string> = {
  name: "Name",
  location: "Lage",
  address: "Adresse",
  phone: "Telefon",
  email: "E-Mail",
  arrival: "Anreise",
  confirmation: "Zusage",
  tariffs: "Tarife",
  pets: "Haustiere",
  fire: "Feuer",
  accessibility: "Barrierefreiheit",
  categories: "Kategorien",
  departure: "Abreisezeit",
};
export default function Concept() {
  return (
    <>
      <Header />
      <main className="document-page" id="main">
        <span className="eyebrow">TRANSPARENZ ZUM ENTWURF</span>
        <h1>Eine Idee für den See.</h1>
        <p className="document-lead">
          Website-Konzept von Phinix.Media – keine offizielle Buchungsseite.
        </p>
        <section>
          <h2>Was diese Demo macht</h2>
          <p>
            Du kannst einen Wunschaufenthalt vollständig durchspielen. Es werden
            keine Anfragen versendet, keine Plätze reserviert und keine
            Zahlungen angenommen. Alle Reisearten und Kategorien sind Beispiele
            für die Gestaltung des Ablaufs. Eine tatsächliche Verfügbarkeit wird
            nicht angezeigt.
          </p>
        </section>
        <section>
          <h2>Deine Daten in dieser Demo</h2>
          <p>
            Verwende am besten die Beispieldaten. Formulareingaben bleiben im
            Arbeitsspeicher dieser Browserseite. Sie werden nicht in Local
            Storage, Session Storage, Cookies oder einer Datenbank gespeichert.
            Die Demo hat keinen Versanddienst. Beim Neuladen gehen die Angaben
            verloren; beim Abschluss werden Name, E-Mail und Bemerkung aus dem
            Formularzustand entfernt.
          </p>
          <p>
            Die Seite nutzt lokal ausgelieferte Schriftdateien und Bilder. Es
            gibt keine Analyse- oder Werbedienste. Beim Öffnen eines
            ausdrücklich verlinkten externen Dienstes, etwa Google Maps, gelten
            dessen Bedingungen. Der lokale Entwicklungsserver kann technische
            Seitenaufrufe protokollieren, aber keine Kontaktangaben aus dem
            Formular.
          </p>
        </section>
        <section>
          <h2>Bilder & Campinggeschichte</h2>
          <p>
            Alle sechs Fotos sind KI-generierte Stimmungsmotive. Sie zeigen
            keine dokumentarischen Ansichten dieses Campingplatzes. Auch die
            Illustration ist eine freie Campinggeschichte. Insbesondere das
            dargestellte Feuer ist keine bestätigte Platzregel. Die
            Laternenvariante lässt sich direkt unter der Animation auswählen.
          </p>
        </section>
        <section>
          <h2>Quellen und offene Angaben</h2>
          <p>
            Die Angaben stammen aus dem beigefügten Briefing vom 30. September
            2026. Der erneute direkte Abruf der Betreiberseiten war nicht
            erfolgreich. Es gibt daher keine zusätzliche Betreiberbestätigung
            durch diese Umsetzung. Die Quellen sind keine Echtzeitdaten.
          </p>
          <div className="source-table">
            <table>
              <thead>
                <tr>
                  <th>Angabe</th>
                  <th>Wert</th>
                  <th>Quellenstatus</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(facts).map(([key, fact]) => (
                  <tr key={key}>
                    <th scope="row">{names[key]}</th>
                    <td>{fact.value || "Noch zu klären"}</td>
                    <td>
                      {fact.source ? (
                        <a href={fact.source} target="_blank" rel="noreferrer">
                          {fact.status}
                        </a>
                      ) : (
                        fact.status
                      )}
                      <small>Briefing: {fact.checkedAt}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2>Vor einem echten Betrieb</h2>
          <p>
            Benötigt werden bestätigte Betreiber- und Kontaktdaten, vollständige
            Tarife und Abgaben, Saison- und Anreiseregeln, tatsächlich
            angebotene Kategorien, Maße, Haustier- und Feuerregeln,
            Barriereinformationen sowie freigegebene Platzfotos. Erst danach
            folgen ein echter Versanddienst und passende rechtliche
            Betreiberinformationen.
          </p>
          <p>
            Eine Sofortbuchung mit Zahlung wäre ein eigener Ausbauschritt mit
            verlässlichem Bestand, serverseitiger Preisprüfung und abgestimmten
            Zahlungs- und Stornobedingungen. Diese Demo ist dafür nicht
            freigeschaltet.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
