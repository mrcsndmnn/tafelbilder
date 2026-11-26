/* =====================================================================
   Aufgabenspeicher – Bausteine für individuelle Arbeitsaufträge
   ---------------------------------------------------------------------
   Aus hochgeladenen Arbeitsblättern werden NUR die Aufgabenarten übernommen
   (z. B. „Kreise die Nomen ein“). Alle Inhalte – Wörter, Sätze, Zahlen,
   Bilder – sind eigene, neu erzeugte Inhalte. Die Originale liegen nicht
   im Repository.

   Aufbau:
     THEMEN     Fach → Thema (wählbar und gewichtbar im Generator)
     BAUSTEINE  eine Aufgabenart: Thema, Klassen, Niveaus, Minuten je Niveau
                und eine Funktion, die mit Zufall (Startwert) eine Aufgabe baut:
                baue(niveau, rnd, D, cfg) → { html, loesung }
     QUELLEN    Liste der ausgewerteten Vorlagen (nur Kurzangaben, keine Inhalte)

   Neue Vorlagen auswerten: Aufgabenart erkennen → Baustein hier ergänzen
   (Thema, Klassen, Minuten) → in QUELLEN eintragen.
   ===================================================================== */
(function () {
  "use strict";
  const T = {};
  const z = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
  const misch = (l, rnd) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const ohne = t => String(t).replace(/(\S)-(?=\S)/g, "$1");

  // ---------------- Themen ----------------
  T.FAECHER = { deutsch: "Deutsch", mathe: "Mathematik" };
  T.THEMEN = {
    nomen: { fach: "deutsch", titel: "Nomen" },
    verben: { fach: "deutsch", titel: "Verben" },
    adjektive: { fach: "deutsch", titel: "Adjektive" },
    "zehner-einer": { fach: "mathe", titel: "Zahlen bis 100: Zehner und Einer" },
    hundertertafel: { fach: "mathe", titel: "Zahlen bis 100: Hundertertafel" },
  };

  // ---------------- Eigene Wortlisten (Grundwortschatz, Silben mit „-“) ----------------
  const NOMEN = [["der", "Hund"], ["die", "Kat-ze"], ["die", "Maus"], ["der", "Ball"], ["das", "Haus"], ["der", "Baum"], ["die", "Son-ne"], ["das", "Buch"],
    ["der", "Stift"], ["die", "Ta-sche"], ["das", "Au-to"], ["der", "Tisch"], ["die", "Blu-me"], ["das", "Brot"], ["der", "Ap-fel"], ["die", "Tür"], ["das", "Bett"],
    ["der", "Fisch"], ["die", "Uhr"], ["das", "Fens-ter"], ["der", "Hut"], ["die", "Ho-se"], ["das", "Rad"], ["der", "Schuh"], ["die", "Lam-pe"], ["das", "Ei"],
    ["der", "Vo-gel"], ["die", "Na-se"], ["das", "Schaf"], ["der", "Ha-se"], ["die", "Ta-fel"], ["das", "Heft"], ["der", "Bus"], ["die", "Kuh"], ["das", "Glas"]];
  const VERBEN = ["spie-len", "lau-fen", "ma-len", "sin-gen", "le-sen", "schrei-ben", "rech-nen", "es-sen", "trin-ken", "schla-fen", "sprin-gen", "schwim-men",
    "tan-zen", "la-chen", "wei-nen", "ru-fen", "hö-ren", "se-hen", "ko-chen", "ba-cken", "bau-en", "fah-ren", "flie-gen", "ge-hen", "kau-fen", "wa-schen",
    "tur-nen", "klet-tern", "ren-nen", "sa-gen", "fra-gen", "hel-fen", "su-chen", "fin-den", "wer-fen", "fan-gen", "zäh-len", "träu-men", "woh-nen", "war-ten"];
  const ADJEKTIVE = ["groß", "klein", "lang", "kurz", "dick", "dünn", "alt", "neu", "jung", "laut", "lei-se", "schnell", "lang-sam", "warm", "kalt", "heiß",
    "nass", "tro-cken", "hell", "dun-kel", "rot", "blau", "grün", "gelb", "lus-tig", "trau-rig", "mü-de", "nett", "süß", "sau-er", "weich", "hart", "schön",
    "voll", "leer", "rund", "spitz", "stark"];
  T.WOERTER = { nomen: NOMEN, verben: VERBEN, adjektive: ADJEKTIVE };
  const WORTART = { nomen: "Nomen", verben: "Verben", adjektive: "Adjektive" };

  // Lückensätze: [Satz mit ___, Beispiel-Lösungen]
  const LUECKE = {
    nomen: [["Mi-a spielt mit dem ___.", "Ball"], ["Der ___ bellt laut.", "Hund"], ["Ben trinkt aus der ___.", "Tas-se"], ["Im Gar-ten steht ein ___.", "Baum"],
      ["Die ___ scheint am Him-mel.", "Son-ne"], ["Ich le-se ein ___.", "Buch"], ["Die ___ frisst Kä-se.", "Maus"], ["Wir fah-ren mit dem ___ zur Schu-le.", "Bus"],
      ["Am Mor-gen es-se ich ein ___.", "Brot, Ei"], ["Der ___ hat lan-ge Oh-ren.", "Ha-se"], ["Ich schrei-be mit dem ___.", "Stift"], ["Am A-bend ge-he ich ins ___.", "Bett"]],
    verben: [["Der Vo-gel ___ am Him-mel.", "fliegt"], ["Ben ___ ein Bild.", "malt"], ["Mi-a ___ ein Lied.", "singt"], ["Der Fisch ___ im Was-ser.", "schwimmt"],
      ["Die Kin-der ___ Fuß-ball.", "spie-len"], ["Ich ___ ein Buch.", "le-se"], ["Der Hund ___ laut.", "bellt"], ["Wir ___ ei-nen Ku-chen.", "ba-cken"],
      ["Ma-ma ___ das Es-sen.", "kocht"], ["Das Ba-by ___ im Bett.", "schläft"], ["Die Kat-ze ___ Milch.", "trinkt"], ["Der Frosch ___ in den Teich.", "springt"]],
    adjektive: [["Der E-le-fant ist ___.", "groß"], ["Die Maus ist ___.", "klein"], ["Im Win-ter ist es ___.", "kalt"], ["Die Schne-cke ist ___.", "lang-sam"],
      ["Der Ball ist ___.", "rund"], ["Die Zi-tro-ne ist ___.", "sau-er"], ["Die Ba-na-ne ist ___.", "gelb"], ["Der Tee ist ___.", "heiß, warm"],
      ["Das Glas ist ___.", "voll, leer"], ["Die Ra-ke-te ist ___.", "schnell"], ["Das Kis-sen ist ___.", "weich"], ["Nach dem Spiel bin ich ___.", "mü-de"]],
  };
  // Sätze zum Unterstreichen: [Satz, gesuchtes Wort]
  const UNTER = {
    verben: [["Hun-de bel-len laut.", "bel-len"], ["Kü-he fres-sen Gras.", "fres-sen"], ["En-ten schwim-men im Teich.", "schwim-men"], ["Bie-nen sum-men lei-se.", "sum-men"],
      ["Frö-sche qua-ken am A-bend.", "qua-ken"], ["Ha-sen hop-peln ü-ber die Wie-se.", "hop-peln"], ["Pfer-de ga-lop-pie-ren schnell.", "ga-lop-pie-ren"],
      ["Kat-zen schnur-ren zu-frie-den.", "schnur-ren"], ["Ad-ler flie-gen hoch.", "flie-gen"], ["Schne-cken krie-chen lang-sam.", "krie-chen"]],
    adjektive: [["Der gro-ße Hund bellt.", "gro-ße"], ["Die klei-ne Maus piepst.", "klei-ne"], ["Mi-a hat ei-nen ro-ten Ball.", "ro-ten"], ["Das Was-ser ist kalt.", "kalt"],
      ["Ben trinkt hei-ßen Ka-ka-o.", "hei-ßen"], ["Der Ha-se ist schnell.", "schnell"], ["Die Ku-gel ist rund.", "rund"], ["Wir es-sen ei-nen sü-ßen Ku-chen.", "sü-ßen"],
      ["Die Nacht ist dun-kel.", "dun-kel"], ["Das Ba-by ist mü-de.", "mü-de"]],
    nomen: [["Der Hund spielt im Gar-ten.", "Hund, Gar-ten"], ["Mi-a liest ein Buch.", "Mi-a, Buch"], ["Die Kat-ze sitzt auf dem Tisch.", "Kat-ze, Tisch"],
      ["Ben isst ei-nen Ap-fel.", "Ben, Ap-fel"], ["Der Vo-gel singt im Baum.", "Vo-gel, Baum"], ["Die Son-ne scheint am Him-mel.", "Son-ne, Him-mel"],
      ["Ma-ma kauft Brot.", "Ma-ma, Brot"], ["Das Au-to fährt schnell.", "Au-to"]],
  };
  // Nomen mit passenden Verben (Wörterkasten)
  const NOMEN_VERBEN = [["hund", "der Hund", ["bel-len", "ren-nen", "fres-sen"]], ["vogel", "der Vo-gel", ["flie-gen", "sin-gen", "pi-cken"]],
    ["fisch", "der Fisch", ["schwim-men", "tau-chen", "schnap-pen"]], ["ball", "der Ball", ["rol-len", "flie-gen", "sprin-gen"]],
    ["sonne", "die Son-ne", ["schei-nen", "wär-men", "strah-len"]], ["auto", "das Au-to", ["fah-ren", "hu-pen", "brem-sen"]],
    ["buch", "das Buch", ["le-sen", "blät-tern", "auf-schla-gen"]], ["blume", "die Blu-me", ["wach-sen", "blü-hen", "duf-ten"]],
    ["kuh", "die Kuh", ["fres-sen", "mu-hen", "lie-gen"]]];
  // Szenen aus den Bildergeschichten: [Geschichte, Bild, Verb]
  const SZENEN = [["kakao", 0, "trin-ken"], ["ball", 0, "spie-len"], ["blume", 1, "gie-ßen"], ["schneemann", 1, "rol-len"], ["morgen", 0, "schla-fen"],
    ["morgen", 2, "es-sen"], ["morgen", 3, "put-zen"], ["ball", 2, "wei-nen"], ["kakao", 3, "wi-schen"], ["morgen", 5, "win-ken"], ["ball", 3, "klet-tern"], ["morgen", 1, "an-zie-hen"]];

  // ---------------- Hilfen zum Darstellen ----------------
  const kasten = w => `<span class="ab-luecke" style="min-width:${w || 32}mm"></span>`;
  const loes = t => `<span class="ab-loes">${t}</span>`;
  const wortkarten = (worte, D) => `<div class="ab-karten">${worte.map(w => `<span class="ab-wk">${D.w(w)}</span>`).join("")}</div>`;

  // ---------------- Bausteine ----------------
  T.BAUSTEINE = [];
  const ALLE_D = ["SEP 2", "SEP 3", "Klasse 3", "Klasse 4"];
  const ZAHLEN100 = ["SEP 2", "SEP 3", "Klasse 3"];

  // 1) Wörter fangen: Wortart unter gemischten Wörtern finden und aufschreiben (Nomen mit Artikel)
  ["nomen", "verben", "adjektive"].forEach(wa => T.BAUSTEINE.push({
    id: "fangen-" + wa, thema: wa, titel: WORTART[wa] + " fangen", klassen: ALLE_D, niveaus: [1, 2, 3], minuten: { 1: 5, 2: 4, 3: 4 }, symbole: ["stift"],
    auftrag: n => `Krei-se die ${WORTART[wa].replace("Adjektive", "Ad-jek-ti-ve").replace("Verben", "Ver-ben").replace("Nomen", "No-men")} ein. Schrei-be sie auf${wa === "nomen" ? " – mit Ar-ti-kel" : ""}.`,
    baue(n, rnd, D, cfg) {
      const anzahl = n === 1 ? 6 : 8, richtig = n === 1 ? 2 : 3;
      const anders = ["nomen", "verben", "adjektive"].filter(x => x !== wa);
      const gross = w => w.toUpperCase();
      const ziel = misch(T.WOERTER[wa], rnd).slice(0, richtig);
      const rest = misch(anders.flatMap(x => T.WOERTER[x].map(w => Array.isArray(w) ? w[1] : w)), rnd).slice(0, anzahl - richtig);
      const zielWort = w => Array.isArray(w) ? w[1] : w;
      const alle = misch(ziel.map(zielWort).concat(rest), rnd);
      return {
        html: `<div class="ab-zwei"><div class="ab-karten gross">${alle.map(w => `<span class="ab-wk">${D.w(gross(w))}</span>`).join("")}</div>
          <div class="ab-schreib">${ziel.map(() => D.linien(cfg.lineatur, 1, 74)).join("")}</div></div>`,
        loesung: ziel.map(w => Array.isArray(w) ? D.w(w[0] + " " + w[1]) : D.w(w)).join(" · "),
      };
    },
  }));

  // 2) Lückensätze: passendes Wort einsetzen
  ["nomen", "verben", "adjektive"].forEach(wa => T.BAUSTEINE.push({
    id: "luecke-" + wa, thema: wa, titel: "Lückensätze: " + WORTART[wa], klassen: ALLE_D, niveaus: [1, 2, 3], minuten: { 1: 5, 2: 4, 3: 4 }, symbole: ["stift"],
    auftrag: n => n === 1 ? "Set-ze ein pas-sen-des Wort ein. Die Wör-ter im Kas-ten hel-fen dir." : "Schrei-be ein pas-sen-des Wort in die Lü-cke.",
    baue(n, rnd, D) {
      const s = misch(LUECKE[wa], rnd).slice(0, n === 1 ? 3 : 4);
      const hilfe = n === 1 ? `<div class="ab-kasten">${misch(s.map(x => x[1].split(",")[0].trim()), rnd).map(w => `<span>${D.w(w)}</span>`).join("")}</div>` : "";
      return {
        html: hilfe + `<ol class="ab-saetze">${s.map(([satz]) => `<li>${satz.split("___").map(t => D.w(t.trim())).join(` ${kasten(34)} `)}</li>`).join("")}</ol>`,
        loesung: s.map(([satz, l], i) => `${i + 1}. ${D.w(satz.replace("___", l.split(",")[0].trim()))}${l.includes(",") ? " <span class='grau'>(auch: " + ohne(l.split(",").slice(1).join(",")) + ")</span>" : ""}`).join("<br>") +
          (n > 1 ? "<br><span class='grau'>Andere passende Wörter sind auch richtig.</span>" : ""),
      };
    },
  }));

  // 3) Wortart im Satz unterstreichen
  ["verben", "adjektive", "nomen"].forEach(wa => T.BAUSTEINE.push({
    id: "unterstreichen-" + wa, thema: wa, titel: WORTART[wa] + " im Satz finden", klassen: ALLE_D, niveaus: [2, 3], minuten: { 2: 4, 3: 3 }, symbole: ["stift"],
    auftrag: () => `Un-ter-strei-che in je-dem Satz ${wa === "nomen" ? "die No-men" : wa === "verben" ? "das Verb" : "das Ad-jek-tiv"}.`,
    baue(n, rnd, D) {
      const s = misch(UNTER[wa], rnd).slice(0, n === 2 ? 4 : 5);
      return {
        html: `<ol class="ab-saetze weit">${s.map(([satz]) => `<li>${D.w(satz)}</li>`).join("")}</ol>`,
        loesung: s.map(([satz, w], i) => `${i + 1}. ${D.w(ohne(w))}`).join(" · "),
      };
    },
  }));

  // 4) Was machen die Kinder? (Bild → Verb, mit Wörterkasten)
  T.BAUSTEINE.push({
    id: "was-machen", thema: "verben", titel: "Was machen die Kinder?", klassen: ALLE_D, niveaus: [1, 2, 3], minuten: { 1: 5, 2: 5, 3: 4 }, symbole: ["lupe", "stift"],
    auftrag: n => n === 1 ? "Was ma-chen die Kin-der? Schrei-be das Verb da-zu. Der Kas-ten hilft dir." : "Was ma-chen die Kin-der? Schrei-be das Verb da-zu.",
    baue(n, rnd, D, cfg) {
      const G = window.GESCHICHTEN, s = misch(SZENEN, rnd).slice(0, 4);
      const bild = ([g, i]) => { const gg = G.liste.find(x => x.id === g); return G.svg(gg, i); };
      return {
        html: (n < 3 ? `<div class="ab-kasten">${misch(s.map(x => x[2]), rnd).map(w => `<span>${D.w(w)}</span>`).join("")}</div>` : "") +
          `<div class="ab-bilder">${s.map(x => `<div class="ab-bz"><div class="ab-bild">${bild(x)}</div>${D.linien(cfg.lineatur, 1, 40)}</div>`).join("")}</div>`,
        loesung: s.map((x, i) => `${i + 1}. ${D.w(x[2])}`).join(" · "),
      };
    },
  });

  // 5) Buchstabensalat: Verben aus vertauschten Buchstaben
  T.BAUSTEINE.push({
    id: "salat-verben", thema: "verben", titel: "Buchstabensalat: Verben", klassen: ["SEP 3", "Klasse 3", "Klasse 4"], niveaus: [2, 3], minuten: { 2: 6, 3: 5 }, symbole: ["lupe", "stift"],
    auftrag: n => n === 2 ? "Hier ist al-les durch-ei-nan-der. Fin-de das Verb. Der ers-te Buch-sta-be stimmt schon." : "Hier ist al-les durch-ei-nan-der. Fin-de das Verb.",
    baue(n, rnd, D, cfg) {
      const w = misch(VERBEN.map(ohne).filter(x => x.length <= (n === 2 ? 6 : 8)), rnd).slice(0, 4);
      const salat = x => { let r; do { r = n === 2 ? x[0] + misch(x.slice(1).split(""), rnd).join("") : misch(x.split(""), rnd).join(""); } while (r === x && x.length > 2); return r; };
      return {
        html: `<div class="ab-salat">${w.map(x => `<div><span class="ab-buchst">${salat(x).split("").join(" ")}</span>${D.linien(cfg.lineatur, 1, 60)}</div>`).join("")}</div>`,
        loesung: w.join(" · "),
      };
    },
  });

  // 6) Zu jedem Nomen passen drei Verben
  T.BAUSTEINE.push({
    id: "nomen-verben", thema: "verben", titel: "Was passt zum Nomen?", klassen: ["SEP 3", "Klasse 3", "Klasse 4"], niveaus: [3], minuten: { 3: 7 }, symbole: ["lupe", "stift"],
    auftrag: () => "Zu je-dem No-men pas-sen drei Ver-ben. Schrei-be sie auf.",
    baue(n, rnd, D, cfg) {
      const s = misch(NOMEN_VERBEN, rnd).slice(0, 3);
      return {
        html: `<div class="ab-kasten">${misch(s.flatMap(x => x[2]), rnd).map(w => `<span>${D.w(w)}</span>`).join("")}</div>
          <div class="ab-nv">${s.map(([b, wort]) => `<div class="ab-nvz"><div class="ab-nvb">${D.bild(b)}<span>${D.w(wort)}</span></div><div>${D.linien(cfg.lineatur, 1, 120)}</div></div>`).join("")}</div>`,
        loesung: s.map(([, wort, v]) => `${D.w(wort)}: ${v.map(D.w).join(", ")}`).join("<br>"),
      };
    },
  });

  // 7) Wie heißt die Zahl? (Zehnerstangen und Einerwürfel)
  // Zehner = 10 Kästchen übereinander, Einer = 1 Kästchen (gleiche Kästchengröße)
  const stangen = (zz, ee) => {
    const k = 4; let s = "", x = 0;
    for (let i = 0; i < zz; i++) { s += `<rect x="${x}" y="0" width="${k}" height="${10 * k}" fill="#f3d3cf" stroke="#000" stroke-width=".5"/>` + Array.from({ length: 9 }, (_, j) => `<line x1="${x}" x2="${x + k}" y1="${k * (j + 1)}" y2="${k * (j + 1)}" stroke="#000" stroke-width=".3"/>`).join(""); x += k + 2 + (i % 5 === 4 ? 2 : 0); }
    x += zz ? 3 : 0;
    for (let i = 0; i < ee; i++) { s += `<rect x="${x + (i % 2) * (k + 1.5)}" y="${10 * k - k - Math.floor(i / 2) * (k + 1.5)}" width="${k}" height="${k}" fill="#cfe0f5" stroke="#000" stroke-width=".5"/>`; }
    x += ee ? 2 * k + 1.5 : 0;
    return `<svg viewBox="-1 -1 ${x + 2} 42" style="height:16mm;width:${(x + 2) * 16 / 42}mm" aria-hidden="true">${s}</svg>`;
  };
  T.BAUSTEINE.push({
    id: "dienes", thema: "zehner-einer", titel: "Wie heißt die Zahl?", klassen: ZAHLEN100, niveaus: [1, 2, 3], minuten: { 1: 5, 2: 4, 3: 4 }, symbole: ["lupe", "stift"],
    auftrag: () => "Zäh-le die Zeh-ner und die Ei-ner. Wie heißt die Zahl?",
    baue(n, rnd) {
      const zahlen = []; while (zahlen.length < 4) { const v = n === 1 ? z(11, 49, rnd) : z(11, 99, rnd); if (!zahlen.includes(v) && v % 10) zahlen.push(v); }
      return {
        html: `<table class="ab-tab"><tr><th></th><th>Z</th><th>E</th><th>Zahl</th></tr>${zahlen.map(v => `<tr><td class="ab-dienes">${stangen(Math.floor(v / 10), v % 10)}</td><td></td><td></td><td></td></tr>`).join("")}</table>`,
        loesung: zahlen.map(v => `${Math.floor(v / 10)} Z ${v % 10} E = ${v}`).join(" · "),
      };
    },
  });

  // 8) Zahl in Zehner und Einer zerlegen
  T.BAUSTEINE.push({
    id: "zerlegen", thema: "zehner-einer", titel: "Zehner und Einer", klassen: ZAHLEN100, niveaus: [1, 2, 3], minuten: { 1: 4, 2: 3, 3: 3 }, symbole: ["stift"],
    auftrag: n => n === 3 ? "Schrei-be die Zehner und Ei-ner auf. Wie heißt die Zahl?" : "Wie vie-le Zeh-ner und Ei-ner hat die Zahl? Schrei-be sie in die Ta-bel-le.",
    baue(n, rnd) {
      const reihe = []; while (reihe.length < 6) { const v = z(10, 99, rnd); if (!reihe.some(r => r.v === v)) reihe.push({ v, rueck: n === 3 && reihe.length % 2 === 1 }); }
      return {
        html: `<table class="ab-tab"><tr><th>Zahl</th><th>Z</th><th>E</th></tr>${reihe.map(({ v, rueck }) => rueck ? `<tr><td></td><td>${Math.floor(v / 10)}</td><td>${v % 10}</td></tr>` : `<tr><td>${v}</td><td></td><td></td></tr>`).join("")}</table>`,
        loesung: reihe.map(({ v }) => `${v} = ${Math.floor(v / 10)} Z ${v % 10} E`).join(" · "),
      };
    },
  });

  // 9) Rätsel an der Hundertertafel: Zeile und Spalte
  const tafel = () => `<table class="ab-100">${Array.from({ length: 10 }, (_, r) => `<tr>${Array.from({ length: 10 }, (_, c) => `<td>${r * 10 + c + 1}</td>`).join("")}</tr>`).join("")}</table>`;
  T.BAUSTEINE.push({
    id: "hunderter-raetsel", thema: "hundertertafel", titel: "Rätsel an der Hundertertafel", klassen: ZAHLEN100, niveaus: [1, 2, 3], minuten: { 1: 6, 2: 5, 3: 5 }, symbole: ["lupe", "stift"],
    auftrag: n => n === 3 ? "Wo wohnt die Zahl? Schrei-be Zei-le und Spal-te auf." : n === 1 ? "Su-che in der Hun-der-ter-ta-fel. Wel-che Zahl ist es?" : "Den-ke an die Hun-der-ter-ta-fel. Wel-che Zahl ist es?",
    baue(n, rnd, D) {
      const pos = []; while (pos.length < 4) { const r = z(1, 10, rnd), c = z(1, 10, rnd); if (!pos.some(p => p.r === r && p.c === c)) pos.push({ r, c }); }
      const v = p => (p.r - 1) * 10 + p.c;
      const zeilen = n === 3
        ? pos.map(p => `<li>${D.w("Die Zahl")} <b>${v(p)}</b> ${D.w("ist in der")} ${kasten(10)}. ${D.w("Zei-le und in der")} ${kasten(10)}. ${D.w("Spal-te.")}</li>`)
        : pos.map(p => `<li>${D.w(`Mei-ne Zahl ist in der ${p.r}. Zei-le und in der ${p.c}. Spal-te.`)} ${D.w("Es ist die")} ${kasten(16)}.</li>`);
      return {
        html: `<div class="${n === 1 ? "ab-mit-tafel" : ""}"><ol class="ab-saetze">${zeilen.join("")}</ol>${n === 1 ? tafel() : ""}</div>`,
        loesung: pos.map((p, i) => n === 3 ? `${i + 1}. ${v(p)}: ${p.r}. Zeile, ${p.c}. Spalte` : `${i + 1}. ${v(p)}`).join(" · "),
      };
    },
  });

  // ---------------- Ausgewertete Vorlagen (nur Kurzangaben) ----------------
  T.QUELLEN = [
    { datum: "2026-11-23", fach: "Mathematik", klasse: "SEP 2", art: "Arbeitsblatt (eigenes)", inhalt: "Hundertertafel: Zahl über Zeile und Spalte finden", bausteine: ["hunderter-raetsel"] },
    { datum: "2026-11-23", fach: "Mathematik", klasse: "SEP 2", art: "Präsentation (eigene)", inhalt: "Zahlen bis 100 mit Zehnerstangen und Einerwürfeln: Zahl bestimmen, Zahl zerlegen", bausteine: ["dienes", "zerlegen"] },
    { datum: "2026-11-23", fach: "Deutsch", klasse: "SEP 2", art: "Kartei (gekauft) – nur Aufgabenarten übernommen", inhalt: "Nomen finden und mit Artikel aufschreiben, Nomen in Lückensatz", bausteine: ["fangen-nomen", "luecke-nomen"] },
    { datum: "2026-11-23", fach: "Deutsch", klasse: "SEP 2", art: "Kartei (gekauft) – nur Aufgabenarten übernommen", inhalt: "Adjektive finden und aufschreiben, Adjektiv in Lückensatz", bausteine: ["fangen-adjektive", "luecke-adjektive"] },
    { datum: "2026-11-23", fach: "Deutsch", klasse: "SEP 2", art: "Selbstlernheft (fremd) – nur Aufgabenarten übernommen", inhalt: "Verben: Bilder benennen, Buchstabensalat, Verben einkreisen, im Satz unterstreichen, zu Nomen passende Verben", bausteine: ["was-machen", "salat-verben", "fangen-verben", "unterstreichen-verben", "nomen-verben", "luecke-verben"] },
  ];

  T.baustein = id => T.BAUSTEINE.find(b => b.id === id);
  window.AUFGABEN = T;
})();
