// Silbenschrift für alle Tafelbilder.
// Texte so schreiben: "-" trennt Silben, Leerzeichen trennt Wörter, <br> macht einen Zeilenumbruch.
// Beispiel: "Lie-be Kin-der," – Wörter ohne Buchstaben (z. B. ein Datum) bekommen keinen Bogen.
function silben(t){
  return String(t).split(/<br\s*\/?>/i).map(zeile =>
    zeile.split(' ').filter(w => w !== '').map(w => {
      if (!/[A-Za-zÄÖÜäöüß]/.test(w)) return '<span class="w">' + w + '</span>';
      return '<span class="w">' + w.split('-').map((s, i) => '<span class="s ' + (i % 2 ? 'b' : 'a') + '">' + s + '</span>').join('') + '</span>';
    }).join(' ')
  ).join('<br>');
}
// Text ohne Silbentrennstriche, z. B. für Vorlese-Programme
function ohneSilben(t){ return String(t).replace(/<br\s*\/?>/gi, ' ').replace(/-/g, ''); }
// Schalter "Silben": box = Kästchen, ziel = Bereich, in dem die Silbenschrift gilt,
// key = Name zum Merken der Auswahl, standard = an (true) oder aus (false) beim ersten Öffnen
function silbenSchalter(box, ziel, key, standard){
  let an = standard;
  try { const v = localStorage.getItem(key); if (v !== null) an = v === '1'; } catch (e) {}
  box.checked = an;
  const anwenden = () => {
    ziel.classList.toggle('silben', box.checked);
    try { localStorage.setItem(key, box.checked ? '1' : '0'); } catch (e) {}
  };
  box.addEventListener('change', anwenden); anwenden();
}
