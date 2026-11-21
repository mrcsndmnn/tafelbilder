/* =====================================================================
   Vertretungsbaukasten – Grundgerüst aller Generatoren
   Druck.start({
     id, titel, nr,                      // z. B. "G-D1"
     auftrag(cfg) → { symbole: ["schere","stift","kleber","lupe"], text: "Schnei-de …" }
     optionen: [{ key, label, werte: [{ wert, text }], std } | { key, label, schalter: true, std } | { key, label, eingabe: "text"|"zahl", std }],
     niveau (Standard an), schrift (Silbenschrift/Druckschrift wählbar, Standard an), lineatur (aus),
     klassensatz (aus): mehrere verschiedene Blätter auf einmal,
     mitLoesung (an), ohneKopf, baue(cfg, rnd, loesung, nummer, index) → Array von Seiten (HTML oder Element)
   })
   Zufall mit Startwert: gleiche Blatt-Nummer = gleiches Blatt. Die Nummer steht klein in der Fußzeile.
   Benötigt: ../../../gemeinsam/silben.js, inhalte.js, bilder.js
   ===================================================================== */
(function () {
  "use strict";
  const D = {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const laden = (k, std) => { try { const v = localStorage.getItem("vb-druck-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  const merken = (k, v) => { try { localStorage.setItem("vb-druck-" + k, JSON.stringify(v)); } catch (e) {} };
  const sitzung = (k, std) => { try { const v = sessionStorage.getItem("vs-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  D.esc = esc; D.sitzung = sitzung;
  D.sterne = n => "★".repeat(n) + "☆".repeat(3 - n);
  D.NIVEAU = { 1: "SEP 1–2", 2: "SEP 3 / Kl. 3 Anfang", 3: "Kl. 3–4" };

  // ---------- Zufall mit Startwert ----------
  D.zufallMit = seed => { let a = (seed >>> 0) || 1;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  D.zufall = (a, b, rnd) => a + Math.floor(rnd() * (b - a + 1));
  D.wahl = (l, rnd) => l[Math.floor(rnd() * l.length)];
  D.mischen = (l, rnd) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- Bausteine für die Blätter ----------
  D.w = t => window.silben ? silben(t) : esc(String(t).replace(/-/g, ""));          // Silbenschrift (wirkt mit Klasse „silben“)
  D.ohne = t => String(t).replace(/(\S)-(?=\S)/g, "$1");
  D.bild = (id, mm) => `<svg viewBox="0 0 200 200" ${mm ? `style="width:${mm}mm;height:${mm}mm"` : ""} aria-hidden="true">${window.SPIELBILDER && SPIELBILDER[id] ? SPIELBILDER[id]() : ""}</svg>`;
  D.wort = id => { const w = (window.INHALTE && INHALTE.WOERTER[id]) || ["", id]; return { art: w[0], silben: w[1], ganz: w[0] + " " + D.ohne(w[1]) }; };
  // Schreiblinien: lineatur 1 (Klasse 1), 2 (Klasse 2), 3 (Klasse 3–4); n Zeilen; breite in mm
  D.LIN = { 1: { o: 5, m: 5, u: 5, abst: 6 }, 2: { o: 4, m: 4, u: 4, abst: 5 }, 3: { o: 3, m: 3.5, u: 3, abst: 4 } };
  D.linien = (lin, n = 1, breite = 180, text = "") => {
    const L = D.LIN[lin] || D.LIN[2], h = L.o + L.m + L.u, ges = n * h + (n - 1) * L.abst;
    let s = "";
    for (let i = 0; i < n; i++) {
      const y = i * (h + L.abst);
      s += `<rect x="0" y="${y + L.o}" width="${breite}" height="${L.m}" fill="#eef2ef"/>` +
        `<line x1="0" x2="${breite}" y1="${y}" y2="${y}" stroke="#8d9892" stroke-width=".2"/>` +
        `<line x1="0" x2="${breite}" y1="${y + L.o}" y2="${y + L.o}" stroke="#8d9892" stroke-width=".2" stroke-dasharray="1 1"/>` +
        `<line x1="0" x2="${breite}" y1="${y + L.o + L.m}" y2="${y + L.o + L.m}" stroke="#1d2320" stroke-width=".4"/>` +
        `<line x1="0" x2="${breite}" y1="${y + h}" y2="${y + h}" stroke="#8d9892" stroke-width=".2"/>`;
      if (i === 0 && text) s += `<text x="2" y="${y + L.o + L.m - .6}" font-size="${(L.m * 1.55).toFixed(1)}" fill="#8d9892" font-family="Andika,'Comic Sans MS',sans-serif">${esc(text)}</text>`;
    }
    return `<svg class="schreiblinie" viewBox="0 0 ${breite} ${ges}" style="width:${breite}mm;height:${ges}mm" aria-hidden="true">${s}</svg>`;
  };

  D.start = def => {
    const cfg = laden(def.id, {});
    const opt = def.optionen || [];
    opt.forEach(o => { if (cfg[o.key] === undefined || (o.werte && !o.werte.some(w => w.wert === cfg[o.key]))) cfg[o.key] = o.std; });
    // Niveau: Die Wahl auf der Startseite (dieser Tab) hat Vorrang vor der zuletzt gespeicherten Einstellung
    if (def.niveau !== false) { const sn = sitzung("niveau", 0); if ([1, 2, 3].includes(sn)) cfg.niveau = sn; else if (![1, 2, 3].includes(cfg.niveau)) cfg.niveau = 2; }
    if (def.schrift !== false && !["silben", "druck"].includes(cfg.schrift)) cfg.schrift = "silben";
    if (def.lineatur && ![1, 2, 3].includes(cfg.lineatur)) cfg.lineatur = cfg.niveau === 1 ? 1 : cfg.niveau === 2 ? 2 : 3;
    if (typeof cfg.loesung !== "boolean") cfg.loesung = true;
    if (def.klassensatz && ![1, 4, 8, 12, 16, 24, 30].includes(cfg.anzahlBlaetter)) cfg.anzahlBlaetter = 1;
    let nr = 1000 + Math.floor(Math.random() * 9000);

    document.body.innerHTML = "";
    const gen = document.createElement("div"); gen.className = "gen"; document.body.appendChild(gen);
    const st = document.createElement("aside"); st.className = "steuer"; st.setAttribute("aria-label", "Einstellungen");
    st.innerHTML = `<a class="zurueck" href="../../"><span aria-hidden="true">←</span> Vertretungsbaukasten</a>
      <h1>${esc(def.titel)}<small>Generator ${esc(def.nr || "")} · Druckvorlage A4</small></h1>`;
    gen.appendChild(st);
    const vorschau = document.createElement("main"); vorschau.className = "vorschau"; vorschau.setAttribute("aria-label", "Vorschau der Blätter"); gen.appendChild(vorschau);

    const aendern = (k, v) => { cfg[k] = v; merken(def.id, cfg); zeichne(); };
    const gruppe = (label, optionen, key) => {
      const g = document.createElement("div"); g.className = "gruppe"; g.setAttribute("role", "group"); g.setAttribute("aria-label", label);
      g.innerHTML = `<span class="glabel">${esc(label)}</span><div class="knoepfe"></div>`;
      const kn = optionen.map(o => {
        const b = document.createElement("button"); b.type = "button"; b.innerHTML = o.text; if (o.aria) b.setAttribute("aria-label", o.aria); if (o.title) b.title = o.title;
        b.setAttribute("aria-pressed", o.wert === cfg[key]);
        b.addEventListener("click", () => { kn.forEach((x, i) => x.setAttribute("aria-pressed", optionen[i].wert === o.wert)); aendern(key, o.wert); });
        g.querySelector(".knoepfe").appendChild(b); return b;
      });
      st.appendChild(g); return g;
    };
    if (def.niveau !== false) gruppe("Niveau", [1, 2, 3].map(i => ({ wert: i, text: "★".repeat(i), aria: `Niveau ${i}: ${D.NIVEAU[i]}`, title: D.NIVEAU[i] })), "niveau");
    opt.forEach(o => {
      if (o.werte) gruppe(o.label, o.werte, o.key);
      else if (o.schalter) gruppe(o.label, [{ wert: true, text: "ja" }, { wert: false, text: "nein" }], o.key);
      else if (o.eingabe) {
        const g = document.createElement("div"); g.className = "gruppe";
        g.innerHTML = `<label class="glabel" for="e-${o.key}">${esc(o.label)}</label><input id="e-${o.key}" type="${o.eingabe === "zahl" ? "number" : "text"}" maxlength="40">`;
        const inp = g.querySelector("input"); inp.value = cfg[o.key] ?? "";
        inp.addEventListener("input", () => { cfg[o.key] = inp.value; merken(def.id, cfg); zeichne(); });
        st.appendChild(g);
      }
    });
    if (def.schrift !== false) gruppe("Schrift", [{ wert: "silben", text: "Silbenschrift" }, { wert: "druck", text: "Druckschrift" }], "schrift");
    if (def.lineatur) gruppe("Lineatur", [{ wert: 1, text: "Kl. 1" }, { wert: 2, text: "Kl. 2" }, { wert: 3, text: "Kl. 3–4" }], "lineatur");
    if (def.klassensatz) gruppe("Klassensatz (verschiedene Blätter)", [1, 4, 8, 12, 16, 24, 30].map(n => ({ wert: n, text: String(n) })), "anzahlBlaetter");
    if (def.mitLoesung !== false) gruppe("Lösungsblatt", [{ wert: true, text: "zeigen und drucken" }, { wert: false, text: "nein" }], "loesung");

    const ak = document.createElement("div"); ak.className = "aktionen";
    ak.innerHTML = `<div class="reihe"><label class="glabel" for="blattnr">Blatt-Nr.</label><input id="blattnr" type="number" min="1" max="99999" inputmode="numeric"></div>`;
    const inp = ak.querySelector("input"); inp.value = nr;
    inp.addEventListener("change", () => { const v = parseInt(inp.value, 10); if (v > 0) { nr = v; zeichne(); } else inp.value = nr; });
    const knopf = (t, fn, cls) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; if (cls) b.className = cls; b.addEventListener("click", fn); ak.appendChild(b); return b; };
    knopf("Neu mischen", () => { nr = 1000 + Math.floor(Math.random() * 9000); inp.value = nr; zeichne(); });
    knopf("Drucken", () => window.print(), "haupt");
    ak.insertAdjacentHTML("beforeend", '<span class="klein">Oder Strg + P drücken. Als PDF: im Druckfenster „Als PDF speichern“ wählen. Gleiche Blatt-Nummer ergibt das gleiche Blatt.</span>');
    st.appendChild(ak);
    if (def.hinweis) st.insertAdjacentHTML("beforeend", `<p class="klein">${def.hinweis}</p>`);

    function blatt(inhalt, loes, k, seiteNr, seitenGesamt) {
      const b = document.createElement("section"); b.className = "blatt" + (cfg.schrift === "druck" ? "" : " silben");
      b.setAttribute("aria-label", (loes ? "Lösung" : "Blatt") + (seitenGesamt > 1 ? " Seite " + seiteNr : ""));
      const innen = document.createElement("div"); innen.className = "innen"; b.appendChild(innen);
      if (!def.ohneKopf) {
        const a = def.auftrag ? def.auftrag(cfg) : null;
        innen.insertAdjacentHTML("beforeend", `<div class="b-kopf"><span class="feld">Name:</span><span class="feld kurz">Datum:</span></div>
          <div class="b-titel"><h2>${esc(def.blattTitel ? def.blattTitel(cfg) : def.titel)}</h2>${loes ? '<span class="loesung">Lösung</span>' : ""}${def.niveau !== false ? `<span class="sterne" aria-label="Niveau ${cfg.niveau}">${D.sterne(cfg.niveau)}</span>` : ""}</div>` +
          (a ? `<div class="b-auftrag"><span class="symbole">${(a.symbole || []).map(s => D.bild(s)).join("")}</span><span>${D.w(a.text)}</span></div>` : ""));
      }
      if (typeof inhalt === "string") innen.insertAdjacentHTML("beforeend", inhalt); else if (inhalt) innen.appendChild(inhalt);
      const info = def.info ? def.info(cfg) : "";
      innen.insertAdjacentHTML("beforeend", `<div class="b-fuss">${esc(def.nr || "")} · Blatt ${nr + k}${def.niveau !== false ? " · Niveau " + D.sterne(cfg.niveau).replace(/☆/g, "") : ""}${info ? " · " + esc(info) : ""}${loes ? " · Lösung" : ""}</div>`);
      return b;
    }
    function zeichne() {
      vorschau.innerHTML = "";
      const n = def.klassensatz ? cfg.anzahlBlaetter : 1;
      const sorten = [false].concat(def.mitLoesung !== false && cfg.loesung ? [true] : []);
      for (let k = 0; k < n; k++) sorten.forEach(loes => {
        const rnd = D.zufallMit((nr + k) * 7919 + 17);
        const seiten = def.baue(cfg, rnd, loes, nr + k, k);
        seiten.forEach((inhalt, si) => vorschau.appendChild(blatt(inhalt, loes, k, si + 1, seiten.length)));
      });
      if (def.nachZeichnen) def.nachZeichnen(cfg, vorschau);
    }
    zeichne();
    return { zeichne, cfg };
  };

  window.Druck = D;
})();
