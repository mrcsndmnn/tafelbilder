# Bauauftrag: Runden – Überarbeitung und neue Tafelbilder

Stand 28.11.2026

## So nutzt du diesen Auftrag

Dieser Auftrag macht alle Tafelbilder ruhiger: Die Kinder sehen nur noch die Aufgabe, alle Einstellungen wandern in ein Lehrkraftmenü. Dazu kommen fünf neue Runden-Tafelbilder. Er baut auf dem ersten Runden-Auftrag und dem bestehenden Code in mathe/runden/ auf.
- Dieses Dokument als Markdown exportieren und im Repo als auftraege/runden-ueberarbeitung.md ablegen.
- In Claude Code im Repo tafelbilder schreiben: „Setze Phase 1 aus auftraege/runden-ueberarbeitung.md um und zeig mir das Ergebnis am Zahlenstrahl-Tafelbild.“ Danach Phase für Phase weiter.
- Nach jeder Phase im Browser bei 1600 × 900 prüfen, Rückmeldungen direkt an Claude Code geben.

| Phase | Inhalt | Ergebnis |
| --- | --- | --- |
| 1 | Gestaltungsregeln festhalten und Lehrkraftmenü als gemeinsamen Baustein bauen | gemeinsam/lehrkraftmenue.js und .css, Regeln in GESTALTUNG.md |
| 2 | Fünf bestehende Runden-Tafelbilder überarbeiten | ruhige Kinderansicht, Menü statt Leisten |
| 3 | Neue Tafelbilder: Einführung, Rechen-Tafel, Rückwärts runden, Zehner-Häuser, Ungefähr rechnen | fünf neue Ordner in mathe/runden/ |
| 4 | Alle übrigen Tafelbilder im Repo prüfen: erst Prüfbericht, nach Freigabe anpassen | auftraege/pruefbericht-gestaltung.md, danach Anpassungen |
| 5 | Startseite, thema.json, Übungsrunde, Test | alles verlinkt und geprüft |

Wichtig für Phase 4: Claude Code soll zuerst nur den Prüfbericht schreiben und nichts ändern. Du entscheidest dann, welche Anpassungen umgesetzt werden. So bleiben bewährte Tafelbilder (z. B. Pilze, Briefe) unberührt, wenn sie im Unterricht gut funktionieren.

## Gestaltungsregeln für Förderschüler

Jedes Tafelbild zeigt den Kindern eine Aufgabe, einen Blickpunkt und höchstens zwei Knöpfe. Claude Code legt die Regeln als GESTALTUNG.md im Repo-Hauptordner ab und verweist in der README.md darauf, damit sie für alle künftigen Tafelbilder gelten.
Befund aus dem Test (Anlass für die Regeln)
- Jede Runden-Seite zeigt oben 12–15 Knöpfe (Start, ?, Farben, Hilfen, Neu, Zehner/Hunderter, Stufe 1–3, Modus, Neue Zahl …), bevor die Aufgabe kommt.
- Farben sind doppelt belegt: Blau = Einer und abrunden, Grün = Hunderter und aufrunden.
- Mehrere Blickpunkte gleichzeitig: zwei Zahlenstrahlen mit Lupen-Dreieck; Stellenwerttafel, Schrittleiste und Eingabefeld neben dem Berg; sechs Gleichungen auf einmal.
- Deko ohne Inhalt: Schulfest-Szene, Roboter, linierter Zettel.
Die Regeln

