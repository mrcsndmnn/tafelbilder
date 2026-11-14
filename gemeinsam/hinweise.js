// Knopf „?“ mit Hinweisen zur Benutzung – für alle Tafelbilder.
// Benutzung:  Hinweise.einbauen({ titel: "…", teile: [ { h: "Überschrift", punkte: ["…", "…"] }, … ] })
// Ohne Ziel wird der Knopf direkt hinter den Knopf „Übersicht“ gesetzt.
// Hinweise.knopf(inhalt) liefert nur den Knopf (z. B. für eine eigene Kopfleiste).
(function () {
  "use strict";
  let dialog = null;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // **fett** im Text erlaubt
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

  function baueDialog() {
    dialog = document.createElement("dialog");
    dialog.className = "hw-dialog";
    dialog.setAttribute("aria-labelledby", "hw-titel");
    dialog.innerHTML = `<div class="hw-kopf"><span class="hw-sym" aria-hidden="true">?</span><h2 id="hw-titel"></h2>
      <button type="button" class="hw-zu" aria-label="Schließen">✕</button></div>
      <div class="hw-inhalt"></div>
      <div class="hw-fuss"><button type="button">Schließen</button></div>`;
    dialog.querySelector(".hw-zu").addEventListener("click", () => dialog.close());
    dialog.querySelector(".hw-fuss button").addEventListener("click", () => dialog.close());
    // Tippen neben das Fenster schließt es
    dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
    document.body.appendChild(dialog);
  }
  function oeffnen(inhalt) {
    if (!dialog) baueDialog();
    dialog.querySelector("h2").textContent = "So geht's: " + inhalt.titel;
    dialog.querySelector(".hw-inhalt").innerHTML = inhalt.teile.map(t =>
      `<h3>${esc(t.h)}</h3>` + (t.text ? `<p>${fmt(t.text)}</p>` : "") +
      (t.punkte ? "<ul>" + t.punkte.map(p => `<li>${fmt(p)}</li>`).join("") + "</ul>" : "")).join("");
    dialog.querySelector(".hw-inhalt").scrollTop = 0;
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    const fuss = dialog.querySelector(".hw-fuss button");
    (fuss.offsetParent ? fuss : dialog.querySelector(".hw-zu")).focus();
  }
  function knopf(inhalt, cls) {
    const b = document.createElement("button");
    b.type = "button"; b.className = cls || "hw-knopf"; b.textContent = "?";
    b.setAttribute("aria-label", "Hinweise zur Benutzung"); b.setAttribute("aria-haspopup", "dialog");
    b.title = "Hinweise zur Benutzung";
    b.addEventListener("click", () => oeffnen(inhalt));
    return b;
  }
  function einbauen(inhalt, ziel) {
    const b = knopf(inhalt);
    if (ziel) ziel.appendChild(b);
    else { const z = document.querySelector("a.zurueck"); z ? z.after(b) : document.body.prepend(b); }
    return b;
  }
  window.Hinweise = { knopf, oeffnen, einbauen };
})();
