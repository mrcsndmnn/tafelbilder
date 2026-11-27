/* =====================================================================
   Übungsrunde – Drankommen-Logik (ohne Bildschirm, gut testbar)
   Ein Zustand „runde“ ist ein einfaches Objekt (lässt sich als JSON speichern):
     { kinder: [{ id, name, symbol, dran, abwesend }], kontingent, extra,
       verlauf: [{ zug, kindId, tafelbild, aufgabeId, ergebnis }], aktuell, letzter }
   „aktuell“ = Kind, das gerade dran ist (noch nicht gezählt); "klasse" = ganze Klasse.
   ===================================================================== */
export const TIERE = ["🦊", "🐻", "🐸", "🐱", "🐶", "🐰", "🦁", "🐯", "🐼", "🐨", "🐵", "🐷", "🐮", "🐔", "🐧",
  "🐢", "🐙", "🦉", "🐝", "🦋", "🐞", "🐳", "🐬", "🦒", "🐘", "🦔", "🐿️", "🦜", "🦄", "🐌"];
export const TIERNAMEN = ["Fuchs", "Bär", "Frosch", "Katze", "Hund", "Hase", "Löwe", "Tiger", "Panda", "Koala", "Affe", "Schwein", "Kuh", "Huhn", "Pinguin",
  "Schildkröte", "Krake", "Eule", "Biene", "Schmetterling", "Marienkäfer", "Wal", "Delfin", "Giraffe", "Elefant", "Igel", "Eichhörnchen", "Papagei", "Einhorn", "Schnecke"];

// Namen aus Textfeld: eine Zeile oder Komma je Name, leere ignorieren, doppelte unterscheiden (Lena, Lena 2)
export function namenAusText(text) {
  const roh = String(text || "").split(/[\n,;]+/).map(s => s.trim().replace(/\s+/g, " ")).filter(Boolean);
  const zaehl = {};
  return roh.map(n => { const k = n.toLowerCase(); zaehl[k] = (zaehl[k] || 0) + 1; return zaehl[k] > 1 ? `${n} ${zaehl[k]}` : n; });
}

// Neue Runde: namen (Liste) oder anzahl; tiere = Tier-Symbole statt Nummern
export function erstelleRunde({ anzahl = 8, namen = [], tiere = false, kontingent = 2 } = {}) {
  const n = namen.length ? namen.length : Math.max(1, Math.min(30, anzahl | 0));
  const kinder = Array.from({ length: n }, (_, i) => ({
    id: "k" + (i + 1),
    name: namen.length ? namen[i] : (tiere ? TIERNAMEN[i % TIERNAMEN.length] : String(i + 1)),
    symbol: tiere && !namen.length ? TIERE[i % TIERE.length] : "",
    dran: 0, abwesend: false,
  }));
  return { kinder, kontingent: Math.max(1, Math.min(10, kontingent | 0)), extra: 0, verlauf: [], aktuell: null, letzter: null };
}

export const kind = (r, id) => r.kinder.find(k => k.id === id);
export const waehlbar = (r, k) => !!k && !k.abwesend && k.dran < r.kontingent;
export const waehlbareKinder = r => r.kinder.filter(k => waehlbar(r, k));
export const rundeVorbei = r => r.aktuell === null && waehlbareKinder(r).length === 0;
// Gesamtzahl der Züge: anwesende Kinder ihr Kontingent, abwesende nur, was sie schon hatten; dazu Extra-Züge der ganzen Klasse
export const gesamtZuege = r => r.kinder.reduce((s, k) => s + (k.abwesend ? k.dran : r.kontingent), 0) + r.extra;
export const erledigteZuege = r => r.verlauf.length;

// Zufällig ziehen: erst alle einmal, dann alle zweimal …; nie zweimal hintereinander (außer einziges Kind)
export function ziehe(r, rnd = Math.random) {
  let frei = waehlbareKinder(r);
  if (!frei.length) return null;
  if (frei.length > 1) frei = frei.filter(k => k.id !== r.letzter);
  const min = Math.min(...frei.map(k => k.dran));
  const stufe = frei.filter(k => k.dran === min);
  return stufe[Math.floor(rnd() * stufe.length)].id;
}

export function waehle(r, id) {
  if (id === "klasse") { r.aktuell = "klasse"; return true; }
  if (!waehlbar(r, kind(r, id))) return false;
  r.aktuell = id; return true;
}

// Zug abschließen (erst jetzt wird gezählt)
export function abschliessen(r, { tafelbild = "", aufgabeId = "", ergebnis = "richtig" } = {}) {
  if (r.aktuell === null) return false;
  if (r.aktuell === "klasse") r.extra++;
  else kind(r, r.aktuell).dran++;
  r.verlauf.push({ zug: r.verlauf.length + 1, kindId: r.aktuell, tafelbild, aufgabeId, ergebnis });
  r.letzter = r.aktuell === "klasse" ? r.letzter : r.aktuell;
  r.aktuell = null;
  return true;
}

// Rückgängig: erst die aktuelle Auswahl, sonst den letzten gezählten Zug
export function rueckgaengig(r) {
  if (r.aktuell !== null) { r.aktuell = null; return "auswahl"; }
  const z = r.verlauf.pop(); if (!z) return null;
  if (z.kindId === "klasse") r.extra--; else { const k = kind(r, z.kindId); if (k) k.dran--; }
  r.aktuell = z.kindId;
  const vorher = [...r.verlauf].reverse().find(v => v.kindId !== "klasse");
  r.letzter = vorher ? vorher.kindId : null;
  return "zug";
}

export function setzeAbwesend(r, id, ab = true) {
  const k = kind(r, id); if (!k) return false;
  k.abwesend = !!ab;
  if (ab && r.aktuell === id) r.aktuell = null;
  return true;
}

// Klassenergebnis: Anteil „richtig“ an allen Zügen (0..1)
export function anteilRichtig(r) {
  const z = r.verlauf.filter(v => v.ergebnis !== "uebersprungen");
  return z.length ? z.filter(v => v.ergebnis === "richtig").length / z.length : 0;
}

// Reihenfolge der Tafelbilder: abwechselnd, zufällig oder nacheinander (Block für Block)
export function naechstesTafelbild(ids, art, zugNr, gesamt, rnd = Math.random, vorher = null) {
  if (!ids.length) return null;
  if (ids.length === 1) return ids[0];
  if (art === "zufaellig") { const l = ids.filter(i => i !== vorher); return l[Math.floor(rnd() * l.length)]; }
  if (art === "nacheinander") { const pro = Math.max(1, Math.ceil(gesamt / ids.length)); return ids[Math.min(ids.length - 1, Math.floor(zugNr / pro))]; }
  return ids[zugNr % ids.length];
}
