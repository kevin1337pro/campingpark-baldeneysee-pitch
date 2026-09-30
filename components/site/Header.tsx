"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Waves } from "lucide-react";
export function Brand() {
  return (
    <Link
      href="/"
      className="brand"
      aria-label="Campingpark Baldeneysee – Startseite"
    >
      <Waves size={36} strokeWidth={1.3} />
      <span>
        Campingpark<strong>Baldeneysee</strong>
      </span>
    </Link>
  );
}
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="demo-ribbon">
        Website-Konzept von Phinix.Media{" "}
        <span>— keine offizielle Buchungsseite</span>
      </div>
      <header className="site-header">
        <Brand />
        <nav className={open ? "nav open" : "nav"} aria-label="Hauptnavigation">
          <Link onClick={() => setOpen(false)} href="/#camping">
            Camping
          </Link>
          <Link onClick={() => setOpen(false)} href="/#see">
            See & Umgebung
          </Link>
          <Link onClick={() => setOpen(false)} href="/#infos">
            Preise & Infos
          </Link>
          <Link onClick={() => setOpen(false)} href="/#kontakt">
            Kontakt
          </Link>
        </nav>
        <Link className="button header-cta" href="/anfragen">
          Aufenthalt anfragen
        </Link>
        <button
          className="menu-button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
    </>
  );
}
