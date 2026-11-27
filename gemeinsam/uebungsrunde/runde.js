/* =====================================================================
   Übungsrunde – Einrichtung, Rundenrahmen, Abschluss
   Aufruf: gemeinsam/uebungsrunde/?thema=mathe/zahlenraum-1000
   Speicherung: Runde und Namen nur in sessionStorage (dieser Tab), Vorlagen ohne Namen in localStorage.
   ===================================================================== */
import * as A from "./auswahl.js?v=2026112701";

const $ = id => document.getElementById(id);
// Schichten im Rundenrahmen einhängen (dort bleibt der Menü-Knopf darüber erreichbar)
const ebene = () => (document.getElementById("runde").hidden ? document.body : document.getElementById("runde"));
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sw = t => (window.silben ? window.silben(t) : esc(String(t).replace(/-/g, "")));
const bewegt = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const sitzung = {
  hol(k, std) { try { const v = sessionStorage.getItem(k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } },
  setz(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  weg(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
};
const dauer = {
  hol(k, std) { try { const v = localStorage.getItem(k); return v === null ? std : JSON.parse(v); } catch (e) { return std; } },
  setz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
const NAMEN_KEY = "vs-namen";          // gemeinsam mit dem Vertretungsbaukasten (nur dieser Tab)
const PUNKTE_KEY = "vs-punkte";        // Klasse gegen Lehrkraft, ebenfalls gemeinsam

// ---------- Thema ----------
const themaPfad = (new URLSearchParams(location.search).get("thema") || "").replace(/^\/+|\/+$/g, "");
const themaOk = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(themaPfad);
const WURZEL = "../../";
const RUNDE_KEY = "uebungsrunde:" + themaPfad, EINST_KEY = "uebungsrunde-einst:" + themaPfad, VORLAGEN_KEY = "uebungsrunde-vorlagen:" + themaPfad;
let thema = null;                      // Inhalt von thema.json
const tb = id => thema.tafelbilder.find(t => t.id === id);
const symHTML = t => t && t.svg ? `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t.svg}</svg>`
  : `<span aria-hidden="true">${esc((t && t.titel || "?").charAt(0))}</span>`;

// ---------- Einstellungen ----------
const STD = { auswahl: null, reihenfolge: "abwechselnd", anzahl: 8, kontingent: 2, namenAn: false, tiere: false, modus: "fenster",
  niveaus: {}, punkte: false, joker: true, klang: false, animation: true, klassenrunde: true, klassenAbstand: 5 };
let cfg = null;
const namenListe = () => A.namenAusText(namenFeld ? namenFeld.value : "");
let namenFeld = null;

function speichereEinst() { const c = Object.assign({}, cfg); sitzung.setz(EINST_KEY, c); }

// ---------- Start ----------
async function los() {
  if (!themaOk) return fehler("Es wurde kein Themenblock angegeben. Bitte die Übungsrunde über den Knopf auf einer Themenseite öffnen.");
  try {
    const r = await fetch(`${WURZEL}${themaPfad}/thema.json`, { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status);
    thema = await r.json();
  } catch (e) { return fehler("Für diesen Themenblock gibt es noch keine Übungsrunde."); }
  document.title = "Übungsrunde – " + thema.titel;
  $("themaTitel").textContent = thema.titel; $("rThema").textContent = thema.titel;
  $("zurThema").href = `${WURZEL}${themaPfad}/`;
  cfg = Object.assign({}, STD, sitzung.hol(EINST_KEY, {}));
  const mitRunde = thema.tafelbilder.filter(t => t.runde).map(t => t.id);
  if (!Array.isArray(cfg.auswahl)) cfg.auswahl = mitRunde;
  cfg.auswahl = cfg.auswahl.filter(id => mitRunde.includes(id));
  // Laufende Runde in diesem Tab?
  const gesp = sitzung.hol(RUNDE_KEY, null);
  if (gesp && gesp.phase && gesp.phase !== "ende" && gesp.runde) return fragFortsetzen(gesp);
  zeigeEinrichtung();
}
function fehler(text) {
  $("einrichtung").hidden = false; $("form").hidden = true;
  const f = $("ladeFehler"); f.hidden = false; f.innerHTML = `<p style="margin:0;font-size:20px">${esc(text)}</p>`;
  $("themaTitel").textContent = "nicht gefunden";
}
function fragFortsetzen(gesp) {
  const sch = el("div", "schicht"); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Runde fortsetzen?");
  const t = el("div", "tafel", `<h2>Runde fortsetzen?</h2><p style="text-align:center;font-size:20px">In diesem Tab läuft noch eine Übungsrunde (${A.erledigteZuege(gesp.runde)} von ${A.gesamtZuege(gesp.runde)} Aufgaben).</p><div class="zeile"></div>`);
  const ja = knopf("Ja, weiter", () => { sch.remove(); cfg = Object.assign({}, STD, gesp.cfg); stand = gesp; stand.phase = "laeuft"; zeigeRunde(true); }, "haupt");
  const nein = knopf("Nein, neu einrichten", () => { sch.remove(); sitzung.weg(RUNDE_KEY); zeigeEinrichtung(); });
  t.querySelector(".zeile").append(ja, nein); sch.appendChild(t); ebene().appendChild(sch); ja.focus();
}

// ---------- Bausteine ----------
function knopf(html, fn, cls) { const b = el("button", "kn" + (cls ? " " + cls : ""), html); b.type = "button"; if (fn) b.addEventListener("click", fn); return b; }
function schalter(text, an, fn) {
  const b = el("button", "schalter", `<span class="box" aria-hidden="true"></span><span>${esc(text)}</span>`); b.type = "button"; b.setAttribute("aria-pressed", !!an);
  b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); fn(v); }); return b;
}
function gruppe(label, optionen, aktiv, fn) {
  const g = el("div", "wahl"); g.setAttribute("role", "group"); g.setAttribute("aria-label", label);
  const kn = optionen.map(o => { const b = knopf(esc(o.text), () => { kn.forEach((x, i) => x.setAttribute("aria-pressed", optionen[i].wert === o.wert)); fn(o.wert); });
    b.setAttribute("aria-pressed", o.wert === aktiv); if (o.aria) b.setAttribute("aria-label", o.aria); g.appendChild(b); return b; });
  return g;
}
function zahlfeld(label, wert, min, max, fn) {
  const z = el("div", "zahlfeld"); const id = "z" + Math.random().toString(36).slice(2, 7);
  const minus = knopf("−"), plus = knopf("+"), inp = el("input"); inp.type = "number"; inp.min = min; inp.max = max; inp.value = wert; inp.id = id; inp.inputMode = "numeric";
  inp.setAttribute("aria-label", label); minus.setAttribute("aria-label", label + " weniger"); plus.setAttribute("aria-label", label + " mehr");
  const setz = v => { v = Math.max(min, Math.min(max, parseInt(v, 10) || min)); inp.value = v; fn(v); };
  minus.addEventListener("click", () => setz(+inp.value - 1)); plus.addEventListener("click", () => setz(+inp.value + 1));
  inp.addEventListener("change", () => setz(inp.value));
  z.append(minus, inp, plus); z.inp = inp; z.knoepfe = [minus, plus]; return z;
}
function bereich(nr, titel) { const b = el("section", "bereich", `<h2><span class="nr">${nr}</span>${esc(titel)}</h2>`); return b; }

// ---------- Einrichtung ----------
let startKnopf, zeitText, anzahlFeld, fehltText, niveauBox;
function zeigeEinrichtung() {
  document.querySelectorAll(".konfetti").forEach(k => k.remove());
  $("runde").hidden = true; $("ende").hidden = true; $("einrichtung").hidden = false;
  const f = $("form"); f.innerHTML = "";
  zeigeVorlagen();

  // ① Tafelbilder
  const b1 = bereich(1, "Tafelbilder");
  const kacheln = el("div", "kacheln");
  thema.tafelbilder.forEach(t => {
    const k = el("button", "kachel", `<span class="sym">${symHTML(t)}</span><strong>${esc(t.titel)}</strong><small>${t.runde ? (t.pruefung === "auto" ? "prüft selbst" : "Lehrkraft prüft") : "noch nicht für Übungsrunden"}</small>`);
    k.type = "button"; k.dataset.id = t.id;
    if (!t.runde) { k.disabled = true; k.setAttribute("aria-label", t.titel + " – noch nicht für Übungsrunden"); }
    else { k.setAttribute("aria-pressed", cfg.auswahl.includes(t.id)); k.addEventListener("click", () => { const an = !cfg.auswahl.includes(t.id);
      cfg.auswahl = an ? thema.tafelbilder.filter(x => x.id === t.id || cfg.auswahl.includes(x.id)).map(x => x.id) : cfg.auswahl.filter(x => x !== t.id);
      k.setAttribute("aria-pressed", an); aktualisiere(); }); }
    kacheln.appendChild(k);
  });
  const alleZeile = el("div", "namen-zeile");
  alleZeile.append(knopf("Alle", () => { cfg.auswahl = thema.tafelbilder.filter(t => t.runde).map(t => t.id); kacheln.querySelectorAll(".kachel:not(:disabled)").forEach(k => k.setAttribute("aria-pressed", true)); aktualisiere(); }, "klein"),
    knopf("Keine", () => { cfg.auswahl = []; kacheln.querySelectorAll(".kachel:not(:disabled)").forEach(k => k.setAttribute("aria-pressed", false)); aktualisiere(); }, "klein"));
  b1.append(kacheln, alleZeile);
  f.appendChild(b1);

  // ② Reihenfolge
  const b2 = bereich(2, "Reihenfolge der Tafelbilder");
  b2.appendChild(gruppe("Reihenfolge", [{ wert: "abwechselnd", text: "abwechselnd" }, { wert: "zufaellig", text: "zufällig" }, { wert: "nacheinander", text: "nacheinander (Block für Block)" }],
    cfg.reihenfolge, v => { cfg.reihenfolge = v; speichereEinst(); }));
  f.appendChild(b2);

  // ③ + ④ Zahlen
  const zz = el("div", "reihe2");
  const b3 = bereich(3, "Anzahl der Schüler");
  anzahlFeld = zahlfeld("Anzahl der Schüler", cfg.anzahl, 1, 30, v => { cfg.anzahl = v; aktualisiere(); });
  b3.append(anzahlFeld, el("p", "hinweis", "1 bis 30. Mit Namen wird die Zahl automatisch gesetzt."));
  const b4 = bereich(4, "Durchgänge pro Kind");
  zeitText = el("p", "zeit");
  b4.append(zahlfeld("Durchgänge pro Kind", cfg.kontingent, 1, 10, v => { cfg.kontingent = v; aktualisiere(); }), zeitText);
  zz.append(b3, b4); f.appendChild(zz);

  // ⑤ Namen
  const b5 = bereich(5, "Namen (freiwillig)");
  const namenBox = el("div");
  namenFeld = el("textarea"); namenFeld.id = "namen"; namenFeld.setAttribute("aria-label", "Namen, einer pro Zeile oder mit Komma");
  namenFeld.placeholder = "Ein Name pro Zeile oder mit Komma getrennt";
  const gemerkt = sitzung.hol(NAMEN_KEY, []);
  namenFeld.addEventListener("input", aktualisiere);
  const nz = el("div", "namen-zeile");
  const uebernehmen = knopf("Namen aus letzter Runde übernehmen", () => { namenFeld.value = sitzung.hol(NAMEN_KEY, []).join("\n"); aktualisiere(); }, "klein");
  uebernehmen.disabled = !gemerkt.length;
  nz.append(uebernehmen, knopf("Namen löschen", () => { namenFeld.value = ""; sitzung.weg(NAMEN_KEY); uebernehmen.disabled = true; aktualisiere(); }, "klein"));
  namenBox.append(namenFeld, nz, el("p", "hinweis", "Namen bleiben nur in diesem Browser-Tab und werden beim Schließen gelöscht."));
  const tierSchalter = schalter("Tiere statt Zahlen", cfg.tiere, v => { cfg.tiere = v; speichereEinst(); });
  const ohneBox = el("div"); ohneBox.append(el("p", "hinweis", "Ohne Namen bekommen die Kinder Nummern 1 bis n – oder Tiere (z. B. Tierkarten auf den Tischen).")); ohneBox.lastChild.style.margin = "0 0 10px"; ohneBox.appendChild(tierSchalter);
  const setzeNamenAn = v => { cfg.namenAn = v; namenBox.hidden = !v; ohneBox.hidden = v; if (v && !namenFeld.value && gemerkt.length) namenFeld.value = gemerkt.join("\n"); aktualisiere(); };
  b5.append(schalter("Namen verwenden", cfg.namenAn, setzeNamenAn), el("div", "", ""), namenBox, ohneBox);
  b5.children[1].style.height = "12px";
  f.appendChild(b5);

  // ⑥ Auswahl des Kindes
  const b6 = bereich(6, "Auswahl des Kindes");
  b6.append(gruppe("Auswahl des Kindes", [{ wert: "fenster", text: "Auswahl-Fenster nach jeder Aufgabe" }, { wert: "zufall", text: "Zufällig (Namensrad)" }], cfg.modus, v => { cfg.modus = v; aktualisiere(); }),
    el("p", "hinweis", "Gilt für die ganze Runde. Während der Runde über das Menü ☰ umschaltbar."));
  // Klassenrunde: im Zufallsmodus antwortet regelmäßig die ganze Klasse (zählt für kein Kind, eine Aufgabe mehr)
  const kr = el("div", "namen-zeile"); kr.style.alignItems = "center";
  kr.append(schalter("Klassenrunde im Zufallsmodus", cfg.klassenrunde, v => { cfg.klassenrunde = v; aktualisiere(); }), el("span", "", "nach jeder"),
    gruppe("Abstand der Klassenrunde", [4, 5, 6].map(n => ({ wert: n, text: n + ".", aria: `jede ${n}. Aufgabe` })), cfg.klassenAbstand, v => { cfg.klassenAbstand = v; aktualisiere(); }),
    el("span", "", "Aufgabe"));
  b6.append(kr, el("p", "hinweis", "Bei der Klassenrunde antworten alle zusammen (Chor). Sie zählt für kein Kind und verlängert die Runde um eine Aufgabe."));
  f.appendChild(b6);

  // Mehr Einstellungen
  const mehr = el("details", "mehr", "<summary>Mehr Einstellungen</summary>");
  const mi = el("div", "mehr-inhalt");
  niveauBox = el("div", "niveau-liste");
  mi.append(el("strong", "", "Niveau je Tafelbild"), niveauBox,
    schalter("Punktestand „Klasse gegen Lehrkraft“ anzeigen", cfg.punkte, v => { cfg.punkte = v; speichereEinst(); }),
    schalter("Joker „Freund fragen“ erlaubt", cfg.joker, v => { cfg.joker = v; speichereEinst(); }),
    schalter("Klang (sanfter Ton beim Lob)", cfg.klang, v => { cfg.klang = v; speichereEinst(); }),
    schalter("Namensrad mit Animation", cfg.animation, v => { cfg.animation = v; speichereEinst(); }));
  mehr.appendChild(mi); f.appendChild(mehr);

  // Start
  const sz = el("div", "start-zeile");
  const vm = el("div", "vorlage-merken");
  const vTitel = el("input"); vTitel.type = "text"; vTitel.placeholder = "Titel, z. B. Wiederholung Freitag"; vTitel.setAttribute("aria-label", "Titel der Vorlage"); vTitel.maxLength = 40;
  vm.append(vTitel, knopf("Als Vorlage merken", () => {
    const titel = vTitel.value.trim() || "Vorlage " + (dauer.hol(VORLAGEN_KEY, []).length + 1);
    const c = Object.assign({}, cfg); delete c.namenText;   // ohne Namen
    const liste = dauer.hol(VORLAGEN_KEY, []).filter(v => v.titel !== titel); liste.push({ titel, cfg: c }); dauer.setz(VORLAGEN_KEY, liste.slice(-8));
    vTitel.value = ""; zeigeVorlagen();
  }, "klein"));
  fehltText = el("span", "fehlt");
  startKnopf = knopf("Runde starten", starteRunde, "haupt");
  const rechts = el("div", "namen-zeile"); rechts.append(fehltText, startKnopf);
  sz.append(vm, rechts); f.appendChild(sz);

  setzeNamenAn(cfg.namenAn);
  aktualisiere();
}
function zeigeVorlagen() {
  const box = $("vorlagen"); box.querySelectorAll(".vorlage").forEach(x => x.remove());
  const liste = dauer.hol(VORLAGEN_KEY, []); box.hidden = !liste.length;
  liste.forEach(v => {
    const w = el("div", "vorlage");
    const kn = knopf("▶ " + esc(v.titel), () => { const namenAn = cfg.namenAn; cfg = Object.assign({}, STD, v.cfg, { namenAn }); speichereEinst(); zeigeEinrichtung(); });
    const weg = knopf("×", () => { dauer.setz(VORLAGEN_KEY, dauer.hol(VORLAGEN_KEY, []).filter(x => x.titel !== v.titel)); zeigeVorlagen(); }, "weg");
    weg.setAttribute("aria-label", `Vorlage „${v.titel}“ löschen`);
    w.append(kn, weg); box.appendChild(w);
  });
}
function kinderZahl() { return cfg.namenAn ? namenListe().length : cfg.anzahl; }
function aktualisiere() {
  if (!startKnopf) return;
  const namen = cfg.namenAn ? namenListe() : [];
  if (cfg.namenAn) { anzahlFeld.inp.value = namen.length || cfg.anzahl; }
  anzahlFeld.inp.disabled = cfg.namenAn; anzahlFeld.knoepfe.forEach(k => k.disabled = cfg.namenAn);
  const n = kinderZahl(), zuege = n * cfg.kontingent;
  const gew = thema.tafelbilder.filter(t => cfg.auswahl.includes(t.id));
  const sek = gew.length ? gew.reduce((s, t) => s + (t.dauerSek || 60), 0) / gew.length : 60;
  const min = Math.max(1, Math.round(zuege * (sek + 15) / 60));
  // Klassenrunden im Zufallsmodus: jede n-te Aufgabe, also zusätzliche Aufgaben
  let kr = 0;
  if (cfg.modus === "zufall" && cfg.klassenrunde && zuege) { const n = cfg.klassenAbstand || 5; let T = zuege; while (zuege + Math.floor(T / n) > T) T++; kr = T - zuege; }
  const minK = Math.max(1, Math.round((zuege + kr) * (sek + 15) / 60));
  zeitText.textContent = `Das ergibt ${zuege} Aufgaben${kr ? ` + ${kr} Klassenrunde${kr > 1 ? "n" : ""}` : ""} (ca. ${kr ? minK : min} Min.)`;
  // Niveau je Tafelbild
  niveauBox.innerHTML = "";
  gew.filter(t => (t.niveaus || []).length > 1).forEach(t => {
    const z = el("div", "niveau-zeile"); z.appendChild(el("span", "", esc(t.titel)));
    const akt = cfg.niveaus[t.id] || t.niveaus[0];
    z.appendChild(gruppe("Niveau " + t.titel, t.niveaus.map(n => ({ wert: n, text: "★".repeat(n), aria: `Niveau ${n}` })), akt, v => { cfg.niveaus[t.id] = v; speichereEinst(); }));
    niveauBox.appendChild(z);
  });
  if (!niveauBox.children.length) niveauBox.appendChild(el("span", "hinweis", "Die gewählten Tafelbilder haben keine Niveaus."));
  const fehlt = !cfg.auswahl.length ? "Bitte mindestens ein Tafelbild wählen." : !n ? "Bitte Namen eintragen oder „Namen verwenden“ ausschalten." : "";
  fehltText.textContent = fehlt; startKnopf.disabled = !!fehlt;
  speichereEinst();
}

// ---------- Rundenstand ----------
let stand = null;            // { cfg, runde, phase, zugNr, tbAkt, aufgaben: {tb: [ids]}, aktAufgabe, gezaehlt, hilfe }
const speichere = () => { if (stand) sitzung.setz(RUNDE_KEY, Object.assign({}, stand, { cfg })); };

function starteRunde() {
  const namen = cfg.namenAn ? namenListe() : [];
  if (cfg.namenAn) sitzung.setz(NAMEN_KEY, namen);
  const runde = A.erstelleRunde({ anzahl: cfg.anzahl, namen, tiere: cfg.tiere, kontingent: cfg.kontingent });
  stand = { runde, phase: "laeuft", zugNr: 0, tbAkt: null, aufgaben: {}, aktAufgabe: null, gezaehlt: false, hilfe: false, tbZug: null };
  zeigeRunde(false);
}

// ---------- Rundenrahmen ----------
const frame = $("rFrame");
let bereitFuer = null, bereitWarten = null, menueOffen = null;
addEventListener("message", e => {
  if (e.origin !== location.origin || e.source !== frame.contentWindow) return;
  const d = e.data || {}; if (d.quelle !== "uebungsrunde" || !stand) return;
  if (d.typ === "bereit") { bereitFuer = d.id; if (bereitWarten) { const f = bereitWarten; bereitWarten = null; f(); } }
  else if (d.typ === "aufgabe-gestartet") { stand.aktAufgabe = String(d.aufgabeId || ""); speichere(); }
  else if (d.typ === "aufgabe-fertig") {
    if (stand.phase !== "laeuft" || stand.gezaehlt || stand.runde.aktuell === null) return;
    const erg = ["richtig", "mit-hilfe", "uebersprungen"].includes(d.ergebnis) ? d.ergebnis : "richtig";
    zaehle(erg, false);
  }
});
const sende = (typ, daten) => { try { frame.contentWindow.postMessage(Object.assign({ quelle: "uebungsrunde", typ }, daten || {}), location.origin); } catch (e) {} };

function zeigeRunde(fortsetzen) {
  document.querySelectorAll(".konfetti").forEach(k => k.remove());
  $("einrichtung").hidden = true; $("ende").hidden = true; $("runde").hidden = false;
  baueKopf();
  $("rHilfe").setAttribute("aria-pressed", !!stand.hilfe);
  $("rJoker").hidden = !cfg.joker;
  if (fortsetzen && stand.tbAkt) {
    // gleiche Aufgabe kann nicht wiederhergestellt werden: neue Aufgabe im selben Tafelbild, Kind bleibt
    ladeTafelbild(stand.tbAkt, true).then(() => { neueAufgabeSenden(); if (stand.runde.aktuell === null && !stand.gezaehlt) waehleKind(); else zeigeBand(); });
  } else naechsterZug();
}
function baueKopf() {
  const p = $("rPunkte"); p.hidden = !cfg.punkte; p.innerHTML = "";
  if (cfg.punkte) {
    const pk = sitzung.hol(PUNKTE_KEY, { k: 0, l: 0 });
    const k = knopf(`<span aria-hidden="true">⭐</span> Klasse ${pk.k}`), l = knopf(`<span aria-hidden="true">🦉</span> Lehrkraft ${pk.l}`);
    const neu = () => { const q = sitzung.hol(PUNKTE_KEY, { k: 0, l: 0 }); k.innerHTML = `<span aria-hidden="true">⭐</span> Klasse ${q.k}`; l.innerHTML = `<span aria-hidden="true">🦉</span> Lehrkraft ${q.l}`; };
    k.addEventListener("click", () => { const q = sitzung.hol(PUNKTE_KEY, { k: 0, l: 0 }); q.k++; sitzung.setz(PUNKTE_KEY, q); neu(); });
    l.addEventListener("click", () => { const q = sitzung.hol(PUNKTE_KEY, { k: 0, l: 0 }); q.l++; sitzung.setz(PUNKTE_KEY, q); neu(); });
    k.title = "Punkt für die Klasse"; l.title = "Punkt für die Lehrkraft"; p.append(k, l);
  }
  zeigeFortschritt();
}
function zeigeFortschritt() {
  const r = stand.runde, ges = A.gesamtZuege(r) + (r.aktuell === "klasse" ? 1 : 0), erl = A.erledigteZuege(r);
  const jetzt = Math.min(ges, erl + (stand.gezaehlt ? 0 : 1));
  $("rText").textContent = `Aufgabe ${Math.max(1, jetzt)} von ${ges}`;
  $("rBalken").style.width = (ges ? erl / ges * 100 : 0) + "%";
}
function zeigeBand(text) {
  const r = stand.runde, wer = $("rWer"), dots = $("rDots"), info = $("rInfo");
  // Nach dem Zählen bleibt das Kind sichtbar, das gerade dran war
  const zuletzt = stand.gezaehlt && r.verlauf.length ? r.verlauf[r.verlauf.length - 1].kindId : null;
  if (zuletzt && zuletzt !== "klasse") { const k = A.kind(r, zuletzt); wer.innerHTML = `${k.symbol ? `<span class="sym" aria-hidden="true">${k.symbol}</span>` : ""}<span class="name">${esc(k.name)}</span>`; dots.innerHTML = punkteHTML(k); }
  else if (zuletzt === "klasse" || r.aktuell === "klasse") { wer.innerHTML = `<span class="sym" aria-hidden="true">👥</span><span class="name">${sw("Die gan-ze Klas-se ist dran!")}</span>`; dots.innerHTML = ""; }
  else if (r.aktuell) { const k = A.kind(r, r.aktuell); wer.innerHTML = `${k.symbol ? `<span class="sym" aria-hidden="true">${k.symbol}</span>` : ""}<span class="name">${esc(k.name)} ${sw("ist dran!")}</span>`; dots.innerHTML = punkteHTML(k); }
  else { wer.innerHTML = `<span class="name">${sw("Wer ist dran?")}</span>`; dots.innerHTML = ""; }
  info.textContent = text || "";
  $("rAnderes").hidden = !(cfg.modus === "zufall" && r.aktuell && r.aktuell !== "klasse" && !stand.gezaehlt && A.waehlbareKinder(r).length > 1);
  const w = $("rWeiter"); w.textContent = stand.gezaehlt ? "Nächste →" : "Fertig → Nächste"; w.classList.toggle("puls", !!stand.gezaehlt);
  w.disabled = r.aktuell === null && !stand.gezaehlt;
  zeigeFortschritt();
}
function punkteHTML(k) { return Array.from({ length: stand.runde.kontingent }, (_, i) => `<i class="${i < k.dran ? "voll" : ""}"></i>`).join("") + `<span class="vh">${k.dran} von ${stand.runde.kontingent} erledigt</span>`; }

// Ablauf eines Zuges
async function naechsterZug() {
  schliesseSchichten();
  const r = stand.runde;
  if (A.rundeVorbei(r)) return abschluss();
  stand.gezaehlt = false; stand.aktAufgabe = null;
  const id = A.naechstesTafelbild(cfg.auswahl, cfg.reihenfolge, stand.zugNr, A.gesamtZuege(r), Math.random, stand.tbAkt);
  stand.zugNr++; speichere();
  zeigeBand();
  await ladeTafelbild(id, false);
  neueAufgabeSenden();
  waehleKind();
}
function niveauVon(id) { const t = tb(id); return cfg.niveaus[id] || (t.niveaus && t.niveaus[0]) || 1; }
function neueAufgabeSenden() {
  const id = stand.tbAkt;
  sende("neue-aufgabe", { niveau: niveauVon(id), ausschliessen: (stand.aufgaben[id] || []).slice(-30) });
  if (stand.hilfe) sende("hilfe", { an: true });
}
function ladeTafelbild(id, sofort) {
  return new Promise(fertig => {
    if (stand.tbAkt === id && bereitFuer === id && !sofort) return fertig();
    const t = tb(id), wechselte = stand.tbAkt !== null && stand.tbAkt !== id;
    stand.tbAkt = id; speichere();
    let ueber = null;
    if (wechselte && cfg.auswahl.length > 1) {
      ueber = el("div", "wechsel", `<div class="sym">${symHTML(t)}</div><div>${esc(t.titel)}</div><small>Jetzt kommt:</small>`);
      ueber.insertBefore(ueber.lastChild, ueber.firstChild); $("rBuehne").appendChild(ueber);
    }
    const start = Date.now();
    bereitFuer = null;
    bereitWarten = () => { const rest = ueber ? Math.max(0, 1000 - (Date.now() - start)) : 0; setTimeout(() => { if (ueber) ueber.remove(); fertig(); }, rest); };
    // Falls sich ein Tafelbild nicht meldet: nach 5 Sekunden trotzdem weiter (Lehrkraft schließt dann mit „Fertig“ ab)
    setTimeout(() => { if (bereitWarten && stand && stand.tbAkt === id) { const f = bereitWarten; bereitWarten = null; f(); } }, 5000);
    frame.src = `${WURZEL}${themaPfad}/${t.pfad}${t.pfad.includes("?") ? "&" : "?"}modus=runde&niveau=${niveauVon(id)}`;
    frame.title = t.titel;
  });
}

// Kind bestimmen
function waehleKind() {
  const r = stand.runde, frei = A.waehlbareKinder(r);
  if (!frei.length) return abschluss();
  if (frei.length === 1) { A.waehle(r, frei[0].id); speichere(); zeigeBand(`Letzte Aufgabe für ${frei[0].name}`); return; }
  if (cfg.modus === "zufall") {
    // Klassenrunde: jede n-te Aufgabe ist für die ganze Klasse
    if (cfg.klassenrunde && stand.zugNr % (cfg.klassenAbstand || 5) === 0) return klassenrunde();
    return namensrad();
  }
  auswahlFenster();
}
function auswahlFenster(verwalten) {
  schliesseSchichten();
  const r = stand.runde;
  const sch = el("div", "schicht" + (r.kinder.length > 18 ? " viele" : "")); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", verwalten ? "Kinder an- und abmelden" : "Wer ist als Nächstes dran?");
  const t = el("div", "tafel breit silben");
  t.innerHTML = `<h2>${verwalten ? "Kinder an- und abmelden" : sw("Wer ist als Nächs-tes dran?")}</h2><div class="raster"></div><div class="zeile"></div>
    <p class="klein-info">${verwalten ? "Antippen: abwesend (Mond) oder wieder da." : "Lange drücken: Kind ist abwesend (Mond). Noch einmal lange drücken: wieder da."}</p>`;
  const raster = t.querySelector(".raster");
  r.kinder.forEach(k => {
    const voll = !k.abwesend && k.dran >= r.kontingent;
    const b = el("button", "karte-k" + (voll ? " voll" : "") + (k.abwesend ? " ab" : ""), `${k.symbol ? `<span class="sym" aria-hidden="true">${k.symbol}</span>` : ""}<span class="nm">${esc(k.name)}</span><span class="dots">${punkteHTML(k)}</span>`);
    b.type = "button";
    b.setAttribute("aria-label", `${k.name}${k.abwesend ? ", abwesend" : voll ? ", schon fertig" : `, ${k.dran} von ${r.kontingent}`}`);
    if (voll && !verwalten) b.setAttribute("aria-disabled", "true");
    let lang = null, langWar = false;
    const abw = () => { A.setzeAbwesend(r, k.id, !k.abwesend); speichere(); if (A.rundeVorbei(r) && !stand.gezaehlt) { schliesseSchichten(); return abschluss(); } auswahlFenster(verwalten); zeigeFortschritt(); };
    if (!verwalten) {
      b.addEventListener("pointerdown", () => { langWar = false; clearTimeout(lang); lang = setTimeout(() => { langWar = true; abw(); }, 650); });
      ["pointerup", "pointerleave", "pointercancel"].forEach(ev => b.addEventListener(ev, () => clearTimeout(lang)));
      b.addEventListener("contextmenu", e => e.preventDefault());
    }
    b.addEventListener("click", () => {
      if (verwalten) return abw();
      if (langWar) { langWar = false; return; }
      if (k.abwesend || voll) return;
      A.waehle(r, k.id); speichere(); sch.remove(); zeigeBand();
    });
    raster.appendChild(b);
  });
  const zeile = t.querySelector(".zeile");
  if (verwalten) zeile.appendChild(knopf("Fertig", () => { sch.remove(); if (stand.runde.aktuell === null && !stand.gezaehlt) waehleKind(); }, "haupt"));
  else {
    const kl = el("button", "karte-k klasse", `<span class="sym" aria-hidden="true">👥</span><span class="nm">Ganze Klasse</span>`); kl.type = "button";
    kl.setAttribute("aria-label", "Ganze Klasse (Chorantwort, zählt für kein Kind)");
    kl.addEventListener("click", () => { A.waehle(r, "klasse"); speichere(); sch.remove(); zeigeBand(); }); raster.appendChild(kl);
    zeile.append(knopf("🎲 Zufall", () => { A.waehle(r, A.ziehe(r)); speichere(); sch.remove(); zeigeBand(); }, "haupt"), knopf("Runde pausieren", () => pause()));
  }
  sch.appendChild(t); ebene().appendChild(sch);
}
function klassenrunde() {
  schliesseSchichten();
  A.waehle(stand.runde, "klasse"); speichere(); zeigeBand(); ton();
  const sch = el("div", "schicht"); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Klassenrunde");
  const t = el("div", "tafel silben", `<h2 style="font-size:56px">👥 ${sw("Klas-sen-run-de!")}</h2><p style="font-size:30px;text-align:center;margin:0">${sw("Al-le ant-wor-ten zu-sam-men.")}</p>`);
  sch.appendChild(t); ebene().appendChild(sch);
  setTimeout(() => { if (sch.isConnected) sch.remove(); }, bewegt && cfg.animation ? 2200 : 1200);
}
function namensrad() {
  schliesseSchichten();
  const r = stand.runde, frei = A.waehlbareKinder(r), wahl = A.ziehe(r), i = frei.findIndex(k => k.id === wahl), n = frei.length;
  const sch = el("div", "schicht"); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Namensrad");
  const t = el("div", "tafel"), FARBEN = ["#dbe9fb", "#e2f3e0", "#fdf0c9", "#f4e3fb", "#f7d8e3", "#d8ecf7"], R = 280, cx = 300, cy = 300;
  const pt = (a, rr) => [cx + rr * Math.sin(a), cy - rr * Math.cos(a)];
  let g = "";
  frei.forEach((k, j) => {
    const a1 = j * 2 * Math.PI / n, a2 = (j + 1) * 2 * Math.PI / n, [x1, y1] = pt(a1, R), [x2, y2] = pt(a2, R);
    g += n > 1 ? `<path d="M${cx} ${cy} L${x1} ${y1} A${R} ${R} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z" fill="${FARBEN[j % FARBEN.length]}" stroke="#1d2320" stroke-width="4"/>` : "";
    const am = (a1 + a2) / 2, [tx, ty] = pt(am, R * .62), roh = am * 180 / Math.PI - 90, deg = n <= 8 ? 0 : (roh > 90 ? roh - 180 : roh), fs = Math.max(16, Math.min(34, 520 / Math.max(n, 8)));
    const txt = (k.symbol ? k.symbol + " " : "") + (k.name.length > 12 ? k.name.slice(0, 11) + "…" : k.name);
    g += `<text x="${tx}" y="${ty}" transform="rotate(${deg} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-family="Andika,'Segoe UI',sans-serif" font-weight="700" font-size="${fs}" fill="#1d2320">${esc(txt)}</text>`;
  });
  t.innerHTML = `<div class="rad-tafel"><svg viewBox="0 0 600 620" aria-hidden="true"><g class="rad-dreh">${g}</g><circle cx="${cx}" cy="${cy}" r="30" fill="#fff" stroke="#1d2320" stroke-width="5"/>
    <path d="M${cx - 26} 4 L${cx + 26} 4 L${cx} 56 Z" fill="#5e2f91" stroke="#1d2320" stroke-width="4" stroke-linejoin="round"/></svg>
    <div class="rad-rechts silben"><div style="font-size:28px;font-weight:700">${sw("Wer ist dran?")}</div><div class="rad-name" aria-live="polite"></div><div class="zeile"></div></div></div>`;
  sch.appendChild(t); ebene().appendChild(sch);
  const d = t.querySelector(".rad-dreh"), name = t.querySelector(".rad-name");
  const mitte = (i + .5) * 360 / n + (Math.random() - .5) * (300 / n), ziel = 360 * 4 + (360 - mitte);
  const anim = cfg.animation && bewegt;
  if (!anim) d.style.transition = "none";
  void getComputedStyle(d).transform; d.getBoundingClientRect();
  d.style.transform = `rotate(${ziel}deg)`;
  setTimeout(() => {
    const k = A.kind(r, wahl); name.innerHTML = (k.symbol ? `<span aria-hidden="true">${k.symbol}</span> ` : "") + esc(k.name);
    A.waehle(r, wahl); speichere(); zeigeBand(); ton();
    setTimeout(() => { if (sch.isConnected) sch.remove(); }, 1300);
  }, anim ? 2100 : 300);
}

// Zug zählen
function zaehle(ergebnis, weiterGleich) {
  const r = stand.runde;
  if (r.aktuell === null || stand.gezaehlt) return;
  const id = stand.tbAkt, aid = stand.aktAufgabe || `${id}-${stand.zugNr}`;
  (stand.aufgaben[id] = stand.aufgaben[id] || []).push(aid);
  A.abschliessen(r, { tafelbild: id, aufgabeId: aid, ergebnis });
  stand.gezaehlt = true; speichere();
  lob(ergebnis);
  zeigeBand(); zeigeFortschritt();
  if (weiterGleich) setTimeout(() => { if (stand.gezaehlt && stand.phase === "laeuft" && !document.querySelector(".pause")) naechsterZug(); }, 1500);
}
const LOB = ["Su-per!", "Toll ge-macht!", "Prima!", "Klas-se!", "Gut ge-macht!", "Stark!"];
function lob(ergebnis) {
  document.querySelectorAll(".lob").forEach(x => x.remove());
  const l = el("div", "lob silben", sw(ergebnis === "mit-hilfe" ? "Gut ge-macht – mit Hil-fe!" : LOB[Math.floor(Math.random() * LOB.length)]));
  l.setAttribute("role", "status"); ebene().appendChild(l); setTimeout(() => l.remove(), 1600); ton();
}
let audio = null;
function ton() {
  if (!cfg.klang) return;
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); const o = audio.createOscillator(), g = audio.createGain();
    o.type = "sine"; o.frequency.value = 660; g.gain.setValueAtTime(.0001, audio.currentTime); g.gain.exponentialRampToValueAtTime(.18, audio.currentTime + .03);
    g.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .5); o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + .55); } catch (e) {}
}

