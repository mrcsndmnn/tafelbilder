/* =====================================================================
   Vertretungsbaukasten – Lesestoff für Blitzlesen (D5) und Lese-/Schreibblätter (G-D4/D5)
   Silben mit "-" trennen. Wörter: [Wort, Bild-ID aus bilder.js oder ""].
   Stufen: 1 = ★ (lautgetreu, offene Silben), 2 = ★★ (mit sch, ei, au, ie, ck …), 3 = ★★★ (länger, mehr Besonderheiten)
   ===================================================================== */
window.LESEN = {
  silben: {
    1: ["ma", "mi", "mo", "mu", "me", "la", "li", "lo", "lu", "le", "sa", "si", "so", "su", "na", "ni", "no", "ne", "ra", "ri", "ro", "ru",
      "ta", "ti", "to", "tu", "fa", "fi", "fo", "wa", "wi", "wo", "ha", "ho", "hu", "ba", "bi", "bo", "da", "di", "do", "pa", "po", "ka", "ko", "ga", "go"],
    2: ["schu", "scho", "scha", "sche", "mei", "lei", "rei", "bau", "mau", "lau", "lie", "bie", "rie", "pfa", "pfe", "eu", "neu", "heu", "chen", "ken", "ten", "ger", "ber", "mer", "ler"],
    3: ["schrei", "spie", "stra", "spri", "zwei", "pflau", "kla", "kro", "flie", "glei", "brau", "trau", "schmet", "sprin", "stei"],
  },
  woerter: {
    1: [["Ma-ma", ""], ["O-ma", ""], ["O-pa", ""], ["Ro-se", "rose"], ["Na-se", "nase"], ["Ho-se", "hose"], ["Ha-se", "hase"], ["Li-mo", ""], ["Mo-tor", ""],
      ["Ta-fel", "tafel"], ["Le-o", ""], ["Ru-di", ""], ["Sa-la-mi", ""], ["To-ma-te", "tomate"], ["Ba-na-ne", "banane"], ["Nu-del", "nudel"], ["Lu-pe", "lupe"],
      ["Ra-ke-te", "rakete"], ["Mo-de", ""], ["Wa-gen", ""], ["Le-se-buch", ""], ["Rol-ler", ""], ["Hut", ""], ["Mut", ""], ["Bus", "bus"], ["Ball", "ball"], ["Tor", ""]],
    2: [["Schu-le", ""], ["Ei-mer", "eimer"], ["Bie-ne", ""], ["Ja-cke", "jacke"], ["Schne-cke", "schnecke"], ["Maus", "maus"], ["Haus", "haus"], ["Baum", "baum"],
      ["Schaf", "schaf"], ["Fisch", "fisch"], ["Kä-se", "kaese"], ["Möh-re", "moehre"], ["Müt-ze", "muetze"], ["Brot", "brot"], ["Stift", "stift"], ["Frosch", "frosch"],
      ["Blu-me", "blume"], ["Kat-ze", "katze"], ["Schau-kel", "schaukel"], ["Tür", "tuer"], ["Uhr", "uhr"], ["Ei-le", ""], ["Rie-se", ""], ["Kü-che", ""], ["Bei-ne", ""], ["Freun-de", ""]],
    3: [["Schmet-ter-ling", "schmetterling"], ["Ma-ri-en-kä-fer", "marienkaefer"], ["Kin-der-wa-gen", "kinderwagen"], ["Ba-de-wan-ne", "badewanne"], ["Was-ser-me-lo-ne", "wassermelone"],
      ["Eich-hörn-chen", "eichhoernchen"], ["Schlüs-sel", "schluessel"], ["Ap-fel-si-ne", "apfelsine"], ["Fahr-rad", "fahrrad"], ["Sprin-gen", ""], ["Ge-burts-tag", ""],
      ["Spiel-platz", ""], ["Re-gen-schirm", ""], ["Haus-auf-ga-ben", ""], ["Schul-ran-zen", "ranzen"], ["Feu-er-wehr", ""], ["Weih-nach-ten", ""], ["Zahn-bürs-te", ""]],
  },
  // häufige Wörter (Sichtwortschatz)
  sicht: ["und", "ist", "der", "die", "das", "ein", "ei-ne", "nicht", "mit", "auf", "ich", "du", "er", "sie", "es", "wir", "ihr", "in", "im", "zu", "von", "hat", "sind", "ha-ben",
    "kann", "will", "geht", "sagt", "da", "hier", "auch", "noch", "wie", "was", "wo", "wer", "dann", "a-ber", "o-der", "heu-te"],
  saetze: {
    1: ["Ma-ma malt.", "O-ma ruft.", "Le-o ru-dert.", "Ru-di liest.", "Die Ro-se ist rot.", "Das Au-to ist neu.", "Ich la-che.", "Wir ma-len.", "Mi-na lobt Le-o.", "O-pa holt Sa-la-mi."],
    2: ["Die Kat-ze schläft.", "Der Hund rennt.", "Ben isst ein Ei.", "Mi-a hat ei-ne Müt-ze.", "Der Ball ist rund.", "Die Maus ist klein.", "Wir ge-hen in die Schu-le.",
      "Der Fisch schwimmt im Was-ser.", "Ich schau-ke-le gern.", "Die Son-ne scheint.", "Der Frosch springt.", "Das Schaf frisst Gras."],
    3: ["Der Hund liegt un-ter dem Tisch.", "Mi-a fährt mit dem Fahr-rad zur Schu-le.", "Im Herbst fal-len die Blät-ter von den Bäu-men.", "Der I-gel schläft im Win-ter un-ter dem Laub.",
      "Ben packt sei-nen Schul-ran-zen ein.", "Die Kin-der spie-len auf dem Spiel-platz.", "Am Mor-gen klin-gelt der We-cker.", "Der Schmet-ter-ling sitzt auf der Blu-me.",
      "Nach der Schu-le ma-che ich Haus-auf-ga-ben.", "Das Eich-hörn-chen sam-melt Nüs-se."],
  },
};
