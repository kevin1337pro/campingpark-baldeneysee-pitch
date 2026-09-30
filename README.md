# Campingpark Baldeneysee · Phinix.Media

Akquise-Prototyp nach dem beigefügten Arbeitsplan. Responsive Startseite, sechs Schritte zur **Demo-Anfrage**, 24 Sekunden Campinganimation und eine Präsentationsroute für Kevin.

## Starten

Voraussetzung: Node.js 20.9 oder neuer (geprüft mit 20.19.5), npm.

```bash
npm ci
npm run dev
```

Öffne **http://127.0.0.1:3000**. Der Server lauscht nur lokal. Falls Port 3000 belegt ist, zeigt Next.js den verwendeten Port im Terminal.

Für eine Vorführung mit dem optimierten Build:

```bash
npm run build
npm start
```

Den Entwicklungsserver vorher beenden, wenn er noch Port 3000 verwendet. Es werden **keine Umgebungsvariablen, API-Schlüssel oder Konten** benötigt.

## Vorführen

- `/` – Startseite, sechs KI-Stimmungsmotive und Campinggeschichte.
- `/anfragen` – vollständig bedienbare Anfrage mit sechs Schritten.
- `/pitch` – geführte Vorführung in ungefähr drei Minuten.
- `/konzept` – Quellenstatus, offene Angaben und Demo-Datenschutz.

Die Navigation Camping / See & Umgebung / Preise & Infos / Kontakt führt zu ausgearbeiteten Abschnitten der Startseite.

Beispiel: drei zukünftige Nächte wählen, zwei Erwachsene, Wohnmobil, touristischer Stellplatz, 6,5 m. Im Kontaktschritt **Beispieldaten einsetzen**, den Demo-Hinweis bestätigen, Angaben prüfen und **Anfrage als Demo testen** auswählen. Das Ergebnis lautet: **„Demo abgeschlossen. Es wurde keine Anfrage versendet.“**

Im letzten Schritt lässt sich unter „Demo-Funktion: Fehlerfall testen“ ein Fehler simulieren. Die Eingaben bleiben erhalten; nach Ausschalten kann die Demo erfolgreich wiederholt werden. Bearbeiten-Links und Zurück erhalten gültige Angaben. Bei einer geänderten Reiseart werden die Kategorie und Maße bewusst zurückgesetzt.

## Animation

Kontrollierbare SVG-Szene mit GSAP, 24 Sekunden, genau zwei erwachsene Figuren mit schwarzen Haaren. Wohnmobil-Ankunft, Ausladen, gemeinsamer Zeltaufbau, zwei Stühle, Entzünden, Tag-Nacht-Wechsel und Ruhe am Feuer. Sonne und Mond bewegen sich. Mobil wird die Szene neu angeordnet (640 × 800), nicht aus dem Desktopbild (1000 × 560) ausgeschnitten.

Die Animation wird erst in Seitennähe geladen, startet beim Eintritt in den sichtbaren Bereich einmal und pausiert außerhalb sowie bei verborgenem Browser-Tab. Pause und Neustart sind verfügbar. Bei `prefers-reduced-motion` erscheint das fertige statische Abendmotiv. Kein Ton. Die Feuer-Ebene lässt sich durch eine Laterne ersetzen. **Die Feuerregel des Platzes ist nicht bestätigt.**

Es liegt bewusst keine MP4-Datei vor: Ein separater Filmexport war im Briefing optional und ist ein zusätzlicher Produktionsschritt.

## Technische Trennung

- `content/site.ts`: Fakten mit Wert, Quelle, Datum und Status; offene Geschäftsdaten sind `null`.
- `lib/booking/model.ts`: Datums-, Eingabe- und Zustandslogik. Nächte werden aus Kalendertagen errechnet, unabhängig von Sommer-/Winterzeit.
- `lib/booking/adapter.ts`: reiner Mock im Browser. Kein `fetch`, kein Backend-Versand, kein Zahlungsdienst.
- `components/booking`: Formular, Kalender, Zusammenfassung und Abschluss.
- `components/animation`: verzögertes Laden, Szene und Timeline.
- `docs/briefing.md`: unveränderte Aufgabenbeschreibung.