| Nr. | Regel | Konkret |
| --- | --- | --- |
| R1 | Kinderansicht und Lehrkraftmenü trennen | Sichtbar sind nur Aufgabe, höchstens 2 Aktionsknöpfe für Kinder und ein kleines Zahnrad. Start, ?, Farben, Hilfen, Neu, Stufe, Modus, Auf Zehner/Hunderter usw. liegen im Lehrkraftmenü. |
| R2 | Eine Aufgabe pro Bildschirm | Eine Zahl, eine Gleichung oder eine Karte. Ausnahme: die Rechen-Tafel (Phase 3), dort ist immer nur eine Zeile aktiv. |
| R3 | Ein Blickpunkt in der Mitte | Die Aufgabe steht mittig und groß (Zahlen ab 96 px). Nichts konkurriert in Größe oder Farbe mit ihr. |
| R4 | Farbe hat genau eine Bedeutung | Grün/Rot/Blau nur für H/Z/E. Auf/ab werden mit Pfeil und Wort gezeigt, in Schwarz/Grau. Richtig = dezentes Grün nur als Rahmen, „noch nicht“ = Orange, beide nur kurz. |
| R5 | Keine Deko | Keine Szenen, Figuren, Muster, Schatten oder Papiereffekte. Ein Symbol nur, wenn es Bedeutung trägt (z. B. Telefon auf der Telefonnummer-Karte). |
| R6 | Hilfen erst auf Anfrage | Startzustand ohne Satzmuster, Beschriftungen und Farbhilfen. Die Lehrkraft blendet Hilfen im Menü ein; ein Kinderknopf „Hilfe“ ist erlaubt, wenn er dann genau eine Hilfe zeigt. |
| R7 | Immer gleicher Aufbau | Aufgabe in der Mitte, Kinderknöpfe unten rechts, Rückmeldung unter der Aufgabe, Zahnrad oben rechts. |
| R8 | Schrittweise statt gleichzeitig | Was nacheinander gedacht wird, erscheint nacheinander und verschwindet wieder, wenn es nicht mehr gebraucht wird. |
| R9 | Viel weiße Fläche | Mindestens 40 % der Bühne bleiben leer. Hintergrund weiß, eine Schriftfarbe (fast schwarz), Linien 3 px. |
| R10 | Wenig Text | Arbeitsauftrag höchstens eine Zeile, Satzstreifen höchstens zwei kurze Sätze. |

Prüfliste je Tafelbild (für Phase 2, 3 und 4)
- Ohne geöffnetes Menü: Wie viele Knöpfe sind sichtbar? Ziel: höchstens 2 plus Zahnrad.
- Wie viele Elemente konkurrieren um den Blick? Ziel: eins.
- Ist jede Farbe nur einmal belegt?
- Gibt es Elemente ohne Inhalt (Deko)?
- Startet die Seite ohne eingeblendete Hilfen?
- Sitzen Aufgabe, Knöpfe und Rückmeldung an den Standardplätzen (R7)?
- Ist mindestens 40 % der Bühne frei?

## Phase 1: Lehrkraftmenü als gemeinsamer Baustein

Das Lehrkraftmenü ersetzt Kopfleiste und Einstellungsleiste auf allen Tafelbildern. Es wird einmal gebaut und von allen Seiten genutzt.
Aussehen
- Geschlossen: nur ein Zahnrad-Knopf oben rechts, 56 px, grau umrandet, unauffällig. Daneben nichts.
- Geöffnet: eine Schublade fährt von rechts herein (ca. 440 px breit, volle Höhe, weiß, leichter grauer Rand). Die Bühne dahinter wird nicht abgedunkelt, damit die Lehrkraft die Wirkung einer Einstellung sofort sieht.
- Schließen über das Zahnrad, ein „×“ oben in der Schublade oder die Taste Esc. Antippen der Bühne schließt das Menü nicht (sonst schließt es versehentlich, wenn ein Kind an die Tafel geht).
Inhalt der Schublade (immer in dieser Reihenfolge)
- Titel des Tafelbilds und kurze Beschreibung (eine Zeile).
- Bereich „Aufgabe“: die seiteneigenen Einstellungen (z. B. Auf Zehner/Hunderter, Stufe 1–3, Modus). Jede Einstellung als beschriftete Knöpfe, nicht als Symbole allein.
- Bereich „Hilfen“: Schalter „Farben (H/Z/E)“, „Satzmuster“ und seiteneigene Hilfen. Alle stehen beim Laden auf aus (R6).
- Bereich „Steuerung“: „Neue Aufgabe“, „Lösung zeigen“, „Zurücksetzen“.
- Unten: „Hinweise für die Lehrkraft“ (bisheriger ?-Inhalt, aufklappbar) und „Zur Startseite“.
Technik
- Neue Dateien gemeinsam/lehrkraftmenue.js und gemeinsam/lehrkraftmenue.css im Repo-Hauptordner, damit alle Fächer sie nutzen können.
- Aufruf: Lehrkraftmenue.baue({ titel, beschreibung, aufgabe: [...], hilfen: [...], steuerung: {...}, hinweise }). Die Elemente nutzen die vorhandenen Helfer (T.gruppe, T.schalter, T.knopf), werden aber in die Schublade statt in Kopf und Leiste gehängt.
- T.kopf und T.leiste in mathe/zahlenraum-1000/gemeinsam/tafel.js bekommen eine Option menue: true. Ist sie gesetzt, landen alle Knöpfe im Menü und der Titel wird nicht auf der Bühne angezeigt. Ohne die Option bleibt alles wie bisher, damit nichts kaputtgeht, bevor Phase 4 entschieden ist.
- Die Übungsrunde blendet das Zahnrad aus (wie bisher Kopf und Leiste über runde-client.js), dort steuert der Rundenrahmen.
- Zuletzt gewählte Einstellungen je Tafelbild in localStorage (mit try/catch), Hilfen aber immer aus beim Laden.
- Tastatur: Zahnrad per Tab erreichbar, Fokus springt beim Öffnen in die Schublade und beim Schließen zurück aufs Zahnrad.
Kinderknöpfe auf der Bühne
Höchstens zwei, immer unten rechts, 72 px hoch, mit Wort: meist „Prüfen“ und „Weiter“, je nach Tafelbild auch „Hilfe“. Antwortkarten und antippbare Zahlen zählen nicht als Knöpfe, sie sind Teil der Aufgabe.

