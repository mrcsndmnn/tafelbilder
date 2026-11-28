# Prüfbericht Gestaltung (Phase 4)

Stand: 28.11.2026 · Grundlage: [GESTALTUNG.md](../GESTALTUNG.md) (Regeln R1–R10 und Prüfliste)

**Wichtig:** Dieser Bericht ändert nichts. Bitte tragen Sie in der Spalte **Freigabe** ein, was umgesetzt werden soll (z. B. „ja“, „nein“ oder „nur 1 und 2“). Erst danach werden Seiten angepasst.

## So wurde geprüft

- Jede Seite wurde im Startzustand bei 1600 × 900 fotografiert (Ordner `pruefbericht-bilder/`, Link „Bild“ in jeder Zeile).
- Automatisch gezählt:
  - **Knöpfe**: alle sichtbaren Knöpfe, in Klammern die in der Kopfleiste (oben).
  - **frei**: Anteil der Bühne ohne Inhalt (Ziel R9: mindestens 40 %).
  - **Farbtöne**: Anzahl kräftiger Farbtöne auf der Seite (Hinweis auf R4).
  - **Wörter**: sichtbare Wörter außerhalb von Knöpfen (R10).
  - **Hilfen**: ob die Seite mit eingeschalteten Hilfen startet (R6). „–“ heißt: Die Seite hat keinen gemeinsamen Hilfen-Schalter.
- Die Fragen „Ein Blickfang?“, „Deko?“ und „Standardplätze?“ wurden anhand der Bildschirmfotos von Hand beurteilt und stehen in den Spalten „Hauptproblem“ und „Vorschlag“.
- ¹ Bei Seiten mit Hundertertafel zählt jedes Tafelfeld als Knopf. Die eigentlichen Bedienknöpfe sind die Zahl in Klammern plus die Knöpfe der zweiten Zeile.
- **Einstufung**:
  - **passt**: Es ist nichts oder nur das Lehrkraftmenü nötig.
  - **kleine Anpassung**: Knöpfe ins Lehrkraftmenü, Hilfen und Farben aus beim Start.
  - **größere Anpassung**: Die Darstellung muss ausgedünnt werden.
- Druckvorlagen und Generatoren wurden nur nach R4, R5, R9 und R10 geprüft. Bei Pilzen und Briefen gelten Bilder und Silbenschrift als Inhalt.
- Übersichtsseiten der Themen und Weiterleitungen (`deutsch/brief-aufbau/`, `su/pilze-aufbau/`, `vertretung/spiele/`) wurden nicht bewertet.

## Zusammenfassung


- Geprüfte Seiten: **68**
  - passt: 27
  - kleine Anpassung: 30
  - größere Anpassung: 11
- Fast alle Tafelbilder außerhalb von „Runden“ zeigen ihre Einstellungen in einer oder zwei Knopfleisten. Sie starten meist mit eingeschalteten Hilfen, im Zahlenstrahl auch mit eingeschalteten Farben.
  - Das lässt sich je Bereich mit wenigen Änderungen an den gemeinsamen Bausteinen lösen (`T.kopf` / `T.leiste`, `buehne.js`, `bilder.js`, `spiele.js` mit `menue: true`).
  - **Vorschlag**: Diese „kleinen Anpassungen“ zuerst und bereichsweise freigeben.
- Größere Anpassungen betreffen vor allem Seiten, auf denen mehrere Elemente um den Blick konkurrieren (Hundertertafel plus zweites Bedienfeld) oder auf denen Farbflächen benutzt werden.
- Mit der Silbenschrift (blau/rot) und den Artikelfarben haben Pilze, Briefe und Vertretung eigene Farbsysteme. Auf einigen Seiten werden diese Farben zusätzlich für Rahmen oder Flächen benutzt und sind damit doppelt belegt (siehe Tabelle).


