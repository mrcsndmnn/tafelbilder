# Gestaltungsregeln für Tafelbilder

Diese Regeln gelten für alle neuen Tafelbilder und für jede Überarbeitung. Sie sind für Kinder mit Förderbedarf gemacht:
Jedes Tafelbild zeigt den Kindern **eine Aufgabe, einen Blickpunkt und höchstens zwei Knöpfe**.

## Die Regeln

| Nr. | Regel | Konkret |
| --- | --- | --- |
| R1 | Kinderansicht und Lehrkraftmenü trennen | Sichtbar sind nur Aufgabe, höchstens 2 Aktionsknöpfe für Kinder und ein kleines Zahnrad. Start, ?, Farben, Hilfen, Neu, Stufe, Modus usw. liegen im Lehrkraftmenü. |
| R2 | Eine Aufgabe pro Bildschirm | Eine Zahl, eine Gleichung oder eine Karte. Ausnahme: Rechen-Tafel, dort ist immer nur eine Zeile aktiv. |
| R3 | Ein Blickpunkt in der Mitte | Die Aufgabe steht mittig und groß (Zahlen ab 96 px). Nichts konkurriert in Größe oder Farbe mit ihr. |
| R4 | Farbe hat genau eine Bedeutung | Grün/Rot/Blau nur für H/Z/E. Auf/ab mit Pfeil und Wort in Schwarz/Grau. Richtig = dezentes Grün nur als Rahmen, „noch nicht“ = Orange, beide nur kurz. |
| R5 | Keine Deko | Keine Szenen, Figuren, Muster, Schatten oder Papiereffekte. Ein Symbol nur, wenn es Bedeutung trägt. |
| R6 | Hilfen erst auf Anfrage | Startzustand ohne Satzmuster, Beschriftungen und Farbhilfen. Ein Kinderknopf „Hilfe“ ist erlaubt, wenn er genau eine Hilfe zeigt. |
| R7 | Immer gleicher Aufbau | Aufgabe in der Mitte, Kinderknöpfe unten rechts, Rückmeldung unter der Aufgabe, Zahnrad oben rechts. |
| R8 | Schrittweise statt gleichzeitig | Was nacheinander gedacht wird, erscheint nacheinander und verschwindet wieder. |
| R9 | Viel weiße Fläche | Mindestens 40 % der Bühne bleiben leer. Hintergrund weiß, eine Schriftfarbe (fast schwarz), Linien 3 px. |
| R10 | Wenig Text | Arbeitsauftrag höchstens eine Zeile, Satzstreifen höchstens zwei kurze Sätze. |

## Prüfliste je Tafelbild

- [ ] Ohne geöffnetes Menü: höchstens 2 Knöpfe plus Zahnrad sichtbar?
- [ ] Nur ein Element konkurriert um den Blick?
- [ ] Jede Farbe nur einmal belegt?
- [ ] Keine Elemente ohne Inhalt (Deko)?
- [ ] Startet die Seite ohne eingeblendete Hilfen?
- [ ] Aufgabe, Knöpfe und Rückmeldung an den Standardplätzen (R7)?
- [ ] Mindestens 40 % der Bühne frei?

Sonderfälle: Bei Druckvorlagen nur R4, R5, R9, R10 prüfen. Bei Lehrkraft-Werkzeugen (Cockpit, Generatoren) gelten die Regeln nur für das, was die Klasse sieht. Silbenschrift und Bilder in Pilze und Briefe sind Inhalt, keine Deko.

## Lehrkraftmenü (gemeinsamer Baustein)

Dateien: `gemeinsam/lehrkraftmenue.js` und `gemeinsam/lehrkraftmenue.css`.

- Geschlossen: nur ein Zahnrad oben rechts (56 px). Geöffnet: Schublade von rechts (440 px), die Bühne bleibt sichtbar.
- Schließen über Zahnrad, „×“ oder Esc. Antippen der Bühne schließt das Menü **nicht**.
- Inhalt immer in dieser Reihenfolge: Titel und Beschreibung · **Aufgabe** (Einstellungen) · **Hilfen** (alle beim Laden aus) · **Steuerung** (Neue Aufgabe, Lösung zeigen, Zurücksetzen) · Hinweise für die Lehrkraft · Zur Startseite.
- In der Übungsrunde ist das Zahnrad ausgeblendet.

Aufruf direkt: `Lehrkraftmenue.baue({ buehne, titel, beschreibung, aufgabe: [...], hilfen: [...], steuerung: { neu, loesung, zuruecksetzen }, hinweise, start })`.
In Tafelbildern mit `tafel.js`: `T.kopf({ menue: true, titel, beschreibung, … })` – dann landen alle Knöpfe aus `T.kopf` und `T.leiste` im Menü.

## Kinderknöpfe auf der Bühne

Höchstens zwei, immer unten rechts, 72 px hoch, mit Wort (meist „Prüfen“ und „Weiter“, je nach Tafelbild auch „Hilfe“).
Antwortkarten und antippbare Zahlen zählen nicht als Knöpfe, sie sind Teil der Aufgabe.
In `tafel.js`: `T.kinderknoepfe(knopf1, knopf2)`.