## Phase 2: Die fünf bestehenden Runden-Tafelbilder überarbeiten

Alle fünf bekommen das Lehrkraftmenü und werden nach den Regeln R1–R10 ausgedünnt. Inhalt und Didaktik bleiben, nur die Darstellung wird ruhiger. Zahlenstrahl-Lupe und Rundungsberg dienen danach vor allem zum Vertiefen; die Einführung übernimmt das neue Tafelbild aus Phase 3.

### Zahlenstrahl-Lupe (zahlenstrahl/)

- Nur noch ein Zahlenstrahl: der Ausschnitt (z. B. 440 bis 450). Der Gesamtstrahl 0–1000 mit dem gestrichelten Lupen-Dreieck entfällt; im Menü als Hilfe „Ganzen Zahlenstrahl zeigen“ (dann klein oberhalb, ohne Dreieck).
- Beschriftet sind nur die beiden Nachbarn (groß, schwarz, schlichter Rahmen in derselben Farbe, kein Blau/Grün). Die Zwischenstriche sind unbeschriftet; Hilfe „Alle Zahlen zeigen“ im Menü.
- Die Zahl erscheint als Punkt auf dem Strahl mit der Zahl darüber (schwarz, ohne gelben Kasten).
- Kinder tippen einen Nachbarn an. Danach hüpft der Punkt zu beiden Seiten; der kürzere Weg bleibt als Bogen stehen, der längere verblasst. Die Gleichung „442 ≈ 440“ erscheint unter dem Strahl.
- „Selbst schieben“, „Einerziffer zeigen“, „Die Mitte“, „Neue Zahl“ wandern ins Menü.
- Kinderknopf: „Weiter“.

### Rundungsberg (rundungsberg/)

- Aufbau von oben nach unten statt links/rechts: oben die Zahl groß (Ziffern nur bei Farben-an farbig), darunter der Berg.
- Berg ohne Farbflächen und ohne Wort „Gipfel“; nur die Bergkontur und die Plätze 0–9 als kleine Zahlen. Am Fuß die beiden Nachbarn schwarz. „ab“ und „auf“ als kurze Pfeile mit Wort in Grau, nur bei Hilfe an.
- Stellenwerttafel, Schrittleiste, Eingabefeld und Merkkarte ins Menü. Die Schritte 1–4 erscheinen nacheinander als ein Satzstreifen unter dem Berg; jeder neue Satz ersetzt den vorigen (R8).
- Die Lupe ist eine einfache Unterstreichung der Prüfziffer, kein Lupensymbol.
- Kinderknopf: „Weiter“ (im Modus „Ich bin dran“ zusätzlich keiner, die Kinder tippen Platz und Fuß direkt an).

### Blitzrunde (blitzrunde/)

