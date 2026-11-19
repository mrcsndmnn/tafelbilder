/* =====================================================================
   Zahlenstrahl bis 1000 – Grundgerüst der Druckvorlagen
   Druck.start({ id, titel, auftrag, optionen, niveau, farben, mitLoesung, ohneKopf, baue })
     baue(cfg, rnd, loesung) → Array von Seiten-Inhalten (HTML-Text oder Element)
   Die Zufallszahlen hängen nur an der Blatt-Nummer: gleiche Nummer = gleiches Blatt.
   ===================================================================== */
(function () {
  "use strict";
  const D = {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const laden = (k, std) => { try { const v = localStorage.getItem("zs-druck-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  const merken = (k, v) => { try { localStorage.setItem("zs-druck-" + k, JSON.stringify(v)); } catch (e) {} };
  const neueNummer = () => 1000 + Math.floor(Math.random() * 9000);
  D.esc = esc;
  D.sterne = n => "★".repeat(n) + "☆".repeat(3 - n);

  D.start = def => {
    const cfg = laden(def.id, {});
    (def.optionen || []).forEach(o => { if (cfg[o.key] === undefined || (o.werte && !o.werte.some(w => w.wert === cfg[o.key]))) cfg[o.key] = o.std; });
    if (def.niveau !== false && ![1, 2, 3].includes(cfg.niveau)) cfg.niveau = 1;
    if (typeof cfg.farben !== "boolean") cfg.farben = false;
    if (typeof cfg.loesung !== "boolean") cfg.loesung = false;
    let nr = neueNummer();

    // ---------- Steuerleiste ----------
    const st = document.createElement("div"); st.className = "steuer";
    st.innerHTML = `<h1>${esc(def.titel)} <span class="klein">– Druckvorlage</span></h1>
      <a class="zurueck" href="../"><span aria-hidden="true">←</span> Start</a>`;
    const gruppe = (label, optionen, aktiv, onWahl) => {
      const g = document.createElement("div"); g.className = "gruppe"; g.setAttribute("role", "group"); g.setAttribute("aria-label", label);
      g.innerHTML = `<span class="glabel">${esc(label)}</span>`;
      const kn = optionen.map(o => {
        const b = document.createElement("button"); b.type = "button"; b.innerHTML = o.text; if (o.aria) b.setAttribute("aria-label", o.aria);
        b.setAttribute("aria-pressed", o.wert === aktiv);
        b.addEventListener("click", () => { kn.forEach((x, i) => x.setAttribute("aria-pressed", optionen[i].wert === o.wert)); onWahl(o.wert); });
        g.appendChild(b); return b;
      });
      g.knoepfe = kn; return g;
    };
    const schalter = (text, an, onWechsel) => {
      const b = document.createElement("button"); b.type = "button"; b.textContent = text; b.setAttribute("aria-pressed", !!an);
      b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); onWechsel(v); });
      return b;
    };
    const aendern = (k, v) => { cfg[k] = v; merken(def.id, cfg); zeichne(); };
    if (def.niveau !== false) st.appendChild(gruppe("Niveau", [1, 2, 3].map(i => ({ wert: i, text: "★".repeat(i), aria: "Niveau " + i })), cfg.niveau, v => aendern("niveau", v)));
    (def.optionen || []).forEach(o => {
      if (o.werte) { const g = gruppe(o.label, o.werte, cfg[o.key], v => aendern(o.key, v)); g.dataset.key = o.key; st.appendChild(g); }
      else st.appendChild(schalter(o.label, cfg[o.key], v => aendern(o.key, v)));
    });
    if (def.farben !== false) st.appendChild(schalter("Farben", cfg.farben, v => aendern("farben", v)));
    const nrBox = document.createElement("div"); nrBox.className = "gruppe";
    nrBox.innerHTML = `<label class="glabel" for="blattnr">Blatt</label><input id="blattnr" type="number" min="1" max="99999" inputmode="numeric">`;
    const inp = nrBox.querySelector("input"); inp.value = nr;
    inp.addEventListener("change", () => { const v = parseInt(inp.value, 10); if (v > 0) { nr = v; zeichne(); } else inp.value = nr; });
    const misch = document.createElement("button"); misch.type = "button"; misch.textContent = "Neu mischen";
    misch.addEventListener("click", () => { nr = neueNummer(); inp.value = nr; zeichne(); });
    nrBox.appendChild(misch); st.appendChild(nrBox);
    if (def.mitLoesung !== false) st.appendChild(schalter("Lösungsblatt zeigen", cfg.loesung, v => aendern("loesung", v)));
    const db = document.createElement("div"); db.className = "druckbox";
    const dk = document.createElement("button"); dk.type = "button"; dk.className = "haupt"; dk.textContent = "Drucken"; dk.addEventListener("click", () => window.print());
    db.appendChild(dk); db.insertAdjacentHTML("beforeend", '<span class="klein">Oder Strg + P drücken</span>'); st.appendChild(db);
    if (def.extraSteuer) def.extraSteuer(st, cfg);
    document.body.appendChild(st);

    const vorschau = document.createElement("main"); vorschau.className = "vorschau"; vorschau.setAttribute("aria-label", "Vorschau der Blätter");
    document.body.appendChild(vorschau);

    function zeichne() {
      vorschau.innerHTML = "";
      const sorten = [false].concat(def.mitLoesung !== false && cfg.loesung ? [true] : []);
      sorten.forEach(loes => {
        const rnd = Strahl.zufallMit(nr * 7919 + 17);      // gleiche Nummer → gleiche Zahlen (Aufgabe und Lösung)
        const seiten = def.baue(cfg, rnd, loes);
        seiten.forEach((inhalt, si) => {
          const b = document.createElement("section"); b.className = "blatt" + (cfg.farben ? " farben" : "");
          b.setAttribute("aria-label", (loes ? "Lösung" : "Arbeitsblatt") + (seiten.length > 1 ? " Seite " + (si + 1) : ""));
          const innen = document.createElement("div"); innen.className = "innen"; b.appendChild(innen);
          if (!def.ohneKopf) {
            innen.insertAdjacentHTML("beforeend", `<div class="b-kopf"><span class="feld">Name:</span><span class="feld kurz">Datum:</span></div>
              <div class="b-titel"><h2>${esc(def.titel)}</h2>${loes ? '<span class="loesung">Lösung</span>' : ""}${def.niveau !== false ? `<span class="sterne" aria-label="Niveau ${cfg.niveau}">${D.sterne(cfg.niveau)}</span>` : ""}</div>`);
          }
          if (typeof inhalt === "string") innen.insertAdjacentHTML("beforeend", inhalt); else innen.appendChild(inhalt);
          const info = def.info ? def.info(cfg) : "";
          innen.insertAdjacentHTML("beforeend", `<div class="b-fuss">Blatt ${nr}${def.niveau !== false ? " · Niveau " + cfg.niveau : ""}${info ? " · " + esc(info) : ""}${loes ? " · Lösung" : ""}</div>`);
          vorschau.appendChild(b);
          if (def.nachher) def.nachher(b, cfg, loes);
        });
      });
      if (def.nachZeichnen) def.nachZeichnen(cfg);
    }
    zeichne();
    return { zeichne, cfg };
  };

  // Strahl für den Druck (Maße in mm)
  D.strahl = (ziel, o) => Strahl.zeichneStrahl(ziel, Object.assign({ L: 6, schrift: 4.6, dicke: .4, links: 5, rechts: 7 }, o, {
    breiteCss: o.breite + "mm", hoeheCss: o.hoehe + "mm" }));

  window.Druck = D;
})();
