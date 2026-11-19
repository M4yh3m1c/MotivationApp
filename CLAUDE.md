# Sabrinas Endspurt – Projektnotizen

Motivations-App für Sabrinas Fernstudium Medienpädagogik (geplanter Abschluss: August 2027).
Gehostet über GitHub Pages, genutzt auf ihrem iPhone als Web-App auf dem Home-Bildschirm.

## Aufbau
- `index.html` – die komplette App (HTML, CSS, JS in einer Datei, keine Build-Tools)
- `sprueche.js` – Tobis täglicher Spruch (Kosenamen „Schatz“ und „Maus“ sparsam eingestreut; `taeglich` ab `start`, ein Eintrag pro Tag bis 31.08.2027, Monatsblöcke müssen zur Tageszahl passen), `besondere` für feste Tage, `klausur` für Vortag/Klausurtag
- `sw.js` – Service Worker für Push; wählt den Erinnerungstext selbst anhand des Lernstands (Cache `endspurt-status`, schreibt die App bei jedem Speichern)
- `.github/workflows/erinnerung.yml` + `.github/scripts/erinnerung.mjs` – tägliche Push-Erinnerung um 10 Uhr Berlin; Secrets `VAPID_PRIVATE_KEY`, `PUSH_SUBSCRIPTIONS`; der öffentliche VAPID-Schlüssel steht in `index.html` und im Skript (müssen übereinstimmen). Einrichtung steht in README.md
- `manifest.webmanifest`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` – Symbol und Vollbildmodus
- Startzustand steht als JSON in `<script id="app-state">`; Fortschritt speichert die App im localStorage (`sabrina-endspurt-v1`)
- Sicherung: In den Einstellungen gibt es Export (JSON-Datei über das iOS-Teilen-Menü, sonst Download) und Import (ersetzt den Stand nach Rückfrage)
- Der Code für `claude.use("artifact")` stammt aus der claude.ai-Version und ist auf GitHub Pages wirkungslos

## Inhalte
- Bereiche: Tobis Spruch des Tages, Countdown, Karte „Erste Klausur“ mit Mutmachern, Fokus-Timer, Wochenübersicht (mit „Fortschritt mit Tobi teilen“ als Textnachricht übers Teilen-Menü), Belohnungen, Meilensteine, Nachricht von Tobi, Erinnerung (Push), Einstellungen (inkl. Export/Import)
- Sabrina hat noch keine Klausur geschrieben (Stand Nov 2026) und macht sich deswegen Sorgen – Ton ermutigend, ohne Druck
- Belohnungen dürfen sich NICHT mit Tobis Adventskalender überschneiden. Dort schon vergeben:
  Serienabend, Ausschlafen, Massage, freier Nachmittag, Date-Abend
- Auch zu nah am Adventskalender und deshalb raus: Schokolade, Chips, Fitzek-Bücher, Wellness
  (gilt für Belohnungen – der Spruch „Schokolade ist erlaubt. Aufgeben nicht.“ bleibt auf Wunsch drin)
- Belohnungen haben eine Versionsnummer (`rewardsV`); bei neuen Standard-Belohnungen hochzählen, damit sie gespeicherte Listen ersetzen

## Arbeitsweise
- Sprache der App und der Kommunikation: Deutsch
- Mobile-first, Safe-Area-Abstände für den Vollbildmodus beibehalten