- Kaum Änderungen: Lupensymbol entfällt ganz; die Unterstreichung der Prüfziffer nur auf Stufe 1 oder wenn die Hilfe an ist. Ist „Farben“ an, keine Unterstreichung (sonst doppelte Markierung).
- Rahmen um die Aufgabe entfällt; Zahl und Antwortkarten stehen frei auf Weiß.
- Stufe, Art, Zeit und Heftzahlen ins Menü; „Runde 3 von 10“ klein in Grau unten links.
- Der kleine Rundungsberg nach der Lösung nur bei Hilfe an.
- Kinderknöpfe: „Lösung“ (nur bei Art „Selbst“) und „Weiter“.

### Fehler-Detektiv (fehler-detektiv/)

- Eine Gleichung auf einmal, groß in der Mitte. Darunter zwei große Antwortkarten „Stimmt“ und „Stimmt nicht“.
- Roboter, linierter Zettel und Satzkasten entfallen. Die Geschichte „Rundo hat gerechnet“ bleibt als ein Satz im Arbeitsauftrag: „Stimmt Rundos Rechnung?“
- Bei „Stimmt nicht“: Die Antwortkarten werden durch zwei Verbesserungen ersetzt. Nach der Wahl wird die falsche Zahl durchgestrichen und die richtige daneben geschrieben.
- Die Frage nach der Fehlerart nur auf Stufe 3 oder bei Hilfe an, als zwei bis drei Wortkarten ohne Bilder.
- Fortschritt als kleine Punkte unten links (z. B. 6 Punkte, erledigte gefüllt), statt „Gefunden: 0 von 1“.
- Kinderknopf: „Weiter“.

### Genau oder gerundet? (schulfest/)

- Szene (Zelt, Tisch, Bus, Ballons) und das Wort „Schulfest“ entfallen. Das Thema steht nur im Arbeitsauftrag: „Schulfest: Darf ich die Zahl runden?“
- Eine Karte in der Mitte oben: Satz in 40 px, links ein schlichtes Strich-Symbol (Telefon, Becher, Bus …), keine Emojis.
- Zwei Körbe unten nebeneinander, gleich gestaltet (schwarzer Rand, kein Strich-Muster, keine Farbfläche), beschriftet „≈ darf ich runden“ und „= muss genau sein“. Einsortierte Karten erscheinen im Korb nur als kleine Stichworte.
- Vorlesen, Vergleichen und „Darüber reden wir“ ins Menü; das Vorlesen kann die Lehrkraft dort als Kinderknopf freischalten.
- Modus „Gerundet oder nicht?“: ein Satz pro Bildschirm, Signalwörter werden beim Antippen unterstrichen (nicht farbig hinterlegt).
- Kinderknopf: keiner (Antippen der Karte und des Korbs reicht) bzw. „Weiter“ im zweiten Modus.

## Phase 3: Neue Tafelbilder

Alle neuen Tafelbilder nutzen von Anfang an das Lehrkraftmenü und die Regeln R1–R10.

### Runden Schritt für Schritt (einfuehrung/)

Didaktik: kleinschrittige Einführung in 8 Etappen, eine Idee pro Etappe. Sie beginnt mit zweistelligen Zahlen und knüpft an die Reihe „Zahlenstrahl bis 1000“ an (Nachbarn, Mitte), die die Klasse kennt. Gedacht für 2–3 Stunden; die Lehrkraft kann jederzeit unterbrechen und später an derselben Etappe weitermachen.
Aufbau jeder Etappe
- Zeigen: eine Idee, eine schlichte Darstellung, ein Satz (z. B. „43 liegt zwischen 40 und 50.“). Die Lehrkraft spricht, die Kinder sprechen nach.
- Probieren: drei kurze Aufgaben derselben Art, eine pro Bildschirm, mit Rückmeldung.
- Das kann ich: ein großes Häkchen, die Etappe wird in der Wegleiste abgehakt.
Oben eine schmale Wegleiste mit 8 kleinen Punkten (erledigt gefüllt, aktuell umrandet), sonst nichts. Kinderknopf: „Weiter“. Im Menü: Etappe direkt wählen, „Zurück“, Aufgaben neu würfeln, Hilfen.