// Fußleiste
$("rWeiter").addEventListener("click", () => {
  if (stand.gezaehlt) return naechsterZug();
  if (stand.runde.aktuell === null) return;
  // Lehrkraft schließt ab: kurz einschätzen
  schliesseSchichten();
  const sch = el("div", "schicht"); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Wie hat es geklappt?");
  const t = el("div", "tafel bewerten silben", `<h2>${sw("Wie hat es ge-klappt?")}</h2><div class="zeile"></div>`);
  t.querySelector(".zeile").append(knopf(`<span class="ico" aria-hidden="true">👍</span> Geschafft`, () => { sch.remove(); zaehle("richtig", true); }, "haupt"),
    knopf(`<span class="ico" aria-hidden="true">✋</span> Mit Hilfe`, () => { sch.remove(); zaehle("mit-hilfe", true); }),
    knopf("Abbrechen", () => sch.remove()));
  sch.appendChild(t); ebene().appendChild(sch);
});
$("rNeu").addEventListener("click", () => { if (stand.gezaehlt) return; stand.aktAufgabe = null; sende("zuruecksetzen"); if (stand.hilfe) sende("hilfe", { an: true }); });
$("rHilfe").addEventListener("click", () => { stand.hilfe = !stand.hilfe; $("rHilfe").setAttribute("aria-pressed", stand.hilfe); sende("hilfe", { an: stand.hilfe }); speichere(); });
$("rJoker").addEventListener("click", () => {
  schliesseSchichten();
  const sch = el("div", "schicht"); sch.setAttribute("role", "dialog"); sch.setAttribute("aria-label", "Joker");
  const t = el("div", "tafel silben", `<h2 style="font-size:40px">💬 ${sw("Frag ein an-de-res Kind. Es hilft dir.")}</h2><p class="klein-info">Der Zug zählt für das Kind, das dran ist.</p><div class="zeile"></div>`);
  t.querySelector(".zeile").appendChild(knopf("OK", () => sch.remove(), "haupt")); sch.appendChild(t); ebene().appendChild(sch);
});
$("rAnderes").addEventListener("click", () => { const r = stand.runde; if (stand.gezaehlt || !r.aktuell) return; const alt = r.aktuell, frueherLetzter = r.letzter;
  r.aktuell = null; r.letzter = alt; namensrad(); r.letzter = frueherLetzter; });

