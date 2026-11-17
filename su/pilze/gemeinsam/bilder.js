/* =====================================================================
   Pilze – selbst gezeichnete Bilder (SVG) im Stil des Pilzbilds:
   schwarze Konturen, weiche Farben. Keine Dateien nötig.
   Pilz.pilz({...})      Pilz in vielen Varianten (Lamellen, Röhren, Fliegenpilz …)
   Pilz.entwicklung(t)   Querschnitt Spore → Pilz, t von 0 (Stufe 1) bis 5 (Stufe 6)
   Pilz.bild("wald")     weitere kleine Bilder (Wald, Pilzbox, Regen …)
   ===================================================================== */
(function () {
  "use strict";
  const P = window.Pilz;
  const K = "#1d2320";            // Kontur
  let uid = 0;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const svg = (vb, inhalt, label) =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">${inhalt}</svg>`;

  // ---------------- Pilz ----------------
  const FORM = {
    kuppel: { hut: "M45 162 C40 92 92 46 150 46 C208 46 260 92 255 162 Q150 182 45 162 Z", unter: "M47 160 Q150 216 253 160 Q150 182 47 160 Z",
      a: [47, 160], q: [150, 216], b: [253, 160], top: 46,
      punkte: [[105, 88, 11], [152, 66, 13], [200, 90, 11], [76, 132, 10], [124, 120, 12], [176, 116, 11], [224, 134, 10], [150, 152, 8]] },
    flach: { hut: "M30 168 C38 118 92 96 150 96 C208 96 262 118 270 168 Q150 186 30 168 Z", unter: "M33 166 Q150 216 267 166 Q150 186 33 166 Z",
      a: [33, 166], q: [150, 216], b: [267, 166], top: 96,
      punkte: [[92, 128, 10], [142, 110, 12], [196, 116, 11], [238, 146, 9], [58, 154, 8], [118, 150, 10], [172, 148, 10], [214, 158, 7]] },
    polster: { hut: "M26 168 C18 76 88 32 150 32 C212 32 282 76 274 168 Q150 194 26 168 Z", unter: "M29 166 Q150 224 271 166 Q150 194 29 166 Z",
      a: [29, 166], q: [150, 224], b: [271, 166], top: 32,
      punkte: [[100, 76, 11], [152, 56, 13], [204, 78, 11], [64, 126, 10], [120, 112, 12], [180, 110, 11], [236, 128, 10]] },
    trichter: { hut: "M36 86 Q66 72 98 84 Q124 94 150 84 Q178 74 206 86 Q236 98 264 84 Q252 126 186 178 L114 178 Q50 126 36 86 Z",
      innen: "M36 86 Q150 124 264 84", unter: "M52 112 Q150 140 248 112 Q220 150 186 178 L114 178 Q80 150 52 112 Z", top: 74 },
  };
  const STIEL = {
    normal: { d: "M128 168 C126 230 122 300 120 340 Q150 350 180 340 C178 300 174 230 172 168 Z" },
    dick: { d: "M120 172 C96 238 92 304 110 338 Q150 354 190 338 C208 304 204 238 180 172 Z" },
    schlank: { d: "M136 168 C134 240 132 300 131 334 Q150 340 169 334 C168 300 166 240 164 168 Z" },
    knolle: { d: "M137 168 C135 230 134 280 133 318 L167 318 C166 280 165 230 163 168 Z", knolle: "M128 316 C104 330 112 352 150 352 C188 352 196 330 172 316 Q150 306 128 316 Z" },
    trichter: { d: "M116 174 C128 230 133 290 133 336 Q150 344 167 336 C167 290 172 230 184 174 Z" },
  };
  const SPOREN = [[84, 206], [112, 232], [96, 262], [206, 214], [220, 250], [194, 284], [80, 300], [224, 304], [104, 330], [204, 334], [74, 238], [232, 222]];
  const MYZEL = ["M150 346 q-30 10 -52 6 q-24 -4 -46 12", "M150 346 q-14 18 -36 22 q-22 4 -34 22", "M150 346 q-4 22 -18 40",
    "M150 346 q8 24 2 44", "M150 346 q22 12 30 30 q6 12 2 16", "M150 346 q30 4 54 -2 q26 -6 52 10", "M150 346 q36 16 62 18 q16 2 30 16",
    "M98 352 q-8 14 -26 18", "M204 344 q8 16 28 20", "M114 368 q-14 8 -20 22", "M180 376 q10 6 14 16"];
  const q = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];

  // Innenleben eines Pilzes (Koordinaten 0..300 × 0..400, Boden bei y = 340)
  P.pilzG = (o = {}) => {
    const f = FORM[o.form || "kuppel"], st = STIEL[o.stielForm || (o.form === "trichter" ? "trichter" : "normal")];
    const hut = o.hut || "#c98a4a", unten = o.unten || "#f6e7c6", stiel = o.stiel || "#f7efcf";
    const id = "p" + (++uid);
    // tief: Unterseite deutlicher zeigen (Pilz etwas von unten gesehen)
    const unterPfad = f.a ? (() => { const qq = [f.q[0], f.q[1] + (o.tief ? 34 : 0)];
      return { d: `M${f.a[0]} ${f.a[1]} Q${qq[0]} ${qq[1]} ${f.b[0]} ${f.b[1]} Q150 ${f.a[1] + 22} ${f.a[0]} ${f.a[1]} Z`, q: qq }; })() : { d: f.unter, q: [150, 178] };
    const mit = o.unterseite && o.unterseite !== "keine";
    const leise = t => o.teil && !o.teil.split(" ").includes(t) ? ' opacity=".28"' : "";
    let g = "";
    // Erde und Myzel
    if (o.erde) {
      g += `<g${leise("myzel")}><path d="M14 338 Q80 333 150 337 Q220 341 286 335 L288 394 Q150 402 12 394 Z" fill="#8b5a33" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
        <g fill="#6f4426" opacity=".55"><circle cx="40" cy="360" r="5"/><circle cx="250" cy="372" r="6"/><circle cx="214" cy="386" r="4"/><circle cx="70" cy="384" r="4"/></g>`;
      if (o.myzel !== false) g += `<g fill="none" stroke-linecap="round"><g stroke="#c9a227" stroke-width="8">${MYZEL.map(d => `<path d="${d}"/>`).join("")}</g>
        <g stroke="#fbf3c4" stroke-width="4">${MYZEL.map(d => `<path d="${d}"/>`).join("")}</g></g>`;
      g += "</g>";
    } else if (o.boden !== false) {
      g += `<ellipse cx="150" cy="342" rx="${o.stielForm === "dick" ? 82 : 66}" ry="8" fill="#000" opacity=".12"/>
        <path d="M70 343 q4 -12 8 0 M86 343 q3 -9 6 0 M214 343 q4 -12 8 0 M228 343 q3 -9 6 0" stroke="#4f9a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }
    // Stiel (bei sichtbarer Unterseite vor der Unterseite, sonst hinter dem Hut)
    const stielSvg = `<g${leise("stiel")}>${st.knolle ? `<path d="${st.knolle}" fill="${stiel}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` : ""}
      <path d="${st.d}" fill="${stiel}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      ${o.ring ? `<path d="M128 206 Q150 216 172 206 L178 224 Q150 236 122 224 Z" fill="${stiel}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>` : ""}
      ${o.stielMuster ? `<path d="M134 220 l10 6 M156 214 l10 6 M130 260 l10 6 M160 258 l10 6 M134 300 l10 6 M158 296 l10 6" stroke="#b9a37a" stroke-width="3" stroke-linecap="round"/>` : ""}</g>`;
    if (!mit) g += stielSvg;
    // Hut
    g += `<g${leise("hut")}><path d="${f.hut}" fill="${hut}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`;
    if (f.innen) g += `<path d="${f.innen}" fill="none" stroke="${K}" stroke-width="3" opacity=".55"/>`;
    if (o.punkte && f.punkte) g += f.punkte.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .8}" fill="${o.punkte}" stroke="${K}" stroke-width="1.5" opacity=".95"/>`).join("");
    if (!o.punkte && o.form !== "trichter") g += `<path d="M84 ${f.top + 58} Q104 ${f.top + 22} 140 ${f.top + 14}" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".35"/>`;
    g += "</g>";
    // Unterseite
    if (mit) {
      const lu = o.teil && o.teil.includes("lamellen") ? "" : leise("hut");
      g += `<defs><clipPath id="${id}"><path d="${unterPfad.d}"/></clipPath></defs><g${lu}><path d="${unterPfad.d}" fill="${unten}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><g clip-path="url(#${id})">`;
      if (o.unterseite === "lamellen") {
        for (let i = 1; i < 22; i++) { const [x, y] = q(f.a, unterPfad.q, f.b, i / 22); g += `<path d="M150 ${f.a[1] + 12} L${x.toFixed(1)} ${(y + 6).toFixed(1)}" stroke="#b07a3a" stroke-width="2.4"/>`; }
      } else if (o.unterseite === "roehren") {
        for (let yy = f.a[1] + 2; yy < unterPfad.q[1]; yy += 9) for (let xx = 40 + ((yy / 9) % 2) * 4.5; xx < 262; xx += 9) g += `<circle cx="${xx}" cy="${yy}" r="2.6" fill="#a8892e" opacity=".85"/>`;
      } else if (o.unterseite === "leisten") {
        for (let i = 0; i < 9; i++) { const x = 70 + i * 20; g += `<path d="M${x} 114 Q${x + (150 - x) * .4} 150 ${150 + (x - 150) * .25} 178" stroke="#c99a1e" stroke-width="2.6" fill="none"/>`; }
      }
      g += "</g></g>" + stielSvg;
    }
    if (o.sporen) g += `<g${o.teil && !o.teil.includes("sporen") ? ' opacity=".4"' : ""}>${SPOREN.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#6b6b6b"/>`).join("")}</g>`;
    return g;
  };
  P.pilz = (o = {}) => svg(o.erde ? "0 0 300 404" : "0 20 300 340", P.pilzG(o), o.label);

  P.FORMEN = { FORM, STIEL, MYZEL, KONTUR: K };

  // Pilzarten (vereinfacht, nicht zum Bestimmen geeignet)
  P.ARTEN = {
    champignon: { name: "der Cham-pig-non", o: { form: "kuppel", hut: "#f4f1ea", stiel: "#f7f3ea", unterseite: "lamellen", unten: "#d8a59a", ring: true } },
    steinpilz: { name: "der Stein-pilz", o: { form: "polster", hut: "#8a5228", stiel: "#efe2c2", stielForm: "dick", unterseite: "roehren", unten: "#efe3a6", stielMuster: true } },
    pfifferling: { name: "der Pfif-fer-ling", o: { form: "trichter", hut: "#f2b52c", stiel: "#f2c04a", unterseite: "leisten", unten: "#f6c94c" } },
    marone: { name: "der Ma-ro-nen-röhr-ling", o: { form: "polster", hut: "#5b3820", stiel: "#d9c29a", unterseite: "roehren", unten: "#e8de86" } },
    fliegenpilz: { name: "der Flie-gen-pilz", o: { form: "kuppel", hut: "#d8382b", punkte: "#ffffff", stiel: "#fbfaf4", ring: true, stielForm: "knolle" } },
    pantherpilz: { name: "der Pan-ther-pilz", o: { form: "flach", hut: "#9a7350", punkte: "#fbf7ec", stiel: "#fbfaf4", ring: true, stielForm: "knolle" } },
    knollenblaetterpilz: { name: "der Knol-len-blät-ter-pilz", o: { form: "flach", hut: "#c9d6a6", stiel: "#f4f6ea", ring: true, stielForm: "knolle", unterseite: "lamellen", unten: "#fbfbf3" } },
  };
  P.art = (k, extra) => P.pilz(Object.assign({}, P.ARTEN[k].o, extra || {}, { label: P.ohne(P.ARTEN[k].name) }));

  // ---------------- Entwicklung: Spore → Pilz (Querschnitt) ----------------
  P.STUFEN = [
    "Die Spo-ren fal-len auf die Er-de.",
    "Die Spo-ren kei-men. Es wach-sen dün-ne Fä-den, die Hy-phen.",
    "Die Hy-phen wach-sen zu-sam-men. Das ist das My-zel.",
    "Aus dem My-zel wächst ein klei-ner Pilz.",
    "Der Pilz wird grö-ßer.",
    "Der Pilz ist reif. Er streut neu-e Spo-ren aus.",
  ];
  const SP = [[66, 52], [118, 92], [170, 40], [232, 78], [282, 48], [334, 100]];
  const KEIM = [["M118 174 l-8 22 l6 16 l-10 8", .45], ["M170 174 l7 20 l-4 18 l8 8", .5], ["M232 174 l-6 24 l8 14 l-8 10", .55], ["M282 174 l8 20 l-3 18 l9 6", .6]];
  const NETZ = [["M116 204 q-20 18 -44 24 q-20 6 -36 22", 1.0], ["M126 212 q10 22 34 30 q20 6 42 -4", 1.05], ["M172 204 q-10 24 -14 44", 1.1],
    ["M175 190 q30 10 52 4", 1.15], ["M228 204 q-14 20 -8 44 q4 14 -6 30", 1.2], ["M236 196 q24 14 44 8 q20 -6 40 14", 1.25],
    ["M286 204 q-10 24 4 44 q12 16 36 18", 1.3], ["M122 230 q-30 30 -20 56", 1.38], ["M200 248 q20 16 50 12", 1.45], ["M300 222 q30 -6 52 12", 1.5],
    ["M58 242 q-20 10 -40 4", 1.55], ["M252 268 q-20 10 -40 22", 1.6], ["M160 270 q-30 6 -46 24", 1.62], ["M330 262 q20 10 34 26", 1.66]];
  const STRANG = [["M200 172 q-2 26 -8 48", 2.3], ["M200 174 q16 20 32 26", 2.4], ["M200 176 q-20 16 -40 18", 2.5]];
  // Maßstab des Pilzes je Zeit
  const gr = t => t < 2.4 ? 0 : t < 3 ? .18 * (t - 2.4) / .6 : t < 4 ? .18 + .18 * (t - 3) : .36 + .18 * clamp(t - 4);
  P.entwicklung = (t, label) => {
    t = clamp(t, 0, 5);
    let g = `<rect x="0" y="0" width="400" height="300" fill="#f6fbff"/>
      <path d="M0 172 Q100 166 200 171 Q300 176 400 169 L400 300 L0 300 Z" fill="#8b5a33"/>
      <g fill="#6f4426" opacity=".5"><circle cx="40" cy="210" r="6"/><circle cx="350" cy="236" r="7"/><circle cx="260" cy="290" r="5"/><circle cx="90" cy="282" r="5"/><circle cx="150" cy="236" r="4"/></g>`;
    // Hyphen (wachsen als Linien)
    const linie = (d, t0, dauer) => { const f = clamp((t - t0) / dauer); return f <= 0 ? "" :
      `<path d="${d}" pathLength="1" stroke-dasharray="${f.toFixed(3)} 1" fill="none" stroke-linecap="round"/>`; };
    const alle = KEIM.map(([d, t0]) => linie(d, t0, .5)).join("") + NETZ.map(([d, t0]) => linie(d, t0, .45)).join("") + STRANG.map(([d, t0]) => linie(d, t0, .6)).join("");
    if (alle) g += `<g stroke="#c9a227" stroke-width="7">${alle}</g><g stroke="#fbf3c4" stroke-width="3.5">${alle}</g>`;
    // Sporen: fallen (t 0 … 0.8), liegen dann auf der Erde
    const fall = P.bewegt || t > 0 ? clamp(t / .8) : 0, e = 1 - (1 - fall) ** 2;
    SP.forEach(([x, y0], i) => {
      const y = y0 + (171 - y0) * e;
      if (fall < 1) g += `<path d="M${x} ${y - 26} v14" stroke="#9aa39e" stroke-width="2.5" stroke-dasharray="4 4" stroke-linecap="round"/>`;
      if (t < 3.2 || i % 2) g += `<circle cx="${x}" cy="${y.toFixed(1)}" r="5.5" fill="#e9e4d4" stroke="#4a4a4a" stroke-width="1.8" opacity="${t > 2.4 ? clamp(3.2 - t).toFixed(2) : 1}"/>`;
    });
    // Pilz (wächst aus dem Myzel)
    const s = gr(t);
    if (s > 0) {
      const reif = t >= 4.5;
      g += `<g transform="translate(200 172) scale(${s.toFixed(3)}) translate(-150 -340)">${P.pilzG({ form: "kuppel", hut: "#d9a066", boden: false, unterseite: reif ? "lamellen" : null })}</g>`;
      if (t > 4.6) {
        const o = clamp((t - 4.6) / .4), rand = 172 - (340 - 162) * s;
        g += `<g fill="#6b6b6b" opacity="${o.toFixed(2)}">${[[176, 14], [196, 32], [216, 10], [226, 40], [182, 50], [246, 26], [160, 40], [206, 60]].map(([x, dy]) => `<circle cx="${x}" cy="${(rand + 18 + dy).toFixed(1)}" r="3.6"/>`).join("")}</g>`;
      }
    }
    g += `<path d="M0 172 Q100 166 200 171 Q300 176 400 169" fill="none" stroke="${K}" stroke-width="4"/>`;
    return svg("0 0 400 300", g, label);
  };

  // ---------------- Weitere Bilder ----------------
  const baum = (x, y, s = 1, farbe = "#4f9a3a") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-10" width="18" height="70" fill="#8a5a33" stroke="${K}" stroke-width="3.5"/>
    <path d="M0 -110 C40 -100 60 -60 46 -30 C40 -6 -40 -6 -46 -30 C-60 -60 -40 -100 0 -110 Z" fill="${farbe}" stroke="${K}" stroke-width="3.5"/></g>`;
  const B = {
    wald: () => `<rect width="300" height="300" fill="#eef7ea"/><path d="M0 240 Q150 228 300 240 V300 H0Z" fill="#9b6a43"/>${baum(70, 200, 1.1)}${baum(160, 190, 1.3, "#3f8a3f")}${baum(240, 205, 1.05, "#5aa547")}
      <g transform="translate(110 240) scale(.18) translate(-150 -340)">${P.pilzG({ hut: "#c98a4a", boden: false })}</g>`,
    baumstamm: () => `<rect width="300" height="300" fill="#eef7ea"/><path d="M0 230 Q150 220 300 230 V300 H0Z" fill="#9b6a43"/>
      <path d="M30 200 H250 Q270 200 270 230 Q270 260 250 260 H30 Z" fill="#9a6b45" stroke="${K}" stroke-width="4"/><ellipse cx="30" cy="230" rx="16" ry="30" fill="#e3c08f" stroke="${K}" stroke-width="4"/>
      <ellipse cx="30" cy="230" rx="7" ry="14" fill="none" stroke="#a07040" stroke-width="2.5"/><path d="M70 214 h60 M150 244 h70" stroke="#6f4426" stroke-width="3"/>
      ${[110, 150, 190].map((x, i) => `<g transform="translate(${x} 202) scale(${.16 + i * .02}) translate(-150 -340)">${P.pilzG({ form: "flach", hut: "#c9893b", boden: false })}</g>`).join("")}`,
    moos: () => `<rect width="300" height="300" fill="#eef7ea"/><path d="M0 210 Q150 200 300 210 V300 H0Z" fill="#7a5a3a"/>
      <path d="M40 220 Q50 170 100 180 Q130 150 170 175 Q220 160 250 195 Q270 205 262 222 Z" fill="#5f9e3a" stroke="${K}" stroke-width="4"/>
      ${Array.from({ length: 16 }, (_, i) => `<path d="M${60 + i * 12} ${210 - (i % 3) * 8} l-4 -10 m4 10 l4 -10" stroke="#2f6f2a" stroke-width="2.5" fill="none"/>`).join("")}
      <path d="M0 268 Q80 252 150 266 Q230 280 300 262 V300 H0Z" fill="#7fb6e6" stroke="${K}" stroke-width="3.5"/>`,
    laub: () => `<rect width="300" height="300" fill="#fbf6ec"/>${[[70, 90, "#d9822b", 20], [170, 70, "#c8322c", -30], [230, 160, "#e0b22a", 50], [110, 190, "#b8601e", -10], [190, 240, "#d9822b", 30]].map(([x, y, c, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 -50 C34 -30 34 30 0 50 C-34 30 -34 -30 0 -50 Z" fill="${c}" stroke="${K}" stroke-width="4"/><path d="M0 -46 V60" stroke="${K}" stroke-width="3"/></g>`).join("")}`,
    regen: () => `<rect width="300" height="300" fill="#eef4fb"/><path d="M60 130 Q50 90 90 86 Q100 46 150 54 Q190 40 210 80 Q252 80 248 120 Q250 140 220 140 H80 Q60 140 60 130 Z" fill="#cfd8e3" stroke="${K}" stroke-width="4"/>
      ${[[90, 170], [130, 190], [170, 165], [210, 188], [110, 230], [160, 240], [200, 225]].map(([x, y]) => `<path d="M${x} ${y} q-8 14 0 18 q8 -4 0 -18 Z" fill="#4a90d9" stroke="${K}" stroke-width="2.5"/>`).join("")}`,
    schatten: () => `<rect width="300" height="300" fill="#fffbe6"/><circle cx="250" cy="50" r="28" fill="#f7cf3c" stroke="${K}" stroke-width="3.5"/><path d="M0 230 Q150 220 300 230 V300 H0Z" fill="#9bc46a"/>
      <ellipse cx="130" cy="246" rx="90" ry="20" fill="#3c5a2c" opacity=".55"/>${baum(110, 190, 1.4, "#3f8a3f")}`,
    sonne: () => `<rect width="300" height="300" fill="#fffbe6"/><circle cx="150" cy="140" r="56" fill="#f7cf3c" stroke="${K}" stroke-width="4"/>
      ${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<path d="M${150 + Math.cos(a) * 74} ${140 + Math.sin(a) * 74} L${150 + Math.cos(a) * 100} ${140 + Math.sin(a) * 100}" stroke="#e0a91c" stroke-width="8" stroke-linecap="round"/>`; }).join("")}`,
    erde: () => `<rect width="300" height="300" fill="#fff"/><path d="M20 110 Q150 96 280 110 L284 250 Q150 262 16 250 Z" fill="#8b5a33" stroke="${K}" stroke-width="4"/>
      <g fill="#6f4426"><circle cx="70" cy="150" r="9"/><circle cx="200" cy="140" r="7"/><circle cx="130" cy="200" r="10"/><circle cx="230" cy="214" r="8"/><circle cx="60" cy="220" r="6"/></g>`,
    pilzbox: () => `<rect width="300" height="300" fill="#fff"/><path d="M40 150 L260 150 L240 270 L60 270 Z" fill="#d9b88a" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M40 150 Q150 136 260 150" fill="#5c3a22" stroke="${K}" stroke-width="4"/><text x="150" y="226" text-anchor="middle" font-family="Andika,sans-serif" font-size="30" font-weight="700" fill="${K}">Pilzbox</text>
      ${[[90, .2], [140, .26], [196, .22], [236, .16]].map(([x, s]) => `<g transform="translate(${x} 150) scale(${s}) translate(-150 -340)">${P.pilzG({ hut: "#f4f1ea", boden: false })}</g>`).join("")}`,
    spruehflasche: () => `<rect width="300" height="300" fill="#fff"/><path d="M110 120 H190 V260 Q190 274 176 274 H124 Q110 274 110 260 Z" fill="#9fd0f0" stroke="${K}" stroke-width="4"/>
      <path d="M128 120 V90 H172 V120" fill="#e5e9ee" stroke="${K}" stroke-width="4"/><path d="M128 92 H96 L92 104 H128" fill="#e5e9ee" stroke="${K}" stroke-width="4"/>
      <path d="M172 96 l14 24" stroke="${K}" stroke-width="5" stroke-linecap="round"/>${[[70, 90], [56, 104], [64, 120], [44, 92], [48, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#4a90d9"/>`).join("")}`,
    flaum: () => `<rect width="300" height="300" fill="#fff"/><path d="M20 150 Q150 138 280 150 L284 260 Q150 272 16 260 Z" fill="#8b5a33" stroke="${K}" stroke-width="4"/>
      <path d="M40 152 Q60 120 90 138 Q110 110 140 132 Q170 108 196 134 Q226 114 250 140 Q270 136 270 152 Q150 166 40 152 Z" fill="#fbfaf2" stroke="#b9b29a" stroke-width="3"/>`,
    ernten: () => `<rect width="300" height="300" fill="#fff"/>${[[100, .22], [150, .25], [200, .21], [125, .2], [176, .2]].map(([x, s], i) => `<g transform="translate(${x} ${168 - (i > 2 ? 10 : 0)}) scale(${s}) translate(-150 -340)">${P.pilzG({ hut: "#f4f1ea", boden: false })}</g>`).join("")}
      <path d="M50 160 H250 L230 260 H70 Z" fill="#c9893b" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M70 186 H230 M80 214 H220 M88 240 H212" stroke="#8a5a2a" stroke-width="3"/>
      <path d="M80 160 Q150 60 220 160" fill="none" stroke="${K}" stroke-width="6"/>`,
    wasser: () => `<rect width="300" height="300" fill="#fff"/><path d="M150 50 C200 130 230 170 230 200 A80 80 0 0 1 70 200 C70 170 100 130 150 50 Z" fill="#7fb6e6" stroke="${K}" stroke-width="5"/>
      <path d="M110 200 Q112 236 146 244" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>`,
    hyphe: () => `<rect width="300" height="300" fill="#8b5a33"/><circle cx="90" cy="90" r="12" fill="#e9e4d4" stroke="#4a4a4a" stroke-width="3"/>
      <g fill="none" stroke-linecap="round"><path d="M98 100 q30 40 70 50 q40 10 60 60 M168 150 q-10 40 -50 60" stroke="#c9a227" stroke-width="12"/>
      <path d="M98 100 q30 40 70 50 q40 10 60 60 M168 150 q-10 40 -50 60" stroke="#fbf3c4" stroke-width="6"/></g>`,
    lamellen: () => `<rect width="300" height="300" fill="#fff"/><circle cx="150" cy="150" r="120" fill="#f6e7c6" stroke="${K}" stroke-width="5"/>
      ${Array.from({ length: 36 }, (_, i) => { const a = i * Math.PI / 18; return `<path d="M${150 + Math.cos(a) * 34} ${150 + Math.sin(a) * 34} L${150 + Math.cos(a) * 116} ${150 + Math.sin(a) * 116}" stroke="#b07a3a" stroke-width="3"/>`; }).join("")}
      <circle cx="150" cy="150" r="32" fill="#f7efcf" stroke="${K}" stroke-width="4"/>`,
    roehren: () => { let d = ""; for (let y = 40; y < 262; y += 18) for (let x = 40 + ((y / 18) % 2) * 9; x < 262; x += 18) if ((x - 150) ** 2 + (y - 150) ** 2 < 112 ** 2) d += `<circle cx="${x}" cy="${y}" r="6" fill="#a8892e"/>`;
      return `<rect width="300" height="300" fill="#fff"/><circle cx="150" cy="150" r="120" fill="#efe3a6" stroke="${K}" stroke-width="5"/>${d}`; },
    sporen: () => `<rect width="300" height="300" fill="#fff"/><path d="M40 90 Q150 50 260 90 Q150 128 40 90 Z" fill="#f6e7c6" stroke="${K}" stroke-width="4"/>
      ${[[90, 140], [130, 170], [170, 150], [210, 180], [110, 210], [160, 230], [200, 250], [80, 250], [240, 220], [140, 270]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#6b6b6b"/>`).join("")}`,
    essbar: () => `<rect width="300" height="300" fill="#e8f5ec"/><path d="M96 160 h40 l30 -70 q16 -4 18 16 l-8 44 h56 q18 2 14 22 l-18 66 q-6 14 -22 14 h-110 Z" fill="#fff" stroke="#2f7d4f" stroke-width="7" stroke-linejoin="round"/>
      <rect x="60" y="156" width="40" height="100" rx="8" fill="#2f7d4f" stroke="#2f7d4f" stroke-width="4"/>`,
    giftig: () => `<rect width="300" height="300" fill="#fff3e0"/><path d="M150 40 L270 250 H30 Z" fill="#f7cf3c" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="138" y="100" width="24" height="90" rx="10" fill="${K}"/><circle cx="150" cy="218" r="14" fill="${K}"/>`,
    stopp: () => `<rect width="300" height="300" fill="#fff"/><circle cx="150" cy="150" r="126" fill="#fff3e0" stroke="#d9822b" stroke-width="10"/>
      <path d="M104 230 V120 q0 -14 14 -14 q14 0 14 14 V96 q0 -14 14 -14 q14 0 14 14 v12 q0 -14 14 -14 q14 0 14 14 v26 q0 -12 13 -12 q13 0 13 13 V196 q0 46 -46 46 h-24 q-30 0 -44 -12 Z" fill="#fbe0c4" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`,
    korb: () => `<rect width="300" height="300" fill="none"/><path d="M40 130 H260 L232 262 H68 Z" fill="#c9893b" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M58 166 H242 M66 204 H234 M74 238 H226" stroke="#8a5a2a" stroke-width="4"/><path d="M80 130 Q150 30 220 130" fill="none" stroke="${K}" stroke-width="7"/>`,
    pilz: () => P.pilzG({ hut: "#c98a4a" }),
    fruchtkoerper: () => P.pilzG({ hut: "#c98a4a", erde: true, teil: "hut stiel" }),
  };
  // Teile eines Pilzes hervorgehoben (Rest blass)
  B.blatt = () => `<path d="M30 150 C80 60 200 40 270 60 C250 140 170 220 40 160 Z" fill="#7cb85a" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M40 158 Q150 110 262 64 M110 128 l-8 -34 M160 108 l-4 -36 M206 88 l2 -24 M120 124 l20 30 M170 104 l26 24" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  ["hut", "stiel", "myzel"].forEach(k => { B[k] = () => P.pilzG({ hut: "#c98a4a", erde: true, unterseite: "lamellen", teil: k }); });
  const VB = { pilz: "0 20 300 340", hut: "0 0 300 404", stiel: "0 0 300 404", myzel: "0 0 300 404", fruchtkoerper: "0 0 300 404" };
  P.bild = (k, label) => svg(VB[k] || "0 0 300 300", B[k] ? B[k]() : "", label);
  P.hatBild = k => !!B[k];
})();
