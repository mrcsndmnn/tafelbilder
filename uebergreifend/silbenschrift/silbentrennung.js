/* =====================================================================
   Automatische Silbentrennung für deutsche Texte (für die Silbenschrift)
   Silbentrennung.trenne("Liebe Kinder") → "Lie-be Kin-der"
   Grundlage: Liang-Verfahren mit den deutschen Trennmustern (trennmuster-de.js),
   dazu Regeln für Lese-Silben, die beim Schreiben nicht getrennt werden
   (z. B. „o-ben“, „A-bend“, „E-sel“). Alles läuft im Browser, ohne Internet.
   ===================================================================== */
(function () {
  "use strict";
  const MUSTER = new Map();   // Buchstabenfolge → Zahlenwerte
  let maxLaenge = 0;
  (window.TRENNMUSTER_DE || "").split(" ").forEach(m => {
    if (!m) return;
    const buchst = m.replace(/\d/g, ""), werte = [];
    let i = 0;
    for (const z of m) { if (/\d/.test(z)) werte[i] = +z; else i++; }
    const voll = Array.from({ length: buchst.length + 1 }, (_, k) => werte[k] || 0);
    MUSTER.set(buchst, voll); maxLaenge = Math.max(maxLaenge, buchst.length);
  });

  const VOKAL = "aeiouäöüy";
  const istVokal = c => VOKAL.includes(c);
  const ZWIELAUT = ["au", "eu", "ei", "ai", "äu", "ie", "ey", "ay"];
  const HIAT = ["ea", "eo", "ia", "io", "iu", "oa", "ao", "ua", "uo", "ui", "oe", "üe"];

  // Trennstellen eines Wortes (nur Buchstaben, Kleinschreibung) nach Liang
  function liang(w) {
    const wort = "_" + w + "_", punkte = new Array(wort.length + 1).fill(0);
    for (let i = 0; i < wort.length; i++)
      for (let l = 1; l <= maxLaenge && i + l <= wort.length; l++) {
        const p = MUSTER.get(wort.slice(i, i + l));
        if (p) p.forEach((v, k) => { if (v > punkte[i + k]) punkte[i + k] = v; });
      }
    const stellen = [];   // Stelle k: Trennung vor Buchstabe k (0-basiert im Wort)
    for (let k = 2; k <= w.length - 2; k++) if (punkte[k + 1] % 2) stellen.push(k);
    return stellen;
  }

  // Ein Wort (nur Buchstaben) in Silben zerlegen
  function wortSilben(original) {
    const w = original.toLowerCase();
    if (w.length < 3) return [original];
    const stellen = new Set(liang(w));
    // Lese-Silbe am Wortanfang: Vokal + einzelner Mitlaut + Vokal → „o-ben“, „A-bend“, „E-sel“
    if (istVokal(w[0]) && !istVokal(w[1]) && w.length > 2 && istVokal(w[2]) && !ZWIELAUT.includes(w.slice(0, 2))) stellen.add(1);
    // … und Zwielaut am Anfang vor Mitlaut + Vokal: „Eu-le“, „Au-to“, „Ei-er“ (Ei-er: Vokal nach Zwielaut)
    if (ZWIELAUT.includes(w.slice(0, 2)) && w.length > 3 && (istVokal(w[2]) || (!istVokal(w[2]) && istVokal(w[3])))) stellen.add(2);
    // Zwei getrennt gesprochene Vokale: „The-a-ter“, „Ra-di-o“, „Ka-ka-o“, „O-ze-an“ (nicht bei „qu“ wie in „Quadrat“)
    for (let k = 1; k < w.length; k++) {
      if (HIAT.includes(w.slice(k - 1, k + 1)) && !(w[k - 2] === "q" && w[k - 1] === "u") && !ZWIELAUT.includes(w.slice(k - 2, k))) stellen.add(k);
    }
    // „ck“, „ch“, „sch“, „ph“, „qu“ nie auseinanderreißen
    [...stellen].forEach(k => {
      const v = w.slice(k - 1, k + 1), v3 = w.slice(k - 2, k + 1), n3 = w.slice(k - 1, k + 2);
      if (v === "ch" || v === "ph" || v === "qu" || v3 === "sch" || n3 === "sch" || v === "ck") {
        stellen.delete(k);
        if (v === "ck") stellen.add(k - 1);       // neue Rechtschreibung: Zu-cker
      }
    });
    const liste = [...stellen].filter(k => k > 0 && k < w.length).sort((a, b) => a - b);
    const teile = []; let von = 0;
    liste.forEach(k => { teile.push(original.slice(von, k)); von = k; });
    teile.push(original.slice(von));
    // Eine Silbe braucht einen Vokal – sonst mit der Nachbarsilbe verbinden
    for (let i = 0; i < teile.length; i++) {
      if (![...teile[i].toLowerCase()].some(istVokal) && teile.length > 1) {
        if (i > 0) { teile[i - 1] += teile[i]; teile.splice(i, 1); } else { teile[1] = teile[0] + teile[1]; teile.splice(0, 1); }
        i--;
      }
    }
    return teile;
  }

  // Ganzer Text: Wörter trennen, alles andere (Satzzeichen, Zahlen, Leerzeichen) bleibt.
  // Echte Bindestriche (z. B. „Mathe-Arbeit“) werden zum Zeichen ‐ (U+2010), damit sie keine Silbengrenze sind.
  function trenne(text) {
    return String(text).replace(/-/g, "‐")
      .replace(/[A-Za-zÄÖÜäöüß]+/g, w => wortSilben(w).join("-"))
      .replace(/(\S)\u2010(?=\S)/g, "$1\u2010-");   // nach echtem Bindestrich beginnt eine neue Silbe (eigener Bogen)
  }
  window.Silbentrennung = { trenne, wortSilben };
})();