// Menü
$("rMenue").addEventListener("click", () => {
  if (menueOffen) { menueOffen.remove(); menueOffen = null; $("rMenue").setAttribute("aria-expanded", false); return; }
  const m = el("div", "menue"); m.setAttribute("role", "menu");
  const zu = () => { m.remove(); menueOffen = null; $("rMenue").setAttribute("aria-expanded", false); };
  const eintrag = (text, fn) => { const b = knopf(text, () => { zu(); fn(); }); b.setAttribute("role", "menuitem"); m.appendChild(b); };
  eintrag("⏸ Pause", pause);
  eintrag(cfg.modus === "zufall" ? "Auswahl: Fenster statt Zufall" : "Auswahl: Zufall statt Fenster", () => { cfg.modus = cfg.modus === "zufall" ? "fenster" : "zufall"; speichereEinst(); speichere(); zeigeBand(); });
  eintrag("↶ Rückgängig", rueckgaengig);
  eintrag("Kinder an- und abmelden", () => auswahlFenster(true));
  eintrag("Runde beenden", () => abschluss());
  eintrag("Alles löschen (Runde und Namen)", () => { sitzung.weg(RUNDE_KEY); sitzung.weg(NAMEN_KEY); stand = null; frame.src = "about:blank"; location.reload(); });
  ebene().appendChild(m); menueOffen = m; $("rMenue").setAttribute("aria-expanded", true); m.firstChild.focus();
});
document.addEventListener("pointerdown", e => { if (menueOffen && !menueOffen.contains(e.target) && e.target.closest("#rMenue") === null) { menueOffen.remove(); menueOffen = null; $("rMenue").setAttribute("aria-expanded", false); } });