| Etappe | Idee | Darstellung | Probieren (Beispiele) |
| --- | --- | --- | --- |
| 1 Ungefähr reicht | Manchmal braucht man keine genaue Zahl. Das Zeichen ≈ heißt „ungefähr“. | Zwei Sätze untereinander: „Auf dem Schulhof sind 48 Kinder.“ / „Auf dem Schulhof sind ungefähr 50 Kinder.“ Dann groß: 48 ≈ 50. | Welcher Satz ist ungefähr? (zwei Satzkarten) |
| 2 Die Nachbarzehner | Jede Zahl liegt zwischen zwei Zehnern. | Kurzer Zahlenstrahl 40–50, nur 40 und 50 beschriftet, Punkt bei 43. Satz: „43 liegt zwischen 40 und 50.“ | 67, 21, 85: zwei Zehner antippen |
| 3 Wer ist näher? | Runden heißt: zum näheren Zehner gehen. | Derselbe Strahl, der Punkt hüpft nach links (3 Sprünge) und rechts (7 Sprünge). | 42, 68, 31: den näheren Zehner antippen |
| 4 Die Mitte | Genau in der Mitte runden wir auf. Das ist eine Abmachung. | Punkt bei 45, beide Wege 5 Sprünge. Schild „Abmachung: aufrunden“. | 25, 65 und eine Nicht-Mitte-Zahl |
| 5 Die Regel | Ich schaue nur auf die Einer: 0–4 ab, 5–9 auf. | Zahl 43, Einer unterstrichen. Darunter zwei Zeilen: „0 1 2 3 4 → ab“, „5 6 7 8 9 → auf“. Die passende Zeile wird dunkel, die andere grau. | 57, 34, 89: ab oder auf? dann Ergebnis |
| 6 Dreistellig auf Zehner | Der Hunderter bleibt, ich runde den Rest. | 273: Der Hunderter wird mit einer grauen Karte abgedeckt, 73 ≈ 70 wie bekannt, Karte weg: 273 ≈ 270. | 452, 618, 375 (mit Abdeck-Karte, auf Stufe 2 ohne) |
| 7 Auf Hunderter | Jetzt schaue ich auf die Zehner. | Zahlenstrahl 200–300, nur 200 und 300 beschriftet, Punkt bei 273. Dann Regel: Zehner unterstrichen, „7 → auf“, 273 ≈ 300. | 348, 162, 750 |
| 8 Besondere Zahlen | Manchmal ändert sich auch der Hunderter. | Nacheinander: 396 ≈ 400, 999 ≈ 1000, 340 ≈ 340 („schon rund“), 47 ≈ 0 auf Hunderter. | eine Zahl je Fall |

- Ab Etappe 2 kommen die Zahlen zufällig aus festen Bereichen (keine Mitte außer in Etappe 4 und 8).
- Fortschritt (erreichte Etappe) wird in localStorage gemerkt, damit die Lehrkraft in der nächsten Stunde weitermachen kann. Im Menü „Von vorn beginnen“.
- In der Übungsrunde wird diese Seite nicht angeboten („runde“: false), sie ist zum gemeinsamen Erarbeiten gedacht.

### Rechen-Tafel Runden (rechentafel/)

