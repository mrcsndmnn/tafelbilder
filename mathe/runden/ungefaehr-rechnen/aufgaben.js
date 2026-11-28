// =====================================================================
//  AUFGABEN für „Ungefähr rechnen“
//  Neue Aufgaben einfach unten anhängen.
//
//  thema    Schulfest, Einkauf oder Klassenfahrt (nur zur Ordnung)
//  text     Die Frage. {a}, {b} und {betrag} werden durch die Zahlen ersetzt.
//  a, b     Die beiden Zahlen, die gerundet und addiert werden
//  betrag   Der Betrag (oder die Grenze), mit dem verglichen wird
//
//  Ob eine Aufgabe „knapp“ ist, rechnet das Tafelbild selbst aus:
//  knapp = die gerundete Summe liegt nah am Betrag.
// =====================================================================
const AUFGABEN = [
  { thema: "Einkauf", a: 289, b: 198, betrag: 500,
    text: "Lea hat {betrag} €. Sie möchte ein Rad für {a} € und einen Helm für {b} € kaufen. Reicht das Geld ungefähr?" },
  { thema: "Einkauf", a: 312, b: 186, betrag: 800,
    text: "Familie Kaya hat {betrag} €. Ein Tisch kostet {a} €, vier Stühle kosten {b} €. Reicht das Geld ungefähr?" },
  { thema: "Einkauf", a: 147, b: 231, betrag: 600,
    text: "Ben hat {betrag} €. Er möchte Schuhe für {a} € und eine Jacke für {b} € kaufen. Reicht das Geld ungefähr?" },
  { thema: "Einkauf", a: 396, b: 207, betrag: 600,
    text: "Mia hat {betrag} €. Ein Tablet kostet {a} €, die Hülle und Kopfhörer {b} €. Reicht das Geld ungefähr?" },
  { thema: "Schulfest", a: 238, b: 154, betrag: 700,
    text: "Für das Schulfest gibt es {betrag} Becher. Am Vormittag werden {a} Becher gebraucht, am Nachmittag {b}. Reichen die Becher ungefähr?" },
  { thema: "Schulfest", a: 347, b: 249, betrag: 600,
    text: "In der Turnhalle stehen {betrag} Stühle. Es kommen {a} Eltern und {b} Großeltern. Reichen die Stühle ungefähr?" },
  { thema: "Schulfest", a: 123, b: 271, betrag: 800,
    text: "Die Klasse hat {betrag} Lose. Am ersten Tag werden {a} verkauft, am zweiten {b}. Reichen die Lose ungefähr?" },
  { thema: "Schulfest", a: 452, b: 351, betrag: 800,
    text: "Es gibt {betrag} Würstchen. Die Klassen 1 bis 4 essen {a}, die Gäste {b}. Reichen die Würstchen ungefähr?" },
  { thema: "Klassenfahrt", a: 186, b: 113, betrag: 500,
    text: "Die Klasse hat {betrag} € für die Fahrt. Der Bus kostet {a} €, der Eintritt {b} €. Reicht das Geld ungefähr?" },
  { thema: "Klassenfahrt", a: 268, b: 237, betrag: 500,
    text: "Die Klasse hat {betrag} €. Die Jugendherberge kostet {a} €, das Essen {b} €. Reicht das Geld ungefähr?" },
  { thema: "Klassenfahrt", a: 134, b: 219, betrag: 900,
    text: "Im Zug sind {betrag} Plätze reserviert. Es fahren {a} Kinder und {b} Erwachsene mit. Reichen die Plätze ungefähr?" },
  { thema: "Klassenfahrt", a: 418, b: 376, betrag: 800,
    text: "Die Klasse hat {betrag} € gesammelt. Die Fahrt kostet {a} €, das Programm {b} €. Reicht das Geld ungefähr?" },
];