## Zahlenraum bis 1000

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `mathe/zahlenraum-1000/blitzrunde/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_blitzrunde.jpg) | kleine Anpassung | Knöpfe: 12 (10 oben) · frei: 86 % · Farbtöne: 0 · Wörter: 10 · Hilfen: an | Kopf- und Fußleiste mit 9 Bedienknöpfen; Hilfen und Stellenfarben beim Start an; Rahmen um die Karte | 1. Lehrkraftmenü (menue:true), Hilfen und Farben aus beim Start · 2. Karte ohne Rahmen, Zahl ≥ 96 px in die Mitte · 3. Kinderknöpfe „Lösung“/„Weiter“ unten rechts | |
| `mathe/zahlenraum-1000/detektiv/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_detektiv.jpg) | größere Anpassung | Knöpfe: 120 (9 oben) ¹ · frei: 68 % · Farbtöne: 0 · Wörter: 24 · Hilfen: an | Hundertertafel, Quadrat-Leiste, Hinweiskarten und 9 Leistenknöpfe gleichzeitig | 1. Lehrkraftmenü · 2. Quadrat-Leiste ins Menü, nur die Tafel und der aktuelle Hinweis sichtbar · 3. „Nächster Hinweis“ als einziger Kinderknopf | |
| `mathe/zahlenraum-1000/druck-geheimschrift/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_druck-geheimschrift.jpg) | passt (Druck) | Knöpfe: 13 (13 oben) · frei: 46 % · Farbtöne: 0 · Wörter: 32 · Hilfen: – | Druckvorlage: Blatt schwarz-weiß, ruhig | Keine Änderung nötig (Einstellungsleiste ist Lehrkraft-Werkzeug) | |
| `mathe/zahlenraum-1000/entdecken/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_entdecken.jpg) | größere Anpassung | Knöpfe: 125 (15 oben) ¹ · frei: 71 % · Farbtöne: 3 · Wörter: 5 · Hilfen: an | Drei Bereiche konkurrieren: Hundertertafel, Pfeilfeld, große farbige Zahl mit Stellenwerttafel | 1. Lehrkraftmenü, Farben aus beim Start · 2. Pfeilfeld und Stellenwerttafel als Hilfen im Menü · 3. Große Zahl als einziger Blickfang | |
| `mathe/zahlenraum-1000/fehlersuche/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_fehlersuche.jpg) | kleine Anpassung | Knöpfe: 30 (10 oben) · frei: 82 % · Farbtöne: 0 · Wörter: 15 · Hilfen: an | 9 Leistenknöpfe, Satzmuster-Kasten beim Start sichtbar | 1. Lehrkraftmenü · 2. Satzmuster aus beim Start · 3. „Auflösen“ ins Menü | |
| `mathe/zahlenraum-1000/geheimschrift-legen/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_geheimschrift-legen.jpg) | größere Anpassung | Knöpfe: 17 (8 oben) · frei: 78 % · Farbtöne: 3 · Wörter: 22 · Hilfen: an | Drei farbige Spalten (H/Z/E-Farben als Flächen), +/–-Knöpfe, Satzmuster und 4 Aktionsknöpfe | 1. Spalten nur mit farbiger Überschrift, Flächen weiß (R4) · 2. Lehrkraftmenü, Satzmuster aus · 3. Kinderknöpfe „Prüfen“, „Nächste Zahl“ | |
| `mathe/zahlenraum-1000/geheimschrift-lesen/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_geheimschrift-lesen.jpg) | kleine Anpassung | Knöpfe: 11 (9 oben) · frei: 82 % · Farbtöne: 0 · Wörter: 17 · Hilfen: an | Rahmen um das Material, Satzmuster beim Start, 10 Knöpfe | 1. Lehrkraftmenü, Satzmuster aus · 2. Rahmen entfernen · 3. Kinderknöpfe „Lösung“/„Nächste Zahl“ | |
| `mathe/zahlenraum-1000/linien/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_linien.jpg) | kleine Anpassung | Knöpfe: 118 (7 oben) ¹ · frei: 76 % · Farbtöne: 0 · Wörter: 9 · Hilfen: an | Quadrat-Leiste und Hundertertafel plus 7 Leistenknöpfe; sonst ruhig | 1. Lehrkraftmenü · 2. Quadrat-Leiste ins Menü · 3. „Was bleibt gleich?“ als Hilfe | |
| `mathe/zahlenraum-1000/sprungstellen/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_sprungstellen.jpg) | größere Anpassung | Knöpfe: 124 (11 oben) ¹ · frei: 70 % · Farbtöne: 3 · Wörter: 19 · Hilfen: an | Tafel, farbige Stellenwerttafel und große Zahl konkurrieren; viele Wahlknöpfe | 1. Lehrkraftmenü, Farben aus · 2. Stellenwerttafel als Hilfe · 3. Frage und Zahl in die Mitte, Tafel kleiner | |
| `mathe/zahlenraum-1000/wege/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_wege.jpg) | kleine Anpassung | Knöpfe: 122 (11 oben) ¹ · frei: 71 % · Farbtöne: 0 · Wörter: 17 · Hilfen: an | Tafel füllt die Bühne, 10 Leistenknöpfe, gelbe Markierung + Käfer | 1. Lehrkraftmenü · 2. Modus/Stufe ins Menü · 3. Käfer behalten (Inhalt), Pfeil-Eingabe unten rechts | |
| `mathe/zahlenraum-1000/zahlenkreuz/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_zahlenkreuz.jpg) | größere Anpassung | Knöpfe: 27 (12 oben) · frei: 77 % · Farbtöne: 1 · Wörter: 21 · Hilfen: an | Zahlenkreuz und Zahlenfenster (zweites Gitter) gleichzeitig, gelb hinterlegt | 1. Lehrkraftmenü · 2. Zahlenfenster nur als Hilfe · 3. Gelb nur für „gesucht“ oder ganz weg (R4) | |
| `mathe/zahlenraum-1000/zoom/` [Bild](pruefbericht-bilder/mathe_zahlenraum-1000_zoom.jpg) | kleine Anpassung | Knöpfe: 16 (6 oben) · frei: 86 % · Farbtöne: 0 · Wörter: 14 · Hilfen: an | Ruhig; nur Leistenknöpfe oben | 1. Lehrkraftmenü · 2. Hilfen aus beim Start | |

## Zahlenstrahl bis 1000

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `mathe/zahlenstrahl/detektiv/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_detektiv.jpg) | kleine Anpassung | Knöpfe: 16 (8 oben) · frei: 83 % · Farbtöne: 0 · Wörter: 14 · Hilfen: an (Farben auch an) | Farben und Hilfen beim Start an, 9 Knöpfe | 1. Lehrkraftmenü, Farben/Hilfen aus · 2. Satzmuster aus · 3. Kinderknöpfe „Springen“/„Weiter“ | |
| `mathe/zahlenstrahl/druck-ausschnitte/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_druck-ausschnitte.jpg) | passt (Druck) | Knöpfe: 13 (13 oben) · frei: 46 % · Farbtöne: 0 · Wörter: 52 · Hilfen: – | Druckvorlage, schwarz-weiß | Keine Änderung | |
| `mathe/zahlenstrahl/druck-karten/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_druck-karten.jpg) | passt (Druck) | Knöpfe: 9 (9 oben) · frei: 45 % · Farbtöne: 0 · Wörter: 62 · Hilfen: – | Druckvorlage, schwarz-weiß | Keine Änderung | |
| `mathe/zahlenstrahl/druck-nachbarn/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_druck-nachbarn.jpg) | passt (Druck) | Knöpfe: 9 (9 oben) · frei: 46 % · Farbtöne: 0 · Wörter: 45 · Hilfen: – | Druckvorlage; gelbe Spalte „Zahl“ | Gelb nur wenn gewünscht, sonst grau (R4) | |
| `mathe/zahlenstrahl/druck-streifen/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_druck-streifen.jpg) | passt (Druck) | Knöpfe: 12 (12 oben) · frei: 50 % · Farbtöne: 0 · Wörter: 36 · Hilfen: – | Druckvorlage, schwarz-weiß | Keine Änderung | |
| `mathe/zahlenstrahl/lupe/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_lupe.jpg) | kleine Anpassung | Knöpfe: 6 (6 oben) · frei: 85 % · Farbtöne: 0 · Wörter: 23 · Hilfen: an (Farben auch an) | Farben und Hilfen beim Start an; Sprungbögen grün | 1. Lehrkraftmenü, Farben aus · 2. Bögen schwarz/grau | |
| `mathe/zahlenstrahl/mitte/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_mitte.jpg) | kleine Anpassung | Knöpfe: 9 (7 oben) · frei: 85 % · Farbtöne: 0 · Wörter: 27 · Hilfen: an (Farben auch an) | Farben an (grüne Striche, lila Mittelstrich), Satzmuster sichtbar | 1. Lehrkraftmenü · 2. Striche schwarz, Mittelstrich grau · 3. Satzmuster aus | |
| `mathe/zahlenstrahl/nachbarn/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_nachbarn.jpg) | größere Anpassung | Knöpfe: 14 (10 oben) · frei: 84 % · Farbtöne: 0 · Wörter: 7 · Hilfen: an (Farben auch an) | Strahl mit farbigen Strichen, Hilfslinien, drei Kästen und gelbe Zahl | 1. Lehrkraftmenü, Farben aus · 2. Hilfslinien nur als Hilfe · 3. Gelb weg, Zahl schwarz | |
| `mathe/zahlenstrahl/ordnen/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_ordnen.jpg) | kleine Anpassung | Knöpfe: 16 (10 oben) · frei: 82 % · Farbtöne: 0 · Wörter: 20 · Hilfen: an (Farben auch an) | 9 Leistenknöpfe, lila Vergleichszeichen, Ablage-Rahmen | 1. Lehrkraftmenü · 2. Vergleichszeichen schwarz · 3. „Prüfen“ als Kinderknopf | |
| `mathe/zahlenstrahl/wo-wohnt/` [Bild](pruefbericht-bilder/mathe_zahlenstrahl_wo-wohnt.jpg) | größere Anpassung | Knöpfe: 16 (14 oben) · frei: 80 % · Farbtöne: 1 · Wörter: 15 · Hilfen: an (Farben auch an) | Strahl mit 100 roten/grünen Strichen, 13 Knöpfe in zwei Leisten | 1. Lehrkraftmenü · 2. Striche schwarz, Farben nur auf Wunsch · 3. Bereich/Modus ins Menü | |