Die Demo speichert keine Kontaktdaten in Browser-Storage, Cookies oder einer Datenbank. Name, E-Mail und Bemerkung werden beim Abschluss aus dem Formularzustand entfernt. Beim Neuladen gehen die Eingaben verloren. Reisezeit und Reiseart können vom Startseiten-Einstieg als nicht vertrauliche URL-Parameter übernommen werden.

**Kein Preisrechner:** Vollständige Tarife und Steuergrundlagen fehlen. Die Oberfläche zeigt durchgängig „Preis wird mit deinem Angebot bestätigt“. Es gibt weder behauptete Liveverfügbarkeit noch erfundene Restplätze. Deshalb sind Tarif-, Cent-Rundungs- und Extras-Tests hier nicht anwendbar.

## Bilder und Schriften

Die Originale liegen unverändert in `public/images/camping/originals`. Motivnamen entsprechen dem Briefing. Ableitungen in 640 und 1280 Pixeln liegen als WebP und AVIF daneben; keine Vergrößerung über das Ausgangsmaterial. Next/Image liefert responsive optimierte Varianten, priorisiert den Hero und lädt übrige Motive bei Bedarf.

```bash
node scripts/optimize-images.mjs
```

Fraunces und Manrope werden lokal aus den eingebundenen Fontsource-Paketen geladen. Lizenzkopien liegen in `docs/licenses`. Keine Google-Fonts-Anfragen, keine Analyse- oder Werbedienste.

## Prüfen

```bash
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Die Browserprüfung nutzt einen laufenden lokalen Server oder startet ihn selbst. Ergebnisse: `docs/abnahme.md`. Screenshots: `docs/screenshots`. Playwright-Bericht nach dem Test: `playwright-report/index.html`.

## Vor echtem Betrieb offen

Betreiberidentität und Empfangsadresse, vollständige Tarife samt Abgaben, Saisonkalender, Abreise, Mindestaufenthalte, Kategorien/Maße, Haustiere, Feuer, Ausstattung, Barrierefreiheit, Bildrechte und authentische Platzfotos, Reservierungssystem, Bestätigungstexte sowie rechtliche Betreiberinformationen. Vollständige Fragenliste: `docs/offene-fragen.md`.

Die öffentliche Demo wurde im Folgeauftrag zur Veröffentlichung freigegeben. Sie bleibt ausdrücklich eine Demo ohne Betreiberanbindung, echten Versand oder Zahlung. Die HTML-Metadaten setzen `noindex, nofollow, noarchive`. Beim Next.js-Server kommt zusätzlich `X-Robots-Tag` zum Einsatz; GitHub Pages erlaubt diese eigene Header-Konfiguration nicht.

## GitHub Pages veröffentlichen

`npm run build:pages` erzeugt einen statischen Build in `out/` mit dem Projektpfad `/campingpark-baldeneysee-pitch`. Alle vier Seiten sind direkt aufrufbar. Die Anfrage liest ihre Startwerte im Browser; die Bildauslieferung verwendet die bereits optimierten 640/1280-Pixel-Dateien.

`npm run deploy:pages` baut die Demo und veröffentlicht das Ergebnis in `gh-pages` des konfigurierten Git-Remotes. GitHub Pages muss auf diesen Branch und das Wurzelverzeichnis eingestellt sein. Der Befehl braucht die GitHub CLI (`gh auth login`) und Schreibzugriff auf das Repository. Zugangsdaten werden ausschließlich durch die GitHub CLI bereitgestellt und nicht im Projekt gespeichert. Der Quellcode liegt auf `main`; generierte Dateien bleiben außerhalb des Quellbranches.
