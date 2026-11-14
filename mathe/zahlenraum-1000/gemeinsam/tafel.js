/* =====================================================================
   Zahlenraum bis 1000 – gemeinsame Bausteine aller Tafelbilder
   1000er-Tafel als Leporello: 10 Hunderterquadrate nebeneinander.
   Quadrat s, Zeile r, Spalte c (jeweils ab 0):  n = s·100 + r·10 + c + 1
   ===================================================================== */
(function () {
  "use strict";
  const T = {};

  // ---------------- Datenmodell ----------------
  T.pos = n => { const k = n - 1; return { s: Math.floor(k / 100), r: Math.floor((k % 100) / 10), c: k % 10 }; };
  T.num = (s, r, c) => s * 100 + r * 10 + c + 1;

  // Ziffern für T, H, Z, E; führende Stellen leer ("" statt 0)
  T.stellen = n => {
    const t = String(n).padStart(4, " ");
    return { T: t[0].trim(), H: t[1].trim(), Z: t[2].trim(), E: t[3].trim() };
  };
  T.NAME = { T: "Tausenderstelle", H: "Hunderterstelle", Z: "Zehnerstelle", E: "Einerstelle" };
  T.KURZ = { T: "Tausender", H: "Hunderter", Z: "Zehner", E: "Einer" };
  const ORDNUNG = ["T", "H", "Z", "E"];

  // Richtungen: Zeilen-/Spaltenschritt, erwartete Änderung je Schritt, Pfeil und Text
  T.R = {
    rechts:   { dr: 0,  dc: 1,  d: 1,    erw: { E: 1 },         pfeil: "→", text: "nach rechts" },
    links:    { dr: 0,  dc: -1, d: -1,   erw: { E: -1 },        pfeil: "←", text: "nach links" },
    oben:     { dr: -1, dc: 0,  d: -10,  erw: { Z: -1 },        pfeil: "↑", text: "nach oben" },
    unten:    { dr: 1,  dc: 0,  d: 10,   erw: { Z: 1 },         pfeil: "↓", text: "nach unten" },
    ro:       { dr: -1, dc: 1,  d: -9,   erw: { Z: -1, E: 1 },  pfeil: "↗", text: "schräg nach rechts oben" },
    lo:       { dr: -1, dc: -1, d: -11,  erw: { Z: -1, E: -1 }, pfeil: "↖", text: "schräg nach links oben" },
    ru:       { dr: 1,  dc: 1,  d: 11,   erw: { Z: 1, E: 1 },   pfeil: "↘", text: "schräg nach rechts unten" },
    lu:       { dr: 1,  dc: -1, d: 9,    erw: { Z: 1, E: -1 },  pfeil: "↙", text: "schräg nach links unten" },
    plus100:  { ds: 1,  d: 100,  erw: { H: 1 },  pfeil: "+100", text: "ins nächste Quadrat" },
    minus100: { ds: -1, d: -100, erw: { H: -1 }, pfeil: "−100", text: "ins Quadrat davor" },
  };
  T.GERADE = ["rechts", "links", "oben", "unten"];
  T.SCHRAEG = ["ro", "lo", "ru", "lu"];
  T.ACHT = ["lo", "oben", "ro", "links", "rechts", "lu", "unten", "ru"];

  // Ein oder mehrere Schritte; null, wenn das Quadrat (bzw. die Tafel) zu Ende ist
  T.schritt = (n, ri, anzahl = 1) => {
    const R = T.R[ri]; let p = T.pos(n);
    for (let i = 0; i < anzahl; i++) {
      if (R.ds) { p = { s: p.s + R.ds, r: p.r, c: p.c }; if (p.s < 0 || p.s > 9) return null; }
      else { p = { s: p.s, r: p.r + R.dr, c: p.c + R.dc }; if (p.r < 0 || p.r > 9 || p.c < 0 || p.c > 9) return null; }
    }
    return T.num(p.s, p.r, p.c);
  };
  // Richtung zwischen zwei Nachbarfeldern im selben Quadrat (oder null)
  T.richtungZwischen = (a, b) => {
    const p = T.pos(a), q = T.pos(b);
    if (p.s !== q.s) return null;
    const dr = q.r - p.r, dc = q.c - p.c;
    return Object.keys(T.R).find(k => T.R[k].dr === dr && T.R[k].dc === dc) || null;
  };

  // Welche Stellen ändern sich von a nach b? (fehlende Stelle zählt als 0)
  T.aenderungen = (a, b) => {
    const sa = T.stellen(a), sb = T.stellen(b);
    return ORDNUNG.filter(p => (sa[p] || "0") !== (sb[p] || "0"))
      .map(p => ({ stelle: p, name: T.NAME[p], kurz: T.KURZ[p], alt: +(sa[p] || 0), neu: +(sb[p] || 0) }));
  };

  const ZAHLWORT = { 1: "eine", 2: "zwei", 3: "drei", 4: "vier" };
  const aufzaehlen = l => l.length < 2 ? l.join("") : l.slice(0, -1).join(", ") + " und " + l[l.length - 1];

  // "Die Zehnerstelle wird um 1 größer." – oder "Sprung! Es ändern sich: …"
  T.stellenSatz = (a, b, ri, k = 1) => {
    const erw = T.R[ri].erw, act = T.aenderungen(a, b);
    const passt = act.length === Object.keys(erw).length && act.every(x => erw[x.stelle] * k === x.neu - x.alt);
    if (passt) {
      return ORDNUNG.filter(p => erw[p]).map(p =>
        `Die ${T.NAME[p]} wird um ${Math.abs(erw[p] * k)} ${erw[p] > 0 ? "größer" : "kleiner"}.`).join(" ");
    }
    return "Sprung! Es ändern sich: " + act.map(x => `${x.name} ${x.alt} → ${x.neu}`).join(", ") + ".";
  };
  T.bewegungsSatz = (a, b, ri) => {
    const R = T.R[ri];
    const anfang = ri === "plus100" ? "Ich springe ins nächste Quadrat an dieselbe Stelle."
      : ri === "minus100" ? "Ich springe ins Quadrat davor an dieselbe Stelle."
      : R.dr && R.dc ? `Ich gehe ${R.text}.` : `Ich gehe einen Schritt ${R.text}.`;
    return anfang + " " + T.stellenSatz(a, b, ri);
  };
  // "Ich gehe 3 Schritte nach rechts: von 37 bis 40." + Stellen-Satz
  T.wegSatz = (a, b, ri, k) =>
    `Ich gehe ${k === 1 ? "einen Schritt" : k + " Schritte"} ${T.R[ri].text}: von ${a} bis ${b}. ` + T.stellenSatz(a, b, ri, k);
  // "Es ändert sich nur die Einerstelle." / "Es ändern sich zwei Stellen: Zehner und Einer."
  T.aenderungsSatz = (a, b) => {
    const act = T.aenderungen(a, b);
    if (act.length === 1) return `Es ändert sich nur die ${act[0].name}.`;
    return `Es ändern sich ${ZAHLWORT[act.length]} Stellen: ${aufzaehlen(act.map(x => x.kurz))}.`;
  };
  T.ortsSatz = n => { const p = T.pos(n); return `im ${p.s + 1}. Quadrat, in der ${p.r + 1}. Zeile, ${"in der " + (p.c + 1) + ". Spalte"}`; };
  T.bereich = s => `${s * 100 + 1} bis ${s * 100 + 100}`;
  T.bereichKurz = s => `${s * 100 + 1}–${s * 100 + 100}`;

  // Zahl als HTML mit Stellen-Klassen (für die H/Z/E-Farben)
  T.zahlHTML = n => {
    const s = T.stellen(n);
    return '<span class="ziffern">' + ORDNUNG.filter(p => s[p] !== "").map(p => `<span class="${p.toLowerCase()}">${s[p]}</span>`).join("") + "</span>";
  };

  // ---------------- Hilfsfunktionen ----------------
  T.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  T.zufall = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  T.wahl = l => l[Math.floor(Math.random() * l.length)];
  T.mischen = l => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  T.lob = () => T.wahl(["Super!", "Genau!", "Klasse!"]);
  T.NOCH = "Noch nicht. Schau noch einmal genau.";
  T.laden = (k, std) => { try { const v = localStorage.getItem("z1000-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  T.merken = (k, v) => { try { localStorage.setItem("z1000-" + k, JSON.stringify(v)); } catch (e) {} };

  // Animationen: abschaltbar (prefers-reduced-motion), werden beim Verlassen abgebrochen
  T.bewegt = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const timer = new Set();
  T.nach = (ms, fn) => { const id = setTimeout(() => { timer.delete(id); fn(); }, T.bewegt ? ms : 0); timer.add(id); return id; };
  T.warte = ms => new Promise(res => T.nach(ms, res));
  T.stop = () => { timer.forEach(clearTimeout); timer.clear(); T.lauf = (T.lauf || 0) + 1; };
  addEventListener("pagehide", T.stop);

  // ---------------- Bühne ----------------
  T.buehne = () => {
    const fit = document.getElementById("fit"), S = document.getElementById("stage");
    let scale = 1;
    const resize = () => {
      const r = fit.getBoundingClientRect();
      scale = Math.min(r.width / 1600, r.height / 900);
      S.style.transform = `scale(${scale})`;
      S.style.left = (r.width - 1600 * scale) / 2 + "px";
      S.style.top = (r.height - 900 * scale) / 2 + "px";
    };
    addEventListener("resize", resize); resize();
    T.S = S;
    return S;
  };
  T.blk = (x, y, w, h, cls) => {
    const d = T.el("div", "blk" + (cls ? " " + cls : ""));
    d.style.left = x + "px"; d.style.top = y + "px";
    if (w) d.style.width = w + "px"; if (h) d.style.height = h + "px";
    T.S.appendChild(d); return d;
  };

  // ---------------- Knöpfe ----------------
  T.knopf = (text, onClick, cls) => {
    const b = T.el("button", "knopf" + (cls ? " " + cls : ""), text); b.type = "button";
    if (onClick) b.addEventListener("click", onClick); return b;
  };
  T.schalter = (text, an, onChange) => {
    const b = T.knopf(`<span class="box" aria-hidden="true"></span>${text}`);
    b.setAttribute("aria-pressed", !!an);
    b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); onChange(v); });
    return b;
  };
  // Gruppe sich ausschließender Knöpfe; key = Name zum Merken (optional)
  T.gruppe = (label, optionen, aktiv, onChange, key) => {
    if (key) aktiv = T.laden(key, aktiv);
    if (!optionen.some(o => o.wert === aktiv)) aktiv = optionen[0].wert;
    const g = T.el("div", "gruppe"); g.setAttribute("role", "group");
    if (label) { g.appendChild(T.el("span", "glabel", label)); g.setAttribute("aria-label", label); }
    const knoepfe = optionen.map(o => {
      const b = T.knopf(o.text); if (o.aria) b.setAttribute("aria-label", o.aria);
      b.setAttribute("aria-pressed", o.wert === aktiv);
      b.addEventListener("click", () => { setze(o.wert); onChange(o.wert); });
      g.appendChild(b); return b;
    });
    const setze = w => { knoepfe.forEach((b, i) => b.setAttribute("aria-pressed", optionen[i].wert === w)); g.wert = w; if (key) T.merken(key, w); };
    g.wert = aktiv; g.setze = setze;
    return g;
  };
  T.stufen = (onChange, key) => T.gruppe("Stufe", [1, 2, 3].map(i => ({ wert: i, text: "●".repeat(i), aria: "Stufe " + i })), 1, onChange, key);

  // ---------------- Kopfleiste ----------------
  // Links „Start“ und Titel, rechts eigene Schalter, „Farben“, „Hilfen“, „Neu“
  T.kopf = ({ titel, onNeu, extra = [], onHilfen }) => {
    const k = T.el("div", "kopf");
    const start = T.el("a", "knopf start", '<span aria-hidden="true">←</span> Start'); start.href = "../";
    k.append(start);
    // Knopf „?“ mit Hinweisen (Text steht auf jeder Seite in window.HINWEISE)
    if (window.Hinweise && window.HINWEISE) {
      const inhalt = { titel: window.HINWEISE.titel || titel, teile: window.HINWEISE.teile.concat([{ h: "Knöpfe oben", punkte: [
        window.HINWEISE.start || "**Start** führt zur Startseite mit allen Tafelbildern zum Zahlenraum bis 1000.",
        window.HINWEISE.farben || "**Farben** färbt die Ziffern im Hunderterquadrat: Hunderter grün, Zehner rot, Einer blau (Tausender grau).",
        "**Hilfen** blendet Pfeilbeschriftungen und Satzmuster ein oder aus. Beim Öffnen sind die Hilfen an.",
        "**Neu** setzt das Tafelbild zurück.",
        "Tipp: Mit **F11** auf Vollbild schalten." ] }]) };
      k.appendChild(window.Hinweise.knopf(inhalt, "knopf rund"));
    }
    k.appendChild(T.el("h1", "", titel));
    const re = T.el("div", "rechts");
    extra.forEach(x => re.appendChild(x));
    const farben = T.laden("farben", false);
    T.S.classList.toggle("farben", farben);
    re.appendChild(T.schalter("Farben", farben, v => { T.S.classList.toggle("farben", v); T.merken("farben", v); }));
    re.appendChild(T.schalter("Hilfen", true, v => { T.S.classList.toggle("hilfen-aus", !v); if (onHilfen) onHilfen(v); }));
    re.appendChild(T.knopf("Neu", () => { T.stop(); onNeu(); }, "haupt"));
    k.appendChild(re);
    T.S.appendChild(k);
    return k;
  };
  T.hilfen = () => !T.S.classList.contains("hilfen-aus");
  T.leiste = (...teile) => {
    const l = T.el("div", "leiste");
    teile.forEach((t, i) => { if (i) l.appendChild(T.el("span", "trenner")); l.appendChild(t); });
    T.S.appendChild(l); return l;
  };

  // ---------------- Hunderterquadrat ----------------
  // opts: zelle (px), onTap(n, feld), zeige(n) → Zahl sichtbar?
  T.quadrat = (box, opts = {}) => {
    const z = opts.zelle || 58;
    const q = T.el("div", "quadrat"); q.style.setProperty("--z", z + "px");
    box.classList.add("qbox"); box.appendChild(q);
    const felder = [];
    for (let i = 0; i < 100; i++) {
      const f = T.el("button", "feld"); f.type = "button";
      f.addEventListener("click", () => { if (opts.onTap) opts.onTap(f.n, f); });
      q.appendChild(f); felder.push(f);
    }
    const marken = new Map();   // n → Set von Klassen (bleibt beim Quadratwechsel erhalten)
    const obj = {
      s: 0, box, q, felder, zelle: z,
      zeigeQuadrat(s) { obj.s = s; obj.zeichne(); },
      zeichne() {
        felder.forEach((f, i) => {
          const n = obj.s * 100 + i + 1; f.n = n;
          const sichtbar = !opts.zeige || opts.zeige(n);
          f.innerHTML = sichtbar ? T.zahlHTML(n) : "";
          f.setAttribute("aria-label", sichtbar ? String(n) : "Feld " + (i + 1));
          f.className = "feld"; (marken.get(n) || []).forEach(c => f.classList.add(c));
        });
      },
      feld: n => (n > obj.s * 100 && n <= obj.s * 100 + 100) ? felder[n - obj.s * 100 - 1] : null,
      mark(n, cls, an = true) {
        if (!marken.has(n)) marken.set(n, new Set());
        an ? marken.get(n).add(cls) : marken.get(n).delete(cls);
        const f = obj.feld(n); if (f) f.classList.toggle(cls, an);
      },
      leere(cls) { marken.forEach(s => cls ? s.delete(cls) : s.clear()); felder.forEach(f => cls ? f.classList.remove(cls) : (f.className = "feld")); },
      hat: (n, cls) => !!(marken.get(n) && marken.get(n).has(cls)),
      mitte(n) { const p = T.pos(n); return { x: p.c * (z + 3) + z / 2, y: p.r * (z + 3) + z / 2 }; },
      groesse: 10 * z + 27,
    };
    return obj;
  };

  // ---------------- Leporello-Leiste ----------------
  T.leporello = (box, opts = {}) => {
    const l = T.el("div", "lepo"); box.appendChild(l);
    const kn = [];
    for (let s = 0; s < 10; s++) {
      const b = T.el("button", "", `<span class="mini"></span><span class="lbl">${T.bereichKurz(s)}</span>`);
      b.type = "button"; b.setAttribute("aria-label", `Quadrat ${s + 1}: ${T.bereich(s)}`);
      b.addEventListener("click", () => opts.onTap && opts.onTap(s));
      l.appendChild(b); kn.push(b);
    }
    return {
      setze(s) { kn.forEach((b, i) => { b.classList.toggle("aktiv", i === s); b.setAttribute("aria-pressed", i === s); }); },
      blink(s) { const b = kn[s]; b.classList.remove("blink"); void b.offsetWidth; b.classList.add("blink"); },
      knoepfe: kn,
    };
  };

  // ---------------- Stellenwerttafel ----------------
  T.stellenwerttafel = box => {
    const t = T.el("table", "swt"); box.appendChild(t);
    return {
      zeige(n, vorher) {
        const mitT = n >= 1000 || (vorher != null && vorher >= 1000);
        const sp = (mitT ? ["T"] : []).concat(["H", "Z", "E"]);
        const s = T.stellen(n), sv = vorher != null ? T.stellen(vorher) : null;
        t.innerHTML = "<tr>" + sp.map(p => `<th class="${p.toLowerCase()}">${p}</th>`).join("") + "</tr><tr>" +
          sp.map(p => `<td class="${p.toLowerCase()}${sv && (sv[p] || "0") !== (s[p] || "0") ? " neu" : ""}">${s[p]}</td>`).join("") + "</tr>";
        t.setAttribute("aria-label", `Stellenwerttafel: ${sp.map(p => T.KURZ[p] + " " + (s[p] || "leer")).join(", ")}`);
      },
    };
  };

  // ---------------- Große Zahl ----------------
  T.grosseZahl = box => {
    const z = T.el("div", "gzahl zahl"), i = T.el("div", "ginfo"); box.append(z, i);
    return {
      zeige(n, vorher) {
        z.innerHTML = T.zahlHTML(n);
        if (vorher != null && vorher !== n) { const d = n - vorher; i.textContent = `${vorher} → ${n} (${d > 0 ? "+" : "−"}${Math.abs(d)})`; }
        else i.textContent = "";
      },
    };
  };

  // ---------------- Satzstreifen / Rückmeldung ----------------
  T.streifen = (box, cls) => { const s = T.el("div", "streifen" + (cls ? " " + cls : "")); s.setAttribute("aria-live", "polite"); box.appendChild(s); return s; };
  T.melde = (el, art, text) => {
    el.className = el.className.replace(/\b(ok|noch)\b/g, "").trim();
    if (art) el.classList.add(art);
    el.innerHTML = Array.isArray(text) ? text.map(t => `<p>${t}</p>`).join("") : text;
  };

  // ---------------- Material ----------------
  T.material = box => {
    const m = T.el("div", "material"); box.appendChild(m);
    return {
      zeige(n) {
        const s = T.stellen(n), g = (k, cls) => { const d = T.el("div", "grp"); for (let i = 0; i < k; i++) d.appendChild(T.el("div", cls)); return d; };
        m.innerHTML = "";
        if (s.T) m.appendChild(g(+s.T, "tausender"));
        if (+s.H) m.appendChild(g(+s.H, "platte"));
        if (+s.Z) m.appendChild(g(+s.Z, "stange"));
        if (+s.E) m.appendChild(g(+s.E, "wuerfel"));
        m.setAttribute("aria-label", `Material: ${+s.T || 0} Tausender, ${+s.H || 0} Hunderter, ${+s.Z || 0} Zehner, ${+s.E || 0} Einer`);
      },
    };
  };

  // ---------------- Pfeil-Overlay (SVG über einem Quadrat) ----------------
  T.ueberlagerung = q => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg"); svg.setAttribute("class", "ueber");
    svg.setAttribute("width", q.groesse); svg.setAttribute("height", q.groesse);
    svg.innerHTML = `<defs><marker id="spitze" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1d2320"/></marker></defs><g></g>`;
    q.box.appendChild(svg);
    const g = svg.querySelector("g");
    return {
      leere() { g.innerHTML = ""; },
      pfeil(d) {
        const p = document.createElementNS(ns, "path"); p.setAttribute("d", d);
        p.setAttribute("fill", "none"); p.setAttribute("stroke", "#1d2320"); p.setAttribute("stroke-width", "6");
        p.setAttribute("stroke-linecap", "round"); p.setAttribute("marker-end", "url(#spitze)");
        g.appendChild(p); return p;
      },
    };
  };

  // Marienkäfer (selbst gezeichnet)
  T.KAEFER = `<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="24" rx="14.5" ry="14" fill="#d03a32" stroke="#1d2320" stroke-width="2.5"/>
    <path d="M7 15 Q20 5 33 15 Q20 12 7 15Z" fill="#1d2320"/><circle cx="20" cy="9" r="6.5" fill="#1d2320"/>
    <circle cx="17.5" cy="7.5" r="1.6" fill="#fff"/><circle cx="22.5" cy="7.5" r="1.6" fill="#fff"/>
    <line x1="20" y1="13" x2="20" y2="37.5" stroke="#1d2320" stroke-width="2.5"/>
    <circle cx="13" cy="21" r="3" fill="#1d2320"/><circle cx="27" cy="21" r="3" fill="#1d2320"/>
    <circle cx="12.5" cy="30" r="2.6" fill="#1d2320"/><circle cx="27.5" cy="30" r="2.6" fill="#1d2320"/></svg>`;

  window.Tafel = T;
})();
