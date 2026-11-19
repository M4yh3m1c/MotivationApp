// Service Worker für Sabrinas Endspurt: zeigt die tägliche Erinnerung an.
// Die Push-Nachricht kommt von der GitHub Action (.github/workflows/erinnerung.yml).
// Welcher Text erscheint, entscheidet das iPhone selbst – je nachdem, ob heute schon gelernt wurde.

const STATUS_CACHE = 'endspurt-status';
const STATUS_URL = new URL('endspurt-status.json', self.registration.scope).href;

const OFFEN = [
  'Heute schon gelernt, Maus? 15 Minuten reichen schon. ❤️',
  'Guten Morgen, Schatz! Plan dir heute einen kleinen Lernblock ein – dann zählt der Tag. 💪',
  'Heute schon gelernt? Timer an, 25 Minuten, fertig. Ich glaub an dich.',
  'Kaffee in der Hand? Perfekt für eine kleine Lernrunde, Maus. ☕',
  'Heute schon was fürs Studium gemacht? Wenn nicht: Ein Absatz reicht. Wenn doch: Eintragen nicht vergessen! 😉',
  'Kleiner Stups von mir: Heute schon gelernt, Schatz?',
  'Der Tag ist noch jung. Eine Mini-Einheit, und du kannst heute Abend stolz auf dich sein.'
];
const SERIE = n => [
  `${n} Tage am Stück! Heute noch 15 Minuten, und deine Serie läuft weiter, Maus. 🔥`,
  `Deine Serie steht bei ${n} Tagen, Schatz. Lass sie heute nicht abreißen – ein kleiner Block reicht. 🔥`
];
const GESCHAFFT = m => [
  `Wow, Maus! Heute schon ${m} Minuten gelernt – und es ist erst Vormittag. ❤️`,
  `Schon ${m} Minuten heute – ich bin stolz auf dich, Schatz! 💪`,
  `${m} Minuten sind heute schon geschafft. Der Rest des Tages ist Bonus. ✨`
];
// 19 Uhr – heute gelernt
const ABEND_LOB = (m, n) => [
  `${m} Minuten heute – ich bin so stolz auf dich, Maus! Jetzt ist Feierabend. ❤️`,
  `Heute ${m} Minuten gelernt. Stark, Schatz! Füße hoch, du hast es dir verdient. ✨`,
  n >= 2 ? `${n} Tage am Stück und heute ${m} Minuten – du ziehst das richtig durch, Maus! 🔥` : `Wieder ein Lerntag geschafft: ${m} Minuten. Ich bin stolz auf dich, Schatz. 💪`,
  `${m} Minuten näher am Abschluss. Gönn dir einen schönen Abend, Maus. 🌙`
];
// 19 Uhr – heute (noch) nichts eingetragen: kein Druck, nur ein lieber Gruß
const ABEND_OHNE = [
  'Heute war kein Lerntag? Völlig okay, Maus. Morgen ist ein neuer Tag. ❤️',
  'Pausen gehören dazu, Schatz. Genieß deinen Abend – du schaffst das trotzdem.',
  'Falls du heute doch gelernt hast: Eintragen nicht vergessen! 😉 Sonst einfach: schönen Abend, Maus.',
  'Nicht jeder Tag muss ein Lerntag sein. Ich bin trotzdem stolz auf dich, Schatz.'
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
      const abend = data.typ === 'abend';
      const istHeute = s && s.date === heute();
      const heuteGelernt = istHeute ? (s.minutes || 0) : 0;
      // Serie zählt nur, wenn der Stand von heute ist oder von gestern mit Lernzeit
      const g = new Date(Date.now() - 864e5);
      const gestern = g.getFullYear() + '-' + String(g.getMonth() + 1).padStart(2, '0') + '-' + String(g.getDate()).padStart(2, '0');
      const serie = istHeute ? s.streak : (s && s.date === gestern && s.minutes > 0 ? s.streak : 0);
      if (abend) body = heuteGelernt > 0 ? pick(ABEND_LOB(heuteGelernt, serie)) : pick(ABEND_OHNE);
      else if (heuteGelernt > 0) body = pick(GESCHAFFT(heuteGelernt));
      else if (serie >= 2) body = pick(SERIE(serie));
      else body = pick(OFFEN);
    }
    await self.registration.showNotification(data.title || 'Endspurt', {
      // iOS verlangt, dass jede Push-Nachricht sichtbar angezeigt wird – darum gibt es abends immer einen Text
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
