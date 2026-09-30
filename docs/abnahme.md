# Abnahme · 30.09.2026

Lokaler Akquise-Prototyp für Phinix.Media. Keine Veröffentlichung, keine Betreiberanbindung, keine Zahlung. Ausgangspunkt war ein leeres Arbeitsverzeichnis ohne bestehende Projektanweisungen oder Nutzeränderungen.

## Arbeitspakete P0–P6

| Paket | Geändert | Geprüft | Offen |
|---|---|---|---|
| P0 Grundlage | Next.js/TypeScript, reproduzierbares Lockfile, Faktenregister, expliziter Demo-Adapter | Installation, Typprüfung, Build, Quellenstatus | Betreiberbestätigung der Inhalte |
| P1 Gestaltung | Waldgrün/Elfenbein, lokal eingebundene Fraunces/Manrope, eigenes Raster, Navigation und Formulare | Desktop 1440 px und Mobil 390 px, sichtbarer Tastaturfokus | Keine bekannten blockierenden Darstellungsfehler |
| P2 Startseite | Acht Abschnitte, sechs Fotos, FAQ, kompakter Anfrage-Einstieg, Kontakt/Anfahrt | Alle Motive laden, kein horizontales Überlaufen, Menünavigation, CTAs | Authentische Platzfotos für Livebetrieb |
| P3 Anfrage | Sechs Schritte, Datumskalender, Gäste/Kinderalter, Maße/Kategorie, Wünsche, Kontakt, Prüfung, Demo-Abschluss | Kompletter Ablauf, Bearbeiten/Zurück, negative Fälle, Fehler/Wiederholung, Doppelklick, Tastatur, kein Versand | Echte Zustellung und freigegebene Tarife gehören zum Folgeprojekt |
| P4 Animation | 24 s SVG/GSAP, zwei Figuren, Wohnmobil, Zeltaufbau, zwei Stühle, Feuer/Laterne, Tag-Nacht | Zeitachse, Pause/Neustart, Sichtbarkeit, Mobilkomposition, reduzierter Bewegungsmodus, Storyboard-Screenshots | Feuerregel; optionaler Videoexport |
| P5 Qualität | Validierungen, ARIA-Labels/Fehlerhinweise, Noindex, optimierte Bilder, nachgeladenes Animationsmodul | 6 Logiktests, 7 Browserprüfungen, Lint, Typen, Produktions-Build | Reale Leistungswerte und vollständiger Screenreader-Audit sind nicht gemessen |
| P6 Übergabe | README, Quellen-/Bildregister, offene Fragen, `/pitch`, Screenshots und Projektarchiv | Start- und Produktionsanleitung dokumentiert, Pitchroute geladen | Betreiberfeedback und Livefreigaben |

## Testergebnisse

### Logik: 6 von 6 bestanden

- Kalendernächte über Sommer-/Winterzeit und Schaltjahr.
- Unmögliche, vergangene, identische und vertauschte Daten werden abgewiesen.
- Kinderalter nur bei ausgewählten Kindern, Grenzwerte 0 und 17.
- Reiseartwechsel setzt Kategorie und Maße zurück, erhält übrige Angaben.
- Kontaktpflichtfelder und Demo-Bestätigung.
- Mock-Fehler erhält Eingaben, erfolgreicher Test erzeugt nur eine Demo-Referenz; kein Netzwerkzugriff des Adapters.

### Browser: 7 von 7 bestanden

Geprüft mit Chromium/Playwright, 390 × 844 und 1440 × 1000 Pixeln.

1. Drei Nächte, zwei Erwachsene als Ausgangspunkt, zurückgehen, Gäste ändern, Kinderalter, 6,5 m, Anreisefenster, Wünsche, Beispieldaten, Bearbeiten, simulierter Fehler, Doppelklick-Wiederholung und eindeutiger Demo-Abschluss. Keine POST-/Schreibanfrage; Browser-Storage leer; keine Browser-Laufzeitfehler.
2. Falscher Zeitraum, fehlende Kategorie, unvollständiger Kontakt verhindern Fortschritt.
3. Wechsel vom Wohnmobil zum Zelt setzt inkompatible Angaben zurück; passende neue Maße lassen sich eingeben.
4. Alle sechs Motive (sieben Bildflächen durch Wiederverwendung des Wassermotivs) laden. Keine horizontale Überbreite bei 390/1440 px. Mobilmenü, FAQ und Noindex funktionieren.
5. Animation erreicht genau 24 Sekunden, Pause hält den Zeitpunkt, Neustart setzt ihn zurück. Zwei Figuren, eigener mobiler Bildraum und Laternenumschaltung vorhanden.
6. Reduzierte Bewegung zeigt ein fertiges statisches Abendmotiv ohne laufende Animation.
7. Vollständiger Anfrageablauf ausschließlich mit Tab, Enter, Leertaste und Texteingabe, einschließlich Kalender und Abschluss. Fokus wechselt nach den Schritten sinnvoll zur Überschrift.

