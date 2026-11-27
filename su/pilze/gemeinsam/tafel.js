/* =====================================================================
   Pilze – gemeinsame Bausteine aller Tafelbilder
   Bühne 1600 × 900, Kopfleiste, Ziehen/Antippen, Silbenschrift, Prüfen.
   Benötigt vorher: ../../../gemeinsam/silben.js (Funktion silben)
   ===================================================================== */
(function () {
  "use strict";
  const P = {};
  let S = null;

  // ---------------- Hilfsfunktionen ----------------
  P.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  P.zufall = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  P.wahl = l => l[Math.floor(Math.random() * l.length)];
  P.mischen = l => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  P.laden = (k, std) => { try { const v = localStorage.getItem("pilze-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  P.merken = (k, v) => { try { localStorage.setItem("pilze-" + k, JSON.stringify(v)); } catch (e) {} };
  P.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  P.LOB = "Super, alles richtig!";
  P.NOCH = "Noch nicht. Schau noch ein-mal ge-nau.";

  // ---------------- Silbenschrift ----------------
  // Text mit "-" zwischen den Silben → HTML. Vorlese-Programme lesen das Wort ohne Bindestriche.
  P.ohne = t => String(t).replace(/<br\s*\/?>/gi, " ").replace(/(\S)-(?=\S)/g, "$1");
  P.w = t => `<span class="sw"><span class="vh">${P.ohne(t)}</span><span aria-hidden="true">${silben(t)}</span></span>`;

  // ---------------- Animationen ----------------
  // abschaltbar (prefers-reduced-motion), werden beim Verlassen der Seite abgebrochen
  P.bewegt = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const timer = new Set(), frames = new Set();
  P.nach = (ms, fn) => { const id = setTimeout(() => { timer.delete(id); fn(); }, P.bewegt ? ms : 0); timer.add(id); return id; };
  P.warte = ms => new Promise(res => P.nach(ms, res));
  // Animation über dauer ms: fn(p) mit p von 0 bis 1; bei reduzierter Bewegung sofort p = 1
  P.anim = (dauer, fn, fertig) => {
    if (!P.bewegt || dauer <= 0) { fn(1); if (fertig) fertig(); return; }
    const t0 = performance.now(); let id;
    const schritt = t => { frames.delete(id); const p = Math.min(1, (t - t0) / dauer); fn(p); if (p < 1) { id = requestAnimationFrame(schritt); frames.add(id); } else if (fertig) fertig(); };
    id = requestAnimationFrame(schritt); frames.add(id);
  };
  P.stop = () => { timer.forEach(clearTimeout); timer.clear(); frames.forEach(cancelAnimationFrame); frames.clear(); P.lauf = (P.lauf || 0) + 1; };
  addEventListener("pagehide", () => { P.stop(); if (window.speechSynthesis) try { speechSynthesis.cancel(); } catch (e) {} });

  // ---------------- Bühne ----------------
  P.buehne = () => {
    const fit = document.getElementById("fit"); S = document.getElementById("stage");
    const resize = () => {
      const r = fit.getBoundingClientRect(), f = Math.min(r.width / 1600, r.height / 900);
      S.style.transform = `scale(${f})`;
      S.style.left = (r.width - 1600 * f) / 2 + "px"; S.style.top = (r.height - 900 * f) / 2 + "px";
    };
    addEventListener("resize", resize); resize();
    P.S = S; return S;
  };
  P.faktor = () => S.getBoundingClientRect().width / 1600;
  // Lage eines Elements in Bühnen-Koordinaten
  P.rect = el => {
    const r = el.getBoundingClientRect(), s = S.getBoundingClientRect(), f = s.width / 1600;
    return { x: (r.left - s.left) / f, y: (r.top - s.top) / f, w: r.width / f, h: r.height / f };
  };
  P.punkt = (cx, cy) => { const s = S.getBoundingClientRect(), f = s.width / 1600; return { x: (cx - s.left) / f, y: (cy - s.top) / f }; };
  P.blk = (x, y, w, h, cls) => {
    const d = P.el("div", "blk" + (cls ? " " + cls : ""));
    d.style.left = x + "px"; d.style.top = y + "px";
    if (w) d.style.width = w + "px"; if (h) d.style.height = h + "px";
    S.appendChild(d); return d;
  };
  P.setze = (el, x, y) => { el.style.left = x + "px"; el.style.top = y + "px"; };

  // ---------------- Knöpfe ----------------
  P.knopf = (text, onClick, cls) => {
    const b = P.el("button", "knopf" + (cls ? " " + cls : ""), text); b.type = "button";
    if (onClick) b.addEventListener("click", onClick); return b;
  };
  P.schalter = (text, an, onChange) => {
    const b = P.knopf(`<span class="box" aria-hidden="true"></span>${text}`);
    b.setAttribute("aria-pressed", !!an);
    b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); onChange(v); });
    b.setze = v => b.setAttribute("aria-pressed", !!v);
    return b;
  };
  // Gruppe sich ausschließender Knöpfe; key = Name zum Merken (optional)
  P.gruppe = (label, optionen, aktiv, onChange, key) => {
    if (key) aktiv = P.laden(key, aktiv);
    if (!optionen.some(o => o.wert === aktiv)) aktiv = optionen[0].wert;
    const g = P.el("div", "gruppe"); g.setAttribute("role", "group");
    if (label) { g.appendChild(P.el("span", "glabel", label)); g.setAttribute("aria-label", label); }
    const knoepfe = optionen.map(o => {
      const b = P.knopf(o.text); if (o.aria) b.setAttribute("aria-label", o.aria);
      b.setAttribute("aria-pressed", o.wert === aktiv);
      b.addEventListener("click", () => { if (g.wert === o.wert) return; setze(o.wert); onChange(o.wert); });
      g.appendChild(b); return b;
    });
    const setze = w => { knoepfe.forEach((b, i) => b.setAttribute("aria-pressed", optionen[i].wert === w)); g.wert = w; if (key) P.merken(key, w); };
    g.wert = aktiv; g.setze = setze; g.knoepfe = knoepfe;
    return g;
  };
  // Stufe 1–3 als kleine Pilz-Symbole
  const MINI = '<svg viewBox="0 0 22 24" aria-hidden="true"><path d="M2 12 C2 4 7 2 11 2 C15 2 20 4 20 12 Z" fill="#c98a4a" stroke="#1d2320" stroke-width="2"/><path d="M8 12 L7.5 22 H14.5 L14 12 Z" fill="#f6ecc8" stroke="#1d2320" stroke-width="2"/></svg>';
  P.stufen = (onChange, key, anzahl = 3) => P.gruppe("Stufe",
    Array.from({ length: anzahl }, (_, i) => ({ wert: i + 1, text: `<span class="stufe-sym">${MINI.repeat(i + 1)}</span>`, aria: "Stufe " + (i + 1) })),
    1, onChange, key);

  // ---------------- Kopfleiste ----------------
  // titel, auftrag (Kindertext mit Silben), say (Satzmuster für die Pille), onNeu, onPruefen (optional),
  // leiste: Elemente rechts in der zweiten Zeile, woerter: Wortspeicher (optional), onHilfen
  P.kopf = ({ titel, auftrag, say, onNeu, onPruefen, leiste = [], woerter, onHilfen, extra = [] }) => {
    const k = P.el("div", "kopf");
    const start = P.el("a", "knopf start", '<span aria-hidden="true">←</span> Start'); start.href = "../";
    k.appendChild(start);
    if (window.Hinweise && window.HINWEISE) {
      const H = window.HINWEISE;
      const knoepfe = [
        "**Start** führt zur Startseite mit allen Tafelbildern zu den Pilzen.",
        "**Farben** färbt Felder und Kärtchen in den Farben der Pilzteile: Hut grün, Stiel rot, Myzel gelb, Fruchtkörper blau.",
        "**Silben** schaltet die Silbenschrift (blaue und rote Silben mit Bögen) ein oder aus. Beim ersten Öffnen ist sie an.",
        "**Hilfen** blendet Satzmuster, Wortspeicher und Hinweislinien ein oder aus. Beim Öffnen sind die Hilfen an.",
      ];
      if (onPruefen) knoepfe.push(H.pruefen || "**Prüfen** zeigt an jedem Feld einen grünen Haken ✓ oder ein oranges **?**. Falsche Karten bleiben liegen und können ausgetauscht werden.");
      knoepfe.push(H.neu || "**Neu** mischt und setzt das Tafelbild zurück.", "Tipp: Mit **F11** auf Vollbild schalten.");
      if (H.ziehen !== false) knoepfe.splice(0, 0, "**Ziehen oder Antippen:** Kärtchen mit Finger, Stift oder Maus ziehen – oder erst das Kärtchen antippen (violetter Rand) und dann das Feld. Beides geht immer.");
      const inhalt = { titel: H.titel || titel, teile: H.teile.concat([{ h: "Knöpfe und Bedienung", punkte: knoepfe }]) };
      k.appendChild(window.Hinweise.knopf(inhalt, "knopf rund"));
    }
    k.appendChild(P.el("h1", "", titel));
    const re = P.el("div", "rechts");
    extra.forEach(x => re.appendChild(x));
    const farben = P.laden("farben", false);
    S.classList.toggle("farben", farben);
    re.appendChild(P.schalter("Farben", farben, v => { S.classList.toggle("farben", v); P.merken("farben", v); }));
    const sil = P.laden("silben", true);
    S.classList.toggle("silben", sil);
    re.appendChild(P.schalter("Silben", sil, v => { S.classList.toggle("silben", v); P.merken("silben", v); }));
    re.appendChild(P.schalter("Hilfen", true, v => { S.classList.toggle("hilfen-aus", !v); if (onHilfen) onHilfen(v); }));
    if (onPruefen) re.appendChild(P.knopf("Prüfen", () => onPruefen(), "haupt"));
    re.appendChild(P.knopf("Neu", () => { P.stop(); onNeu(); }));
    k.appendChild(re);
    S.appendChild(k);

    const z2 = P.el("div", "zeile2");
    const a = P.el("div", "auftrag");
    z2.appendChild(a);
    const l = P.el("div", "leiste");
    leiste.forEach((t, i) => { if (i) l.appendChild(P.el("span", "trenner")); l.appendChild(t); });
    if (woerter) {
      if (leiste.length) l.appendChild(P.el("span", "trenner hilfe"));
      const ws = P.wortspeicher(woerter);
      const b = P.knopf("Wörter", () => ws.umschalten(), "hilfe");
      b.setAttribute("aria-expanded", "false"); ws.knopf = b;
      l.appendChild(b);
    }
    z2.appendChild(l);
    S.appendChild(z2);
    P._pruefen = onPruefen; P._zeile = z2;
    const obj = {
      kopf: k, zeile: z2, leiste: l,
      auftrag(text, satz) {
        a.innerHTML = (text ? `<span>${P.w(text)}</span>` : "") +
          (satz ? `<span class="say hilfe"><span class="lbl">Sprich:</span>${P.w(satz)}</span>` : "");
      },
    };
    obj.auftrag(auftrag, say);
    return obj;
  };
  // Übungsrunde (iframe mit ?modus=runde): Kopf und Leiste blendet runde-client.js aus.
  // Der Prüfen-Knopf wandert dann in die zweite Zeile, damit das Kind selbst prüfen kann.
  P.runde = ({ id, oben = 84, neu, hilfe }) => {
    if (!window.Runde || !Runde.aktiv) return false;
    if (P._pruefen && P._zeile) { const b = P.knopf("Prüfen", () => P._pruefen(), "haupt"); b.style.marginLeft = "auto"; P._zeile.appendChild(b); }
    let nr = 0;
    Runde.verbinde({ id, oben,
      neueAufgabe(n, aus) { P.stop(); const aid = neu(n, aus || []); Runde.gestartet(aid != null ? aid : `${id}-${++nr}`); },
      hilfe(an) { S.classList.toggle("hilfen-aus", !an); if (hilfe) hilfe(an); } });
    return true;
  };
  P.fertig = ohneFehler => { if (window.Runde) Runde.fertig({ ohneFehler }); };
  P.hilfen = () => !S.classList.contains("hilfen-aus");

  // ---------------- Wortspeicher ----------------
  P.wortspeicher = woerter => {
    const bar = P.el("div", "wortspeicher hilfe"); bar.hidden = true;
    bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Wortspeicher");
    const fuellen = l => { bar.innerHTML = l.map(w => `<span class="wt">${P.w(w)}</span>`).join("");
      const zu = P.knopf("Zu", () => obj.umschalten(false), "klein zu"); bar.appendChild(zu); };
    const obj = {
      el: bar,
      umschalten(v) { bar.hidden = v === undefined ? !bar.hidden : !v; if (obj.knopf) obj.knopf.setAttribute("aria-expanded", !bar.hidden); },
      setze: fuellen,
    };
    fuellen(woerter); S.appendChild(bar);
    return obj;
  };

  // ---------------- Satzstreifen / Rückmeldung ----------------
  P.streifen = (box, cls) => { const s = P.el("div", "streifen" + (cls ? " " + cls : "")); s.setAttribute("aria-live", "polite"); box.appendChild(s); return s; };
  // text in Silbenschreibweise; Array = mehrere Sätze
  P.melde = (el, art, text) => {
    el.classList.remove("ok", "noch");
    if (art) el.classList.add(art);
    el.innerHTML = text ? (Array.isArray(text) ? text : [text]).map(t => `<span>${P.w(t)}</span>`).join("") : "";
  };

  // ---------------- Prüf-Marke ----------------
  P.marke = (el, art) => {
    let m = el.querySelector(":scope > .mk");
    el.classList.remove("ist-ok", "ist-noch");
    if (!art) { if (m) m.remove(); return; }
    if (!m) { m = P.el("span", "mk"); m.setAttribute("aria-hidden", "true"); el.appendChild(m); }
    m.className = "mk " + art; m.textContent = art === "ok" ? "✓" : "?";
    el.classList.add(art === "ok" ? "ist-ok" : "ist-noch");
    el.dataset.pruef = art === "ok" ? "richtig" : "noch nicht";
  };

  // ---------------- Ziehen und Antippen ----------------
  // Teile (z. B. Karten) liegen frei auf der Bühne (position:absolute, left/top in Bühnen-Pixeln).
  // o.ziele()            → Liste der Ziele {el, …}
  // o.lege(teil, ziel)   → Teil wurde auf ein Ziel gezogen/getippt (Seite legt es dort hin)
  // o.zurueck(teil)      → Teil fiel daneben oder auf die Ablage (Seite legt es zurück)
  // o.ablage             → Element der Ablage (Antippen/Ziehen dorthin = zurücklegen)
  // o.nah                → so viele Pixel darf die Kartenmitte neben dem Ziel liegen
  // o.passt(teil, ziel)  → optional: darf dieses Teil auf dieses Ziel?
  P.zieher = o => {
    const z = { gewaehlt: null, sperre: false };
    let zug = null, hover = null;
    const waehle = t => {
      if (z.gewaehlt) z.gewaehlt.el.classList.remove("gewaehlt");
      z.gewaehlt = t || null;
      if (t) t.el.classList.add("gewaehlt");
      S.classList.toggle("waehlt-aus", !!t);
      if (o.onWahl) o.onWahl(z.gewaehlt);
    };
    z.waehle = waehle;
    const finde = t => {
      const r = P.rect(t.el), cx = r.x + r.w / 2, cy = r.y + r.h / 2, n = o.nah || 0;
      let best = null, bd = 1e12;
      o.ziele().forEach(zi => {
        if (!zi.el.isConnected || zi.el.closest("[hidden]")) return;
        if (o.passt && !o.passt(t, zi)) return;
        const q = P.rect(zi.el);
        if (cx < q.x - n || cx > q.x + q.w + n || cy < q.y - n || cy > q.y + q.h + n) return;
        const d = (cx - q.x - q.w / 2) ** 2 + (cy - q.y - q.h / 2) ** 2;
        if (d < bd) { bd = d; best = zi; }
      });
      if (best) return best;
      const ab = typeof o.ablage === "function" ? o.ablage() : o.ablage;
      if (ab) { const q = P.rect(ab); if (cx >= q.x && cx <= q.x + q.w && cy >= q.y && cy <= q.y + q.h) return "ablage"; }
      return null;
    };
    const setzeHover = zi => { if (hover && hover !== zi) hover.el.classList.remove("hover"); hover = zi && zi !== "ablage" ? zi : null; if (hover) hover.el.classList.add("hover"); };
    z.ziehbar = t => {
      const el = t.el;
      el.classList.add("ziehbar"); el.tabIndex = 0; el.setAttribute("role", "button");
      el.addEventListener("pointerdown", e => {
        if (z.sperre || t.fest || zug || (e.pointerType === "mouse" && e.button !== 0)) return;
        e.preventDefault(); e.stopPropagation();
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        zug = { t, id: e.pointerId, x0: e.clientX, y0: e.clientY, l0: parseFloat(el.style.left) || 0, t0: parseFloat(el.style.top) || 0, los: false };
      });
      el.addEventListener("pointermove", e => {
        if (!zug || zug.t !== t || e.pointerId !== zug.id) return;
        const f = P.faktor(), dx = (e.clientX - zug.x0) / f, dy = (e.clientY - zug.y0) / f;
        if (!zug.los) {
          if (Math.hypot(dx, dy) < 10) return;
          zug.los = true; el.classList.add("drag"); waehle(null);
          if (o.onStart) o.onStart(t);
        }
        P.setze(el, zug.l0 + dx, zug.t0 + dy);
        setzeHover(finde(t));
      });
      const ende = (e, abbruch) => {
        if (!zug || zug.t !== t || e.pointerId !== zug.id) return;
        const war = zug; zug = null; setzeHover(null);
        if (!war.los) { if (!abbruch) waehle(z.gewaehlt === t ? null : t); return; }
        el.classList.remove("drag");
        const zi = abbruch ? null : finde(t);
        if (zi && zi !== "ablage") o.lege(t, zi); else o.zurueck(t);
      };
      el.addEventListener("pointerup", e => ende(e, false));
      el.addEventListener("pointercancel", e => ende(e, true));
      el.addEventListener("lostpointercapture", e => { if (zug && zug.t === t && e.pointerId === zug.id) ende(e, false); });
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!t.fest && !z.sperre) waehle(z.gewaehlt === t ? null : t); } });
    };
    const tippeZiel = zi => {
      if (zug || z.sperre || !z.gewaehlt) return;
      const t = z.gewaehlt; waehle(null);
      if (o.passt && !o.passt(t, zi)) { o.zurueck(t); return; }
      o.lege(t, zi);
    };
    z.zielbar = zi => {
      zi.el.classList.add("zielbar");
      if (!zi.el.hasAttribute("tabindex")) zi.el.tabIndex = 0;
      zi.el.addEventListener("pointerup", e => { if (e.pointerType === "mouse" && e.button !== 0) return; tippeZiel(zi); });
      zi.el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tippeZiel(zi); } });
    };
    z.ablageBar = el => {
      el.addEventListener("pointerup", () => { if (!zug && z.gewaehlt && !z.sperre) { const t = z.gewaehlt; waehle(null); o.zurueck(t); } });
    };
    if (o.ablage && typeof o.ablage !== "function") z.ablageBar(o.ablage);
    z.abbrechen = () => { if (zug) { zug.t.el.classList.remove("drag"); const t = zug.t; zug = null; setzeHover(null); o.zurueck(t); } waehle(null); };
    return z;
  };

  // ---------------- Überlagerungs-Tafel ----------------
  P.tafelauf = ({ x, y, w, h, schleier = true, cls }) => {
    const sch = schleier ? P.el("div", "schleier") : null;
    const t = P.el("div", "tafelauf" + (cls ? " " + cls : ""));
    t.style.left = x + "px"; t.style.top = y + "px"; t.style.width = w + "px"; if (h) t.style.height = h + "px";
    t.setAttribute("role", "dialog"); t.hidden = true; if (sch) sch.hidden = true;
    if (sch) S.appendChild(sch); S.appendChild(t);
    return {
      el: t,
      zeige() { t.hidden = false; if (sch) sch.hidden = false; const f = t.querySelector("button"); if (f) f.focus({ preventScroll: true }); },
      zu() { t.hidden = true; if (sch) sch.hidden = true; },
      get offen() { return !t.hidden; },
    };
  };

  // ---------------- Vorlesen (Sprachausgabe des Browsers, falls vorhanden) ----------------
  P.kannVorlesen = () => "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
  P.vorlesen = text => {
    if (!P.kannVorlesen()) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(P.ohne(text)); u.lang = "de-DE"; u.rate = .85;
      const st = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang));
      const v = st.find(v => v.localService) || st[0]; if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  };

  window.Pilz = P;
})();
