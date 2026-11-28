/* =====================================================================
   Lehrkraftmenü – gemeinsamer Baustein für alle Tafelbilder (siehe GESTALTUNG.md)
   Lehrkraftmenue.baue({ buehne, titel, beschreibung, aufgabe: [el], hilfen: [el],
                         steuerung: { neu, loesung, zuruecksetzen }, hinweise: { teile }, start: "../" })
   liefert { aufgabe(...el), hilfe(...el), steuer(text, fn), oeffnen(), schliessen(), zahnrad, schublade }.
   Geschlossen nur ein Zahnrad oben rechts. Die Schublade schließt über Zahnrad, × oder Esc –
   nicht durch Antippen der Bühne. In der Übungsrunde ist alles ausgeblendet (data-runde="aus").
   ===================================================================== */
(function () {
  "use strict";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const ZAHNRAD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>';

  function baue({ buehne, titel = "", beschreibung = "", aufgabe = [], hilfen = [], steuerung = {}, hinweise = null, start = "../", startText = "Zur Startseite" }) {
    const S = buehne || document.getElementById("stage");
    const rad = el("button", "lkm-zahnrad", ZAHNRAD); rad.type = "button";
    rad.setAttribute("aria-label", "Lehrkraftmenü"); rad.title = "Lehrkraftmenü"; rad.setAttribute("aria-expanded", "false");
    const sch = el("div", "lkm-schublade"); sch.id = "lkm-" + Math.random().toString(36).slice(2, 8);
    sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Lehrkraftmenü"); rad.setAttribute("aria-controls", sch.id);
    rad.dataset.runde = "aus"; sch.dataset.runde = "aus";
    const innen = el("div", "lkm-innen"); sch.appendChild(innen);
    innen.appendChild(el("div", "lkm-kopf", `<h2>${esc(titel)}</h2>`));
    const zu = el("button", "lkm-zu", "×"); zu.type = "button"; zu.setAttribute("aria-label", "Menü schließen"); sch.appendChild(zu);
    if (beschreibung) innen.appendChild(el("p", "lkm-besch", esc(beschreibung)));
    const bereich = name => { const b = el("section", "lkm-bereich", `<h3>${esc(name)}</h3>`); const l = el("div", "lkm-liste"); b.appendChild(l); innen.appendChild(b); b.liste = l; return b; };
    const bA = bereich("Aufgabe"), bH = bereich("Hilfen"), bS = bereich("Steuerung");
    const fuss = el("div", "lkm-fuss"); innen.appendChild(fuss);
    const sichtbar = () => [bA, bH, bS].forEach(b => b.hidden = !b.liste.children.length);
    const obj = {
      zahnrad: rad, schublade: sch,
      aufgabe(...e) { e.filter(Boolean).forEach(x => bA.liste.appendChild(x)); sichtbar(); return obj; },
      hilfe(...e) { e.filter(Boolean).forEach(x => bH.liste.appendChild(x)); sichtbar(); return obj; },
      steuer(text, fn) { const b = el("button", "knopf", esc(text)); b.type = "button"; b.addEventListener("click", fn); bS.liste.appendChild(b); sichtbar(); return b; },
      offen: () => sch.classList.contains("offen"),
      oeffnen() { sch.classList.add("offen"); rad.setAttribute("aria-expanded", "true"); setTimeout(() => { const f = sch.querySelector("button, a, input, summary"); if (f) f.focus(); }, 30); },
      schliessen() { if (!obj.offen()) return; sch.classList.remove("offen"); rad.setAttribute("aria-expanded", "false"); rad.focus(); },
    };
    obj.aufgabe(...aufgabe); obj.hilfe(...hilfen);
    if (steuerung.neu) obj.steuer("Neue Aufgabe", steuerung.neu);
    if (steuerung.loesung) obj.steuer("Lösung zeigen", steuerung.loesung);
    if (steuerung.zuruecksetzen) obj.steuer("Zurücksetzen", steuerung.zuruecksetzen);
    if (hinweise && hinweise.teile) {
      const d = el("details", "lkm-hinweise lkm-bereich", "<summary>Hinweise für die Lehrkraft</summary>");
      d.insertAdjacentHTML("beforeend", hinweise.teile.map(t => `<h4>${esc(t.h)}</h4>` + (t.text ? `<p>${fmt(t.text)}</p>` : "") +
        (t.punkte ? "<ul>" + t.punkte.map(p => `<li>${fmt(p)}</li>`).join("") + "</ul>" : "")).join(""));
      fuss.appendChild(d);
    }
    if (start) { const a = el("a", "lkm-start", `<span aria-hidden="true">←</span> ${esc(startText)}`); a.href = start; fuss.appendChild(a); }
    sichtbar();
    rad.addEventListener("click", () => obj.offen() ? obj.schliessen() : obj.oeffnen());
    zu.addEventListener("click", () => obj.schliessen());
    document.addEventListener("keydown", e => { if (e.key === "Escape" && obj.offen()) { e.preventDefault(); obj.schliessen(); } });
    S.append(sch, rad);
    return obj;
  }
  window.Lehrkraftmenue = { baue };
})();