Die anschließende Vergrößerung von Haupttext und Eingaben wurde mit erneuter Mobil-/Desktopprüfung und dem vollständigen mobilen Anfragefall kontrolliert.

### Werkzeuge und Build

`npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`: erfolgreich. Produktionsabhängigkeiten laut `npm audit --omit=dev`: keine bekannten Schwachstellen zum Prüfzeitpunkt. Zusätzlich Browser-Erstprüfung mit agent-browser: Seite lädt, erwartete Elemente vorhanden, keine gemeldeten JavaScript-Fehler.

## Sichtprüfung der Animation

Desktop-Storyboard-Screenshots liegen unter `screenshots/storyboard`: Ankunft bei 4 s, Plane bei 7,8 s, Gestänge/Aufbau bei 10 s, zwei Stühle bei 14,7 s, kniende Figur/Entzünden bei 16,5 s, Abend bei 20 s und Nacht bei 24 s. Die Handlungen sind bewusst vereinfacht illustriert. Die Figuren bleiben identisch, die Frau hat längere schwarze Haare, der Mann kurze schwarze Haare. Die Schlussansicht zeigt beide zum See gewandt.

Die Kamera bleibt fest. Das Zelt wird stufenweise aufgebaut. Sonne und Mond ändern ihre Position. Die mobile Komposition ordnet Wohnmobil, Zelt und Feuerplatz untereinander an. Keine automatisch wiederholte Rückwärtsanimation, kein Ton.

## Beabsichtigte Grenzen

- Es gibt keinen bestätigten Tarif und deshalb keinen Gesamtpreis und keinen Preisrechner. Tests von Cent-Rundung, Steuerbasis und kostenpflichtigen Extras entfallen in diesem Modus.
- Die Reisearten und Kategorien sind ausdrücklich Demo-Beispiele. Keine behauptete Liveverfügbarkeit.
- Die sechs KI-Fotos und die Animation sind keine Belege für Ausstattung oder Lage einzelner Parzellen.
- Kein fertiger MP4-Film; der optionale Export ist nicht Bestandteil dieser Web-Umsetzung.
- Keine Behauptungen über LCP, CLS, INP, Umsatz, Conversion oder Probleme der alten Website. Zielwerte aus dem Briefing bleiben Ziele.
- Die Bedienung wurde in Chromium geprüft. Ein realer iOS-/Android-Gerätetest und ein vollständiger Screenreader-Audit bleiben vor Livebetrieb sinnvoll; sie werden hier nicht als durchgeführt ausgewiesen.

## Folgeauftrag: öffentliche Veröffentlichung

Auf ausdrücklichen Wunsch des Nutzers wurde das Projekt am 30.09.2026 in einem öffentlichen GitHub-Repository veröffentlicht und über GitHub Pages bereitgestellt. Diese Freigabe ersetzt die ursprüngliche Einschränkung auf lokale Bereitstellung; echter Versand und Zahlungen bleiben ausgeschaltet.

- Repository: https://github.com/kevin1337pro/campingpark-baldeneysee-pitch
- Live: https://kevin1337pro.github.io/campingpark-baldeneysee-pitch/
- Quellcode: `main`; veröffentlichte statische Dateien: `gh-pages`.
- GitHub Pages meldet `built`, öffentlich und HTTPS erzwungen.
- Zusätzlicher Test der tatsächlichen Live-URL: Startseite, sämtliche Bilder, Animation, Übernahme der Startwerte per URL, alle sechs Anfrageschritte samt Demo-Abschluss, Direktaufrufe von Anfrage/Konzept/Pitch, Noindex und Desktopansicht erfolgreich. Keine fehlgeschlagenen Ressourcenanfragen oder Browser-Laufzeitfehler.
- Die statische Fassung braucht keinen Next.js-Server. Formulare bleiben im Browser; responsive Bilder nutzen die vorhandenen optimierten Dateien. Noindex wird im HTML gesetzt, da GitHub Pages keine eigenen Response-Header aus `next.config.ts` übernimmt.
- Erneute Veröffentlichung: `npm run deploy:pages` mit angemeldeter GitHub CLI. Es sind keine Tokens oder Zugangsdaten im Repository enthalten.