## Briefe

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `deutsch/brief-arbeitsblatt/` [Bild](pruefbericht-bilder/deutsch_brief-arbeitsblatt.jpg) | passt (Druck) | Knöpfe: 1 (1 oben) · frei: 94 % · Farbtöne: 0 · Wörter: 169 · Hilfen: – | Arbeitsblatt (Druck) | Keine Änderung | |
| `deutsch/briefe/adresse/` [Bild](pruefbericht-bilder/deutsch_briefe_adresse.jpg) | kleine Anpassung | Knöpfe: 7 (5 oben) · frei: 40 % · Farbtöne: 0 · Wörter: 34 · Hilfen: an | Farbige Zeilen (blau/grün/rot) für Name/Straße/Ort, 7 Knöpfe | 1. Knöpfe „Wörter/Hilfe/Neu“ ins Menü (buehne.js menue:true) · 2. Zeilenfarben nur mit Hilfe · 3. „Prüfen“ als Kinderknopf | |
| `deutsch/briefe/aufbau/` [Bild](pruefbericht-bilder/deutsch_briefe_aufbau.jpg) | kleine Anpassung | Knöpfe: 5 (5 oben) · frei: 62 % · Farbtöne: 0 · Wörter: 207 · Hilfen: an | Viel Text (Brief) ist Inhalt; Silben-/Wörter-/Hilfe-Knöpfe oben | 1. Leistenknöpfe ins Menü · 2. „Prüfen“ als Kinderknopf | |
| `deutsch/briefe/post-detektiv/` [Bild](pruefbericht-bilder/deutsch_briefe_post-detektiv.jpg) | kleine Anpassung | Knöpfe: 17 (5 oben) · frei: 49 % · Farbtöne: 0 · Wörter: 38 · Hilfen: an | Checkliste mit vier farbigen Symbolen neben dem Umschlag, 6 Knöpfe | 1. Leistenknöpfe ins Menü · 2. Checkliste ohne Farben · 3. „Abschicken“ als Kinderknopf | |
| `deutsch/briefe/umschlag/` [Bild](pruefbericht-bilder/deutsch_briefe_umschlag.jpg) | passt | Knöpfe: 5 (5 oben) · frei: 35 % · Farbtöne: 0 · Wörter: 38 · Hilfen: an | Ruhig; Briefmarke ist Inhalt | Nur Leistenknöpfe ins Menü (optional) | |
| `deutsch/briefe/zurueck/` [Bild](pruefbericht-bilder/deutsch_briefe_zurueck.jpg) | passt | Knöpfe: 8 (5 oben) · frei: 51 % · Farbtöne: 0 · Wörter: 18 · Hilfen: an | Ruhig, ein Blickfang | Nur Leistenknöpfe ins Menü (optional) | |

