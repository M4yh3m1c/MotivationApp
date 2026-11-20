# MotivationApp – Sabrinas Endspurt

Web-App für Sabrinas Fernstudium, gehostet über GitHub Pages und auf dem iPhone über „Zum Home-Bildschirm“ installiert.

## Tägliche Erinnerung (Push) einrichten

Eine GitHub Action schickt zwei Benachrichtigungen am Tag: gegen 10 Uhr „Heute schon gelernt?“ und gegen 19 Uhr Lob, wenn an dem Tag Lernzeit eingetragen wurde.
Ohne Lernzeit kommt abends ein lieber Gruß ohne Druck – iOS verlangt, dass jede Push-Nachricht sichtbar angezeigt wird.

1. **Schlüssel hinterlegen (einmalig):** Im Repository unter *Settings → Secrets and variables → Actions → New repository secret*
   das Secret `VAPID_PRIVATE_KEY` mit dem privaten Schlüssel anlegen. Der Schlüssel gehört nicht ins Repository.
2. **Auf Sabrinas iPhone:** App vom Home-Bildschirm öffnen (iOS 16.4 oder neuer), bei „🔔 Erinnerung“ auf
   *Erinnerungen aktivieren* tippen, erlauben und dann *Code an Tobi schicken*.
3. **Code eintragen:** Den Code als Secret `PUSH_SUBSCRIPTIONS` anlegen. Für mehrere Geräte: `[ {Code 1}, {Code 2} ]`.
4. **Testen:** *Actions → Tägliche Erinnerung → Run workflow*. Dort „morgen“ oder „abend“ wählen, optional einen eigenen Text eingeben.

Hinweise:
- Ausgelöst wird die Action von zwei Aufgaben bei **cron-job.org** (10:00 und 19:00 Uhr, Europe/Berlin): POST an `https://api.github.com/repos/M4yh3m1c/MotivationApp/actions/workflows/erinnerung.yml/dispatches` mit den Headern `Authorization: Bearer <Fine-grained Token mit Actions: Read and write>`, `Accept: application/vnd.github+json`, `Content-Type: application/json` und dem Body `{"ref":"main","inputs":{"art":"morgen"}}` bzw. `"abend"`. Der Token läuft am 19.11.2027 ab – dann einen neuen erstellen und bei beiden Aufgaben eintragen.
- Wird die Erinnerung auf dem iPhone ausgeschaltet oder die App neu installiert, gibt es einen neuen Code. Dann Schritt 2 und 3 wiederholen.
  Schlägt der Versand fehl, schickt GitHub eine Mail über den fehlgeschlagenen Lauf.
- Uhrzeiten ändern: direkt bei cron-job.org in den beiden Aufgaben.
