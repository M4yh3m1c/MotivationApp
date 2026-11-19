// Tobis Inhalte für Sabrinas App: die Nachricht „Von Tobi“ und die Belohnungen.
// Änderungen hier kommen automatisch bei Sabrina an (nach dem Merge auf main, spätestens nach ca. 10 Minuten).
//
// NACHRICHT: Zeilenumbruch mit \n
//
// BELOHNUNGEN – jede Belohnung braucht eine feste "id" (nie ändern, sonst gilt sie als neu und „eingelöst“ ist weg).
//   Freischalten entweder über Lernstunden:     h: 15
//   oder über einen Meilenstein:                ms: "k4"   (k4 = „Erste Klausur geschrieben“)
//   oder wenn alle Meilensteine abgehakt sind:  h: null
// Neue Belohnung: einfach eine Zeile mit einer neuen id ergänzen (z. B. "t1", "t2" …).
//
// Bitte nichts, was schon im Adventskalender steckt:
// Serienabend, Ausschlafen, Massage, freier Nachmittag, Date-Abend, Schokolade, Chips, Fitzek-Bücher, Wellness.

window.TOBI_INHALT = {

nachricht: "Ich bin so stolz auf dich, wie du Studium, Familie und Alltag unter einen Hut bekommst.\nBis August 2027 – und dann feiern wir! ❤️\nTobi",

belohnungen: [
  { id: "q0", ms: "k4",  ico: "🥂", t: "Erste Klausur geschrieben – egal mit welcher Note: Tobi kocht dein Lieblingsessen und wir stoßen an" },
  { id: "p1", h: 5,      ico: "☕", t: "Lernpausen-Lieferdienst: Einen Lerntag lang bringt Tobi Kaffee & Nervennahrung an deinen Platz" },
  { id: "q2", h: 15,     ico: "🧹", t: "Eine Woche keine Küche – Tobi spült, räumt und kocht" },
  { id: "p3", h: 30,     ico: "🎟️", t: "Konzert, Kino oder Event deiner Wahl – die Tickets gehen auf Tobi" },
  { id: "p4", h: 50,     ico: "🎧", t: "Upgrade für deinen Lernplatz – du suchst aus, Tobi zahlt" },
  { id: "q5", h: 65,     ico: "🃏", t: "Joker: ein Wunsch frei, Tobi sagt Ja" },
  { id: "q6", h: 80,     ico: "🚗", t: "Tagesausflug zu zweit – Ziel bestimmst du" },
  { id: "q7", h: null,   ico: "🎓", t: "Zum Abschluss: Kurzurlaub zu zweit" }
]

};
