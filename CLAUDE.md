# Sabrinas Endspurt – Projektnotizen

Motivations-App für Sabrinas Fernstudium Medienpädagogik (geplanter Abschluss: August 2027).
Gehostet über GitHub Pages, genutzt auf ihrem iPhone als Web-App auf dem Home-Bildschirm.

## Aufbau
- `index.html` – die komplette App (HTML, CSS, JS in einer Datei, keine Build-Tools)
- `tobi.js` – Tobis Nachricht und die Belohnungen (pflegt Tobi auf GitHub, kommt automatisch bei Sabrina an)
- `sprueche.js` – Tobis täglicher Spruch (Kosenamen „Schatz“ und „Maus“ sparsam eingestreut; `taeglich` ab `start`, ein Eintrag pro Tag bis 31.08.2027, Monatsblöcke müssen zur Tageszahl passen), `besondere` für feste Tage, `klausur` für Vortag/Klausurtag
- `sw.js` – Service Worker für Push; wählt den Erinnerungstext selbst anhand des Lernstands (Cache `endspurt-status`, schreibt die App bei jedem Speichern)
- `.github/workflows/erinnerung.yml` + `.github/scripts/erinnerung.mjs` – Push gegen 10 Uhr Berlin (Zeitpläne auf :07, Läufe mit >90 Min Verspätung werden ausgelassen; „Heute schon gelernt?“) und 19 Uhr (Lob, ohne Lernzeit ein lieber Gruß – iOS braucht bei jedem Push eine sichtbare Nachricht); Secrets `VAPID_PRIVATE_KEY`, `PUSH_SUBSCRIPTIONS`; der öffentliche VAPID-Schlüssel steht in `index.html` und im Skript (müssen übereinstimmen). Einrichtung steht in README.md
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
- Nachricht „Von Tobi“ und Belohnungen stehen in `tobi.js` und sind in der App NICHT bearbeitbar (Sabrina soll sie nicht ändern; Daten werden nicht zwischen Geräten abgeglichen). Belohnungs-`id`s nie ändern, sonst geht „eingelöst“ verloren. `state.note`/`state.rewards` sind nur noch Ersatz, falls `tobi.js` fehlt

## Arbeitsweise
- Sprache der App und der Kommunikation: Deutsch
- Mobile-first, Safe-Area-Abstände für den Vollbildmodus beibehalten