## Pilze

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `su/pilze/aufbau/` [Bild](pruefbericht-bilder/su_pilze_aufbau.jpg) | kleine Anpassung | Knöpfe: 12 (8 oben) · frei: 71 % · Farbtöne: 2 · Wörter: 24 · Hilfen: an | 5 Knöpfe oben, Silben/Hilfen an beim Start (Silben sind Inhalt) | 1. Farben/Hilfen/Wörter ins Menü (bilder.js menue:true) · 2. Hilfen aus beim Start · 3. „Prüfen“ unten rechts | |
| `su/pilze/entwicklung/` [Bild](pruefbericht-bilder/su_pilze_entwicklung.jpg) | kleine Anpassung | Knöpfe: 16 (12 oben) · frei: 62 % · Farbtöne: 3 · Wörter: 13 · Hilfen: an | Vier Bildkarten + vier Felder; Kreislauf/Erzählen zusätzlich | 1. Leistenknöpfe ins Menü · 2. Kreislauf als Option im Menü | |
| `su/pilze/essbar-giftig/` [Bild](pruefbericht-bilder/su_pilze_essbar-giftig.jpg) | kleine Anpassung | Knöpfe: 13 (9 oben) · frei: 72 % · Farbtöne: 1 · Wörter: 32 · Hilfen: an | Zwei Körbe flächig grün/orange | 1. Körbe weiß, nur Symbol farbig · 2. Leistenknöpfe ins Menü | |
| `su/pilze/gluecksrad/` [Bild](pruefbericht-bilder/su_pilze_gluecksrad.jpg) | passt | Knöpfe: 9 (7 oben) · frei: 69 % · Farbtöne: 0 · Wörter: 25 · Hilfen: an | Rad ist Inhalt, Farben der Themen einmal belegt | Nur Leistenknöpfe ins Menü | |
| `su/pilze/hefe-versuch/` [Bild](pruefbericht-bilder/su_pilze_hefe-versuch.jpg) | kleine Anpassung | Knöpfe: 14 (8 oben) · frei: 72 % · Farbtöne: 1 · Wörter: 51 · Hilfen: an | Zwei Flaschen und Abstimmungsliste mit 6 Zeilen gleichzeitig | 1. Schritte 1–3 nacheinander zeigen (R8) · 2. Leistenknöpfe ins Menü | |
| `su/pilze/lamellen-roehren/` [Bild](pruefbericht-bilder/su_pilze_lamellen-roehren.jpg) | passt | Knöpfe: 11 (9 oben) · frei: 78 % · Farbtöne: 2 · Wörter: 21 · Hilfen: an | Zwei Bilder, ruhig | Nur Leistenknöpfe ins Menü | |
| `su/pilze/lebensraum/` [Bild](pruefbericht-bilder/su_pilze_lebensraum.jpg) | größere Anpassung | Knöpfe: 14 (7 oben) · frei: 37 % · Farbtöne: 7 · Wörter: 40 · Hilfen: an | Großes Wimmel-Szenenbild mit vielen Farben, freie Fläche nur 37 % | 1. Szene beim Start ohne Marker · 2. Wetter-Knöpfe ins Menü · 3. Leistenknöpfe ins Menü | |
| `su/pilze/lupe/` [Bild](pruefbericht-bilder/su_pilze_lupe.jpg) | passt | Knöpfe: 8 (7 oben) · frei: 69 % · Farbtöne: 2 · Wörter: 37 · Hilfen: an | Ein Pilz, eine Lupe, eine Liste | Nur Leistenknöpfe ins Menü | |
| `su/pilze/memory/` [Bild](pruefbericht-bilder/su_pilze_memory.jpg) | kleine Anpassung | Knöpfe: 22 (10 oben) · frei: 63 % · Farbtöne: 1 · Wörter: 12 · Hilfen: an | 12 grüne Kartenflächen, Team-Zähler oben | 1. Karten weiß mit dünnem Rahmen · 2. Team-/Stufenknöpfe ins Menü | |
| `su/pilze/puzzle/` [Bild](pruefbericht-bilder/su_pilze_puzzle.jpg) | passt | Knöpfe: 13 (10 oben) · frei: 65 % · Farbtöne: 2 · Wörter: 18 · Hilfen: an | Ruhig | Nur Leistenknöpfe ins Menü | |
| `su/pilze/satzbaukasten/` [Bild](pruefbericht-bilder/su_pilze_satzbaukasten.jpg) | kleine Anpassung | Knöpfe: 21 (11 oben) · frei: 59 % · Farbtöne: 1 · Wörter: 22 · Hilfen: an | Zwei Satzzeilen plus 11 Bausteine (Text ist Inhalt) | 1. Nur die aktuelle Satzzeile zeigen (R2) · 2. Leistenknöpfe ins Menü | |
| `su/pilze/tagebuch/` [Bild](pruefbericht-bilder/su_pilze_tagebuch.jpg) | passt | Knöpfe: 13 (10 oben) · frei: 80 % · Farbtöne: 1 · Wörter: 35 · Hilfen: an | Lehrkraft-Werkzeug, ruhig | Nur Leistenknöpfe ins Menü | |
| `su/pilze/zeitraffer/` [Bild](pruefbericht-bilder/su_pilze_zeitraffer.jpg) | kleine Anpassung | Knöpfe: 14 (8 oben) · frei: 69 % · Farbtöne: 2 · Wörter: 41 · Hilfen: an | Bild, Satzkarte, Frage-Karte und Zeitleiste mit 6 Vorschaubildern | 1. Vorschaubilder der Zeitleiste klein/grau · 2. Leistenknöpfe ins Menü | |

