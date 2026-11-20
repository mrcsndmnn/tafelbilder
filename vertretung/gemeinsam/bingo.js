/* =====================================================================
   Vertretungsbaukasten – Bingo-Inhalte (Rechen-Bingo M3 und Generator G-Bingo)
   Jede Art hat einen Vorrat an Feldern (was auf den Karten steht) und eine
   Funktion, die zu einem Feld eine Aufgabe zum Vorlesen/Zeigen erzeugt.
   rnd = Zufallsfunktion (für Druckblätter mit Startwert)
   ===================================================================== */
(function () {
  "use strict";
  const z = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
  const wahl = (l, rnd) => l[Math.floor(rnd() * l.length)];
  const bereich = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const KERN = [1, 2, 5, 10];
  const produkte = fs => [...new Set(fs.flatMap(k => bereich(1, 10).map(f => k * f)))].sort((a, b) => a - b);

  // plus/minus mit Ergebnis r im Zahlenraum max
  const plusMinus = (r, max, rnd) => {
    if (rnd() < .5 && r > 1) { const a = z(1, r - 1, rnd); return { zeige: `${a} + ${r - a}`, sprich: `${a} plus ${r - a} ist ${r}.`, satz: `${a} plus ${r - a} ist ${r}.` }; }
    const a = z(Math.max(r + 1, 2), max, rnd); return { zeige: `${a} − ${a - r}`, sprich: `${a} minus ${a - r} ist ${r}.`, satz: `${a} mi-nus ${a - r} ist ${r}.` };
  };
  const mal = (r, fs, rnd) => {
    const paare = [];
    bereich(1, 10).forEach(a => bereich(1, 10).forEach(b => { if (a * b === r && (!fs || fs.includes(b) || fs.includes(a))) paare.push([a, b]); }));
    const ohne1 = paare.filter(([x, y]) => x > 1 && y > 1);
    let [a, b] = wahl(ohne1.length && rnd() < .85 ? ohne1 : paare, rnd); if (fs && !fs.includes(b)) [a, b] = [b, a];
    return { zeige: `${a} · ${b}`, sprich: `${a} mal ${b} ist ${r}.`, satz: `${a} mal ${b} ist ${r}.` };
  };

  const ARTEN = {
    plus10: { titel: "Plus und Minus bis 10", kurz: "+/− bis 10", niveau: 1, felder: bereich(0, 10), aufgabe: (r, rnd) => plusMinus(r, 10, rnd) },
    plus20: { titel: "Plus und Minus bis 20", kurz: "+/− bis 20", niveau: 2, felder: bereich(0, 20), aufgabe: (r, rnd) => plusMinus(r, 20, rnd) },
    kern: { titel: "Einmaleins: Kernaufgaben (·1, ·2, ·5, ·10)", kurz: "Kernaufgaben", niveau: 2, felder: produkte(KERN), aufgabe: (r, rnd) => mal(r, KERN, rnd) },
    einmaleins: { titel: "Kleines Einmaleins", kurz: "Einmaleins", niveau: 3, felder: produkte(bereich(1, 10)), aufgabe: (r, rnd) => mal(r, null, rnd) },
    umkehr: { titel: "Umkehraufgaben (geteilt)", kurz: "Geteilt", niveau: 3, felder: bereich(1, 10), aufgabe: (r, rnd) => { const d = z(2, 10, rnd);
      return { zeige: `${r * d} : ${d}`, sprich: `${r * d} geteilt durch ${d} ist ${r}.`, satz: `${r * d} ge-teilt durch ${d} ist ${r}.` }; } },
  };
  // Anlaute und Wörter (nur Generator): Feld = Buchstabe bzw. Wort, Aufgabe = Bild + Wort zum Vorlesen
  const ANLAUTE = { A: ["affe", "apfel"], B: ["ball", "banane", "baum", "bus", "buch", "birne", "bett"], E: ["ente", "elefant"],
    F: ["fisch", "frosch", "fahrrad", "fuchs"], H: ["hund", "hase", "haus", "hose", "huhn"], I: ["igel"], K: ["katze", "kuh", "kaese"], L: ["lampe", "loewe", "lupe"],
    M: ["maus", "muetze", "moehre"], N: ["nase", "nudel"], R: ["rakete", "rose", "ranzen", "reh"], S: ["sonne"], Sch: ["schaf", "schuh", "schere", "schnecke", "schaukel"],
    T: ["tisch", "tasse", "tomate", "tafel"], U: ["uhr"] };
  ARTEN.anlaute = { titel: "Anlaute", kurz: "Anlaute", niveau: 1, nurDruck: true, felder: Object.keys(ANLAUTE),
    aufgabe: (r, rnd) => { const id = wahl(ANLAUTE[r], rnd), w = window.INHALTE ? INHALTE.WOERTER[id] : null, wort = w ? w[1].replace(/-/g, "") : id;
      return { zeige: wort, bild: id, sprich: `${wort} fängt mit ${r} an.`, satz: `${w ? w[1] : wort} fängt mit ${r} an.` }; } };
  ARTEN.woerter = { titel: "Wörter (mit Bild)", kurz: "Wörter", niveau: 1, nurDruck: true,
    felder: ["hund", "katze", "maus", "fisch", "hase", "kuh", "ente", "apfel", "banane", "brot", "ei", "buch", "schere", "haus", "tisch", "lampe", "ball", "sonne", "baum", "auto", "bus", "hose", "schuh", "uhr", "fuchs"],
    aufgabe: (r) => { const w = window.INHALTE ? INHALTE.WOERTER[r] : null; return { zeige: w ? w[1].replace(/-/g, "") : r, bild: r, sprich: w ? w[0] + " " + w[1].replace(/-/g, "") : r, satz: w ? w[0] + " " + w[1] : r }; } };
  ARTEN.anlaute.anlaute = ANLAUTE;

  // Karte: n Felder (9 oder 16) zufällig aus dem Vorrat
  const karte = (art, n, rnd) => { const f = [...ARTEN[art].felder]; for (let i = f.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [f[i], f[j]] = [f[j], f[i]]; } return f.slice(0, n); };

  window.BINGO = { ARTEN, karte };
})();
