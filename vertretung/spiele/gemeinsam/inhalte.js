/* =====================================================================
   Vertretungsspiele – Inhalte (ohne Programmierung erweiterbar)
   Silbentrennung steht fest im Text: Silben mit "-" trennen.
   Ein neues Wort braucht ein Bild mit demselben Namen in bilder.js.
   ===================================================================== */
window.INHALTE = {

  // id: [Artikel, Wort in Silben, Thema]
  WOERTER: {
    hund: ["der", "Hund", "tiere"], katze: ["die", "Kat-ze", "tiere"], maus: ["die", "Maus", "tiere"], fisch: ["der", "Fisch", "tiere"],
    hase: ["der", "Ha-se", "tiere"], kuh: ["die", "Kuh", "tiere"], schaf: ["das", "Schaf", "tiere"], vogel: ["der", "Vo-gel", "tiere"],
    schnecke: ["die", "Schne-cke", "tiere"], frosch: ["der", "Frosch", "tiere"], ente: ["die", "En-te", "tiere"], loewe: ["der", "Lö-we", "tiere"],
    elefant: ["der", "E-le-fant", "tiere"], schmetterling: ["der", "Schmet-ter-ling", "tiere"], marienkaefer: ["der", "Ma-ri-en-kä-fer", "tiere"],
    apfel: ["der", "Ap-fel", "essen"], banane: ["die", "Ba-na-ne", "essen"], birne: ["die", "Bir-ne", "essen"], moehre: ["die", "Möh-re", "essen"],
    brot: ["das", "Brot", "essen"], kaese: ["der", "Kä-se", "essen"], ei: ["das", "Ei", "essen"], tomate: ["die", "To-ma-te", "essen"],
    nudel: ["die", "Nu-del", "essen"], pizza: ["die", "Piz-za", "essen"],
    stift: ["der", "Stift", "schule"], buch: ["das", "Buch", "schule"], schere: ["die", "Sche-re", "schule"], ranzen: ["der", "Ran-zen", "schule"],
    tafel: ["die", "Ta-fel", "schule"], kleber: ["der", "Kle-ber", "schule"], lineal: ["das", "Li-ne-al", "schule"],
    haus: ["das", "Haus", "zuhause"], tisch: ["der", "Tisch", "zuhause"], stuhl: ["der", "Stuhl", "zuhause"], bett: ["das", "Bett", "zuhause"],
    lampe: ["die", "Lam-pe", "zuhause"], tuer: ["die", "Tür", "zuhause"], tasse: ["die", "Tas-se", "zuhause"], schluessel: ["der", "Schlüs-sel", "zuhause"],
    teddy: ["der", "Ted-dy", "zuhause"],
    ball: ["der", "Ball", "draussen"], sonne: ["die", "Son-ne", "draussen"], baum: ["der", "Baum", "draussen"], blume: ["die", "Blu-me", "draussen"],
    auto: ["das", "Au-to", "draussen"], fahrrad: ["das", "Fahr-rad", "draussen"], bus: ["der", "Bus", "draussen"], rakete: ["die", "Ra-ke-te", "draussen"],
    schaukel: ["die", "Schau-kel", "draussen"],
    hose: ["die", "Ho-se", "kleidung"], schuh: ["der", "Schuh", "kleidung"], muetze: ["die", "Müt-ze", "kleidung"], jacke: ["die", "Ja-cke", "kleidung"],
    // Zusätzliche Bilder für Reime und lange Wörter (kommen nicht in die Themen)
    rose: ["die", "Ro-se", "extra"], kasse: ["die", "Kas-se", "extra"], tatze: ["die", "Tat-ze", "extra"], decke: ["die", "De-cke", "extra"],
    nase: ["die", "Na-se", "extra"], stall: ["der", "Stall", "extra"], bein: ["das", "Bein", "extra"], schwein: ["das", "Schwein", "extra"],
    tonne: ["die", "Ton-ne", "extra"], laus: ["die", "Laus", "extra"],
    badewanne: ["die", "Ba-de-wan-ne", "extra"], kinderwagen: ["der", "Kin-der-wa-gen", "extra"], apfelsine: ["die", "Ap-fel-si-ne", "extra"],
    wassermelone: ["die", "Was-ser-me-lo-ne", "extra"],
    eimer: ["der", "Ei-mer", "extra"],
  },
  THEMEN: { tiere: "Tiere", essen: "Essen", schule: "Schule", zuhause: "Zuhause", draussen: "Draußen", kleidung: "Kleidung" },

  // Reimpaare: [Wort, reimt sich, reimt sich nicht]; REIMENDE: Teil, der sich reimt
  REIME: [["haus", "maus", "ball"], ["hose", "rose", "hund"], ["tasse", "kasse", "sonne"], ["katze", "tatze", "fisch"],
    ["schnecke", "decke", "baum"], ["hase", "nase", "tisch"], ["tisch", "fisch", "auto"], ["ball", "stall", "ei"],
    ["bein", "schwein", "buch"], ["kuh", "schuh", "lampe"], ["sonne", "tonne", "stift"], ["maus", "laus", "brot"]],
  REIMENDE: { haus: "aus", maus: "aus", laus: "aus", hose: "ose", rose: "ose", tasse: "asse", kasse: "asse", katze: "atze", tatze: "atze",
    schnecke: "ecke", decke: "ecke", hase: "ase", nase: "ase", tisch: "isch", fisch: "isch", ball: "all", stall: "all",
    bein: "ein", schwein: "ein", kuh: "uh", schuh: "uh", sonne: "onne", tonne: "onne" },

  // Wer bin ich? – je 4 Hinweise: [Symbol, Satz]
  RAETSEL: {
    hase: [["ohr", "Ich ha-be lan-ge Oh-ren."], ["hoppeln", "Ich hop-pe-le."], ["moehre", "Ich fres-se Möh-ren."], ["stall", "Ich woh-ne im Stall."]],
    katze: [["schnurrhaare", "Ich ha-be Schnurr-haa-re."], ["laut", "Ich mi-au-e."], ["maus", "Ich fan-ge Mäu-se."], ["sprechblase", "Ich schnur-re."]],
    fisch: [["wasser", "Ich woh-ne im Was-ser."], ["beine_nein", "Ich ha-be kei-ne Bei-ne."], ["schwimmen_fisch", "Ich schwim-me."], ["schuppen", "Ich ha-be Schup-pen."]],
    kuh: [["gross", "Ich bin groß."], ["gras", "Ich fres-se Gras."], ["laut", "Ich ma-che Muh."], ["milch", "Ich ge-be Milch."]],
    elefant: [["gross", "Ich bin sehr groß."], ["farbe_grau", "Ich bin grau."], ["ohr", "Ich ha-be gro-ße Oh-ren."], ["", "Ich ha-be ei-nen Rüs-sel."]],
    schnecke: [["langsam", "Ich bin lang-sam."], ["beine_nein", "Ich ha-be kei-ne Bei-ne."], ["regen", "Ich mag Re-gen."], ["haus", "Ich tra-ge mein Haus."]],
    frosch: [["farbe_gruen", "Ich bin grün."], ["teich", "Ich woh-ne am Teich."], ["springen", "Ich sprin-ge."], ["laut", "Ich ma-che Quak."]],
    banane: [["besteck", "Man kann mich es-sen."], ["farbe_gelb", "Ich bin gelb."], ["krumm", "Ich bin krumm."], ["affe", "Af-fen mö-gen mich."]],
    sonne: [["himmel", "Ich bin o-ben am Him-mel."], ["rund", "Ich bin rund."], ["farbe_gelb", "Ich bin gelb."], ["warm", "Ich ma-che es warm."]],
    schere: [["ranzen", "Ich bin in der Schu-le."], ["loch", "Ich ha-be zwei Lö-cher für die Fin-ger."], ["spitz", "Ich bin spitz."], ["schneiden", "Ich schnei-de Pa-pier."]],
  },

  // Glücksrad: Kategorien mit Symbol und Farbe; Aufträge: text, satz, bild, hilfe (Bildauswahl bei „leicht“), schwer (nur bei „schwer“)
  KATEGORIEN: {
    sprechen: { name: "Spre-chen", bild: "sprechblase", farbe: "#dbe9fb" },
    bewegen: { name: "Be-we-gen", bild: "hampelmann", farbe: "#e2f3e0" },
    hoeren: { name: "Klat-schen und Hö-ren", bild: "klatschen", farbe: "#fdf0c9" },
    joker: { name: "Jo-ker", bild: "stern", farbe: "#f4e3fb" },
  },
  AUFTRAEGE: [
    { kat: "sprechen", text: "Nen-ne ein Tier mit M.", satz: "Ein Tier mit M ist die Maus.", bild: "maus", hilfe: ["maus", "hund", "fisch"] },
    { kat: "sprechen", text: "Nen-ne ein Tier mit H.", satz: "Ein Tier mit H ist der Hund.", bild: "hund", hilfe: ["hund", "kuh", "ente"] },
    { kat: "sprechen", text: "Was ist rot?", satz: "Der Ap-fel ist rot.", bild: "farbe_rot", hilfe: ["apfel", "banane", "birne"] },
    { kat: "sprechen", text: "Was ist gelb?", satz: "Die Ba-na-ne ist gelb.", bild: "farbe_gelb", hilfe: ["banane", "apfel", "frosch"] },
    { kat: "sprechen", text: "Nen-ne drei Sa-chen aus der Kü-che.", satz: "In der Kü-che ist die Tas-se.", bild: "kueche", hilfe: ["tasse", "brot", "ei"] },
    { kat: "sprechen", text: "Was ist das Ge-gen-teil von groß?", satz: "Das Ge-gen-teil von groß ist klein.", bild: "gross", hilfe: ["elefant", "maus"] },
    { kat: "sprechen", text: "Nen-ne drei Tie-re.", satz: "Der Hund, die Kat-ze und die Maus sind Tie-re.", bild: "hund", schwer: true },
    { kat: "sprechen", text: "Was kann flie-gen?", satz: "Der Vo-gel kann flie-gen.", bild: "vogel", schwer: true },
    { kat: "sprechen", text: "Was ziehst du im Win-ter an?", satz: "Im Win-ter zie-he ich die Müt-ze an.", bild: "muetze", schwer: true },
    { kat: "bewegen", text: "Mach drei Ham-pel-män-ner.", satz: "Ich ma-che drei Ham-pel-män-ner.", bild: "hampelmann" },
    { kat: "bewegen", text: "Hüp-fe wie ein Frosch.", satz: "Ich hüp-fe wie ein Frosch.", bild: "frosch" },
    { kat: "bewegen", text: "Zeig mir: un-ter dem Tisch. Al-le ma-chen mit!", satz: "Mei-ne Hand ist un-ter dem Tisch.", bild: "tisch" },
    { kat: "bewegen", text: "Flie-ge wie ein Vo-gel.", satz: "Ich flie-ge wie ein Vo-gel.", bild: "vogel" },
    { kat: "bewegen", text: "Geh so lang-sam wie ei-ne Schne-cke.", satz: "Ich ge-he lang-sam wie ei-ne Schne-cke.", bild: "schnecke" },
    { kat: "hoeren", text: "Klat-sche dei-nen Na-men.", satz: "Ich klat-sche mei-nen Na-men.", bild: "klatschen" },
    { kat: "hoeren", text: "Wo-mit fängt Son-ne an?", satz: "Son-ne fängt mit S an.", bild: "sonne", hilfe: ["sonne", "schuh", "schaf"] },
    { kat: "hoeren", text: "Wo-mit fängt Ball an?", satz: "Ball fängt mit B an.", bild: "ball", hilfe: ["ball", "bus", "baum"] },
    { kat: "hoeren", text: "Klat-sche das Wort Ba-na-ne.", satz: "Ba-na-ne hat drei Sil-ben.", bild: "banane" },
    { kat: "hoeren", text: "Was reimt sich auf Haus?", satz: "Haus und Maus rei-men sich.", bild: "haus", hilfe: ["maus", "ball", "ei"], schwer: true },
    { kat: "joker", text: "Al-le ma-chen mit!", satz: "Wir ma-chen al-le mit.", bild: "alle", joker: "alle" },
    { kat: "joker", text: "Du darfst je-man-den aus-su-chen.", satz: "Ich su-che … aus.", bild: "zeigen", joker: "aussuchen" },
    { kat: "joker", text: "Stern für die Klas-se!", satz: "Wir be-kom-men ei-nen Stern.", bild: "stern", joker: "stern" },
  ],

  // Kennenlernen: „Ich heiße … Ich mag …“
  MAG: {
    "Tie-re": [["hund", "Hun-de"], ["katze", "Kat-zen"], ["hase", "Ha-sen"], ["fisch", "Fi-sche"]],
    "Es-sen": [["apfel", "Äp-fel"], ["banane", "Ba-na-nen"], ["pizza", "Piz-za"], ["nudel", "Nu-deln"]],
    "Far-ben": [["farbe_rot", "Rot"], ["farbe_blau", "Blau"], ["farbe_gruen", "Grün"], ["farbe_gelb", "Gelb"]],
    "Sport": [["ball", "Fuß-ball"], ["fahrrad", "Rad-fah-ren"], ["schwimmen", "Schwim-men"], ["tanzen", "Tan-zen"]],
  },

  // Regeln für „Klasse gegen Lehrkraft“
  REGELN: [["ohr", "Wir hö-ren zu."], ["hand", "Wir mel-den uns."], ["alle", "Wir hel-fen uns."]],

  // Wimmelbild: Ankerpunkte (x, y = Mitte des Gegenstands) mit Präposition und Bezug; hinten = hinter einem Möbel; schwer = nur im Niveau „schwer“
  WIMMEL: {
    zimmer: { name: "Kinderzimmer", dinge: ["katze", "ball", "teddy", "buch", "schuh"], plaetze: [
      { x: 145, y: 296, ort: "auf", bezug: "dem Bett" }, { x: 140, y: 404, ort: "unter", bezug: "dem Bett" },
      { x: 350, y: 346, ort: "hinter", bezug: "der Kiste", hinten: true }, { x: 437, y: 404, ort: "neben", bezug: "der Kiste" },
      { x: 560, y: 256, ort: "auf", bezug: "dem Tisch" }, { x: 560, y: 404, ort: "unter", bezug: "dem Tisch" },
      { x: 690, y: 404, ort: "zwischen", bezug: "dem Tisch und dem Stuhl", schwer: true }, { x: 762, y: 300, ort: "auf", bezug: "dem Stuhl" },
      { x: 915, y: 292, ort: "in", bezug: "dem Regal", satz: "im Re-gal" }, { x: 915, y: 488, ort: "vor", bezug: "dem Regal" }] },
    spielplatz: { name: "Spielplatz", dinge: ["katze", "ball", "eimer", "muetze"], plaetze: [
      { x: 132, y: 318, ort: "hinter", bezug: "dem Baum", hinten: true }, { x: 256, y: 404, ort: "neben", bezug: "dem Baum" },
      { x: 418, y: 318, ort: "auf", bezug: "der Rutsche" }, { x: 440, y: 404, ort: "unter", bezug: "der Rutsche" },
      { x: 670, y: 338, ort: "auf", bezug: "der Schaukel" }, { x: 670, y: 410, ort: "unter", bezug: "der Schaukel" },
      { x: 784, y: 404, ort: "zwischen", bezug: "der Schaukel und der Bank", schwer: true },
      { x: 895, y: 340, ort: "auf", bezug: "der Bank" }, { x: 895, y: 410, ort: "unter", bezug: "der Bank" },
      { x: 445, y: 486, ort: "in", bezug: "dem Sandkasten", satz: "im Sand-kas-ten" }] },
  },
  PRAEP: { auf: "auf", unter: "un-ter", neben: "ne-ben", in: "in", hinter: "hin-ter", vor: "vor", zwischen: "zwi-schen" },

  LOB: ["Su-per ge-macht!", "Toll!", "Prima!", "Klas-se!", "Ge-nau!"],
  NOCH: ["Schau noch mal ge-nau.", "Fast! Pro-bier es noch mal.", "Hör noch mal gut hin."],
};