function rueckgaengig() {
  const vorher = stand.runde.aktuell;
  const art = A.rueckgaengig(stand.runde); if (!art) return;
  // Klassenrunde zurückgenommen: dann doch ein einzelnes Kind ziehen
  if (art === "auswahl" && vorher === "klasse" && cfg.modus === "zufall") { speichere(); return namensrad(); }
  if (art === "zug") { stand.gezaehlt = false; const l = stand.aufgaben[stand.tbAkt]; if (l) l.pop(); }
  speichere();
  if (art === "auswahl") waehleKind(); else zeigeBand("Zug zurückgenommen – das Kind ist noch einmal dran.");
}
function pause() {
  schliesseSchichten();
  const p = el("div", "pause silben", `<div class="hand" aria-hidden="true">✋</div><div class="gross">Pause</div>`); p.setAttribute("role", "dialog"); p.setAttribute("aria-label", "Pause");
  const w = knopf("Weiter", () => { p.remove(); if (stand.gezaehlt) return; if (stand.runde.aktuell === null) waehleKind(); }, "haupt"); p.appendChild(w);
  ebene().appendChild(p); w.focus();
}
function schliesseSchichten() { document.querySelectorAll(".schicht,.pause").forEach(x => x.remove()); if (menueOffen) { menueOffen.remove(); menueOffen = null; } }

