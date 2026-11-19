// Service Worker für Sabrinas Endspurt: zeigt die tägliche Erinnerung an.
// Die Push-Nachricht kommt von der GitHub Action (.github/workflows/erinnerung.yml).
// Welcher Text erscheint, entscheidet das iPhone selbst – je nachdem, ob heute schon gelernt wurde.

const STATUS_CACHE = 'endspurt-status';
const STATUS_URL = new URL('endspurt-status.json', self.registration.scope).href;

const OFFEN = [
  'Heute schon gelernt, Maus? 15 Minuten reichen schon. ❤️',
  'Hey Schatz, kurze Erinnerung: Ein kleiner Lernblock heute und der Tag zählt. 💪',
  'Heute schon gelernt? Timer an, 25 Minuten, fertig. Ich glaub an dich.',
  'Noch Zeit für eine kleine Runde? Auch 10 Minuten bringen dich weiter, Maus.',
  'Heute schon was fürs Studium gemacht? Wenn nicht: Ein Absatz reicht. Wenn doch: Eintragen nicht vergessen! 😉',
  'Kleiner Stups von mir: Heute schon gelernt, Schatz?',
  'Dein Endspurt wartet. Eine Mini-Einheit, und du kannst stolz ins Bett gehen.'
];
const SERIE = n => [
  `${n} Tage am Stück! Heute noch 15 Minuten, und deine Serie läuft weiter, Maus. 🔥`,
  `Deine Serie steht bei ${n} Tagen, Schatz. Lass sie heute nicht abreißen – ein kleiner Block reicht. 🔥`
];
const GESCHAFFT = m => [
  `Stark, Maus! Heute schon ${m} Minuten gelernt. Den Rest des Abends hast du dir verdient. ❤️`,
  `${m} Minuten heute – ich bin stolz auf dich, Schatz! 💪`,
  `Heute ${m} Minuten geschafft. Füße hoch, du hast genug getan. ✨`
];

function heute() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function pick(list) {
  const d = new Date();
  const n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  return list[n % list.length];
}
async function leseStatus() {
  try {
    const c = await caches.open(STATUS_CACHE);
    const r = await c.match(STATUS_URL);
    return r ? await r.json() : null;
  } catch (e) { return null; }
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) {}
  e.waitUntil((async () => {
    let body = data.body;
    if (!body) {
      const s = await leseStatus();
      const istHeute = s && s.date === heute();
      const heuteGelernt = istHeute ? (s.minutes || 0) : 0;
      // Serie zählt nur, wenn der Stand von heute ist oder von gestern mit Lernzeit
      const g = new Date(Date.now() - 864e5);
      const gestern = g.getFullYear() + '-' + String(g.getMonth() + 1).padStart(2, '0') + '-' + String(g.getDate()).padStart(2, '0');
      const serie = istHeute ? s.streak : (s && s.date === gestern && s.minutes > 0 ? s.streak : 0);
      if (heuteGelernt > 0) body = pick(GESCHAFFT(heuteGelernt));
      else if (serie >= 2) body = pick(SERIE(serie));
      else body = pick(OFFEN);
    }
    await self.registration.showNotification(data.title || 'Endspurt', {
      body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'endspurt-erinnerung',
      data: { url: self.registration.scope }
    });
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow(e.notification.data && e.notification.data.url || './');
  })());
});
