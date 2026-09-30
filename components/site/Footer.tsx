import Link from "next/link";
import { Brand } from "./Header";
import { facts } from "@/content/site";
export default function Footer() {
  return (
    <footer id="kontakt">
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Ein bisschen näher am Wasser.
            <br />
            Ein bisschen weiter weg vom Alltag.
          </p>
        </div>
        <div>
          <h3>Hier findest du den See</h3>
          <p>
            Hardenbergufer 369
            <br />
            45239 Essen-Fischlaken
          </p>
          <a
            className="text-link"
            href="https://www.google.com/maps/search/?api=1&query=Hardenbergufer+369+45239+Essen"
            target="_blank"
            rel="noreferrer"
          >
            Anfahrt in Google Maps öffnen
          </a>
        </div>
        <div>
          <h3>Kontakt zum Campingpark</h3>
          <p>
            {facts.phone.value}
            <br />
            {facts.email.value}
          </p>
          <small>Kontaktdaten aus Drittquelle, noch nicht bestätigt.</small>
          <Link className="text-link" href="/konzept">
            Hinweise & Quellen zum Konzept
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © 2026 · Website-Konzept von <strong>Phinix.Media</strong>
        </span>
        <span>
          Keine offizielle Buchungsseite · Alle Fotos sind KI-Stimmungsmotive
        </span>
        <Link href="/pitch">Pitch ansehen</Link>
      </div>
    </footer>
  );
}
