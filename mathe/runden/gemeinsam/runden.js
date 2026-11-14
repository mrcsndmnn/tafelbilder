/* =====================================================================
   Runden im Zahlenraum bis 1000 – zusätzliche Bausteine
   Benötigt Tafel (../../zahlenraum-1000/gemeinsam/tafel.js).
   Schulregel: Bei 0, 1, 2, 3, 4 wird abgerundet. Bei 5, 6, 7, 8, 9 wird aufgerundet.
   ===================================================================== */
(function () {
  "use strict";
  const T = window.Tafel, R = {};
  R.BASIS = { Z: 10, H: 100 };
  R.NAME = { Z: "Zehner", H: "Hunderter" };
  R.PRUEF = { Z: "E", H: "Z" };                        // Stelle, auf die man schaut
  R.PRUEFNAME = { Z: "Einer", H: "Zehner" };
  R.ANDERE = { Z: "H", H: "Z" };

  // ---------------- Rechnen ----------------
  R.runde = (n, st) => { const b = R.BASIS[st]; return Math.floor(n / b + 0.5) * b; };
  R.nachbarn = (n, st) => { const b = R.BASIS[st], u = Math.floor(n / b) * b; return n % b === 0 ? { u: n, o: n, rund: true } : { u, o: u + b, rund: false }; };
  R.pruefziffer = (n, st) => st === "Z" ? n % 10 : Math.floor(n / 10) % 10;
  R.pruefstelle = st => R.PRUEF[st];
  R.istMitte = (n, st) => st === "Z" ? n % 10 === 5 : n % 100 === 50;

  // ---------------- Sätze ----------------
  R.zwischen = (n, st) => { const x = R.nachbarn(n, st); return `${n} liegt zwischen ${x.u} und ${x.o}.`; };
  R.naeher = (n, st) => {
    const x = R.nachbarn(n, st), lu = n - x.u, lo = x.o - n;
    return lu === lo ? `${n} liegt genau in der Mitte.` : `${n} liegt näher an ${lu < lo ? x.u : x.o}.`;
  };
  R.richtung = (n, st) => R.pruefziffer(n, st) >= 5 ? "auf" : "ab";
  // Die vier Denkschritte
  R.denkschritte = (n, st) => {
    const d = R.pruefziffer(n, st), re = d >= 5;
    return [`Ich runde auf ${R.NAME[st]}.`, `Ich schaue auf die ${R.PRUEFNAME[st]}.`,
      `Die ${R.PRUEFNAME[st]}ziffer ist ${d}.`, `${d} ist ${re ? "rechts" : "links"} vom Gipfel. Ich runde ${re ? "auf" : "ab"}.`];
  };
  // Zusätze für Sonderfälle
  R.zusatz = (n, st) => {
    const r = R.runde(n, st), t = [];
    if (R.nachbarn(n, st).rund) t.push(`${n} ist schon ein ${R.NAME[st]}. Die Zahl bleibt ${n}.`);
    else if (R.istMitte(n, st)) t.push("Genau in der Mitte runden wir auf.");
    if (st === "Z" && Math.floor(r / 100) !== Math.floor(n / 100)) t.push(r === 1000 ? "Es wird 1000." : "Der Hunderter wird größer.");
    if (st === "H" && r === 1000) t.push("Es wird 1000.");
    return t;
  };
  R.kurzSatz = (n, st) => { const d = R.pruefziffer(n, st); return `Die ${R.PRUEFNAME[st]}ziffer ist ${d}. Ich runde ${d >= 5 ? "auf" : "ab"}.`; };
  R.ungefaehr = (n, st) => `${n} ist ungefähr ${R.runde(n, st)}.`;

  // ---------------- Darstellung ----------------
  // Zahl als HTML; mit lupe = "Z"/"H" wird die Prüfstelle markiert
  R.zahl = (n, lupe) => {
    const s = T.stellen(n), p = lupe ? R.PRUEF[lupe] : null;
    return '<span class="ziffern">' + ["T", "H", "Z", "E"].filter(k => s[k] !== "")
      .map(k => `<span class="${k.toLowerCase()}${k === p ? " pruef" : ""}">${s[k]}</span>`).join("") + "</span>";
  };
  R.gleichung = (n, r, lupe) => `${R.zahl(n, lupe)}<span class="ca">≈</span>${R.zahl(r)}`;
  R.aufabSVG = auf => `<svg viewBox="0 0 48 34" aria-hidden="true"><path d="${auf ? "M6 28 Q18 2 32 14" : "M42 28 Q30 2 16 14"}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="${auf ? "M26 8 L34 16 L24 20" : "M22 8 L14 16 L24 20"}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------------- Zufallszahlen ----------------
  // stufe 1: weg von der Mitte; 2: alle (mit Mitte); 3: Sonderfälle (Mitte, Übergang, unter 100, schon rund)
  R.zufallsZahl = (st, stufe, vorher) => {
    const b = R.BASIS[st];
    for (let v = 0; v < 500; v++) {
      let n;
      if (stufe === 3 && Math.random() < .55) {
        const art = T.wahl(st === "Z" ? ["mitte", "uebergang", "uebergang", "rund"] : ["mitte", "uebergang", "unter100", "unter100", "rund"]);
        if (art === "mitte") n = st === "Z" ? T.zufall(1, 99) * 10 + 5 : T.zufall(1, 9) * 100 + 50;
        if (art === "uebergang") n = st === "Z" ? T.zufall(1, 9) * 100 + 90 + T.zufall(5, 9) : 900 + T.zufall(50, 99);
        if (art === "uebergang" && st === "Z" && Math.random() < .2) n = T.wahl([995, 996, 997, 998, 999]);
        if (art === "unter100") n = T.zufall(11, 99);
        if (art === "rund") n = st === "Z" ? T.zufall(2, 99) * 10 : T.zufall(1, 9) * 100;
      } else {
        n = T.zufall(st === "Z" ? 11 : 101, 989);
        if (n % b === 0) continue;
        const d = R.pruefziffer(n, st);
        if (stufe === 1 && (d === 0 || d === 4 || d === 5 || d === 6)) continue;
        if (st === "H" && n % 10 === 0 && stufe < 3) continue;
      }
      if (n >= 1 && n <= 999 && n !== vorher) return n;
    }
    return 273;
  };

  // ---------------- Rundungsberg (SVG) ----------------
  // Plätze 0–4 auf dem linken Hang, 5–9 auf dem rechten, Gipfel zwischen 4 und 5.
  const FL = { x: 75, y: 370 }, P = { x: 450, y: 70 }, FR = { x: 825, y: 370 };
  const platzPos = i => {
    if (i <= 4) { const t = (i + 1) / 6; return { x: FL.x + (P.x - FL.x) * t - 30, y: FL.y + (P.y - FL.y) * t - 32 }; }
    const t = (i - 4) / 6; return { x: P.x + (FR.x - P.x) * t + 30, y: P.y + (FR.y - P.y) * t - 32 };
  };
  R.berg = (box, opts = {}) => {
    const ns = "http://www.w3.org/2000/svg";
    const w = T.el("div", "berg"); box.appendChild(w);
    const plaetze = Array.from({ length: 10 }, (_, i) => { const p = platzPos(i);
      return `<g class="platz" data-i="${i}" transform="translate(${p.x},${p.y})"><circle r="28"/><text>${i}</text></g>`; }).join("");
    w.innerHTML = `<svg viewBox="-10 20 920 450" width="${opts.breite || 900}" role="img" aria-label="Rundungsberg mit den Plätzen 0 bis 9">
      <path class="hang-l" d="M${FL.x},${FL.y} L${P.x},${P.y} L${P.x},${FL.y} Z"/><path class="hang-r" d="M${P.x},${P.y} L${FR.x},${FR.y} L${P.x},${FR.y} Z"/>
      <path class="umriss" d="M10,${FL.y} L${FL.x},${FL.y} L${P.x},${P.y} L${FR.x},${FR.y} L890,${FR.y}"/>
      <g class="gipfel hilfe"><text x="${P.x}" y="${P.y - 18}">Gipfel</text></g>
      <g class="wort" style="color:#2d5f9e"><text x="300" y="${FL.y - 34}" fill="#2d5f9e">abrunden</text>
        <path d="M250 ${FL.y - 72} Q205 ${FL.y - 60} 170 ${FL.y - 26}" fill="none" stroke="#2d5f9e" stroke-width="5" stroke-linecap="round"/><path d="M168 ${FL.y - 44} L166 ${FL.y - 22} L188 ${FL.y - 24}" fill="none" stroke="#2d5f9e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g class="wort"><text x="600" y="${FR.y - 34}" fill="#24753a">aufrunden</text>
        <path d="M650 ${FR.y - 72} Q695 ${FR.y - 60} 730 ${FR.y - 26}" fill="none" stroke="#24753a" stroke-width="5" stroke-linecap="round"/><path d="M732 ${FR.y - 44} L734 ${FR.y - 22} L712 ${FR.y - 24}" fill="none" stroke="#24753a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
      ${plaetze}
      <g class="fuss links" data-seite="u" transform="translate(${FL.x},${FL.y + 42})"><rect x="-80" y="-30" width="160" height="60" rx="12"/><text></text></g>
      <g class="fuss rechts" data-seite="o" transform="translate(${FR.x},${FR.y + 42})"><rect x="-80" y="-30" width="160" height="60" rx="12"/><text></text></g>
      <g class="kugel" style="visibility:hidden"><circle r="27"/><text></text></g>
    </svg>`;
    const svg = w.querySelector("svg"), kugel = w.querySelector(".kugel");
    const pl = [...w.querySelectorAll(".platz")], fu = { u: w.querySelector(".fuss.links"), o: w.querySelector(".fuss.rechts") };
    pl.forEach(g => g.addEventListener("click", () => opts.onPlatz && opts.onPlatz(+g.dataset.i)));
    Object.entries(fu).forEach(([k, g]) => g.addEventListener("click", () => opts.onFuss && opts.onFuss(k)));
    const setzeKugel = (x, y) => kugel.setAttribute("style", `transform:translate(${x}px,${y}px)`);
    const obj = {
      el: w,
      fuesse(u, o) { fu.u.querySelector("text").textContent = u; fu.o.querySelector("text").textContent = o; },
      tippbar(an) { pl.concat(Object.values(fu)).forEach(g => g.classList.toggle("tippbar", an)); },
      leere() { kugel.style.visibility = "hidden"; pl.forEach(g => g.classList.remove("an", "falsch")); Object.values(fu).forEach(g => g.classList.remove("an")); },
      platz(i, cls = "an") { pl[i].classList.add(cls); },
      fuss(seite) { fu[seite].classList.add("an"); },
      // Kugel mit Ziffer d auf Platz d setzen (farbe = Farbe der Prüfstelle)
      kugel(d, farbe, sofort) {
        kugel.querySelector("text").textContent = d; kugel.querySelector("circle").setAttribute("fill", farbe);
        const p = platzPos(d);
        if (sofort || !T.bewegt) { kugel.style.transition = "none"; setzeKugel(p.x, p.y); kugel.getBoundingClientRect(); kugel.style.transition = ""; }
        else { kugel.style.transition = "none"; setzeKugel(p.x, 20); kugel.getBoundingClientRect(); kugel.style.transition = ""; setzeKugel(p.x, p.y); }
        kugel.style.visibility = "visible";
      },
      // Kugel rollt zum Fuß (seite "u" oder "o")
      rolle(seite) { const f = seite === "u" ? FL : FR; setzeKugel(f.x + (seite === "u" ? -4 : 4), f.y - 28); },
      svg,
    };
    return obj;
  };
  R.FARBE = { Z: "#2667c9", H: "#d03a32" };   // Kugel = Farbe der Prüfstelle (Einer blau, Zehner rot)

  // Merkkarte
  R.MERK = `<strong>So runde ich</strong><span class="ab">Bei 0, 1, 2, 3, 4 wird abgerundet.</span><br><span class="auf">Bei 5, 6, 7, 8, 9 wird aufgerundet.</span>`;

  window.Runden = R;
})();
