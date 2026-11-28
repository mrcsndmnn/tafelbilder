/* =====================================================================
   Übungsrunde – Hilfsmodul für Tafelbilder (Rundenmodus)
   Einbinden:  <script src="…/gemeinsam/uebungsrunde/runde-client.js"></script>
   Aufruf im iframe mit ?modus=runde&niveau=2. Ohne diesen Zusatz tut das Modul nichts.
   Das Tafelbild meldet sich mit
     Runde.verbinde({ id, neueAufgabe(niveau, ausschliessen), hilfe(an), zuruecksetzen() })
   und meldet Aufgaben mit Runde.gestartet(aufgabeId) und Runde.fertig({ ohneFehler }).
   Elemente mit data-runde="aus" sind im Rundenmodus ausgeblendet, ebenso Kopf- und Fußleisten.
   ===================================================================== */
(function () {
  "use strict";
  const p = new URLSearchParams(location.search);
  const aktiv = p.get("modus") === "runde" && window.parent !== window;
  const R = { aktiv, niveau: [1, 2, 3].includes(+p.get("niveau")) ? +p.get("niveau") : null, hilfeAn: false };
  let def = null, aufgabeId = null;

  if (aktiv) {
    document.documentElement.classList.add("runde-modus");
    const st = document.createElement("style");
    st.textContent = ".runde-modus .kopf,.runde-modus .leiste,.runde-modus .fuss:not(g),.runde-modus [data-runde=\"aus\"]{display:none!important}" +
      ".runde-modus body{background:transparent}";
    document.head.appendChild(st);
  }
  const sende = (typ, daten) => { if (aktiv) parent.postMessage(Object.assign({ quelle: "uebungsrunde", typ }, daten || {}), location.origin); };

  // Ausgeblendete Kopfleiste oben abschneiden (oben = Höhe in Bühnen-Pixeln), damit das Tafelbild größer wird
  let oben = 0;
  const passe = () => {
    const fit = document.getElementById("fit"); if (!fit || !oben) return;
    const W = innerWidth, H = innerHeight, f = Math.min(W / 1600, H / (900 - oben));
    fit.style.cssText = `position:fixed;left:0;width:${W}px;top:${-oben * f}px;height:${H + oben * f}px`;
  };
  if (aktiv) addEventListener("resize", passe);
  R.verbinde = d => {
    def = d;
    if (aktiv && d.oben) { oben = d.oben; passe(); dispatchEvent(new Event("resize")); }
    sende("bereit", { id: d.id, version: 1 });
  };
  R.gestartet = id => { aufgabeId = String(id); sende("aufgabe-gestartet", { aufgabeId }); };
  // ohneFehler: beim ersten Versuch gelöst? Mit Hilfe oder nach Fehlversuch zählt „mit Hilfe“ (nie „falsch“)
  R.fertig = ({ ohneFehler = true } = {}) => {
    if (!aktiv || aufgabeId === null) return;
    sende("aufgabe-fertig", { aufgabeId, ergebnis: ohneFehler && !R.hilfeAn ? "richtig" : "mit-hilfe" });
    aufgabeId = null;
  };
  R.offen = () => aufgabeId !== null;

  addEventListener("message", e => {
    if (!aktiv || e.origin !== location.origin || e.source !== parent) return;
    const d = e.data || {}; if (d.quelle !== "uebungsrunde" || !def) return;
    if (d.typ === "neue-aufgabe") { aufgabeId = null; def.neueAufgabe(R.niveau = d.niveau || R.niveau || 1, d.ausschliessen || []); }
    else if (d.typ === "hilfe") { R.hilfeAn = !!d.an; if (def.hilfe) def.hilfe(R.hilfeAn); }
    else if (d.typ === "zuruecksetzen") { aufgabeId = null; if (def.zuruecksetzen) def.zuruecksetzen(); else def.neueAufgabe(R.niveau || 1, []); }
  });
  window.Runde = R;
})();
