/* =====================================================================
   Zahlenstrahl bis 1000 – gemeinsame Bausteine
   Alle Tafelbilder und Druckvorlagen zeichnen den Strahl hiermit,
   damit er überall gleich aussieht.

   Strahl.zeichneStrahl(ziel, optionen)  → Objekt mit x(wert), wertAus(ereignis), …
   Strahl.nachbarzahlen / nachbarzehner / nachbarhunderter / zufallszahl
   Strahl.zeiger(strahl, optionen)       → ziehbarer Zeiger, rastet am Strich ein
   ===================================================================== */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const S = {};

  // ---------------- Nachbar-Logik ----------------
  S.nachbarzahlen = n => [n - 1, n + 1];
  S.nachbarzehner = n => n % 10 === 0 ? [n - 10, n + 10] : [Math.floor(n / 10) * 10, Math.ceil(n / 10) * 10];
  S.nachbarhunderter = n => n % 100 === 0 ? [n - 100, n + 100] : [Math.floor(n / 100) * 100, Math.ceil(n / 100) * 100];
  // Alle Nachbarn, die auf einer Stufe gebraucht werden, liegen zwischen 0 und 1000?
  S.passt = (n, stufe) => {
    if (n < 1 || n > 999) return false;
    const l = [S.nachbarzahlen(n)];
    if (stufe >= 2) l.push(S.nachbarzehner(n));
    if (stufe >= 3) l.push(S.nachbarhunderter(n));
    return l.every(([a, b]) => a >= 0 && b <= 1000);
  };

  // ---------------- Zufall (auch mit Startwert, für Druckblätter) ----------------
  // Gleiche Blatt-Nummer → gleiche Zufallsfolge
  S.zufallMit = seed => {
    let a = (seed >>> 0) || 1;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  };
  S.rnd = Math.random;
  S.zufall = (a, b, rnd = S.rnd) => a + Math.floor(rnd() * (b - a + 1));
  S.wahl = (l, rnd = S.rnd) => l[Math.floor(rnd() * l.length)];
  S.mischen = (l, rnd = S.rnd) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Zufallszahl 1–999 für die Nachbar-Aufgaben.
  // zehnerzahlen: gezielt Zahlen wie 70 oder 340 (sonst keine Zehnerzahlen)
  S.zufallszahl = (stufe = 3, { zehnerzahlen = false, rnd = S.rnd, ausser = [] } = {}) => {
    for (let i = 0; i < 500; i++) {
      let n;
      if (zehnerzahlen && rnd() < .6) n = S.zufall(1, 99, rnd) * 10;
      else { n = S.zufall(1, 999, rnd); if (n % 10 === 0) continue; }
      if (S.passt(n, stufe) && !ausser.includes(n)) return n;
    }
    return 347;
  };

  // ---------------- Strich-Arten ----------------
  // h Hunderter, f50 Fünfziger (nur bei Schritt 10), z Zehner, f5 Fünfer (nur bei Schritt 1), e Einer
  S.LAENGE = { h: 1, f50: .75, z: .6, f5: .45, e: .3, n: .5, m: .85 };
  S.art = (v, schritt) => {
    if (v % 100 === 0) return "h";
    if (schritt === 10 && v % 50 === 0) return "f50";
    if (v % 10 === 0) return "z";
    if (schritt === 1 && v % 5 === 0) return "f5";
    return "e";
  };
  S.SATZ = s => `Ein Strich bedeutet ${s}.`;

  const el = (tag, attr = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attr) e.setAttribute(k, attr[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  S.el = el;
  const rund = x => Math.round(x * 100) / 100;

  /* ---------------- Der Zahlenstrahl ----------------
     ziel: HTML-Element (dann wird ein eigenes SVG angelegt) oder SVG-/g-Element
     optionen:
       von, bis          angezeigter Bereich
       schritt           Wert eines kleinsten Strichs: 1, 10 oder 100
       beschriftung      "hunderter" | "zehner" | "alle" | "enden" | "keine" | [Liste] | Funktion(wert) → bool
       pfeil             Pfeilspitze am rechten Ende (Standard: an)
       farben            true/false = fest; nicht angegeben = folgt der Klasse „farben“ weiter außen
       einheitlich       alle Striche gleich lang, nur der Mittelstrich länger (Strahl-Detektiv, Ausschnitte)
       markierungen      [{ wert, seite: "oben"|"unten", text, kasten: true, … }]
       antippbar         Funktion(wert, ereignis): Antippen liefert den Wert
     Maße (in Einheiten des SVG: px am Board, mm auf dem Blatt):
       breite, hoehe, y (Höhe der Linie), links, rechts (Rand), L (längster Strich), schrift, dicke
  */
  S.zeichneStrahl = (ziel, o = {}) => {
    o = Object.assign({ von: 0, bis: 1000, schritt: 100, beschriftung: "hunderter", pfeil: true,
      breite: 1400, hoehe: 200, y: 100, links: 40, rechts: 60, L: 60, schrift: 30, dicke: 4 }, o);
    let svg, root;
    if (ziel instanceof SVGElement) {
      svg = ziel.ownerSVGElement || ziel; root = el("g", { class: "strahl" }, ziel);
    } else {
      svg = el("svg", { class: "strahl-svg", viewBox: `0 0 ${o.breite} ${o.hoehe}`, width: o.breiteCss || o.breite, height: o.hoeheCss || o.hoehe });
      svg.setAttribute("overflow", "visible");
      if (ziel) ziel.appendChild(svg);
      root = el("g", { class: "strahl" }, svg);
    }
    if (o.farben === true) root.classList.add("farbig");
    if (o.farben === false) root.classList.add("schwarz");
    if (o.klasse) o.klasse.split(" ").forEach(k => root.classList.add(k));

    const api = { o, svg, root, striche: new Map(), labels: new Map() };
    const innen = () => o.breite - o.links - o.rechts;
    api.x = w => o.links + (w - o.von) / (o.bis - o.von) * innen();
    api.w = x => o.von + (x - o.links) / innen() * (o.bis - o.von);
    api.abstand = () => api.x(o.von + o.schritt) - api.x(o.von);   // Abstand zweier Striche

    // Wert unter dem Finger/der Maus (berücksichtigt die Skalierung der Bühne)
    api.wertAus = e => {
      const m = (root.getScreenCTM && root.getScreenCTM()); if (!m) return o.von;
      const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(m.inverse());
      return api.w(q.x);
    };
    api.punktAus = e => {
      const m = root.getScreenCTM(); const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(m.inverse());
    };
    api.einrasten = (w, s = o.schritt) => Math.max(o.von, Math.min(o.bis, Math.round((w - o.von) / s) * s + o.von));

    const beschriftet = v => {
      const b = o.beschriftung;
      if (typeof b === "function") return b(v);
      if (Array.isArray(b)) return b.includes(v);
      if (b === "alle") return true;
      if (b === "hunderter") return v % 100 === 0;
      if (b === "zehner") return v % 10 === 0;
      if (b === "enden") return v === o.von || v === o.bis;
      return false;
    };

    api.zeichne = () => {
      root.innerHTML = ""; api.striche.clear(); api.labels.clear();
      const gLinie = el("g", { class: "s-linie" }, root);
      const gStriche = el("g", { class: "s-striche" }, root);
      const gText = el("g", { class: "s-text" }, root);
      if (o.antippbar) {   // Tippfläche liegt unter Markierungen und Zeiger
        const fl = el("rect", { y: rund(o.y - o.L * 1.1), height: rund(o.L * 2.2 + o.schrift), class: "s-tipp" }, root);
        api.tippflaeche = fl;
        fl.addEventListener("pointerdown", e => { if (e.button > 0) return; o.antippbar(api.wertAus(e), e); });
      }
      api.gUnten = el("g", { class: "s-unten" }, root);    // für Bögen, Markierungen
      api.gOben = el("g", { class: "s-oben" }, root);
      const a = api.abstand();
      const xl = o.von === 0 && !o.randLinks ? api.x(o.von) : api.x(o.von) - Math.min(a * .7, o.L * .7);
      const xr = api.x(o.bis) + (o.pfeil ? o.L * .55 : Math.min(a * .7, o.L * .7));
      if (api.tippflaeche) { api.tippflaeche.setAttribute("x", rund(xl)); api.tippflaeche.setAttribute("width", rund(xr - xl)); }
      el("line", { x1: rund(xl), y1: o.y, x2: rund(xr), y2: o.y, class: "s-achse", "stroke-width": o.dicke }, gLinie);
      if (o.pfeil) {
        const s = o.dicke * 3.2;
        el("path", { d: `M${rund(xr + s * 1.1)} ${o.y} L${rund(xr - s * .5)} ${rund(o.y - s)} L${rund(xr - s * .5)} ${rund(o.y + s)} Z`, class: "s-spitze" }, gLinie);
      }
      // Striche: alle Vielfachen von „schritt“ im Bereich
      const erster = Math.ceil(o.von / o.schritt - 1e-9) * o.schritt, anzahl = Math.round((o.bis - o.von) / o.schritt);
      const mitte = o.von + Math.round(anzahl / 2) * o.schritt;
      for (let v = erster; v <= o.bis + 1e-9; v += o.schritt) {
        v = Math.round(v * 1000) / 1000;
        if (o.strichFilter && !o.strichFilter(v)) continue;
        let art = S.art(v, o.schritt);
        if (o.einheitlich) art = (v === mitte && anzahl % 2 === 0) ? "m" : "n";
        const h = o.L * S.LAENGE[art] / 2, x = rund(api.x(v));
        const li = el("line", { x1: x, y1: rund(o.y - h), x2: x, y2: rund(o.y + h), class: "st st-" + art, "stroke-width": o.dicke }, gStriche);
        li.dataset.wert = v;
        api.striche.set(v, li);
        if (beschriftet(v)) {
          const t = el("text", { x, y: rund(o.y + o.L / 2 + o.schrift * 1.05), class: "s-zahl", "font-size": o.schrift, "text-anchor": "middle" }, gText);
          t.textContent = v; api.labels.set(v, t);
        }
      }
      (o.markierungen || []).forEach(m => api.markiere(m));
    };

    // Strich kurz aufleuchten lassen
    api.leuchte = (v, dauer = 1600) => {
      const li = api.striche.get(v); if (!li) return;
      li.classList.remove("leuchtet"); void li.getBBox(); li.classList.add("leuchtet");
      setTimeout(() => li.classList.remove("leuchtet"), dauer);
    };

    /* Markierung: Pfeil an einem Wert, optional mit Kästchen darüber/darunter
       m = { wert, seite, text, kasten (true), leer, abstand, kb, kh, klasse, onTap, linie ("pfeil"|"linie") } */
    api.markiere = m => {
      const seite = m.seite || "oben", dir = seite === "oben" ? -1 : 1;
      const g = el("g", { class: "s-mark" + (m.klasse ? " " + m.klasse : "") }, seite === "oben" ? api.gOben : api.gUnten);
      const x = api.x(m.wert), kb = m.kb || o.schrift * 3.2, kh = m.kh || o.schrift * 1.6;
      const abst = m.abstand || o.L * 1.6 + (seite === "unten" ? o.schrift * 1.2 : 0);
      const ky = o.y + dir * abst;                            // Mitte des Kästchens
      const spitzeY = o.y + dir * (o.L * .3 + o.dicke);        // knapp über/unter der Linie
      const vonY = m.kasten === false ? ky : (seite === "oben" ? ky + kh / 2 : ky - kh / 2);   // Kante zur Linie hin
      el("line", { x1: rund(x), y1: rund(vonY), x2: rund(x), y2: rund(spitzeY - dir * o.dicke * 2.2), class: "m-linie", "stroke-width": o.dicke * .8 }, g);
      if (m.linie !== "linie") {
        const s = o.dicke * 2.4;
        el("path", { d: `M${rund(x)} ${rund(spitzeY)} L${rund(x - s)} ${rund(spitzeY - dir * s * 2)} L${rund(x + s)} ${rund(spitzeY - dir * s * 2)} Z`, class: "m-spitze" }, g);
      }
      let rect = null, txt = null;
      if (m.kasten !== false) {
        rect = el("rect", { x: rund(x - kb / 2), y: rund(ky - kh / 2), width: rund(kb), height: rund(kh), rx: rund(kh * .18), class: "m-kasten", "stroke-width": o.dicke * .7 }, g);
        txt = el("text", { x: rund(x), y: rund(ky + o.schrift * .36), "text-anchor": "middle", "font-size": o.schrift, class: "m-text" }, g);
        txt.textContent = m.text == null ? "" : m.text;
      }
      if (m.onTap) { g.classList.add("tippbar"); g.addEventListener("click", e => m.onTap(e, g)); }
      g.setzeText = t => { if (txt) txt.textContent = t; };
      g.rect = rect; g.txt = txt; g.x = x; g.ky = ky;
      return g;
    };

    // Sprungbogen von a nach b über (oder unter) der Linie, mit Beschriftung
    api.bogen = (a, b, text, { seite = "oben", klasse = "", hoehe } = {}) => {
      const dir = seite === "oben" ? -1 : 1;
      const x1 = api.x(a), x2 = api.x(b), y0 = o.y + dir * (o.L * .35 + o.dicke);
      const h = hoehe || Math.min(Math.abs(x2 - x1) * .55, o.L * 1.4);
      const g = el("g", { class: "s-bogen " + klasse }, seite === "oben" ? api.gOben : api.gUnten);
      const cx = (x1 + x2) / 2, cy = y0 + dir * h * 2;
      el("path", { d: `M${rund(x1)} ${rund(y0)} Q${rund(cx)} ${rund(cy)} ${rund(x2)} ${rund(y0)}`, class: "b-pfad", "stroke-width": o.dicke * .75 }, g);
      // Pfeilspitze in Richtung der Kurve am Ende
      const dx = x2 - cx, dy = y0 - cy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, s = o.dicke * 2.6;
      const bx = x2 - ux * s * 1.8, by = y0 - uy * s * 1.8;
      el("path", { d: `M${rund(x2)} ${rund(y0)} L${rund(bx - uy * s)} ${rund(by + ux * s)} L${rund(bx + uy * s)} ${rund(by - ux * s)} Z`, class: "b-spitze" }, g);
      if (text) {
        const t = el("text", { x: rund((x1 + x2) / 2), y: rund(y0 + dir * h + (dir < 0 ? -o.schrift * .25 : o.schrift * .95)), "text-anchor": "middle", "font-size": rund(o.schrift * .8), class: "b-text" }, g);
        t.textContent = text;
      }
      return g;
    };

    api.zeichne();
    return api;
  };

  /* ---------------- Ziehbarer Zeiger ----------------
     Ein Dreieck über der Linie mit Stiel; rastet am nächsten Strich ein.
     opt: wert, raster (Standard: Schritt des Strahls), frei (kein Einrasten),
          zahlZeigen (Wert am Zeiger anzeigen), onBewegt(w), onAbgelegt(w)
     Antippen des Strahls setzt den Zeiger dorthin (Alternative zum Ziehen). */
  S.zeiger = (strahl, opt = {}) => {
    const o = strahl.o, raster = opt.raster || o.schritt;
    const g = el("g", { class: "zeiger", tabindex: "0", role: "slider", "aria-label": opt.label || "Zeiger" }, strahl.root);
    const s = o.L * .42, top = o.y - o.L * .55;
    el("line", { x1: 0, y1: rund(top - s * 1.2), x2: 0, y2: rund(o.y + o.L * .5), class: "z-stiel", "stroke-width": o.dicke * 1.1 }, g);
    el("path", { d: `M0 ${rund(top)} L${rund(-s)} ${rund(top - s * 1.7)} L${rund(s)} ${rund(top - s * 1.7)} Z`, class: "z-kopf" }, g);
    el("rect", { x: rund(-s * 1.6), y: rund(top - s * 2.6), width: rund(s * 3.2), height: rund(o.y + o.L * .6 - top + s * 2.6), class: "z-griff" }, g);
    const zt = el("text", { x: 0, y: rund(top - s * 2.1), "text-anchor": "middle", "font-size": o.schrift, class: "z-zahl" }, g);
    const z = { g, wert: opt.wert != null ? opt.wert : o.von, aktiv: true };
    const fang = w => opt.frei ? Math.max(o.von, Math.min(o.bis, w)) : strahl.einrasten(w, raster);
    z.setze = (w, still) => {
      z.wert = fang(w);
      g.setAttribute("transform", `translate(${rund(strahl.x(z.wert))} 0)`);
      zt.textContent = opt.zahlZeigen ? Math.round(z.wert) : "";
      g.setAttribute("aria-valuenow", Math.round(z.wert));
      if (!still && opt.onBewegt) opt.onBewegt(z.wert);
    };
    z.zahlZeigen = an => { opt.zahlZeigen = an; z.setze(z.wert, true); };
    z.zeige = an => { g.style.display = an ? "" : "none"; };
    let zieht = false;
    g.addEventListener("pointerdown", e => {
      if (!z.aktiv || e.button > 0) return;
      e.preventDefault(); e.stopPropagation(); zieht = true; g.classList.add("zieht");
      try { g.setPointerCapture(e.pointerId); } catch (x) {}
    });
    g.addEventListener("pointermove", e => { if (zieht) z.setze(strahl.wertAus(e)); });
    const ende = () => { if (!zieht) return; zieht = false; g.classList.remove("zieht"); if (opt.onAbgelegt) opt.onAbgelegt(z.wert); };
    g.addEventListener("pointerup", ende); g.addEventListener("pointercancel", ende);
    g.addEventListener("keydown", e => {
      if (!z.aktiv) return;
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); z.setze(z.wert + d * raster); if (opt.onAbgelegt) opt.onAbgelegt(z.wert); }
    });
    z.setze(z.wert, true);
    return z;
  };

  /* Ausschnitt mit 11 Strichen (10 Abstände) für Strahl-Detektiv und Druckvorlage A
     schritt 1|10, gegeben "enden" | "endeMitte" | "eine", ausgerichtet (Anfang auf Zehner bzw. Hunderter),
     gesucht: Anzahl, abstand: kleinster Abstand (in Strichen) zwischen gesuchten Stellen, abstandG: zu gegebenen */
  S.ausschnittAufgabe = ({ schritt = 1, gegeben = "enden", ausgerichtet = true, gesucht = 2, abstand = 1, abstandG = 1, rnd = S.rnd } = {}) => {
    const von = schritt === 1 ? (ausgerichtet ? S.zufall(0, 99, rnd) * 10 : S.zufall(0, 989, rnd))
      : (ausgerichtet ? S.zufall(0, 9, rnd) * 100 : S.zufall(0, 90, rnd) * 10);
    let geg, pflicht = [];
    if (gegeben === "enden") geg = [0, 10];
    else if (gegeben === "endeMitte") { const links = rnd() < .5; geg = links ? [0, 5] : [5, 10]; pflicht = [links ? 10 : 0]; }
    else geg = [S.wahl([0, 5, 5, 10], rnd)];
    for (let versuch = 0; versuch < 200; versuch++) {
      const ges = [...pflicht];
      const frei = S.mischen([1, 2, 3, 4, 6, 7, 8, 9, 0, 5, 10].filter(i => !geg.includes(i) && !ges.includes(i)), rnd);
      for (const i of frei) {
        if (ges.length >= gesucht) break;
        if (ges.some(j => Math.abs(i - j) < abstand) || geg.some(j => Math.abs(i - j) < abstandG)) continue;
        ges.push(i);
      }
      if (ges.length >= Math.min(gesucht, 2) && ges.every(i => !geg.some(j => Math.abs(i - j) < abstandG))) {
        return { von, bis: von + 10 * schritt, schritt, gegeben: geg.sort((a, b) => a - b), gesucht: ges.sort((a, b) => a - b),
          wert: i => von + i * schritt, eineZahl: gegeben === "eine" };
      }
    }
    return { von, bis: von + 10 * schritt, schritt, gegeben: [0, 10], gesucht: [3, 7], wert: i => von + i * schritt, eineZahl: false };
  };

  // Satzstreifen setzen: art = "ok" | "noch" | "muster" | "muster hilfe" | ""
  S.melde = (elm, art, text) => {
    elm.className = "streifen" + (art ? " " + art : "");
    elm.innerHTML = Array.isArray(text) ? text.map(t => `<p>${t}</p>`).join("") : text;
  };

  // Text mit Zahl-Formatierung für Sätze
  S.zwischen = n => { const [a, b] = S.nachbarzehner(n); return `Die Zahl ${n} liegt zwischen ${a} und ${b}.`; };

  window.Strahl = S;
})();
