// Verschickt die Erinnerung (ca. 10 Uhr) bzw. das Abend-Lob (ca. 19 Uhr) an alle eingetragenen Geräte.
// Den genauen Text wählt das iPhone selbst (sw.js), je nachdem ob heute schon gelernt wurde.
import webpush from 'web-push';

const PUBLIC_KEY = 'BJH5XcaBsAiLvmbAIDe1pHchNBZ56e3GiMevmgIndZsLLUWZS-t7LX8vtWLOJriKzfcMgf-Gun2DARpH9yWVCak';
const SUBJECT = 'https://m4yh3m1c.github.io/MotivationApp/';
// Uhrzeiten in Berlin und welche Nachricht dann kommt
const ZEITEN = { 10: 'morgen', 19: 'abend' };

const { VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTIONS, SCHEDULE, TEXT } = process.env;
let art = process.env.ART || 'morgen';

// Beim geplanten Lauf: Welche Berliner Uhrzeit ist das gerade (Sommer-/Winterzeit)?
// Läufe, die später als das starten, werden ausgelassen (GitHub verzögert geplante Läufe manchmal um Stunden).
const MAX_VERSPAETUNG_MIN = 90;

if (SCHEDULE) {
  const [utcMinute, utcStunde] = SCHEDULE.split(' ').map(Number);
  const jetzt = new Date();
  const verspaetung = ((jetzt.getUTCHours() * 60 + jetzt.getUTCMinutes()) - (utcStunde * 60 + utcMinute) + 1440) % 1440;
  if (verspaetung > MAX_VERSPAETUNG_MIN) {
    console.log(`Lauf für ${utcStunde}:${String(utcMinute).padStart(2, '0')} UTC startet ${verspaetung} Minuten zu spät – keine Nachricht.`);
    process.exit(0);
  }
  const berlin = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Berlin' }).format(jetzt));
  const offset = (berlin - jetzt.getUTCHours() + 24) % 24;
  const stunde = (utcStunde + offset) % 24;
  if (!ZEITEN[stunde]) {
    console.log(`Lauf für ${utcStunde} Uhr UTC übersprungen – das ist in Berlin gerade ${stunde} Uhr.`);
    process.exit(0);
  }
  art = ZEITEN[stunde];
}
console.log(`Nachricht: ${art}`);

if (!VAPID_PRIVATE_KEY || !PUSH_SUBSCRIPTIONS) {
  console.log('Secrets VAPID_PRIVATE_KEY und/oder PUSH_SUBSCRIPTIONS fehlen noch – nichts zu tun.');
  process.exit(0);
}

let subs;
try {
  subs = JSON.parse(PUSH_SUBSCRIPTIONS);
  if (!Array.isArray(subs)) subs = [subs];
} catch (e) {
  console.error('PUSH_SUBSCRIPTIONS ist kein gültiges JSON. Bitte den Code aus der App komplett einfügen.');
  process.exit(1);
}

webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, VAPID_PRIVATE_KEY);
const payload = JSON.stringify(TEXT ? { body: TEXT, typ: art } : { typ: art });

let ok = 0;
for (const [i, sub] of subs.entries()) {
  try {
    await webpush.sendNotification(sub, payload, { TTL: 3600, urgency: 'high' });
    console.log(`Gerät ${i + 1}: gesendet ✓`);
    ok++;
  } catch (e) {
    const abgelaufen = e.statusCode === 404 || e.statusCode === 410;
    console.error(`Gerät ${i + 1}: Fehler ${e.statusCode || ''} ${abgelaufen ? '– Abo abgelaufen. In der App Erinnerungen neu aktivieren und den neuen Code eintragen.' : e.body || e.message}`);
  }
}
if (!ok) process.exit(1);
