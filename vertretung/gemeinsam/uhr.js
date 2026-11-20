/* =====================================================================
   Vertretungsbaukasten – Uhr (für Uhr-Werkstatt M9 und Uhrzeit-Blätter G-M9)
   Uhr.text(h, m)      → "halb drei", "Viertel nach acht", "fünf vor halb neun" …
   Uhr.digital(h, m)   → "8:30"
   Uhr.svg(h, m, opt)  → SVG-Text einer Analoguhr (viewBox 0 0 200 200)
   Uhr.zeit(niveau, rnd, minutengenau) → { h, m } passend zum Niveau
   ===================================================================== */
(function () {
  "use strict";
  const ZAHL = ["zwölf", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
  const SILBEN = { zwölf: "zwölf", eins: "eins", zwei: "zwei", drei: "drei", vier: "vier", fünf: "fünf", sechs: "sechs", sieben: "sie-ben", acht: "acht", neun: "neun", zehn: "zehn", elf: "elf", zwanzig: "zwan-zig" };
  const h12 = h => ((h % 12) + 12) % 12 || 12;
  const n = h => ZAHL[h12(h)];
  // Umgangssprachliche Uhrzeit (ohne Silbentrennung)
  const text = (h, m) => {
    const a = n(h), b = n(h + 1);
    if (m === 0) return (h12(h) === 1 ? "ein" : a) + " Uhr";
    if (m === 30) return "halb " + b;
    if (m === 15) return "Viertel nach " + a;
    if (m === 45) return "Viertel vor " + b;
    if (m % 5 === 0) {
      if (m < 25) return `${{ 5: "fünf", 10: "zehn", 20: "zwanzig" }[m]} nach ${a}`;
      if (m === 25) return "fünf vor halb " + b;
      if (m === 35) return "fünf nach halb " + b;
      return `${{ 40: "zwanzig", 50: "zehn", 55: "fünf" }[m]} vor ${b}`;
    }
    return `${h12(h)} Uhr ${m}`;
  };
  // Silbenschreibweise für die Silbenschrift
  const textSilben = (h, m) => text(h, m).split(" ").map(w => SILBEN[w] || (w === "Viertel" ? "Vier-tel" : w)).join(" ");
  const digital = (h, m) => `${h}:${String(m).padStart(2, "0")}`;

  /* Analoguhr. opt: zeiger (true), ziffern (true), minuten (Minutenstriche), stunde/minute-Farben, groesse egal (viewBox) */
  const svg = (h, m, opt = {}) => {
    const o = Object.assign({ zeiger: true, ziffern: true, minuten: true, dick: 1, rand: "#1d2320", fuell: "#fff" }, opt);
    let s = `<circle cx="100" cy="100" r="94" fill="${o.fuell}" stroke="${o.rand}" stroke-width="${6 * o.dick}"/>`;
    for (let i = 0; i < 60; i++) {
      const a = i * Math.PI / 30, gross = i % 5 === 0;
      if (!gross && !o.minuten) continue;
      const r1 = gross ? 80 : 86;
      s += `<line x1="${(100 + r1 * Math.sin(a)).toFixed(2)}" y1="${(100 - r1 * Math.cos(a)).toFixed(2)}" x2="${(100 + 90 * Math.sin(a)).toFixed(2)}" y2="${(100 - 90 * Math.cos(a)).toFixed(2)}" stroke="#1d2320" stroke-width="${(gross ? 3.2 : 1.4) * o.dick}" stroke-linecap="round"/>`;
    }
    if (o.ziffern) for (let i = 1; i <= 12; i++) {
      const a = i * Math.PI / 6;
      s += `<text x="${(100 + 66 * Math.sin(a)).toFixed(2)}" y="${(100 - 66 * Math.cos(a) + 7).toFixed(2)}" text-anchor="middle" font-size="20" font-weight="700" font-family="Andika,'Comic Sans MS',sans-serif" fill="#1d2320">${i}</text>`;
    }
    if (o.zeiger) {
      const am = m * Math.PI / 30, ah = ((h % 12) + m / 60) * Math.PI / 6;
      s += `<line class="z-std" x1="100" y1="100" x2="${(100 + 44 * Math.sin(ah)).toFixed(2)}" y2="${(100 - 44 * Math.cos(ah)).toFixed(2)}" stroke="#1d2320" stroke-width="${9 * o.dick}" stroke-linecap="round"/>`;
      s += `<line class="z-min" x1="100" y1="100" x2="${(100 + 72 * Math.sin(am)).toFixed(2)}" y2="${(100 - 72 * Math.cos(am)).toFixed(2)}" stroke="#c8322c" stroke-width="${5 * o.dick}" stroke-linecap="round"/>`;
    }
    s += `<circle cx="100" cy="100" r="${6 * o.dick}" fill="#1d2320"/>`;
    return s;
  };
  // Zufällige Zeit passend zum Niveau: 1 volle/halbe, 2 + Viertel, 3 Fünf-Minuten (oder minutengenau)
  const zeit = (niveau, rnd = Math.random, minutengenau = false) => {
    const h = 1 + Math.floor(rnd() * 12);
    const schritte = niveau === 1 ? [0, 30] : niveau === 2 ? [0, 15, 30, 45] : minutengenau ? Array.from({ length: 60 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i * 5);
    return { h, m: schritte[Math.floor(rnd() * schritte.length)] };
  };
  window.Uhr = { text, textSilben, digital, svg, zeit, h12 };
})();