Didaktik: Automatisieren und entdeckendes Üben, nur mit Rechnungen, so wie im Heft. Keine Grafik, kein Symbol, keine Figur.
- Ansicht „Paket“: 6 Aufgaben untereinander, links bündig am ≈ ausgerichtet, Schrift 64 px, z. B.
- 271 ≈ ___
- 273 ≈ ___
- …
- Immer nur die aktuelle Zeile ist schwarz, die anderen sind hellgrau. Gelöste Zeilen werden wieder schwarz und behalten ihr Ergebnis.
- Ansicht „Einzeln“: nur eine Aufgabe in 120 px in der Mitte.
- Eingabe: Die Kinder sagen die Lösung, die Lehrkraft oder ein Kind tippt sie über ein Ziffernfeld unten rechts ein (Tasten 0–9, Löschen, Prüfen; 80 px groß). Alternativ im Menü „Nur aufdecken“: Antippen der Lücke zeigt das Ergebnis.
- Rückmeldung nur an der Zeile selbst: richtig = Ergebnis steht, kleines Häkchen; noch nicht = Ergebnis wackelt kurz und wird gelöscht, Hinweis „Schau auf die Einer.“ bzw. „Schau auf die Zehner.“ in Grau unter der Zeile.
- Strukturierte Päckchen (Menü „Päckchenart“):
- Bunt gemischt: zufällige Zahlen.
- Einer-Treppe: 271, 272, … 279 auf Zehner (gerundet wird 270 oder 280).
- Zehner-Treppe: 213, 223, … 293 auf Hunderter.
- Mitte: 245, 255, 265 …
- Gleiches Ergebnis: Alle Aufgaben ergeben 300 (z. B. 251, 286, 349, 300).
- Nach einem strukturierten Päckchen erscheint die Frage „Was fällt dir auf?“. Bei Hilfe an zusätzlich ein Satzanfang: „Von 271 bis 274 ist das Ergebnis immer …“.
- Überschrift über dem Päckchen in einer Zeile: „Runde auf Zehner.“ / „Runde auf Hunderter.“ Gemischte Päckchen schreiben „(Z)“ oder „(H)“ hinter jede Aufgabe.
- Stufe 1: nur Zehner, Einer-Treppe und bunt gemischt ohne Sonderfälle. Stufe 2: Zehner und Hunderter getrennt, alle Päckchenarten. Stufe 3: gemischte Päckchen mit (Z)/(H) und Sonderfällen.
- Im Menü: Farben H/Z/E (aus beim Start), Unterstreichung der Prüfziffer (aus beim Start), Anzahl 4/6/8, Ansicht Paket/Einzeln, „Druckansicht“ (gleiches Päckchen als Arbeitsblatt in DIN A4, schwarz-weiß, mit Lösungsseite).
- Kinderknopf: keiner außer dem Ziffernfeld; nach dem letzten Ergebnis „Neues Päckchen“.

### Rückwärts runden (rueckwaerts/)

Didaktik: Umkehraufgabe. Die Kinder finden alle Zahlen, die zu einem gerundeten Wert werden. Das zeigt sicher, ob die Idee verstanden ist. Ohne Grafik.
- Oben die Frage in einer Zeile: „Welche Zahlen werden zu 270?“ (auf Zehner) bzw. „… zu 300?“ (auf Hunderter).
- Darunter eine Reihe von 12–16 Zahlenkarten (z. B. 263 bis 278, gemischt angeordnet). Die Kinder tippen passende Karten an; sie rücken in eine Zeile darunter und ordnen sich dort der Größe nach.
- „Prüfen“: Fehlende Zahlen werden als leere Rahmen in der Zeile angedeutet, falsch gewählte rücken zurück nach oben. Am Ende: „Von 265 bis 274 werden alle Zahlen zu 270.“
- Stufe 1: nur Zehner, 12 Karten. Stufe 2: 16 Karten, inklusive der Grenzzahlen 264, 265, 274, 275. Stufe 3: Hunderter mit Karten in Zehnerschritten (z. B. 230 … 360) und Frage „Welche ist die kleinste? Welche die größte?“.
- Kinderknopf: „Prüfen“, danach „Weiter“.

### Zehner-Häuser (haeuser/)

Didaktik: Klassifizieren und Partnerarbeit. Zahlen werden dem gerundeten Wert zugeordnet.
- Zwei schlichte Häuser als Umriss (Rechteck mit Dach, schwarz, keine Füllung), nebeneinander, Dach beschriftet „270“ und „280“. Auf Stufe 3 drei Häuser (260, 270, 280).
- Oben eine Zahlenkarte (z. B. 276). Die Kinder ziehen sie in ein Haus oder tippen erst die Karte, dann das Haus an. Im Haus erscheint die Zahl klein in einer Liste.
- Pro Runde 8 Karten. Danach liest das Haus seine Bewohner vor: „In 280 wohnen: 275, 276, 279, 283.“ (Text, Vorlesen optional im Menü).
- Modus Hunderter: Häuser 300 und 400.
- Partnerarbeit im Menü: „Fragekind/Antwortkind“ blendet unten eine kleine Anzeige ein, wer dran ist; sie wechselt nach jeder Karte.
- Falsch gelegte Karten rutschen zurück, Hinweis: „276 liegt näher an 280.“

### Ungefähr rechnen (ungefaehr-rechnen/)

