/* =====================================================================
   Briefe – gemeinsamer Code der Tafelbilder
   Bühne (1600 × 900, eingepasst), Ziehen und Einrasten (Pointer Events),
   Knöpfe in fester Reihenfolge (Wörter · Hilfe · Prüfen · Neu), Satzstreifen.
   ===================================================================== */
(function () {
  "use strict";
  const B = {};
  let S = null, fit = null;
  B.skala = 1;
  B.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  B.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  B.mischen = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  B.wahl = a => a[Math.floor(Math.random() * a.length)];
  B.bewegt = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  B.laden = (k, std) => { try { const v = localStorage.getItem(k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } };
  B.merken = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // Bühne einpassen
  B.buehne = () => {
    fit = document.getElementById("fit"); S = document.getElementById("stage"); B.S = S;
    const passe = () => { const r = fit.getBoundingClientRect(); B.skala = Math.min(r.width / 1600, r.height / 900);
      S.style.transform = `scale(${B.skala})`; S.style.left = (r.width - 1600 * B.skala) / 2 + "px"; S.style.top = (r.height - 900 * B.skala) / 2 + "px"; };
    addEventListener("resize", passe); passe();
    return S;
  };
  B.pos = el => ({ x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0 });
  B.setze = (el, x, y) => { el.style.left = x + "px"; el.style.top = y + "px"; };

  // Ziehen: start() → false bricht ab; bewege(x, y) während des Ziehens; ende(x, y, bewegt) beim Loslassen
  B.ziehbar = (el, { start, bewege, ende } = {}) => {
    el.classList.add("zieh");
    let zug = null;
    el.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (start && start() === false) return;
      e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (_) {}
      const sr = S.getBoundingClientRect(), p = B.pos(el);
      zug = { id: e.pointerId, ox: (e.clientX - sr.left) / B.skala - p.x, oy: (e.clientY - sr.top) / B.skala - p.y, x0: e.clientX, y0: e.clientY, los: false };
      el.classList.add("drag");
    });
    el.addEventListener("pointermove", e => {
      if (!zug || e.pointerId !== zug.id) return;
      if (!zug.los && Math.hypot(e.clientX - zug.x0, e.clientY - zug.y0) < 4) return;
      zug.los = true;
      const sr = S.getBoundingClientRect(), x = (e.clientX - sr.left) / B.skala - zug.ox, y = (e.clientY - sr.top) / B.skala - zug.oy;
      B.setze(el, x, y); if (bewege) bewege(x, y);
    });
    const fertig = e => { if (!zug || e.pointerId !== zug.id) return; const los = zug.los; zug = null; el.classList.remove("drag"); const p = B.pos(el); if (ende) ende(p.x, p.y, los); };
    el.addEventListener("pointerup", fertig); el.addEventListener("pointercancel", fertig);
  };

  B.knopf = (html, fn, cls) => { const b = B.el("button", "knopf" + (cls ? " " + cls : ""), html); b.type = "button"; if (fn) b.addEventListener("click", fn); return b; };
  B.schalter = (text, fn, an = false) => { const b = B.knopf(text); b.setAttribute("aria-pressed", an);
    b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); fn(v); }); b.setze = v => b.setAttribute("aria-pressed", !!v); return b; };

  // Knopfleiste oben rechts. woerter/hilfe: fn(an) oder null; hilfeKlick: eigener Ablauf (z. B. Hilfe in Stufen)
  B.knoepfe = ({ vorne = [], woerter, hilfe, hilfeKlick, pruefen, neu, neuText = "Neu" }) => {
    const c = B.el("div", "ctrl"), k = {};
    vorne.forEach(x => c.appendChild(x));
    if (woerter) c.appendChild(k.woerter = B.schalter("Wörter", woerter));
    if (hilfe) c.appendChild(k.hilfe = B.schalter("Hilfe", hilfe));
    if (hilfeKlick) c.appendChild(k.hilfe = B.knopf("Hilfe", hilfeKlick));
    if (pruefen) c.appendChild(k.pruefen = B.knopf("Prüfen", pruefen, "haupt"));
    if (neu) { c.appendChild(k.neu = B.knopf(neuText, neu)); k.neu.dataset.runde = "aus"; }
    S.appendChild(c); k.leiste = c; return k;
  };

  // Satzstreifen
  B.satzstreifen = (x, y, w, h = 100) => {
    const s = B.el("div", "satz", '<span class="lbl">Sprich</span><span class="text" aria-live="polite"></span>');
    B.setze(s, x, y); s.style.width = w + "px"; s.style.height = h + "px"; S.appendChild(s); B.satzEl = s; return s;
  };
  // html darf <em> für das gezogene Wort enthalten
  B.satz = (html, art) => { const t = B.satzEl.querySelector(".text"); t.className = "text"; t.innerHTML = html; B.satzEl.classList.toggle("hinweis", art === "hinweis"); };
  B.satzLeer = text => { const t = B.satzEl.querySelector(".text"); t.className = "text leer"; t.textContent = text; B.satzEl.classList.remove("hinweis"); };

  // Wortspeicher
  B.wortspeicher = (x, y, w, h, woerter, leit = []) => {
    const d = B.el("div", "woerter"); B.setze(d, x, y); d.style.width = w + "px"; d.style.height = h + "px";
    d.innerHTML = leit.map(t => `<span class="l">${B.esc(t)}</span>`).join("") + woerter.map(t => `<span>${B.esc(t)}</span>`).join("");
    S.appendChild(d); return d;
  };

  // Haken/Kreuz an einem Element (braucht ein Kind .mark)
  B.markiere = (el, ok) => { el.classList.toggle("ok", ok === true); el.classList.toggle("bad", ok === false); const m = el.querySelector(":scope>.mark"); if (m) m.textContent = ok ? "✓" : ok === false ? "✗" : ""; };

  // Rückfrage in der Seite (kein confirm)
  B.frage = (text, jaText, fn) => {
    const f = B.el("div", "frage", `<div class="box"><p>${B.esc(text)}</p><div class="zeile"></div></div>`);
    f.setAttribute("role", "dialog"); f.setAttribute("aria-label", text);
    const ja = B.knopf(jaText, () => { f.remove(); fn(); }, "haupt"), nein = B.knopf("Abbrechen", () => f.remove());
    f.querySelector(".zeile").append(ja, nein); S.appendChild(f); nein.focus();
  };

  window.Brief = B;
})();