## Vertretung: Spiele und Tafelbilder

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `vertretung/deutsch/bildergeschichte/` [Bild](pruefbericht-bilder/vertretung_deutsch_bildergeschichte.jpg) | kleine Anpassung | Knöpfe: 23 (14 oben) · frei: 67 % · Farbtöne: 1 · Wörter: 11 · Hilfen: an | Zwei Leisten (oben Auswahl, unten 6 Knöpfe), Satzmuster an | 1. Auswahl-Leiste ins Menü (spiele.js menue:true) · 2. Satzmuster aus beim Start | |
| `vertretung/deutsch/blitzlesen/` [Bild](pruefbericht-bilder/vertretung_deutsch_blitzlesen.jpg) | kleine Anpassung | Knöpfe: 24 (16 oben) · frei: 80 % · Farbtöne: 0 · Wörter: 12 · Hilfen: an | Zwei Leisten mit zusammen 15 Knöpfen | 1. Was/Tempo/Niveau ins Menü · 2. Kinderknöpfe „Blitz!“/„Weiter“ | |
| `vertretung/mathe/einmaleins-rakete/` [Bild](pruefbericht-bilder/vertretung_mathe_einmaleins-rakete.jpg) | größere Anpassung | Knöpfe: 26 (19 oben) · frei: 65 % · Farbtöne: 1 · Wörter: 8 · Hilfen: an | Drei Bereiche (zwei Raketen-Säulen, Aufgabe), 2 Leisten | 1. Reihen-Auswahl ins Menü · 2. Raketen-Säulen schmaler/grau · 3. Bewertungsknöpfe unten rechts | |
| `vertretung/mathe/rechen-bingo/` [Bild](pruefbericht-bilder/vertretung_mathe_rechen-bingo.jpg) | kleine Anpassung | Knöpfe: 21 (14 oben) · frei: 75 % · Farbtöne: 1 · Wörter: 23 · Hilfen: an | Bingo-Karte und Verlauf-Raster gleichzeitig | 1. Verlauf als Hilfe · 2. Leisten ins Menü | |
| `vertretung/mathe/uhr-werkstatt/` [Bild](pruefbericht-bilder/vertretung_mathe_uhr-werkstatt.jpg) | passt | Knöpfe: 17 (12 oben) · frei: 81 % · Farbtöne: 0 · Wörter: 11 · Hilfen: an | Uhr als einziger Blickfang | Nur Leisten ins Menü | |
| `vertretung/spiele/gluecksrad/` [Bild](pruefbericht-bilder/vertretung_spiele_gluecksrad.jpg) | kleine Anpassung | Knöpfe: 19 (7 oben) · frei: 68 % · Farbtöne: 0 · Wörter: 12 · Hilfen: an | Rad und leerer Kasten; 12 Knöpfe in Fußleiste | 1. Auftrags-Symbole ins Menü · 2. Leerer Kasten erst bei Ergebnis | |
| `vertretung/spiele/hallo/` [Bild](pruefbericht-bilder/vertretung_spiele_hallo.jpg) | kleine Anpassung | Knöpfe: 18 (6 oben) · frei: 77 % · Farbtöne: 3 · Wörter: 11 · Hilfen: an | Fünf farbige Bildkarten + Wer-ist-dran-Kasten | 1. Themenknöpfe ins Menü · 2. Karten ohne Farbflächen | |
| `vertretung/spiele/klasse-gegen-lehrkraft/` [Bild](pruefbericht-bilder/vertretung_spiele_klasse-gegen-lehrkraft.jpg) | passt | Knöpfe: 12 (6 oben) · frei: 63 % · Farbtöne: 1 · Wörter: 20 · Hilfen: an | Punktestand-Spiel, klar | Keine Änderung | |
| `vertretung/spiele/reime/` [Bild](pruefbericht-bilder/vertretung_spiele_reime.jpg) | kleine Anpassung | Knöpfe: 16 (6 oben) · frei: 74 % · Farbtöne: 3 · Wörter: 15 · Hilfen: an | Vier große farbige Bildkarten mit roten/blauen Rahmen (Artikelfarben doppelt belegt?) | 1. Kartenrahmen neutral, Artikelfarben nur am Artikel · 2. Modusknöpfe ins Menü | |
| `vertretung/spiele/silben/` [Bild](pruefbericht-bilder/vertretung_spiele_silben.jpg) | passt | Knöpfe: 18 (7 oben) · frei: 82 % · Farbtöne: 1 · Wörter: 8 · Hilfen: an | Ruhig, ein Bild | Nur Leisten ins Menü | |
| `vertretung/spiele/tschuess/` [Bild](pruefbericht-bilder/vertretung_spiele_tschuess.jpg) | kleine Anpassung | Knöpfe: 12 (6 oben) · frei: 76 % · Farbtöne: 4 · Wörter: 15 · Hilfen: an | Drei große Karten mit farbigen Flächen (grün/gelb/orange) | 1. Karten weiß, Farbe nur im Symbol | |
| `vertretung/spiele/versteckt/` [Bild](pruefbericht-bilder/vertretung_spiele_versteckt.jpg) | größere Anpassung | Knöpfe: 31 (15 oben) · frei: 58 % · Farbtöne: 0 · Wörter: 24 · Hilfen: an | Neun farbige Felder + Themenleiste + Textfeld | 1. Felder einfarbig hell · 2. Themen ins Menü · 3. Raster kleiner, Text unter das Raster | |
| `vertretung/spiele/was-fehlt/` [Bild](pruefbericht-bilder/vertretung_spiele_was-fehlt.jpg) | kleine Anpassung | Knöpfe: 18 (12 oben) · frei: 73 % · Farbtöne: 3 · Wörter: 25 · Hilfen: an | Sechs Karten mit roten/grünen Rahmen (Artikelfarben als Rahmen) | 1. Rahmen neutral · 2. Anzahl/Niveau ins Menü | |
| `vertretung/spiele/wer-bin-ich/` [Bild](pruefbericht-bilder/vertretung_spiele_wer-bin-ich.jpg) | passt | Knöpfe: 14 (6 oben) · frei: 68 % · Farbtöne: 2 · Wörter: 14 · Hilfen: an | Vorhang als Inhalt, ruhig | Nur Leisten ins Menü | |
| `vertretung/spiele/wimmelbild/` [Bild](pruefbericht-bilder/vertretung_spiele_wimmelbild.jpg) | kleine Anpassung | Knöpfe: 24 (6 oben) · frei: 43 % · Farbtöne: 3 · Wörter: 16 · Hilfen: an | Wimmelbild ist Inhalt (freie Fläche 43 %), Einstellungen rechts | 1. Szene/Spielart ins Menü | |
| `vertretung/su/wer-wohnt-wo/` [Bild](pruefbericht-bilder/vertretung_su_wer-wohnt-wo.jpg) | größere Anpassung | Knöpfe: 29 (9 oben) · frei: 51 % · Farbtöne: 2 · Wörter: 9 · Hilfen: an | Fünf farbige Spalten + zehn Tierkarten + 2 Leisten | 1. Spalten weiß, nur Symbol farbig · 2. Karten einzeln anbieten (eine Karte oben) · 3. Niveau ins Menü | |