Didaktik: Anwendung und Ausblick auf das Überschlagen. Optional, nur einsetzen, wenn das Überschlagen im Lehrplan als Nächstes kommt.
- Eine Frage pro Bildschirm, nur Text und Zahlen: „Lea hat 500 €. Sie möchte ein Rad für 289 € und einen Helm für 198 € kaufen. Reicht das Geld ungefähr?“ (Vorlesen im Menü).
- Schritt 1: Die beiden Zahlen runden (Antwortkarten oder Ziffernfeld wie in der Rechen-Tafel): 289 ≈ 300, 198 ≈ 200.
- Schritt 2: Gerundet rechnen: 300 + 200 = 500.
- Schritt 3: Entscheiden mit zwei Karten „Reicht“ / „Wird knapp, genau nachrechnen“. Danach auf Wunsch genau: 289 + 198 = 487.
- Die Schritte erscheinen nacheinander unter der Frage (R8). Stufe 1: auf Hunderter, Summe deutlich unter oder über dem Betrag. Stufe 2: auf Zehner. Stufe 3: Ergebnis nah am Betrag („knapp“).
- Aufgaben in einer Liste AUFGABEN in ungefaehr-rechnen/aufgaben.js (Schulfest, Einkauf, Klassenfahrt), leicht erweiterbar.

## Phase 4: Alle übrigen Tafelbilder im Repo prüfen

Claude Code prüft jedes Tafelbild im Repo mit der Prüfliste aus den Gestaltungsregeln. Es schreibt zuerst nur einen Prüfbericht und ändert nichts. Angepasst wird erst, wenn du im Bericht freigegeben hast, was geändert werden soll.
Umfang (Stand 28.11.2026)

| Bereich | Ordner | Seiten | Gemeinsamer Baustein |
| --- | --- | --- | --- |
| Zahlenraum bis 1000 | mathe/zahlenraum-1000/ | 13 | gemeinsam/tafel.js |
| Zahlenstrahl bis 1000 | mathe/zahlenstrahl/ | 11 (davon 4 Druckvorlagen) | gemeinsam/strahl.js |
| Briefe | deutsch/briefe/, deutsch/brief-aufbau/, deutsch/brief-arbeitsblatt/ | 8 | gemeinsam/buehne.js |
| Pilze | su/pilze/, su/pilze-aufbau/ | 15 | gemeinsam/bilder.js |
| Silbenschrift | uebergreifend/silbenschrift/ | 1 | – |
| Vertretung | vertretung/ | Spiele, Generatoren, Cockpit | gemeinsam/spiele.js |
| Übungsrunde | gemeinsam/uebungsrunde/ | Rahmen | runde.js |

Vorgehen
- Für jede Seite einen Screenshot bei 1600 × 900 im Startzustand erstellen (Playwright oder headless Chrome, lokal) und im Bericht ablegen unter auftraege/pruefbericht-bilder/.
- Pro Seite die sieben Fragen der Prüfliste beantworten, mit gezählten Werten (z. B. „sichtbare Knöpfe: 13“).
- Pro Seite eine Einstufung: passt / kleine Anpassung (nur Lehrkraftmenü, Hilfen aus beim Start) / größere Anpassung (Darstellung ausdünnen) mit 1–3 konkreten Vorschlägen.
- Bericht als auftraege/pruefbericht-gestaltung.md mit einer Tabelle je Bereich: Seite · Einstufung · gezählte Knöpfe · Hauptproblem · Vorschlag · Spalte „Freigabe“ (leer, für dich).
- Commit nur des Berichts. Danach wartet Claude Code auf deine Freigabe.
Sonderregeln für einzelne Bereiche
- Druckvorlagen (druck-…, Arbeitsblätter, Generatoren-Ausdrucke): Nur R4, R5, R9 und R10 prüfen; Knopf-Regeln gelten nicht für das Blatt selbst.
- Vertretungs-Cockpit und Generatoren sind Lehrkraft-Werkzeuge: Dort gelten die Regeln nur für das, was die Klasse an der Tafel sieht.
- Pilze und Briefe: Silbenschrift und Bilder sind Teil des Inhalts, nicht Deko. Nur ausdünnen, wenn mehr als ein Bild gleichzeitig um den Blick konkurriert.
- Farben: Wo ein Bereich eigene Farbsysteme hat (Pilz-Farben, Artikelfarben, Silbenfarben), auf doppelte Belegung innerhalb derselben Seite prüfen, nicht über Bereiche hinweg.
Nach der Freigabe
- Seiten mit „kleine Anpassung“: Die gemeinsamen Bausteine (T.kopf/T.leiste, buehne.js, strahl.js) bekommen die Option menue: true, sodass ganze Bereiche mit wenigen Änderungen umgestellt werden.
- Seiten mit „größere Anpassung“: einzeln, je Bereich ein Commit, mit Vorher-Nachher-Screenshot im Bericht.

