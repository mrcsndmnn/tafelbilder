/* =====================================================================
   Vertretungsspiele – gemeinsame Bausteine
   Kopfleiste (Ablauf, Punkte, Ruhesignal, Klang, Vollbild), Fußleiste,
   Satzstreifen, Bildkarte, Namensrad, Rückmeldung, Vorlesen, Zufall.
   Liegt in vertretung/gemeinsam/ und wird von allen Teilen des Vertretungsbaukastens genutzt.
   Benötigt: ../../../gemeinsam/silben.js, inhalte.js, bilder.js
   Pfade in V.SPIELE gelten ab vertretung/ (Startseite mit Cockpit).
   ===================================================================== */
(function () {
  "use strict";
  const V = {}, I = window.INHALTE, B = window.SPIELBILDER;
  let S = null;

  // ---------------- Spiele (für Ablaufleiste und Startseite) ----------------
  V.SPIELE = {
    hallo: { titel: "Hallo!", pfad: "spiele/hallo/", bild: "winken" },
    versteckt: { titel: "Was versteckt sich da?", pfad: "spiele/versteckt/", bild: "raster", art: "ganze Klasse" },
    "was-fehlt": { titel: "Was fehlt?", pfad: "spiele/was-fehlt/", bild: "eule_schlaeft", art: "ganze Klasse" },
    reime: { titel: "Reimt sich das?", pfad: "spiele/reime/", bild: "maus", art: "ganze Klasse" },
    silben: { titel: "Silben-Sortierer", pfad: "spiele/silben/", bild: "klatschen", art: "ganze Klasse" },
    gluecksrad: { titel: "Glücksrad mit Aufträgen", pfad: "spiele/gluecksrad/", bild: "rad", art: "Drankommen" },
    "wer-bin-ich": { titel: "Wer bin ich?", pfad: "spiele/wer-bin-ich/", bild: "vorhang", art: "Drankommen" },
    wimmelbild: { titel: "Wimmelbild", pfad: "spiele/wimmelbild/", bild: "lupe", art: "Drankommen" },
    "klasse-gegen-lehrkraft": { titel: "Klasse gegen Lehrkraft", pfad: "spiele/klasse-gegen-lehrkraft/", bild: "stern", art: "Rahmenspiel" },
    tschuess: { titel: "Tschüss!", pfad: "spiele/tschuess/", bild: "daumen_hoch" },
    // Vertretungsbaukasten (Paket 1 und 2)
    cockpit: { titel: "Cockpit", pfad: "cockpit/", bild: "winken" },
    bildergeschichte: { titel: "Bildergeschichte ordnen", pfad: "deutsch/bildergeschichte/", bild: "geschichte", art: "Deutsch", fach: "deutsch", nr: "D1", gen: "bildergeschichte", niveau: "★–★★★" },
    blitzlesen: { titel: "Blitzlesen", pfad: "deutsch/blitzlesen/", bild: "blitz", art: "Deutsch", fach: "deutsch", nr: "D5", gen: "lesen-schreiben", niveau: "★–★★★" },
    "rechen-bingo": { titel: "Rechen-Bingo", pfad: "mathe/rechen-bingo/", bild: "bingo", art: "Mathe", fach: "mathe", nr: "M3", gen: "bingo", niveau: "★–★★★" },
    "einmaleins-rakete": { titel: "Einmaleins-Rakete", pfad: "mathe/einmaleins-rakete/", bild: "rakete", art: "Mathe", fach: "mathe", nr: "M4", gen: "rechnen", niveau: "★★–★★★" },
    "uhr-werkstatt": { titel: "Uhr-Werkstatt", pfad: "mathe/uhr-werkstatt/", bild: "uhr", art: "Mathe", fach: "mathe", nr: "M9", gen: "uhrzeit", niveau: "★–★★★" },
    "wer-wohnt-wo": { titel: "Wer wohnt wo?", pfad: "su/wer-wohnt-wo/", bild: "wald", art: "Sachunterricht", fach: "su", nr: "S1", niveau: "★–★★★" },
  };
  // Generatoren (Druckvorlagen), Pfade ab vertretung/
  V.GENERATOREN = {
    stundenkarte: { titel: "Stundenkarte", nr: "G-V1", bild: "geschichte", text: "Ablauf der Stunde auf einer Seite, mit Adressen und Kopierliste." },
    rueckmeldung: { titel: "Rückmeldezettel", nr: "G-V2", bild: "sprechblase", text: "Kurze Rückmeldung für die Klassenlehrkraft (ohne Kindernamen)." },
    bingo: { titel: "Bingo-Karten", nr: "G-Bingo", bild: "bingo", text: "Klassensatz: jede Karte anders. Anlaute, Wörter oder Ergebnisse." },
    bildergeschichte: { titel: "Bildergeschichte", nr: "G-D1", bild: "geschichte", text: "Bilder zum Ausschneiden, Felder zum Aufkleben, Schreibzeilen." },
    "lesen-schreiben": { titel: "Lese- und Schreibblätter", nr: "G-D4/D5", bild: "buch", text: "Bild + Wort mit Silbenbögen, Lesepyramide, Lesekarten." },
    rechnen: { titel: "Rechenblätter", nr: "G-M3/M4", bild: "stift", text: "Päckchen, Rechenmauern, Zahlenhäuser, Einmaleins, Umkehraufgaben." },
    uhrzeit: { titel: "Uhrzeit-Blätter", nr: "G-M9", bild: "uhr", text: "Uhren ablesen, Zeiger einzeichnen, Zeitspannen." },
  };
  // Niveau für die ganze Stunde (Startseite), gilt als Vorgabe in allen Tafelbildern
  V.NIVEAU = { 1: "★ SEP 1–2", 2: "★★ SEP 3 / Klasse 3 Anfang", 3: "★★★ Klasse 3–4" };

  // ---------------- Hilfsfunktionen ----------------
  V.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  V.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  V.zufall = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  V.mische = l => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const letzte = {};
  // zufällig ziehen, aber nie zweimal hintereinander dasselbe
  V.ziehe = (liste, schluessel = "") => {
    if (!liste.length) return undefined;
    const kandidaten = liste.length > 1 ? liste.filter(x => JSON.stringify(x) !== letzte[schluessel]) : liste;
    const w = kandidaten[Math.floor(Math.random() * kandidaten.length)]; letzte[schluessel] = JSON.stringify(w); return w;
  };
  // Speicher: Sitzung (Namen, Ablauf, Punkte) und dauerhaft (nur Bequemlichkeiten)
  V.sitzung = { hol: (k, std) => { try { const v = sessionStorage.getItem("vs-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } },
    setz: (k, v) => { try { sessionStorage.setItem("vs-" + k, JSON.stringify(v)); } catch (e) {} } };
  V.laden = (k, std) => { try { const v = localStorage.getItem("vs-" + k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  V.merken = (k, v) => { try { localStorage.setItem("vs-" + k, JSON.stringify(v)); } catch (e) {} };

  // Animationen abbrechen beim Verlassen; reduzierte Bewegung beachten
  V.bewegt = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const timer = new Set();
  V.nach = (ms, fn) => { const id = setTimeout(() => { timer.delete(id); fn(); }, ms); timer.add(id); return id; };
  V.stop = () => { timer.forEach(clearTimeout); timer.clear(); try { speechSynthesis.cancel(); } catch (e) {} };
  addEventListener("pagehide", V.stop);

  // ---------------- Silbenschrift und Bilder ----------------
  V.ohne = t => String(t).replace(/(\S)-(?=\S)/g, "$1");
  V.w = t => `<span class="sw"><span class="vh">${V.ohne(t)}</span><span aria-hidden="true">${silben(t)}</span></span>`;
  V.bild = (id, label) => `<svg viewBox="0 0 200 200" ${label ? `role="img" aria-label="${V.esc(label)}"` : 'aria-hidden="true"'}>${B[id] ? B[id]() : B.fragezeichen()}</svg>`;
  V.wort = id => { const w = I.WOERTER[id]; return w ? { art: w[0], silben: w[1], ganz: w[0] + " " + V.ohne(w[1]) } : { art: "", silben: id, ganz: id }; };
  V.wortHTML = (id, mitArtikel = true) => { const w = V.wort(id); return (mitArtikel ? `<span class="art ${w.art}">${w.art}</span>` : "") + V.w(w.silben); };
  // Bildkarte: Bild + (optional) Wort mit Artikelfarbe
  V.karte = (id, { wort = true } = {}) => { const w = V.wort(id);
    return `<div class="bk ${wort ? w.art : ""}"><div class="bild">${V.bild(id, w.ganz)}</div>${wort ? `<div class="wort">${V.wortHTML(id)}</div>` : ""}</div>`; };
  V.woerter = thema => Object.keys(I.WOERTER).filter(k => thema === "alle" ? I.WOERTER[k][2] !== "extra" : I.WOERTER[k][2] === thema);
  V.silbenzahl = id => V.wort(id).silben.split("-").length;

  // ---------------- Vorlesen ----------------
  let stimme = null;
  const suche = () => { try { const st = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang)); stimme = st.find(v => v.localService) || st[0] || null; } catch (e) { stimme = null; }
    document.querySelectorAll(".sprich").forEach(b => b.hidden = !stimme); };
  if ("speechSynthesis" in window) { suche(); try { speechSynthesis.addEventListener("voiceschanged", suche); } catch (e) {} }
  V.kannSprechen = () => !!stimme;
  // Automatisches Vorlesen nur, wenn „Ton“ an ist. Der Lautsprecher-Knopf am Satzstreifen liest immer vor (V.vorlesen).
  V.sprich = (text, tempo = .85) => { if (V.klangAn()) V.vorlesen(text, tempo); };
  V.vorlesen = (text, tempo = .85) => {
    if (!stimme) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(V.ohne(String(text).replace(/…/g, ""))); u.lang = "de-DE"; u.rate = tempo; u.voice = stimme; speechSynthesis.speak(u); } catch (e) {}
  };
  V.sprichKnopf = (textFn, cls) => { const b = V.knopf(V.bild("laut"), () => V.vorlesen(textFn()), "sym sprich" + (cls ? " " + cls : "")); b.setAttribute("aria-label", "Vorlesen"); b.hidden = !stimme; return b; };

  // ---------------- Klang (standardmäßig aus, nie Fehlertöne) ----------------
  let ctx = null;
  // Ton (Klänge + automatisches Vorlesen): gilt nur für diese Sitzung, jeder neue Tab startet stumm.
  // Eigener Name „ton“, damit eine alte Einstellung „klang“ aus früheren Versionen nicht mehr wirkt.
  V.klangAn = () => V.sitzung.hol("ton", false) === true;
  V.setzeTon = an => { V.sitzung.setz("ton", !!an); if (!an) { try { speechSynthesis.cancel(); } catch (e) {} } };
  try { localStorage.removeItem("vs-klang"); } catch (e) {}
  V.klang = art => {
    if (!V.klangAn()) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const toene = art === "gong" ? [[392, 0, 1.6], [523, .02, 1.6]] : art === "fertig" ? [[523, 0, .3], [659, .15, .3], [784, .3, .6]] : [[660, 0, .25], [880, .12, .35]];
      toene.forEach(([f, start, dauer]) => {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0, ctx.currentTime + start); g.gain.linearRampToValueAtTime(.18, ctx.currentTime + start + .02);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + start + dauer);
        o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dauer + .05);
      });
    } catch (e) {}
  };

  // ---------------- Bühne ----------------
  V.buehne = () => {
    const fit = document.getElementById("fit"); S = document.getElementById("stage");
    const resize = () => { const r = fit.getBoundingClientRect(), f = Math.min(r.width / 1600, r.height / 900);
      S.style.transform = `scale(${f})`; S.style.left = (r.width - 1600 * f) / 2 + "px"; S.style.top = (r.height - 900 * f) / 2 + "px"; };
    addEventListener("resize", resize); resize();
    S.classList.add("silben"); V.S = S;
    // Wörter auf Karten verkleinern, bis sie hineinpassen
    let geplant = false;
    const passe = () => { geplant = false; S.querySelectorAll(".bk .wort, .passe").forEach(w => {
      const box = w.parentElement; if (!box || !w.offsetParent) return;
      const max = box.clientWidth - 16; if (!w.dataset.gr) w.dataset.gr = parseFloat(getComputedStyle(w).fontSize);
      let f = +w.dataset.gr; w.style.fontSize = f + "px"; while (w.scrollWidth > max && f > 14) { f -= 1; w.style.fontSize = f + "px"; } }); };
    new MutationObserver(() => { if (!geplant) { geplant = true; requestAnimationFrame(passe); } }).observe(S, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
    return S;
  };
  V.faktor = () => S.getBoundingClientRect().width / 1600;
  V.rect = el => { const r = el.getBoundingClientRect(), s = S.getBoundingClientRect(), f = s.width / 1600; return { x: (r.left - s.left) / f, y: (r.top - s.top) / f, w: r.width / f, h: r.height / f }; };
  V.blk = (x, y, w, h, cls) => { const d = V.el("div", "blk" + (cls ? " " + cls : "")); d.style.left = x + "px"; d.style.top = y + "px"; if (w) d.style.width = w + "px"; if (h) d.style.height = h + "px"; S.appendChild(d); return d; };
  V.setze = (el, x, y) => { el.style.left = x + "px"; el.style.top = y + "px"; };

  // ---------------- Knöpfe ----------------
  V.knopf = (html, onClick, cls) => { const b = V.el("button", "knopf" + (cls ? " " + cls : ""), html); b.type = "button"; if (onClick) b.addEventListener("click", onClick); return b; };
  V.schalter = (text, an, onChange) => {
    const b = V.knopf(`<span class="box" aria-hidden="true"></span>${text}`); b.setAttribute("aria-pressed", !!an);
    b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); onChange(v); });
    b.setze = v => b.setAttribute("aria-pressed", !!v); return b;
  };
  V.gruppe = (label, optionen, aktiv, onChange, key) => {
    if (key) aktiv = V.laden(key, aktiv);
    if (!optionen.some(o => o.wert === aktiv)) aktiv = optionen[0].wert;
    const g = V.el("div", "gruppe"); g.setAttribute("role", "group"); if (label) { g.appendChild(V.el("span", "glabel", label)); g.setAttribute("aria-label", label); }
    const kn = optionen.map(o => { const b = V.knopf(o.text); if (o.aria) b.setAttribute("aria-label", o.aria); b.setAttribute("aria-pressed", o.wert === aktiv);
      b.addEventListener("click", () => { if (g.wert === o.wert) return; setze(o.wert); onChange(o.wert); }); g.appendChild(b); return b; });
    const setze = w => { kn.forEach((b, i) => b.setAttribute("aria-pressed", optionen[i].wert === w)); g.wert = w; if (key) V.merken(key, w); };
    g.wert = aktiv; g.setze = setze; return g;
  };

  // ---------------- Niveau ★ / ★★ / ★★★ ----------------
  V.niveau = () => { const n = V.sitzung.hol("niveau", 2); return [1, 2, 3].includes(n) ? n : 2; };
  V.setzeNiveau = n => V.sitzung.setz("niveau", n);
  V.niveauWahl = onChange => {
    const g = V.gruppe("Niveau", [1, 2, 3].map(i => ({ wert: i, text: "★".repeat(i), aria: "Niveau " + V.NIVEAU[i] })), V.niveau(), v => { V.setzeNiveau(v); onChange(v); });
    g.classList.add("niveau"); g.querySelectorAll(".knopf").forEach((b, i) => { b.title = V.NIVEAU[i + 1]; });
    return g;
  };

  // ---------------- Punkte „Klasse gegen Lehrkraft“ ----------------
  V.punkte = () => V.sitzung.hol("punkte", { k: 0, l: 0 });
  V.punkt = (wer, d = 1) => { const p = V.punkte(); p[wer] = Math.max(0, p[wer] + d); V.sitzung.setz("punkte", p); document.dispatchEvent(new CustomEvent("punkte", { detail: p })); return p; };
  function punkteAnzeige() {
    const box = V.el("div", "punkte");
    const k = V.knopf("", () => { V.punkt("k"); blink(k); }), l = V.knopf("", () => { V.punkt("l"); blink(l); });
    k.title = "Stern für die Klasse (+1)"; l.title = "Punkt für die Lehrkraft (+1)";
    const blink = b => { b.classList.remove("plus"); void b.offsetWidth; b.classList.add("plus"); };
    const zeig = () => { const p = V.punkte(); k.innerHTML = V.bild("stern") + p.k; l.innerHTML = V.bild("eule") + p.l;
      k.setAttribute("aria-label", `Klasse: ${p.k} Sterne. Antippen für einen Stern mehr.`); l.setAttribute("aria-label", `Lehrkraft: ${p.l} Punkte. Antippen für einen Punkt mehr.`); };
    document.addEventListener("punkte", zeig); zeig(); box.append(k, l); return box;
  }

  // ---------------- Ablaufleiste ----------------
  V.ablauf = () => V.sitzung.hol("ablauf", []);
  function ablaufLeiste(id, wurzel) {
    const liste = V.ablauf(), box = V.el("nav", "ablauf"); box.setAttribute("aria-label", "Ablauf der Stunde");
    if (!liste.length) return box;
    const pos = liste.indexOf(id), erledigt = new Set(V.sitzung.hol("erledigt", []));
    if (pos > 0) { liste.slice(0, pos).forEach(x => erledigt.add(x)); V.sitzung.setz("erledigt", [...erledigt]); }
    liste.forEach((x, i) => {
      const sp = V.SPIELE[x]; if (!sp) return;
      const a = V.el("a", (i === pos ? "jetzt" : "") + (erledigt.has(x) && i !== pos ? " erledigt" : ""), V.bild(sp.bild));
      a.href = wurzel + sp.pfad; a.title = (i + 1) + ". " + sp.titel; a.setAttribute("aria-label", `${i + 1}. ${sp.titel}${erledigt.has(x) ? " (erledigt)" : ""}`);
      if (i === pos) a.setAttribute("aria-current", "page");
      box.appendChild(a);
    });
    return box;
  }

  // ---------------- Ruhesignal ----------------
  V.ruhe = () => {
    const sch = V.el("div", "schicht ruhe", `<div class="inhalt"><div class="bilder">${V.bild("hand")}${V.bild("ohr")}</div>
      <div class="text">${V.w("Hand hoch – Oh-ren auf!")}</div><div class="klein">Antippen schließt das Signal.</div></div>`);
    sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Ruhesignal"); sch.tabIndex = 0;
    const zu = () => sch.remove();
    sch.addEventListener("click", zu); sch.addEventListener("keydown", e => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") zu(); });
    S.appendChild(sch); sch.focus(); V.klang("gong");
  };

  // ---------------- Rückmeldung ----------------
  V.lob = (text) => meld(text || V.ziehe(I.LOB, "lob"), "", "richtig");
  V.noch = (text) => meld(text || V.ziehe(I.NOCH, "noch"), "noch");
  function meld(text, art, klang) {
    S.querySelectorAll(".meldung").forEach(m => m.remove());
    const m = V.el("div", "meldung" + (art ? " " + art : ""), V.w(text)); m.setAttribute("role", "status"); S.appendChild(m);
    if (klang) V.klang(klang);
    setTimeout(() => m.remove(), 1900);
  }
  V.leuchte = el => { el.classList.remove("leuchten"); void el.offsetWidth; el.classList.add("leuchten"); };

  // ---------------- Endstand feiern (Klasse gegen Lehrkraft) ----------------
  V.feier = () => {
    const p = V.punkte(), sch = V.el("div", "schicht"), t = V.el("div", "tafel ende");
    const text = p.k > p.l ? "Die Klas-se hat ge-won-nen!" : p.k === p.l ? "Un-ent-schie-den – nächs-tes Mal schafft ihr es!" : "Fast ge-schafft! Nächs-tes Mal ge-winnt ihr!";
    t.innerHTML = `<div class="gross">${V.w(text)}</div><div class="stand">${V.bild("stern")}${p.k}<span>:</span>${p.l}${V.bild("eule")}</div>`;
    t.appendChild(V.knopf("Schließen", () => sch.remove(), "haupt")); sch.appendChild(t); S.appendChild(sch);
    if (p.k > p.l && V.bewegt) for (let i = 0; i < 70; i++) {
      const c = V.el("div", "konfetti"); c.style.left = Math.random() * 1600 + "px"; c.style.background = ["#f7c52b", "#5cb85c", "#4f86d6", "#e86a9a", "#9b6cd6"][i % 5];
      c.style.animationDelay = Math.random() * .8 + "s"; S.appendChild(c); setTimeout(() => c.remove(), 3600);
    }
    V.klang("fertig");
  };

  // ---------------- Namensrad ----------------
  V.namen = () => V.sitzung.hol("namen", []);
  // Liefert ein Versprechen mit dem gezogenen Namen (oder null beim Schließen ohne Ziehen)
  V.namensrad = ({ titel = "Wer ist dran?", sofort = true } = {}) => new Promise(fertig => {
    const echte = V.namen(), namen = echte.length ? echte : Array.from({ length: 10 }, (_, i) => String(i + 1));
    const schluessel = echte.length ? "gezogen" : "gezogen-zahlen";
    let gezogen = V.sitzung.hol(schluessel, []).filter(n => namen.includes(n));
    const sch = V.el("div", "schicht"); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", titel);
    const t = V.el("div", "tafel namensrad"); sch.appendChild(t); S.appendChild(sch);
    const n = namen.length, R = 280, cx = 300, cy = 320, FARBEN = ["#dbe9fb", "#e2f3e0", "#fdf0c9", "#f4e3fb", "#f7d8e3", "#d8ecf7"];
    let winkel = 0, ergebnis = null, laeuft = false;
    const pt = (a, r) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
    const radHTML = () => {
      let g = "";
      namen.forEach((nm, i) => {
        const a1 = i * 2 * Math.PI / n, a2 = (i + 1) * 2 * Math.PI / n, [x1, y1] = pt(a1, R), [x2, y2] = pt(a2, R), weg = gezogen.includes(nm);
        g += n > 1 ? `<path d="M${cx} ${cy} L${x1} ${y1} A${R} ${R} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z" fill="${weg ? "#e3e7e4" : FARBEN[i % FARBEN.length]}" stroke="#1d2320" stroke-width="4"/>`
          : `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${FARBEN[0]}" stroke="#1d2320" stroke-width="4"/>`;
        const am = (a1 + a2) / 2, [tx, ty] = pt(am, R * .6), roh = am * 180 / Math.PI - 90, deg = roh > 90 ? roh - 180 : roh, fs = Math.max(16, Math.min(34, 520 / Math.max(n, 8)));
        g += `<text x="${tx}" y="${ty}" transform="rotate(${deg} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-family="Andika,'Comic Sans MS',sans-serif" font-weight="700"
          font-size="${fs}" fill="${weg ? "#9aa39e" : "#1d2320"}">${V.esc(nm.length > 12 ? nm.slice(0, 11) + "…" : nm)}</text>`;
      });
      return `<svg viewBox="0 0 600 620" aria-hidden="true"><g class="nr-dreh" style="transform:rotate(${winkel}deg)">${g}</g>
        <circle cx="${cx}" cy="${cy}" r="30" fill="#fff" stroke="#1d2320" stroke-width="5"/><path d="M${cx - 26} 4 L${cx + 26} 4 L${cx} 56 Z" fill="#5e2f91" stroke="#1d2320" stroke-width="4" stroke-linejoin="round"/></svg>`;
    };
    t.innerHTML = `<div class="nr-rad"></div><div class="nr-rechts"><div style="font-size:30px;font-weight:700">${V.w(titel)}</div>
      <div class="nr-name" aria-live="polite"></div><div class="nr-joker" hidden>${V.bild("sprechblase")}<span>${V.w("Frag ein an-de-res Kind. Es hilft dir.")}</span></div>
      <div class="nr-zeile"></div><div class="nr-info"></div></div>`;
    const rad = t.querySelector(".nr-rad"), name = t.querySelector(".nr-name"), joker = t.querySelector(".nr-joker"), info = t.querySelector(".nr-info");
    const zeichne = () => { rad.innerHTML = radHTML(); info.textContent = echte.length ? `Schon dran: ${gezogen.length} von ${n}. Wer dran war, ist grau.` : "Ohne Namen: Zahlen 1 bis 10. Namen gibt es auf der Startseite."; };
    const drehen = () => {
      if (laeuft) return;
      let frei = namen.filter(x => !gezogen.includes(x)); if (!frei.length) { gezogen = []; frei = [...namen]; }
      const wahl = V.ziehe(frei, "rad"), i = namen.indexOf(wahl);
      laeuft = true; joker.hidden = true; name.textContent = ""; drehKnopf.disabled = true;
      const mitte = (i + .5) * 360 / n + (Math.random() - .5) * (300 / n);
      winkel = winkel - (winkel % 360) + 360 * 4 + (360 - mitte);
      const d = rad.querySelector(".nr-dreh"); if (!V.bewegt) d.style.transition = "none"; d.style.transform = `rotate(${winkel}deg)`;
      V.nach(V.bewegt ? 2700 : 50, () => {
        laeuft = false; ergebnis = wahl; gezogen.push(wahl); V.sitzung.setz(schluessel, gezogen);
        name.textContent = wahl; zeichne(); V.klang("richtig"); drehKnopf.disabled = false; drehKnopf.textContent = "Noch mal drehen"; fertigKnopf.disabled = false;
      });
    };
    const drehKnopf = V.knopf("Drehen", drehen, "haupt");
    const jokerKnopf = V.knopf("Joker: Freund fragen", () => { joker.hidden = !joker.hidden; });
    const fertigKnopf = V.knopf("Weiter", () => { sch.remove(); fertig(ergebnis); });
    const zuKnopf = V.knopf("Schließen", () => { sch.remove(); fertig(ergebnis); });
    t.querySelector(".nr-zeile").append(drehKnopf, jokerKnopf, fertigKnopf, zuKnopf); fertigKnopf.disabled = true;
    zeichne(); drehKnopf.focus();
    if (sofort) drehen();
  });

  // ---------------- Kopf- und Fußleiste ----------------
  // id, titel, onWeiter, onNeu, onHilfe(an), extra: Elemente für die Fußleiste, satz: Satzmuster
  V.rahmen = ({ id, titel, onWeiter, onNeu, onHilfe, extra = [], satz = "", ohneSatz = false, ohneHilfe = false, wurzel = "../../" }) => {
    const sp = V.SPIELE[id] || {};
    const k = V.el("div", "kopf");
    const start = V.el("a", "knopf", '<span aria-hidden="true">←</span> Start'); start.href = wurzel; k.appendChild(start);
    if (window.Hinweise && window.HINWEISE) {
      const H = window.HINWEISE;
      k.appendChild(window.Hinweise.knopf({ titel: H.titel || titel, teile: H.teile.concat([{ h: "Leisten oben und unten", punkte: [
        "**Start** führt zur Startseite des Vertretungsbaukastens mit Namen, Ablauf-Planer und Cockpit.",
        "Die kleinen Bilder oben zeigen den **Ablauf** der Stunde. Antippen wechselt zum Spiel, erledigte Spiele haben einen Haken.",
        "**Stern / Eule**: Punktestand „Klasse gegen Lehrkraft“. Antippen gibt einen Punkt. Korrigieren und Zurücksetzen auf der Seite „Klasse gegen Lehrkraft“.",
        "**Hand**: Ruhesignal „Hand hoch – Ohren auf!“ (bildschirmfüllend, Antippen schließt).",
        "**Lautsprecher-Knopf oben**: Ton an oder aus – gilt für die Klänge (sanfter Ton bei richtig, nie Fehlertöne) und für das automatische Vorlesen. In jedem neuen Tab ist der Ton zuerst aus (durchgestrichener Lautsprecher). **Vollbild** für das Smartboard.",
        "Unten: **Satzmuster** und **Hilfe** ein- oder ausblenden, **Weiter** zur nächsten Runde, **Neu starten** beginnt das Spiel von vorn.",
        "Der Lautsprecher-Knopf **am Satzstreifen** liest den Satz einmal vor – auch wenn der Ton oben aus ist (nur wenn das Gerät eine deutsche Stimme hat)." ] }]) }, "knopf sym"));
    }
    k.appendChild(V.el("div", "titel", (sp.bild ? V.bild(sp.bild) : "") + `<span>${V.esc(titel)}</span>`));
    k.appendChild(ablaufLeiste(id, wurzel));
    k.appendChild(V.el("div", "platz"));
    k.appendChild(punkteAnzeige());
    const ruhe = V.knopf(V.bild("hand"), () => V.ruhe(), "sym"); ruhe.setAttribute("aria-label", "Ruhesignal"); ruhe.title = "Ruhesignal";
    const klang = V.knopf(V.bild("laut"), null, "sym"); klang.setAttribute("aria-label", "Klang"); klang.title = "Klang an oder aus";
    // Ton an/aus: Klänge und automatisches Vorlesen. Aus = durchgestrichener Lautsprecher.
    const AUS = '<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M30 76 H64 L108 40 V160 L64 124 H30 Z" fill="#cfd6d1" stroke="#1d2320" stroke-width="6" stroke-linejoin="round"/><path d="M128 70 L180 130 M180 70 L128 130" stroke="#d9822b" stroke-width="12" stroke-linecap="round"/></svg>';
    const setzeKlang = () => { const an = V.klangAn(); klang.setAttribute("aria-pressed", an); klang.innerHTML = an ? V.bild("laut") : AUS;
      klang.setAttribute("aria-label", an ? "Ton ist an – antippen zum Ausschalten" : "Ton ist aus – antippen zum Einschalten"); klang.title = an ? "Ton an (antippen: aus)" : "Ton aus (antippen: an)"; };
    klang.addEventListener("click", () => { const an = !V.klangAn(); V.setzeTon(an); setzeKlang(); if (an) V.klang("richtig"); }); setzeKlang();
    if (!V.klangAn()) { try { speechSynthesis.cancel(); } catch (e) {} }
    const voll = V.knopf('<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 15 V6 H15 M25 6 H34 V15 M34 25 V34 H25 M15 34 H6 V25" fill="none" stroke="#1d2320" stroke-width="4" stroke-linecap="round"/></svg>',
      () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) {} }, "sym");
    voll.setAttribute("aria-label", "Vollbild"); voll.title = "Vollbild";
    k.append(ruhe, klang, voll);
    S.appendChild(k);

    // Satzstreifen
    const streifen = V.el("div", "satzstreifen"), text = V.el("div", "text"); text.setAttribute("aria-live", "polite");
    streifen.append(text, V.sprichKnopf(() => streifen.dataset.text || ""));
    if (!ohneSatz) S.appendChild(streifen);
    const satzAn = V.laden("satz", true); streifen.classList.toggle("aus", !satzAn);

    // Fußleiste
    const f = V.el("div", "fuss");
    if (!ohneSatz) f.appendChild(V.schalter("Satzmuster", satzAn, v => { streifen.classList.toggle("aus", !v); V.merken("satz", v); }));
    const hilfe = V.schalter("Hilfe", false, v => { obj.hilfe = v; if (onHilfe) onHilfe(v); });
    if (!ohneHilfe) f.appendChild(hilfe);
    extra.forEach(x => f.appendChild(x));
    f.appendChild(V.el("div", "platz"));
    if (onWeiter) f.appendChild(V.knopf("Weiter", () => { V.stop(); onWeiter(); }, "haupt"));
    if (onNeu) f.appendChild(V.knopf("Neu starten", () => { V.stop(); onNeu(); }));
    S.appendChild(f);
    const obj = {
      hilfe: false,
      setzeHilfe(v) { hilfe.setze(v); obj.hilfe = v; },
      // Satzmuster: "…" wird zur Lücke (optional mit Bild); text in Silbenschreibweise
      // eigenes HTML im Satzstreifen (z. B. hervorgehobene Präposition); vorlese = Text für den Lautsprecher
      satzHTML(html, vorlese) { streifen.dataset.text = vorlese || ""; text.innerHTML = html; },
      satz(t, bildId) {
        streifen.dataset.text = t ? t.replace(/…/g, bildId ? V.wort(bildId).ganz : "") : "";
        text.innerHTML = t ? t.split("…").map(teil => teil.trim() ? V.w(teil.trim()) : "").join(`<span class="luecke">${bildId ? V.bild(bildId) : ""}</span>`) : "";
      },
    };
    obj.satz(satz);
    return obj;
  };

  window.Spiele = V;
})();
