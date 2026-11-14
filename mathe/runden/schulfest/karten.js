// =====================================================================
//  KARTEN für „Genau oder gerundet? Das Schulfest“
//  Neue Sets (z. B. klassenfahrt) einfach als weitere Liste ergänzen
//  und unten in SETS eintragen.
//
//  sym        Symbol auf der Karte
//  text       Satz auf der Karte (wird auch vorgelesen)
//  vorschlag  "r" = darf ich runden, "g" = muss genau sein (Vorschlags-Lösung)
//  reden      true = bewusst diskutierbar (beide Körbe können richtig sein)
//  wer        Satzanfang für die Begründung, z. B. „Die Zahl der Gäste“
//  weilR      Begründung für „darf ich runden“ (leer lassen, wenn es kaum passt)
//  weilG      Begründung für „muss genau sein“
//  gerundet   Anzeige, wenn man die Karte im Korb „runden“ antippt
//  leicht     true = eindeutiger Fall für Stufe 1
// =====================================================================
const KARTEN = {
  schulfest: [
    { id: "gaeste", sym: "👥", text: "Es kommen 247 Gäste.", vorschlag: "r", wer: "Die Zahl der Gäste",
      weilR: "es nur ungefähr sein muss", weilG: "wir genug Stühle brauchen", gerundet: "Es kommen etwa 250 Gäste.", leicht: true },
    { id: "becher", sym: "🥤", text: "Wir brauchen 368 Becher.", vorschlag: "r", reden: true, wer: "Die Zahl der Becher",
      weilR: "ein paar Becher mehr nicht schlimm sind", weilG: "sonst vielleicht Becher fehlen", gerundet: "Wir brauchen etwa 370 Becher." },
    { id: "los", sym: "🎟️", text: "Die Losnummer ist 483.", vorschlag: "g", wer: "Die Losnummer",
      weilG: "sonst bekommt das falsche Los den Gewinn" },
    { id: "weg", sym: "🚶", text: "Der Weg zum Festplatz ist 742 m lang.", vorschlag: "r", wer: "Die Länge vom Weg",
      weilR: "es nur ungefähr sein muss", weilG: "man genau messen will", gerundet: "Der Weg ist etwa 740 m lang." },
    { id: "bus", sym: "🚌", text: "Der Bus hat 54 Sitzplätze.", vorschlag: "g", reden: true, wer: "Die Zahl der Sitzplätze",
      weilR: "es nur ungefähr sein muss", weilG: "sonst passen vielleicht nicht alle Kinder in den Bus", gerundet: "Der Bus hat etwa 50 Sitzplätze." },
    { id: "ballons", sym: "🎈", text: "Wir haben 126 Luftballons.", vorschlag: "r", wer: "Die Zahl der Luftballons",
      weilR: "es nur ungefähr sein muss", weilG: "man sie genau zählen will", gerundet: "Wir haben etwa 130 Luftballons.", leicht: true },
    { id: "beginn", sym: "🕘", text: "Das Fest beginnt um 9:15 Uhr.", vorschlag: "g", wer: "Die Uhrzeit",
      weilG: "sonst kommen alle zu früh oder zu spät" },
    { id: "kuchen", sym: "🍰", text: "Letztes Jahr gab es 895 Stück Kuchen.", vorschlag: "r", wer: "Die Zahl der Kuchenstücke",
      weilR: "es nur ungefähr sein muss", weilG: "man genau zählen will", gerundet: "Letztes Jahr gab es etwa 900 Stück Kuchen." },
  ],
  alltag: [
    { id: "auto", sym: "🚗", text: "Die Autofahrt dauert 187 Minuten.", vorschlag: "r", wer: "Die Fahrzeit",
      weilR: "es nur ungefähr sein muss", weilG: "man genau planen will", gerundet: "Die Autofahrt dauert etwa 190 Minuten." },
    { id: "turm", sym: "⛪", text: "Der Kirchturm ist 21 m hoch.", vorschlag: "r", wer: "Die Höhe vom Kirchturm",
      weilR: "es nur ungefähr sein muss", weilG: "man genau messen will", gerundet: "Der Kirchturm ist etwa 20 m hoch." },
    { id: "loewe", sym: "🦁", text: "Der Löwe wiegt 183 kg.", vorschlag: "r", wer: "Das Gewicht vom Löwen",
      weilR: "es nur ungefähr sein muss", weilG: "der Tierarzt es genau wissen muss", gerundet: "Der Löwe wiegt etwa 180 kg." },
    { id: "telefon", sym: "📞", text: "Die Telefonnummer ist 0209 4711.", vorschlag: "g", wer: "Die Telefonnummer",
      weilG: "man sonst jemand Falschen anruft", leicht: true },
    { id: "pin", sym: "🔢", text: "Der PIN-Code ist 3851.", vorschlag: "g", wer: "Der PIN-Code",
      weilG: "das Handy sonst nicht aufgeht", leicht: true },
    { id: "geburt", sym: "🎂", text: "Ich habe am 12.05. Geburtstag.", vorschlag: "g", wer: "Das Geburtsdatum",
      weilG: "wir sonst am falschen Tag feiern" },
    { id: "kiga", sym: "🧒", text: "Im Kindergarten sind 98 Kinder.", vorschlag: "r", wer: "Die Zahl der Kinder",
      weilR: "es nur ungefähr sein muss", weilG: "die Erzieherin genau zählen muss", gerundet: "Im Kindergarten sind etwa 100 Kinder." },
  ],
};
const SETS = [{ wert: "schulfest", text: "Schulfest" }, { wert: "alltag", text: "Alltag" }];

// Sätze für „Gerundet oder nicht?“ – Signalwörter: fast, etwa, ca., ungefähr
const SAETZE = [
  "Im Kino waren fast 100 Menschen.", "Die Mensa hat 122 Essen ausgegeben.", "Etwa 300 Kinder gehen auf unsere Schule.",
  "Das Buch hat 157 Seiten.", "Der Zug hat ca. 400 Sitzplätze.", "Ungefähr 50 Eltern helfen beim Fest.",
  "Meine Oma ist 73 Jahre alt.", "Im Zoo leben fast 600 Tiere.", "Der Bus fährt um 7:45 Uhr ab.", "Die Turnhalle ist etwa 30 m lang.",
];
const SIGNALWOERTER = ["fast", "etwa", "ca.", "ungefähr"];