## Phase 5: Startseite, thema.json und Test

Die Startseite mathe/runden/index.html ordnet die zehn Tafelbilder nach dem Einsatz im Unterricht. Sie folgt ebenfalls den Gestaltungsregeln: Kacheln ohne Farbflächen, je ein schlichtes Strich-Symbol.
Reihenfolge auf der Startseite (drei Gruppen)

| Gruppe | Tafelbild | Ordner | In der Übungsrunde |
| --- | --- | --- | --- |
| Einführen | Runden Schritt für Schritt | einfuehrung/ | nein |
| Vertiefen | Zahlenstrahl-Lupe | zahlenstrahl/ | ja |
| Vertiefen | Rundungsberg | rundungsberg/ | ja |
| Üben | Rechen-Tafel | rechentafel/ | ja (Ansicht Einzeln) |
| Üben | Blitzrunde | blitzrunde/ | ja |
| Üben | Zehner-Häuser | haeuser/ | ja |
| Üben | Rückwärts runden | rueckwaerts/ | ja |
| Üben | Fehler-Detektiv | fehler-detektiv/ | ja |
| Anwenden | Genau oder gerundet? | schulfest/ | ja |
| Anwenden | Ungefähr rechnen | ungefaehr-rechnen/ | ja |

- mathe/runden/thema.json um die fünf neuen Einträge ergänzen (id, titel, pfad, svg, runde, niveaus, dauerSek, pruefung) und nach obiger Reihenfolge sortieren. Neue Einträge auch im Array EINTRAEGE der Repo-index.html.
- Neue Seiten mit <meta name="robots" content="noindex, nofollow"> (siehe README) und der Übungsrunden-Anbindung über T.runde (genau eine Aufgabe pro neu(niveau)).
- runden.js um nachbarn() für zweistellige Zahlen und eine Funktion grenzen(ziel, stelle) (270 auf Z → 265 bis 274) ergänzen, für Einführung und Rückwärts runden.
Test-Checkliste für Claude Code (vor jedem Commit)
- Jede Runden-Seite erfüllt die Prüfliste; Screenshots vorher/nachher liegen im Prüfbericht.
- Startzustand jeder Seite: Menü zu, Hilfen aus, höchstens zwei Kinderknöpfe sichtbar.
- Lehrkraftmenü: öffnet und schließt per Zahnrad, × und Esc; Antippen der Bühne schließt es nicht; Einstellungen wirken sofort.
- In der Übungsrunde ist das Zahnrad ausgeblendet und jede Seite liefert eine Aufgabe.
- Farbprüfung: Grün/Rot/Blau erscheinen nur an Ziffern bzw. H/Z/E-Beschriftungen.
- grenzen(): 270 Z → 265–274; 300 H → 250–349; 0 H → 0–49; 1000 Z → 995–1000.
- Einführung: Fortschritt bleibt nach Neuladen erhalten, „Von vorn beginnen“ setzt zurück.
- Rechen-Tafel: Druckansicht passt auf eine DIN-A4-Seite, Lösungsseite getrennt.
- Alle Seiten bei 1600 × 900 und 1280 × 720 ohne Abschneiden; Schublade verdeckt keine Kinderknöpfe dauerhaft.
- prefers-reduced-motion schaltet Hüpfen, Rollen und Schublade-Animation ab.
- Keine externen Aufrufe, keine Konsolenfehler.
Offene Punkte
- Phase 4: Freigabe im Prüfbericht durch dich.
- „Ungefähr rechnen“ erst einsetzen, wenn das Überschlagen im Lehrplan dran ist.
