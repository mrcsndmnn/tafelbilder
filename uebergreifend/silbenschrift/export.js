/* =====================================================================
   Export der Silbenschrift als PNG, JPG, PDF und Word (.docx)
   Alles entsteht im Browser – ohne fremde Bibliotheken, ohne Internet.
   SilbenExport.speichere(format, { text, groesse, boegen, farben })
     text    = Text mit Silbengrenzen ("Lie-be Kin-der"), Zeilen mit \n
     groesse = Schriftgröße in Bildschirm-Pixeln (wie in der Vorschau)
   ===================================================================== */
(function () {
  "use strict";
  const BLAU = "#1f5fbf", ROT = "#c8322c", TINTE = "#1d2320", BOGEN = "#3a3a3a";
  const BUCHST = /[A-Za-zÄÖÜäöüß]/;

  // Text → Zeilen → Wörter → Silben
  function zerlege(text) {
    return String(text).split("\n").map(z => z.split(" ").filter(w => w !== "").map(w =>
      BUCHST.test(w) ? { silben: w.split("-").filter(s => s !== ""), wort: true } : { silben: [w], wort: false }));
  }
  const schrift = px => `700 ${px}px Andika, "Comic Sans MS", "Segoe UI", sans-serif`;

  // ---------------- Bild zeichnen (Canvas) ----------------
  // Zeilen umbrechen und Lage jeder Silbe berechnen
  function setze(text, breite, px, ctx) {
    ctx.font = schrift(px);
    const wortAbst = px * .45, silbAbst = px * .1, zeilenH = px * 1.75;
    const zeilen = [];
    zerlege(text).forEach(absatz => {
      let zeile = [], x = 0;
      if (!absatz.length) { zeilen.push([]); return; }
      absatz.forEach(w => {
        const teile = w.silben.map(s => ({ s, b: ctx.measureText(s).width }));
        const wb = teile.reduce((a, t) => a + t.b, 0) + silbAbst * (teile.length - 1);
        if (zeile.length && x + wb > breite) { zeilen.push(zeile); zeile = []; x = 0; }
        let sx = x;
        zeile.push({ wort: w.wort, teile: teile.map(t => { const r = { s: t.s, x: sx, b: t.b }; sx += t.b + silbAbst; return r; }) });
        x += wb + wortAbst;
      });
      zeilen.push(zeile);
    });
    return { zeilen, zeilenH };
  }
  function zeichne(ctx, zeilen, von, bis, rand, px, zeilenH, opt) {
    ctx.font = schrift(px); ctx.textBaseline = "alphabetic";
    for (let i = von; i < bis; i++) {
      const y = rand + (i - von) * zeilenH + px * 1.05;
      zeilen[i].forEach(w => w.teile.forEach((t, j) => {
        ctx.fillStyle = !opt.farben || !w.wort ? TINTE : j % 2 ? ROT : BLAU;
        ctx.fillText(t.s, rand + t.x, y);
        if (opt.boegen && w.wort) {
          const l = rand + t.x + px * .04, r = rand + t.x + t.b - px * .04, oben = y + px * .2, tief = px * .26;
          ctx.beginPath(); ctx.moveTo(l, oben);
          ctx.bezierCurveTo(l, oben + tief * 1.33, r, oben + tief * 1.33, r, oben);
          ctx.lineWidth = Math.max(2, px * .065); ctx.strokeStyle = BOGEN; ctx.lineCap = "round"; ctx.stroke();
        }
      }));
    }
  }
  // Ein Bild mit allen Zeilen
  function bild(opt, breite = 1800) {
    const px = opt.groesse * 2, rand = Math.round(px * 1.2);
    const c = document.createElement("canvas"), ctx = c.getContext("2d");
    const { zeilen, zeilenH } = setze(opt.text, breite - 2 * rand, px, ctx);
    c.width = breite; c.height = Math.ceil(2 * rand + Math.max(1, zeilen.length) * zeilenH);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    zeichne(ctx, zeilen, 0, zeilen.length, rand, px, zeilenH, opt);
    return c;
  }
  // Seiten für A4 (Zeilen werden nicht zerschnitten)
  function seiten(opt, breite = 1800) {
    const px = opt.groesse * 2, rand = 0;
    const mess = document.createElement("canvas").getContext("2d");
    const { zeilen, zeilenH } = setze(opt.text, breite, px, mess);
    const seitenH = Math.floor(breite * (841.89 - 2 * 56) / (595.28 - 2 * 56));   // Verhältnis des Satzspiegels
    const proSeite = Math.max(1, Math.floor(seitenH / zeilenH)), liste = [];
    for (let von = 0; von < Math.max(1, zeilen.length); von += proSeite) {
      const bis = Math.min(zeilen.length, von + proSeite);
      const c = document.createElement("canvas"); c.width = breite; c.height = Math.ceil(Math.max(1, bis - von) * zeilenH + px * .3);
      const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      zeichne(ctx, zeilen, von, bis, rand, px, zeilenH, opt);
      liste.push(c);
    }
    return liste;
  }
  const blob = (c, typ, q) => new Promise(res => c.toBlob(res, typ, q));
  const bytes = async b => new Uint8Array(await b.arrayBuffer());

  // ---------------- PDF (A4, je Seite ein Bild) ----------------
  async function pdf(opt) {
    const A4 = [595.28, 841.89], R = 56, enc = new TextEncoder(), teile = [], offs = [];
    let laenge = 0;
    const add = d => { const u = typeof d === "string" ? enc.encode(d) : d; teile.push(u); laenge += u.length; };
    const seitenListe = seiten(opt), n = seitenListe.length;
    // Objekte: 1 Katalog, 2 Seiten, dann je Seite: Seite, Inhalt, Bild
    add("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    const obj = (nr, kopf, strom) => { offs[nr] = laenge; add(`${nr} 0 obj\n${kopf}\n`); if (strom) { add("stream\n"); add(strom); add("\nendstream\n"); } add("endobj\n"); };
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, `<< /Type /Pages /Count ${n} /Kids [${seitenListe.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] >>`);
    for (let i = 0; i < n; i++) {
      const c = seitenListe[i], jpg = await bytes(await blob(c, "image/jpeg", .92));
      const w = A4[0] - 2 * R, h = c.height * w / c.width, s = 3 + i * 3;
      const inhalt = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${R} ${(A4[1] - R - h).toFixed(2)} cm /Im1 Do Q`;
      obj(s, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4[0]} ${A4[1]}] /Resources << /XObject << /Im1 ${s + 2} 0 R >> >> /Contents ${s + 1} 0 R >>`);
      obj(s + 1, `<< /Length ${inhalt.length} >>`, inhalt);
      obj(s + 2, `<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>`, jpg);
    }
    const anzahl = 3 + n * 3, xref = laenge;
    add(`xref\n0 ${anzahl}\n0000000000 65535 f \n` + offs.slice(1, anzahl).map(o => String(o).padStart(10, "0") + " 00000 n \n").join(""));
    add(`trailer\n<< /Size ${anzahl} /Root 1 0 R /Info << /Producer (Silbenschrift-Editor) >> >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(teile, { type: "application/pdf" });
  }

  // ---------------- ZIP (für .docx, ohne Komprimierung) ----------------
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  function zip(dateien) {   // [{name, daten: Uint8Array|string}]
    const enc = new TextEncoder(), teile = [], zentral = []; let off = 0;
    const d = new Date(), zeit = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), datum = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    dateien.forEach(f => {
      const name = enc.encode(f.name), daten = typeof f.daten === "string" ? enc.encode(f.daten) : f.daten, crc = crc32(daten);
      const k = new DataView(new ArrayBuffer(30));
      [[0, 0x04034b50, 4], [4, 20, 2], [6, 0x0800, 2], [8, 0, 2], [10, zeit, 2], [12, datum, 2], [14, crc, 4], [18, daten.length, 4], [22, daten.length, 4], [26, name.length, 2], [28, 0, 2]]
        .forEach(([o, v, l]) => l === 4 ? k.setUint32(o, v, true) : k.setUint16(o, v, true));
      teile.push(new Uint8Array(k.buffer), name, daten);
      const z = new DataView(new ArrayBuffer(46));
      [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x0800, 2], [10, 0, 2], [12, zeit, 2], [14, datum, 2], [16, crc, 4], [20, daten.length, 4], [24, daten.length, 4],
        [28, name.length, 2], [30, 0, 2], [32, 0, 2], [34, 0, 2], [36, 0, 2], [38, 0, 4], [42, off, 4]].forEach(([o, v, l]) => l === 4 ? z.setUint32(o, v, true) : z.setUint16(o, v, true));
      zentral.push(new Uint8Array(z.buffer), name);
      off += 30 + name.length + daten.length;
    });
    const zLaenge = zentral.reduce((a, u) => a + u.length, 0), e = new DataView(new ArrayBuffer(22));
    [[0, 0x06054b50, 4], [4, 0, 2], [6, 0, 2], [8, dateien.length, 2], [10, dateien.length, 2], [12, zLaenge, 4], [16, off, 4], [20, 0, 2]]
      .forEach(([o, v, l]) => l === 4 ? e.setUint32(o, v, true) : e.setUint16(o, v, true));
    return new Blob([...teile, ...zentral, new Uint8Array(e.buffer)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  // ---------------- Word (.docx) ----------------
  const xml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const TYPEN = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const SEITE = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>';
  const doc = body => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document ${NS}><w:body>${body}${SEITE}</w:body></w:document>`;

  // Bearbeitbarer Text: farbige Silben; Bögen als Unterstrich je Silbe (Word kann keine Bögen unter Text zeichnen)
  function docxText(opt) {
    const pt = Math.round(opt.groesse * .6) * 2;   // halbe Punkte: M (40 px) → 24 pt
    const lauf = (t, farbe, unter, klein) => `<w:r><w:rPr><w:rFonts w:ascii="Andika" w:hAnsi="Andika" w:cs="Andika"/><w:b/><w:color w:val="${farbe}"/><w:sz w:val="${klein ? 8 : pt}"/>` +
      (unter ? '<w:u w:val="single" w:color="3A3A3A"/>' : "") + `</w:rPr><w:t xml:space="preserve">${xml(t)}</w:t></w:r>`;
    const body = zerlege(opt.text).map(zeile => `<w:p><w:pPr><w:spacing w:after="120" w:line="480" w:lineRule="auto"/></w:pPr>` +
      zeile.map((w, i) => (i ? lauf(" ", "1D2320", false) : "") + w.silben.map((s, j) =>
        (j && opt.boegen && w.wort ? lauf("\u202F", "1D2320", false, true) : "") +   // schmales, nicht umbrechendes Leerzeichen
        lauf(s, !opt.farben || !w.wort ? "1D2320" : j % 2 ? "C8322C" : "1F5FBF", opt.boegen && w.wort)).join("")).join("") + "</w:p>").join("");
    return zip([{ name: "[Content_Types].xml", daten: TYPEN }, { name: "_rels/.rels", daten: RELS }, { name: "word/document.xml", daten: doc(body) }]);
  }
  // Als Bild: genau wie die Vorschau, mit Bögen – je A4-Seite ein Bild
  async function docxBild(opt) {
    const liste = seiten(opt), dateien = [], rels = [];
    const breiteEmu = 6120000;   // 17 cm
    let body = "";
    for (let i = 0; i < liste.length; i++) {
      const c = liste[i], png = await bytes(await blob(c, "image/png")), id = "rId" + (10 + i), hoeheEmu = Math.round(breiteEmu * c.height / c.width);
      dateien.push({ name: `word/media/seite${i + 1}.png`, daten: png });
      rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/seite${i + 1}.png"/>`);
      body += `<w:p>${i ? '<w:r><w:br w:type="page"/></w:r>' : ""}<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${breiteEmu}" cy="${hoeheEmu}"/>` +
        `<wp:docPr id="${i + 1}" name="Silbenschrift ${i + 1}" descr="${xml(opt.text.replace(/-/g, "").slice(0, 300))}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
        `<pic:pic><pic:nvPicPr><pic:cNvPr id="${i + 1}" name="seite${i + 1}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
        `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${breiteEmu}" cy="${hoeheEmu}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
    }
    const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.join("")}</Relationships>`;
    return zip([{ name: "[Content_Types].xml", daten: TYPEN }, { name: "_rels/.rels", daten: RELS }, { name: "word/document.xml", daten: doc(body) },
      { name: "word/_rels/document.xml.rels", daten: docRels }, ...dateien]);
  }

  // ---------------- Herunterladen ----------------
  function lade(b, endung) {
    const d = new Date(), name = `silbenschrift-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}.${endung}`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    return name;
  }
  async function speichere(format, opt) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    if (format === "png") return lade(await blob(bild(opt), "image/png"), "png");
    if (format === "jpg") return lade(await blob(bild(opt), "image/jpeg", .92), "jpg");
    if (format === "pdf") return lade(await pdf(opt), "pdf");
    if (format === "docx") return lade(docxText(opt), "docx");
    if (format === "docx-bild") return lade(await docxBild(opt), "docx");
  }
  window.SilbenExport = { speichere, bild, pdf, docxText, docxBild };
})();
