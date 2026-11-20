/* =====================================================================
   Vertretungsbaukasten – Bildergeschichten (für D1 und G-D1)
   Jedes Bild ist eine schlichte Szene (viewBox 0 0 300 220) aus einem gezeichneten Kind
   und Gegenständen der Bildbibliothek (bilder.js).
   Sätze in Silbenschreibweise ("-" trennt Silben). „inv“ = Satz nach „Zuerst / Dann …“
   (Verb zuerst), „satz“ = normaler Satz.
   ===================================================================== */
(function () {
  "use strict";
  const B = window.SPIELBILDER;
  const K = 'stroke="#1d2320" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
  const H = "#f3c9a0";   // Hautfarbe

  // Bild aus der Bibliothek: Mitte x, y, Größe s, Drehung
  const ic = (id, x, y, s, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s / 200}) translate(-100 -100)">${B[id]()}</g>`;
  const innen = () => `<rect width="300" height="220" fill="#fdf6e3"/><rect y="182" width="300" height="38" fill="#e8d5b5"/><line x1="0" y1="182" x2="300" y2="182" stroke="#c9b38d" stroke-width="3"/>`;
  const draussen = (boden = "#a8dc7c") => `<rect width="300" height="220" fill="#dff1fb"/><rect y="178" width="300" height="42" fill="${boden}"/><line x1="0" y1="178" x2="300" y2="178" stroke="#7fb85a" stroke-width="3"/>`;
  const winter = (flocken = true) => `<rect width="300" height="220" fill="#dbe7f3"/><path d="M0 176 Q80 166 150 176 T300 172 V220 H0 Z" fill="#fff" ${K}/>` +
    (flocken ? [[30, 30], [80, 60], [140, 24], [200, 50], [260, 30], [240, 100], [40, 110], [110, 120], [180, 96], [280, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="#9fb4c8" stroke-width="2"/>`).join("") : "");
  const tisch = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="12" rx="3" fill="#b07a46" ${K}/><path d="M${x + 12} ${y + 12} V182 M${x + w - 12} ${y + 12} V182" ${K} fill="none"/>`;
  const pfuetze = (x, y, w, f = "#8a5a2b") => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .22}" fill="${f}" stroke="#1d2320" stroke-width="3"/>`;
  const tropfen = (x, y, f = "#8a5a2b") => `<path d="M${x} ${y} q-6 9 0 13 q6 -4 0 -13 Z" fill="${f}" stroke="#1d2320" stroke-width="2"/>`;
  const topf = (x, y) => `<path d="M${x - 24} ${y - 34} H${x + 24} L${x + 18} ${y} H${x - 18} Z" fill="#c8673a" ${K}/><rect x="${x - 28}" y="${y - 42}" width="56" height="10" rx="3" fill="#d9774a" ${K}/>`;
  const spross = (x, y, h) => `<path d="M${x} ${y} V${y - h}" ${K} fill="none"/><path d="M${x} ${y - h * .6} q-16 -10 -22 2 q12 8 22 -2 Z M${x} ${y - h * .85} q16 -10 22 2 q-12 8 -22 -2 Z" fill="#6cc04a" stroke="#1d2320" stroke-width="3"/>`;
  const kanne = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-22" y="-20" width="40" height="34" rx="6" fill="#4f9de6" ${K}/><path d="M18 -10 L44 -26" ${K} fill="none" stroke-width="7"/><path d="M40 -32 l10 10" ${K}/><path d="M-22 -14 q-14 6 0 22" ${K} fill="none"/></g>`;
  const leiter = (x, y, h) => `<g ${K} fill="none"><path d="M${x} ${y} L${x + 14} ${y - h} M${x + 30} ${y} L${x + 44} ${y - h}"/>${[1, 2, 3, 4, 5].map(i => `<path d="M${x + 14 * i / 6} ${y - h * i / 6} H${x + 30 + 14 * i / 6}"/>`).join("")}</g>`;
  const kugel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${K}/>`;
  const bewegung = (x, y) => `<path d="M${x} ${y} q8 -6 16 0 M${x + 4} ${y + 10} q8 -6 16 0" stroke="#5d6862" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const herz = (x, y) => `<path d="M${x} ${y + 10} C${x - 16} ${y} ${x - 10} ${y - 12} ${x} ${y - 4} C${x + 10} ${y - 12} ${x + 16} ${y} ${x} ${y + 10} Z" fill="#e86a7f" stroke="#1d2320" stroke-width="2.5"/>`;
  const buerste = (x, y) => `<g transform="translate(${x} ${y}) rotate(-25)"><rect x="-4" y="-2" width="40" height="8" rx="3" fill="#4fb3d9" ${K}/><rect x="-14" y="-6" width="12" height="8" rx="2" fill="#fff" stroke="#1d2320" stroke-width="2.5"/></g>`;

  /* Gezeichnetes Kind. x = Mitte, y = Füße.
     mund: froh | o | traurig; arme: unten | hoch | vorn | wischen | tragen | [[lx,ly],[rx,ry]] (relativ zu x, y)
     sitzt: Beine angewinkelt; dreh: schaut nach links (gespiegelt) */
  function kind({ x, y, shirt = "#4f86d6", hose = "#3a5f9a", haar = "#7a4e2c", mund = "froh", arme = "unten", sitzt = false, dreh = false, traene = false, zopf = false }) {
    const A = { unten: [[-28, -46], [28, -46]], hoch: [[-34, -124], [34, -124]], vorn: [[26, -64], [46, -74]], wischen: [[30, -56], [56, -48]],
      tragen: [[34, -54], [40, -60]], winken: [[-28, -46], [40, -118]], giessen: [[34, -70], [46, -84]] };
    const [[lx, ly], [rx, ry]] = Array.isArray(arme) ? arme : A[arme] || A.unten;
    let s = "";
    // Beine
    if (sitzt) s += `<path d="M-8 -40 H18 V-2 M6 -40 H30 V0" stroke="${hose}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
      `<path d="M14 0 h12 M26 2 h12" stroke="#1d2320" stroke-width="7" stroke-linecap="round"/>`;
    else s += `<path d="M-10 -42 L-12 -4 M10 -42 L12 -4" stroke="${hose}" stroke-width="14" stroke-linecap="round" fill="none"/>` +
      `<path d="M-20 0 h12 M8 0 h12" stroke="#1d2320" stroke-width="8" stroke-linecap="round"/>`;
    // Arme (hinter dem Körper beginnen)
    s += `<path d="M-18 -78 L${lx} ${ly} M18 -78 L${rx} ${ry}" stroke="${shirt}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
    s += `<rect x="-22" y="-90" width="44" height="52" rx="14" fill="${shirt}" ${K}/>`;
    s += `<circle cx="${lx}" cy="${ly}" r="7" fill="${H}" stroke="#1d2320" stroke-width="3"/><circle cx="${rx}" cy="${ry}" r="7" fill="${H}" stroke="#1d2320" stroke-width="3"/>`;
    // Kopf
    s += `<circle cx="0" cy="-110" r="22" fill="${H}" ${K}/>`;
    s += `<path d="M-23 -112 Q-22 -136 0 -134 Q22 -136 23 -112 Q12 -124 0 -122 Q-12 -124 -23 -112 Z" fill="${haar}" stroke="#1d2320" stroke-width="3"/>`;
    if (zopf) s += `<path d="M20 -118 q16 6 12 24" stroke="${haar}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    s += `<circle cx="-8" cy="-110" r="3" fill="#1d2320"/><circle cx="8" cy="-110" r="3" fill="#1d2320"/>`;
    s += mund === "o" ? `<ellipse cx="0" cy="-98" rx="4" ry="5" fill="#8a2b2b"/>` + `<path d="M-14 -120 l6 -3 M14 -120 l-6 -3" stroke="#1d2320" stroke-width="2.5" stroke-linecap="round"/>`
      : mund === "traurig" ? `<path d="M-8 -96 Q0 -103 8 -96" stroke="#1d2320" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path d="M-9 -101 Q0 -92 9 -101" stroke="#1d2320" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (traene) s += `<path d="M10 -104 q-4 7 0 10 q4 -3 0 -10 Z" fill="#7fc4ef" stroke="#1d2320" stroke-width="1.5"/>`;
    return `<g transform="translate(${x} ${y})${dreh ? " scale(-1 1)" : ""}">${s}</g>`;
  }
  const kindSitzt = (x, y, o = {}) => kind(Object.assign({ x, y, sitzt: true }, o));

  // Name des Kindes in der Geschichte: Ben (blaues Shirt) oder Mia (gelbes Shirt, Zopf)
  const BEN = { shirt: "#4f86d6", hose: "#3a5f9a", haar: "#7a4e2c" };
  const MIA = { shirt: "#f2b52c", hose: "#9b6cd6", haar: "#3a2a1a", zopf: true };
  const k = (o, extra) => kind(Object.assign({}, o, extra));

  const G = [
    { id: "kakao", titel: "Der Ka-ka-o", bild: "tasse", kurz: [0, 2, 3], bilder: [
      { s: () => innen() + tisch(120, 120, 150) + k(BEN, { x: 80, y: 182, sitzt: true, arme: [[30, -60], [52, -66]] }) + ic("tasse", 150, 102, 40), inv: "trinkt Ben Ka-ka-o.", satz: "Ben trinkt Ka-ka-o." },
      { s: () => innen() + tisch(120, 120, 150) + k(BEN, { x: 80, y: 182, sitzt: true, arme: [[30, -60], [64, -72]], mund: "o" }) + ic("tasse", 176, 108, 40, 70) + tropfen(196, 116) + tropfen(206, 104) + bewegung(150, 70),
        inv: "stößt Ben die Tas-se um.", satz: "Ben stößt die Tas-se um." },
      { s: () => innen() + tisch(120, 120, 150) + k(BEN, { x: 80, y: 182, sitzt: true, arme: "hoch", mund: "o" }) + ic("tasse", 186, 112, 40, 90) + pfuetze(210, 120, 46) + tropfen(240, 140) + tropfen(250, 160),
        inv: "läuft der Ka-ka-o über den Tisch.", satz: "Der Ka-ka-o läuft über den Tisch." },
      { s: () => innen() + tisch(120, 120, 150) + k(BEN, { x: 120, y: 182, arme: "wischen" }) + `<rect x="168" y="112" width="34" height="14" rx="4" fill="#f7c52b" ${K}/>` + ic("tasse", 240, 102, 40) + bewegung(208, 90),
        inv: "wischt Ben den Tisch ab.", satz: "Ben wischt den Tisch ab." },
    ] },
    { id: "ball", titel: "Der Ball im Baum", bild: "ball", kurz: [0, 1, 4], bilder: [
      { s: () => draussen() + ic("baum", 230, 110, 150) + k(MIA, { x: 80, y: 186, arme: "hoch" }) + ic("ball", 80, 40, 36), inv: "spielt Mi-a mit dem Ball.", satz: "Mi-a spielt mit dem Ball." },
      { s: () => draussen() + ic("baum", 230, 110, 150) + k(MIA, { x: 80, y: 186, arme: "hoch", mund: "o" }) + ic("ball", 222, 66, 32) + `<path d="M100 40 Q170 0 210 60" stroke="#5d6862" stroke-width="3" stroke-dasharray="6 6" fill="none"/>`,
        inv: "fliegt der Ball in den Baum.", satz: "Der Ball fliegt in den Baum." },
      { s: () => draussen() + ic("baum", 230, 110, 150) + k(MIA, { x: 150, y: 186, mund: "traurig", traene: true }) + ic("ball", 222, 66, 32), inv: "ist Mi-a trau-rig.", satz: "Mi-a ist trau-rig." },
      { s: () => draussen() + ic("baum", 230, 110, 150) + leiter(170, 184, 110) + k(MIA, { x: 205, y: 140, arme: "hoch" }) + ic("ball", 230, 60, 32), inv: "holt Mi-a ei-ne Lei-ter.", satz: "Mi-a holt ei-ne Lei-ter." },
      { s: () => draussen() + ic("baum", 230, 110, 150) + leiter(170, 184, 110) + k(MIA, { x: 90, y: 186, arme: "tragen" }) + ic("ball", 132, 128, 34) + herz(60, 50), inv: "hat Mi-a den Ball wie-der.", satz: "Mi-a hat den Ball wie-der." },
    ] },
    { id: "blume", titel: "Die Blu-me", bild: "blume", kurz: [0, 1, 4], bilder: [
      { s: () => innen() + topf(170, 182) + k(MIA, { x: 100, y: 182, arme: [[30, -56], [62, -62]] }) + `<circle cx="168" cy="134" r="4" fill="#7a4e2c"/><circle cx="176" cy="138" r="4" fill="#7a4e2c"/>`,
        inv: "legt Mi-a ei-nen Sa-men in den Topf.", satz: "Mi-a legt ei-nen Sa-men in den Topf." },
      { s: () => innen() + topf(180, 182) + k(MIA, { x: 90, y: 182, arme: "giessen" }) + kanne(150, 102, 20) + tropfen(182, 116, "#7fc4ef") + tropfen(190, 128, "#7fc4ef"), inv: "gießt Mi-a die Er-de.", satz: "Mi-a gießt die Er-de." },
      { s: () => innen() + topf(150, 182) + spross(150, 140, 30) + ic("sonne", 250, 50, 70) + `<path d="M226 72 L180 120 M214 60 L176 100" stroke="#f7c52b" stroke-width="4" stroke-linecap="round"/>`,
        inv: "wächst ei-ne klei-ne Pflan-ze.", satz: "Ei-ne klei-ne Pflan-ze wächst." },
      { s: () => innen() + topf(150, 182) + spross(150, 140, 60) + ic("blume", 150, 66, 70) + ic("sonne", 255, 45, 60), inv: "blüht die Blu-me.", satz: "Die Blu-me blüht." },
      { s: () => innen() + k(MIA, { x: 110, y: 182, arme: "tragen" }) + topf(156, 150) + spross(156, 108, 26) + ic("blume", 156, 76, 50) + herz(70, 40) + herz(250, 60),
        inv: "freut sich Mi-a über die Blu-me.", satz: "Mi-a freut sich über die Blu-me." },
    ] },
    { id: "schneemann", titel: "Der Schnee-mann", bild: "muetze", kurz: [1, 3, 5], bilder: [
      { s: () => winter() + k(BEN, { x: 150, y: 184, arme: "hoch", shirt: "#d9534f" }), inv: "fällt viel Schnee.", satz: "Es fällt viel Schnee." },
      { s: () => winter(false) + k(BEN, { x: 110, y: 184, arme: [[34, -50], [44, -56]], shirt: "#d9534f" }) + kugel(186, 152, 32) + bewegung(226, 140), inv: "rollt Ben ei-ne gro-ße Ku-gel.", satz: "Ben rollt ei-ne gro-ße Ku-gel." },
      { s: () => winter(false) + k(BEN, { x: 90, y: 184, arme: "vorn", shirt: "#d9534f" }) + kugel(190, 150, 34) + kugel(190, 98, 24), inv: "legt Ben ei-ne Ku-gel o-ben drauf.", satz: "Ben legt ei-ne Ku-gel o-ben drauf." },
      { s: () => winter(false) + k(BEN, { x: 90, y: 184, arme: [[30, -56], [60, -110]], shirt: "#d9534f" }) + kugel(190, 150, 34) + kugel(190, 98, 24) + kugel(190, 58, 18) +
        `<circle cx="184" cy="54" r="2.5" fill="#1d2320"/><circle cx="196" cy="54" r="2.5" fill="#1d2320"/><path d="M190 60 L170 64 L190 66 Z" fill="#f28c28" stroke="#1d2320" stroke-width="2"/>`,
        inv: "steckt Ben ei-ne Möh-re als Na-se an.", satz: "Ben steckt ei-ne Möh-re als Na-se an." },
      { s: () => winter() + k(BEN, { x: 90, y: 184, arme: "winken", shirt: "#d9534f" }) + kugel(200, 150, 34) + kugel(200, 98, 24) + kugel(200, 58, 18) +
        `<circle cx="194" cy="54" r="2.5" fill="#1d2320"/><circle cx="206" cy="54" r="2.5" fill="#1d2320"/><path d="M200 60 L180 64 L200 66 Z" fill="#f28c28" stroke="#1d2320" stroke-width="2"/>` + ic("muetze", 200, 36, 40),
        inv: "ist der Schnee-mann fer-tig.", satz: "Der Schnee-mann ist fer-tig." },
      { s: () => draussen("#c8e6b0") + ic("sonne", 250, 45, 70) + pfuetze(170, 176, 60, "#bfe3f7") + `<path d="M170 168 L150 172 L170 176 Z" fill="#f28c28" stroke="#1d2320" stroke-width="2"/>` + ic("muetze", 200, 166, 36, 20) +
        k(BEN, { x: 70, y: 186, mund: "o", shirt: "#d9534f" }), inv: "scheint die Son-ne und der Schnee-mann schmilzt.", satz: "Die Son-ne scheint und der Schnee-mann schmilzt." },
    ] },
    { id: "morgen", titel: "Am Mor-gen", bild: "bett", kurz: [0, 2, 5], bilder: [
      { s: () => innen() + ic("bett", 150, 140, 170) + `<circle cx="104" cy="108" r="18" fill="${H}" ${K}/><path d="M88 104 Q104 86 120 104" fill="#7a4e2c" stroke="#1d2320" stroke-width="3"/><path d="M98 110 h5 M108 110 h5" stroke="#1d2320" stroke-width="2.5" stroke-linecap="round"/>` +
        ic("uhr", 262, 120, 44) + `<path d="M240 92 l-8 -8 M284 92 l8 -8 M262 88 v-10" stroke="#d03a32" stroke-width="3" stroke-linecap="round"/>`, inv: "klin-gelt der We-cker.", satz: "Der We-cker klin-gelt." },
      { s: () => innen() + k(BEN, { x: 150, y: 182, arme: "unten" }) + ic("jacke", 70, 110, 70) + ic("schuh", 240, 166, 40), inv: "zieht Ben sich an.", satz: "Ben zieht sich an." },
      { s: () => innen() + tisch(110, 120, 160) + k(BEN, { x: 70, y: 182, sitzt: true, arme: [[30, -60], [50, -66]] }) + ic("brot", 160, 104, 40) + ic("tasse", 220, 102, 36), inv: "früh-stückt Ben.", satz: "Ben früh-stückt." },
      { s: () => innen() + `<rect x="190" y="40" width="70" height="90" rx="8" fill="#dff1fb" ${K}/>` + k(BEN, { x: 150, y: 182, arme: [[-28, -46], [16, -100]] }) + buerste(150, 92), inv: "putzt Ben die Zäh-ne.", satz: "Ben putzt die Zäh-ne." },
      { s: () => innen() + `<rect x="210" y="60" width="60" height="122" rx="4" fill="#b07a46" ${K}/><circle cx="222" cy="124" r="4" fill="#1d2320"/>` + k(BEN, { x: 130, y: 182, arme: "unten" }) + ic("ranzen", 96, 120, 50),
        inv: "nimmt Ben den Ran-zen.", satz: "Ben nimmt den Ran-zen." },
      { s: () => draussen("#c9cfcb") + ic("bus", 200, 120, 150) + k(BEN, { x: 70, y: 184, arme: "winken" }), inv: "fährt Ben mit dem Bus zur Schu-le.", satz: "Ben fährt mit dem Bus zur Schu-le." },
    ] },
  ];

  // Satzanfänge nach Position (i von n)
  const MITTE = ["Dann", "Da-nach", "Spä-ter", "Dann"];
  const anfang = (i, n) => i === 0 ? "Zu-erst" : i === n - 1 ? "Zum Schluss" : MITTE[(i - 1) % MITTE.length];
  // Bilder einer Geschichte für eine Anzahl: kurz (3) oder die ersten n
  const auswahl = (g, n) => n <= 3 ? g.kurz.slice(0, n) : g.bilder.slice(0, Math.min(n, g.bilder.length)).map((_, i) => i);
  const svg = (g, i) => `<svg viewBox="0 0 300 220" aria-hidden="true">${g.bilder[i].s()}</svg>`;

  window.GESCHICHTEN = { liste: G, anfang, auswahl, svg, kind };
})();
