// Verschickt die tägliche Erinnerung an alle eingetragenen Geräte.
// Den genauen Text wählt das iPhone selbst (sw.js), je nachdem ob heute schon gelernt wurde.
import webpush from 'web-push';

const PUBLIC_KEY = 'BJH5XcaBsAiLvmbAIDe1pHchNBZ56e3GiMevmgIndZsLLUWZS-t7LX8vtWLOJriKzfcMgf-Gun2DARpH9yWVCak';
const SUBJECT = 'https://m4yh3m1c.github.io/MotivationApp/';
const STUNDE = 10; // Uhrzeit in Berlin

const { VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTIONS, SCHEDULE, TEXT } = process.env;

// Beim geplanten Lauf nur senden, wenn es in Berlin gerade die richtige Stunde ist (Sommer-/Winterzeit)
if (SCHEDULE) {
  const utcStunde = Number(SCHEDULE.split(' ')[1]);
  const jetzt = new Date();
  const berlin = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Berlin' }).format(jetzt));
  const offset = (berlin - jetzt.getUTCHours() + 24) % 24;
  if ((utcStunde + offset) % 24 !== STUNDE) {
    console.log(`Lauf für ${utcStunde} Uhr UTC übersprungen – in Berlin ist das gerade nicht ${STUNDE} Uhr.`);
    process.exit(0);
  }
}

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
const payload = JSON.stringify(TEXT ? { body: TEXT } : { typ: 'erinnerung' });

let ok = 0;
for (const [i, sub] of subs.entries()) {
  try {
    await webpush.sendNotification(sub, payload, { TTL: 4 * 3600, urgency: 'normal' });
    console.log(`Gerät ${i + 1}: gesendet ✓`);
    ok++;
  } catch (e) {
    const abgelaufen = e.statusCode === 404 || e.statusCode === 410;
    console.error(`Gerät ${i + 1}: Fehler ${e.statusCode || ''} ${abgelaufen ? '– Abo abgelaufen. In der App Erinnerungen neu aktivieren und den neuen Code eintragen.' : e.body || e.message}`);
  }
}
if (!ok) process.exit(1);