## Vertretung: Cockpit und Generatoren (Lehrkraft-Werkzeuge)

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `vertretung/cockpit/` [Bild](pruefbericht-bilder/vertretung_cockpit.jpg) | passt | Knöpfe: 11 (6 oben) · frei: 81 % · Farbtöne: 1 · Wörter: 38 · Hilfen: an | Lehrkraft-Werkzeug; die Klasse sieht Begrüßung und 5 Kacheln | Keine Änderung | |
| `vertretung/generatoren/arbeitsauftrag/` [Bild](pruefbericht-bilder/vertretung_generatoren_arbeitsauftrag.jpg) | passt (Druck) | Knöpfe: 20 (0 oben) · frei: 56 % · Farbtöne: 0 · Wörter: 102 · Hilfen: – | Generator; Blatt schwarz-weiß mit Silbenschrift | Keine Änderung | |
| `vertretung/generatoren/bildergeschichte/` [Bild](pruefbericht-bilder/vertretung_generatoren_bildergeschichte.jpg) | passt (Druck) | Knöpfe: 25 (0 oben) · frei: 49 % · Farbtöne: 1 · Wörter: 64 · Hilfen: – | Generator; Bilder sind Inhalt | Keine Änderung | |
| `vertretung/generatoren/bingo/` [Bild](pruefbericht-bilder/vertretung_generatoren_bingo.jpg) | passt (Druck) | Knöpfe: 23 (0 oben) · frei: 56 % · Farbtöne: 0 · Wörter: 43 · Hilfen: – | Generator | Keine Änderung | |
| `vertretung/generatoren/lesen-schreiben/` [Bild](pruefbericht-bilder/vertretung_generatoren_lesen-schreiben.jpg) | passt (Druck) | Knöpfe: 19 (0 oben) · frei: 55 % · Farbtöne: 0 · Wörter: 43 · Hilfen: – | Generator | Keine Änderung | |
| `vertretung/generatoren/rechnen/` [Bild](pruefbericht-bilder/vertretung_generatoren_rechnen.jpg) | passt (Druck) | Knöpfe: 21 (0 oben) · frei: 57 % · Farbtöne: 0 · Wörter: 29 · Hilfen: – | Generator | Keine Änderung | |
| `vertretung/generatoren/rueckmeldung/` [Bild](pruefbericht-bilder/vertretung_generatoren_rueckmeldung.jpg) | passt (Druck) | Knöpfe: 6 (0 oben) · frei: 52 % · Farbtöne: 0 · Wörter: 130 · Hilfen: – | Generator (nur Lehrkraft) | Keine Änderung | |
| `vertretung/generatoren/stundenkarte/` [Bild](pruefbericht-bilder/vertretung_generatoren_stundenkarte.jpg) | passt (Druck) | Knöpfe: 11 (0 oben) · frei: 57 % · Farbtöne: 0 · Wörter: 87 · Hilfen: – | Generator (nur Lehrkraft) | Keine Änderung | |
| `vertretung/generatoren/uhrzeit/` [Bild](pruefbericht-bilder/vertretung_generatoren_uhrzeit.jpg) | passt (Druck) | Knöpfe: 17 (0 oben) · frei: 54 % · Farbtöne: 0 · Wörter: 55 · Hilfen: – | Generator | Keine Änderung | |

