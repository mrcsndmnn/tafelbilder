/* Erfundene Adressen für den Themenblock „Briefe“ – nie echte Adressen von Kindern verwenden. */
window.ADRESSEN = [
  { vorname: "Tom", nachname: "Müller", strasse: "Rosenweg", nr: "12", plz: "45879", ort: "Gelsenkirchen" },
  { vorname: "Mila", nachname: "Schulz", strasse: "Lindenstraße", nr: "7", plz: "44137", ort: "Dortmund" },
  { vorname: "Anna", nachname: "Weber", strasse: "Am Bach", nr: "3", plz: "45127", ort: "Essen" },
  { vorname: "Ali", nachname: "Yıldız", strasse: "Gartenweg", nr: "21", plz: "44787", ort: "Bochum" },
  { vorname: "Lena", nachname: "Koch", strasse: "Blumenstraße", nr: "15", plz: "46045", ort: "Oberhausen" },
];
// Absender ist immer die Klasse
window.ABSENDER = ["Klasse 3", "Schule an der Gecksheide", "Gecksheide 153", "45897 Gelsenkirchen"];
// Die drei Zeilen einer Adresse
window.adressZeilen = a => [`${a.vorname} ${a.nachname}`, `${a.strasse} ${a.nr}`, `${a.plz} ${a.ort}`];