// ---------- Abschluss ----------
function abschluss() {
  schliesseSchichten();
  const r = stand.runde; stand.phase = "ende"; speichere();
  frame.src = "about:blank"; bereitFuer = null; stand.tbAkt = null;
  $("runde").hidden = true; $("einrichtung").hidden = true;
  const e = $("ende"); e.hidden = false;
  const zahl = A.erledigteZuege(r), anteil = A.anteilRichtig(r), sterne = Math.max(1, Math.round(anteil * 5));
  const tbs = cfg.auswahl.map(tb);
  const zelle = (kid, t) => { const z = r.verlauf.filter(v => v.kindId === kid && v.tafelbild === t.id);
    return z.length ? z.map(v => v.ergebnis === "richtig" ? "✓" : v.ergebnis === "mit-hilfe" ? "✓ (H)" : "–").join(" ") : "–"; };
  e.innerHTML = `<div class="sterne" aria-label="${sterne} von 5 Sternen für die Klasse">${"★".repeat(sterne)}${"☆".repeat(5 - sterne)}</div>
    <h1>${sw("Ge-schafft!")}</h1><p style="font-size:28px;font-weight:700;margin:0">${sw(`Ihr habt ${zahl} Auf-ga-ben ge-löst.`)}</p>
    <div class="karten">${r.kinder.map(k => `<div class="karte-k${k.abwesend ? " ab" : ""}">${k.symbol ? `<span class="sym" aria-hidden="true">${k.symbol}</span>` : ""}<span class="nm">${esc(k.name)}</span><span class="dots">${punkteHTML(k)}</span></div>`).join("")}</div>
    <div class="zeile"></div>
    <details class="diagnose"><summary>Für die Lehrkraft: Übersicht Kind × Tafelbild</summary>
      <p class="hinweis">✓ = selbst gelöst · ✓ (H) = mit Hilfe · – = nicht dran. Wird nicht gespeichert.</p>
      <table><tr><th>Kind</th>${tbs.map(t => `<th>${esc(t.titel)}</th>`).join("")}</tr>
      ${r.kinder.map(k => `<tr><td>${esc(k.name)}${k.abwesend ? " (abwesend)" : ""}</td>${tbs.map(t => `<td>${zelle(k.id, t)}</td>`).join("")}</tr>`).join("")}
      ${r.extra ? `<tr><td>Ganze Klasse</td>${tbs.map(t => `<td>${zelle("klasse", t)}</td>`).join("")}</tr>` : ""}</table>
      <button type="button" class="kn klein" id="drucken">Drucken</button></details>`;
  e.querySelector(".zeile").append(
    knopf("Noch eine Runde", () => { starteRundeGleich(); }, "haupt"),
    knopf("Einstellungen ändern", () => { sitzung.weg(RUNDE_KEY); stand = null; zeigeEinrichtung(); }),
    Object.assign(el("a", "kn", "Zur Themenseite"), { href: `${WURZEL}${themaPfad}/` }));
  e.querySelector("#drucken").addEventListener("click", () => window.print());
  if (bewegt) { const k = el("div", "konfetti"); const F = ["#f0a500", "#2f7d4f", "#2667c9", "#d03a32", "#5e2f91"];
    for (let i = 0; i < 70; i++) { const c = el("i"); c.style.left = Math.random() * 100 + "%"; c.style.background = F[i % F.length]; c.style.animationDelay = Math.random() * .8 + "s"; k.appendChild(c); }
    ebene().appendChild(k); setTimeout(() => k.remove(), 3800); }
}
function starteRundeGleich() {
  const alt = stand.runde;
  const runde = A.erstelleRunde({ anzahl: alt.kinder.length, namen: [], kontingent: cfg.kontingent });
  runde.kinder = alt.kinder.map(k => Object.assign({}, k, { dran: 0 }));
  stand = { runde, phase: "laeuft", zugNr: 0, tbAkt: null, aufgaben: {}, aktAufgabe: null, gezaehlt: false, hilfe: false };
  zeigeRunde(false);
}

los();