## Silbenschrift und Übungsrunde

| Seite | Einstufung | Gezählte Werte | Hauptproblem | Vorschlag | Freigabe |
|---|---|---|---|---|---|
| `gemeinsam/uebungsrunde/` [Bild](pruefbericht-bilder/gemeinsam_uebungsrunde.jpg) | kleine Anpassung | Knöpfe: 0 (0 oben) · frei: 96 % · Farbtöne: 0 · Wörter: 42 · Hilfen: – | Rahmen der Übungsrunde: Kopf, gelbes Band, Fußleiste mit 4 Knöpfen (in der Runde sichtbar) | 1. „Neue Aufgabe“ und „Joker“ ins ☰-Menü · 2. Gelbes Band schmaler/grau | |
| `uebergreifend/silbenschrift/` [Bild](pruefbericht-bilder/uebergreifend_silbenschrift.jpg) | passt | Knöpfe: 4 (1 oben) · frei: 93 % · Farbtöne: 1 · Wörter: 58 · Hilfen: – | Werkzeug, ruhig | Keine Änderung | |

## Runden (bereits umgesetzt, Phase 2, 3 und 5)

Alle zehn Runden-Seiten haben das Lehrkraftmenü und wurden nach der Test-Checkliste geprüft:

- Startzustand: Menü zu, Hilfen und Farben aus, höchstens 2 Kinderknöpfe.
- Lehrkraftmenü: öffnet und schließt über Zahnrad, × und Esc. Antippen der Bühne schließt es nicht.
- Nichts wird abgeschnitten, bei 1600 × 900 und 1280 × 720.
- Mit „reduzierter Bewegung“: keine Fehler.
- Keine externen Aufrufe, keine Konsolenfehler.
- In der Übungsrunde ist das Zahnrad ausgeblendet, und jede Seite liefert eine Aufgabe (die Einführung ist bewusst nicht dabei).

| Tafelbild | Vorher | Nachher |
|---|---|---|
| zahlenstrahl | [Bild](pruefbericht-bilder/runden_zahlenstrahl_vorher.jpg) | [Bild](pruefbericht-bilder/runden_zahlenstrahl_nachher.jpg) |
| rundungsberg | [Bild](pruefbericht-bilder/runden_rundungsberg_vorher.jpg) | [Bild](pruefbericht-bilder/runden_rundungsberg_nachher.jpg) |
| blitzrunde | [Bild](pruefbericht-bilder/runden_blitzrunde_vorher.jpg) | [Bild](pruefbericht-bilder/runden_blitzrunde_nachher.jpg) |
| fehler-detektiv | [Bild](pruefbericht-bilder/runden_fehler-detektiv_vorher.jpg) | [Bild](pruefbericht-bilder/runden_fehler-detektiv_nachher.jpg) |
| schulfest | [Bild](pruefbericht-bilder/runden_schulfest_vorher.jpg) | [Bild](pruefbericht-bilder/runden_schulfest_nachher.jpg) |
| einfuehrung (neu) | – | [Bild](pruefbericht-bilder/runden_einfuehrung_nachher.jpg) |
| rechentafel (neu) | – | [Bild](pruefbericht-bilder/runden_rechentafel_nachher.jpg) |
| haeuser (neu) | – | [Bild](pruefbericht-bilder/runden_haeuser_nachher.jpg) |
| rueckwaerts (neu) | – | [Bild](pruefbericht-bilder/runden_rueckwaerts_nachher.jpg) |
| ungefaehr-rechnen (neu) | – | [Bild](pruefbericht-bilder/runden_ungefaehr-rechnen_nachher.jpg) |
| Startseite | – | [Bild](pruefbericht-bilder/runden_startseite_nachher.jpg) |

## Nach der Freigabe

- **Seiten mit „kleiner Anpassung“**: Die gemeinsamen Bausteine bekommen die Option `menue: true`. So lässt sich ein ganzer Bereich mit wenigen Änderungen umstellen.
- **Seiten mit „größerer Anpassung“**: Sie werden einzeln umgebaut, mit einem Commit je Bereich und einem Vorher-Nachher-Bildschirmfoto in diesem Bericht.
