/* ===== mock-a1-lesen.js: A1 · Lesen — ৩টা মডেল টেস্ট (Goethe-Zertifikat A1: Start Deutsch 1 এর ধাঁচে, নিজস্ব অনুশীলন-লেখা) =====
   Teil 1: ২টা লেখা + ৫টা Richtig/Falsch · Teil 2: ৫টা a/b · Teil 3: ৫টা Schild + Richtig/Falsch
   নতুন সেট যোগ করতে এই তালিকার শেষে আরেকটা { ... } বসান। */
window.MOCK_A1_LESEN=[
{
 id:'l1', title:'Modelltest 1',
 t1:{
  texts:[
   {h:'E-Mail von Anna',t:'Hallo Tom,\nich bin am Samstag in Hamburg. Ich komme um 14 Uhr mit dem Zug an. Hast du Zeit? Wir können einen Kaffee trinken. Am Abend muss ich zu meiner Tante fahren. Sie wohnt in Bremen.\nBis bald!\nAnna'},
   {h:'Nachricht von Peter Weber',t:'Liebe Frau Krause,\nich bin vom 5. bis 12. August im Urlaub. Können Sie bitte meine Blumen gießen? Den Schlüssel finden Sie bei Familie Özdemir im Erdgeschoss. Vielen Dank!\nViele Grüße\nPeter Weber'}
  ],
  q:[
   {s:'Anna kommt am Samstag mit dem Zug nach Hamburg.',a:true,e:'ই-মেইলে লেখা আছে: Ich komme um 14 Uhr mit dem Zug an। অ্যানা ট্রেনে হামবুর্গে আসছে, তাই Richtig।'},
   {s:'Anna und Tom trinken am Abend Kaffee.',a:false,e:'কফি খাওয়ার কথা অ্যানা আসার পর, বিকেলে। Am Abend (সন্ধ্যায়) তাকে খালার বাসায় যেতে হয়। তাই Falsch।'},
   {s:'Annas Tante wohnt in Bremen.',a:true,e:'Meine Tante ... Sie wohnt in Bremen — খালা ব্রেমেনে থাকেন। Richtig।'},
   {s:'Frau Krause soll die Blumen gießen.',a:true,e:'Können Sie bitte meine Blumen gießen? — ফ্রাউ ক্রাউজে ফুলে পানি দিতে বলা হয়েছে। Richtig।'},
   {s:'Den Schlüssel gibt es bei Herrn Weber.',a:false,e:'Den Schlüssel finden Sie bei Familie Özdemir — চাবি পরিবার Özdemir এর কাছে, হের ভেবারের কাছে নয়। Falsch।'}
  ]
 },
 t2:[
  {s:'Sie möchten am Sonntag frühstücken.',a:'Café Sonne\nFrühstück täglich von 8 bis 12 Uhr.\nSonntag: Brunch bis 14 Uhr.',b:'Restaurant Roma\nPizza und Pasta.\nGeöffnet von 17 bis 23 Uhr. Montag Ruhetag.',k:'a',e:'Frühstück ও Brunch আছে Café Sonne তে, রবিবারেও। Restaurant Roma খোলে বিকেল ৫টা থেকে। উত্তর a।'},
  {s:'Sie suchen ein Zimmer in Köln.',a:'Verkaufe Fahrrad,\nkaum gefahren, 80 Euro.\nTel. 0151 234567',b:'Zimmer in Köln-Ehrenfeld frei.\n20 qm, 350 Euro warm, ab 1. Mai.\nTel. 0221 998877',k:'b',e:'Zimmer in Köln ... frei — ঘর ভাড়ার বিজ্ঞাপন b-তে। a-তে সাইকেল বিক্রির কথা। উত্তর b।'},
  {s:'Sie wollen Deutsch lernen.',a:'Sprachschule Lingua\nDeutschkurse A1 bis B1.\nMontag und Mittwoch, 18 bis 20 Uhr.',b:'Tanzschule Luna\nSalsa für Anfänger.\nFreitag, 19 Uhr.',k:'a',e:'Sprachschule = ভাষার স্কুল, Deutschkurse = জার্মান ভাষার কোর্স। b হলো নাচের স্কুল। উত্তর a।'},
  {s:'Sie brauchen einen Arzt für Ihr Kind.',a:'Zahnarzt Dr. Weiß\nTermine nach Vereinbarung.\nTelefon 040 556677',b:'Kinderarzt Dr. Braun\nSprechstunde: Mo–Fr 8–12 Uhr.\nDi und Do auch 15–18 Uhr.',k:'b',e:'Kinderarzt = শিশুর ডাক্তার। a হলো দাঁতের ডাক্তার (Zahnarzt)। উত্তর b।'},
  {s:'Sie wollen am Wochenende einen Ausflug machen.',a:'Tierpark Hagen\nSamstag und Sonntag\ngeöffnet von 9 bis 18 Uhr.\nKinder bis 5 Jahre frei.',b:'Büro-Möbel Müller\nWir sind von Montag\nbis Freitag für Sie da.',k:'a',e:'Tierpark (চিড়িয়াখানা) শনি ও রবিবার খোলা — ছুটির দিনে ঘোরার জন্য মানানসই। b সোম থেকে শুক্র খোলা আসবাবের দোকান। উত্তর a।'}
 ],
 t3:[
  {sign:'Rauchen verboten!\nBitte gehen Sie nach draußen.',s:'Man darf hier nicht rauchen.',a:true,e:'Rauchen verboten = ধূমপান নিষেধ। তাই Richtig।'},
  {sign:'Bäckerei Meyer\nHeute geschlossen.\nMorgen ab 6 Uhr wieder für Sie da.',s:'Die Bäckerei ist morgen auch geschlossen.',a:false,e:'আজ বন্ধ, কিন্তু morgen ab 6 Uhr wieder da — কাল সকাল ৬টা থেকে আবার খোলা। তাই Falsch।'},
  {sign:'Bitte leise sein!\nVon 22 bis 6 Uhr ist Ruhezeit.',s:'In der Nacht muss man leise sein.',a:true,e:'রাত ১০টা থেকে সকাল ৬টা পর্যন্ত Ruhezeit (নীরব থাকার সময়)। Richtig।'},
  {sign:'Kasse 3 ist nicht besetzt.\nBitte zu Kasse 1 oder 2.',s:'Man kann an Kasse 3 bezahlen.',a:false,e:'Nicht besetzt = কেউ নেই, বন্ধ। কাউন্টার ১ বা ২ এ যেতে বলা হয়েছে। তাই Falsch।'},
  {sign:'Bus Linie 12\nfährt heute wegen einer Baustelle nicht bis zum Hauptbahnhof.\nBitte aussteigen: Marktplatz.',s:'Der Bus 12 fährt heute nicht bis zum Bahnhof.',a:true,e:'fährt nicht bis zum Hauptbahnhof — আজ বাসটা স্টেশন পর্যন্ত যায় না। Richtig।'}
 ]
},
{
 id:'l2', title:'Modelltest 2',
 t1:{
  texts:[
   {h:'E-Mail von Lisa',t:'Liebe Mara,\nvielen Dank für die Einladung zu deinem Geburtstag! Leider kann ich am Freitag nicht kommen, denn ich arbeite bis 20 Uhr. Aber am Samstag habe ich Zeit. Gehen wir zusammen ins Kino? Der neue Film beginnt um 19.30 Uhr.\nLiebe Grüße\nLisa'},
   {h:'Mitteilung von der Sprachschule',t:'Liebe Kursteilnehmer,\nder Deutschkurs beginnt nicht am Montag, sondern erst am Mittwoch, 3. März, um 18 Uhr. Bitte bringen Sie Ihr Kursbuch mit. Den Raum finden Sie im ersten Stock, Zimmer 14.\nMit freundlichen Grüßen\nSabine Hoffmann, Sprachschule Lingua'}
  ],
  q:[
   {s:'Lisa hat am Freitag Geburtstag.',a:false,e:'deinem Geburtstag — জন্মদিন মারার, লিসার নয়। Falsch।'},
   {s:'Lisa arbeitet am Freitag bis 20 Uhr.',a:true,e:'ich arbeite bis 20 Uhr — শুক্রবার রাত ৮টা পর্যন্ত কাজ। Richtig।'},
   {s:'Lisa möchte am Samstag ins Kino gehen.',a:true,e:'Gehen wir zusammen ins Kino? — শনিবার সিনেমায় যাওয়ার প্রস্তাব দিয়েছে। Richtig।'},
   {s:'Der Deutschkurs beginnt am Montag.',a:false,e:'nicht am Montag, sondern erst am Mittwoch — সোমবার নয়, বুধবার থেকে। Falsch।'},
   {s:'Der Kursraum ist im ersten Stock.',a:true,e:'Den Raum finden Sie im ersten Stock, Zimmer 14 — Richtig।'}
  ]
 },
 t2:[
  {s:'Sie möchten Brot kaufen.',a:'Apotheke am Markt\nMedikamente und Beratung.\nMo–Sa geöffnet.',b:'Bäckerei Schmidt\nFrische Brötchen und Brot\njeden Tag ab 6 Uhr.',k:'b',e:'Brot, Brötchen পাওয়া যায় Bäckerei (বেকারি) তে। a হলো ওষুধের দোকান। উত্তর b।'},
  {s:'Sie suchen Arbeit im Supermarkt.',a:'Supermarkt Frisch sucht\nVerkäuferin, 20 Stunden pro Woche.\nBewerbung bitte per E-Mail.',b:'Fahrschule Kurz\nFührerschein in drei Monaten.\nJetzt anmelden!',k:'a',e:'sucht Verkäuferin — সুপারমার্কেট বিক্রয়কর্মী খুঁজছে। b হলো ড্রাইভিং স্কুল। উত্তর a।'},
  {s:'Sie wollen ein Fahrrad kaufen.',a:'Reisebüro Sonne\nUrlaub am Meer!\nFlüge ab 99 Euro.',b:'Fahrradladen Rad & Tat\nNeue und gebrauchte Fahrräder\nab 90 Euro. Reparaturservice.',k:'b',e:'Fahrradladen = সাইকেলের দোকান, Fahrräder ab 90 Euro। a ভ্রমণ সংস্থা। উত্তর b।'},
  {s:'Sie wollen wissen: Wann fährt der Zug nach München?',a:'Fahrplan\nZug nach München:\nAbfahrt 7.15, 9.15, 11.15 Uhr.\nGleis 4',b:'Stadtplan\nBahnhofstraße:\nHotel, Post, Bank',k:'a',e:'Fahrplan = ট্রেনের সময়সূচি; Abfahrt = ছাড়ার সময়। b শহরের মানচিত্র। উত্তর a।'},
  {s:'Sie suchen einen Sportkurs.',a:'Buchhandlung Lesezeit\nNeue Bücher\njede Woche!',b:'Sportverein Blau-Weiß\nYoga für alle,\nDienstag 19 Uhr.\nProbestunde kostenlos.',k:'b',e:'Sportverein, Yoga, Probestunde — খেলাধুলার কোর্স। a হলো বইয়ের দোকান। উত্তর b।'}
 ],
 t3:[
  {sign:'Achtung!\nFrisch gestrichen.',s:'Man soll die Wand nicht anfassen.',a:true,e:'Frisch gestrichen = সদ্য রং করা, তাই দেয়াল ছোঁয়া যাবে না। Richtig।'},
  {sign:'Schwimmbad\nIm August montags geschlossen.',s:'Im August kann man montags schwimmen.',a:false,e:'montags geschlossen — সোমবার বন্ধ, তাই সাঁতার কাটা যায় না। Falsch।'},
  {sign:'Hunde bitte\nan die Leine nehmen!',s:'Hunde müssen an der Leine sein.',a:true,e:'an die Leine nehmen = দড়িতে বেঁধে রাখা। Richtig।'},
  {sign:'Zahnarztpraxis Dr. Klein\nUrlaub vom 10. bis 24. Juli.\nVertretung: Dr. Yilmaz, Tel. 030 112233',s:'Dr. Klein arbeitet im Juli die ganze Zeit.',a:false,e:'Urlaub vom 10. bis 24. Juli — এই সময় ডাক্তার ছুটিতে, অন্য ডাক্তার (Vertretung) আছেন। Falsch।'},
  {sign:'Parkplatz nur für Kunden.\nAndere Autos werden abgeschleppt.',s:'Hier dürfen alle Leute parken.',a:false,e:'nur für Kunden = শুধু ক্রেতাদের জন্য। অন্যদের গাড়ি সরিয়ে নেওয়া হবে। Falsch।'}
 ]
},
{
 id:'l3', title:'Modelltest 3',
 t1:{
  texts:[
   {h:'E-Mail von Ali',t:'Hallo Julia,\nich wohne jetzt in Düsseldorf. Meine Wohnung ist klein, aber sehr schön. Sie hat zwei Zimmer und einen Balkon. Die Miete ist 520 Euro. Am Wochenende machen wir eine Party. Kommst du? Wir fangen um 18 Uhr an.\nGruß\nAli'},
   {h:'Nachricht von der Zahnarztpraxis',t:'Sehr geehrter Herr Klein,\nIhr Termin ist am Dienstag, 14. Mai, um 9.30 Uhr. Bitte kommen Sie 10 Minuten früher. Wenn Sie nicht kommen können, rufen Sie bitte an: 089 445566.\nFreundliche Grüße\nPraxis Dr. Berger'}
  ],
  q:[
   {s:'Ali wohnt jetzt in Düsseldorf.',a:true,e:'Ich wohne jetzt in Düsseldorf — Richtig।'},
   {s:'Alis Wohnung hat drei Zimmer.',a:false,e:'Sie hat zwei Zimmer und einen Balkon — দুইটা রুম, তিনটা নয়। Falsch।'},
   {s:'Die Party beginnt um 18 Uhr.',a:true,e:'Wir fangen um 18 Uhr an — Richtig।'},
   {s:'Herr Klein hat am Dienstag einen Termin.',a:true,e:'Ihr Termin ist am Dienstag, 14. Mai — Richtig।'},
   {s:'Herr Klein soll 10 Minuten später kommen.',a:false,e:'10 Minuten früher = ১০ মিনিট আগে, পরে নয়। Falsch।'}
  ]
 },
 t2:[
  {s:'Sie möchten eine Pizza essen.',a:'Pizzeria Napoli\nTäglich 11–23 Uhr.\nAuch Lieferservice.',b:'Blumen Rose\nBlumen und Pflanzen.\nMo–Fr 8–18 Uhr.',k:'a',e:'Pizzeria = পিৎজার দোকান। b ফুলের দোকান। উত্তর a।'},
  {s:'Sie suchen eine Wohnung.',a:'Gebrauchtes Sofa\nzu verkaufen.\n100 Euro.',b:'Wohnung zu vermieten:\n3 Zimmer, Küche, Bad, 75 qm.\n780 Euro. Ab 1. Juni.\nTel. 0172 334455',k:'b',e:'Wohnung zu vermieten = ফ্ল্যাট ভাড়া দেওয়া হবে। a পুরনো সোফা বিক্রির বিজ্ঞাপন। উত্তর b।'},
  {s:'Sie haben Kopfschmerzen.',a:'Elektro Meier\nFernseher und Handys\nab 49 Euro.',b:'Apotheke Hirsch\nMedikamente und Beratung.\nMo–Fr 8.30–18.30 Uhr',k:'b',e:'মাথাব্যথায় ওষুধ লাগে — Apotheke (ওষুধের দোকান), Medikamente = ওষুধ। a হলো ইলেকট্রনিক্সের দোকান। উত্তর b।'},
  {s:'Sie möchten ein Konto eröffnen.',a:'Stadtbank\nNeu: Konto für Studenten\nund Azubis, kostenlos!\nBeratung ohne Termin.',b:'Reisebüro Nord\nUrlaub in der Türkei.\nJetzt günstig buchen!',k:'a',e:'Konto, Bank — ব্যাংক অ্যাকাউন্টের বিজ্ঞাপন a-তে। b ভ্রমণ সংস্থা। উত্তর a।'},
  {s:'Sie möchten am Abend ins Theater gehen.',a:'Stadtbücherei\nÖffnungszeiten:\nMo–Sa 10–18 Uhr.',b:'Stadttheater\nDer kleine Prinz, 19.30 Uhr.\nKarten ab 12 Euro an der Abendkasse.',k:'b',e:'Theater, 19.30 Uhr, Karten — থিয়েটারের টিকিট b-তে। a লাইব্রেরির সময়সূচি। উত্তর b।'}
 ],
 t3:[
  {sign:'Eingang nur für Mitarbeiter.',s:'Alle Besucher dürfen hier hinein.',a:false,e:'nur für Mitarbeiter = শুধু কর্মীদের জন্য। দর্শনার্থীরা ঢুকতে পারে না। Falsch।'},
  {sign:'Geöffnet:\nMo–Fr 9–18 Uhr\nSa 9–13 Uhr\nSonntag geschlossen',s:'Am Samstag ist das Geschäft bis 13 Uhr offen.',a:true,e:'Sa 9–13 Uhr — শনিবার দুপুর ১টা পর্যন্ত খোলা। Richtig।'},
  {sign:'Fahrräder bitte hier abstellen.',s:'Hier kann man sein Fahrrad parken.',a:true,e:'Fahrräder abstellen = সাইকেল রাখা। Richtig।'},
  {sign:'Bitte Schuhe ausziehen!',s:'Man muss die Schuhe anlassen.',a:false,e:'Schuhe ausziehen = জুতা খুলে ফেলুন। তাই জুতা পরে থাকা যাবে না। Falsch।'},
  {sign:'Heute: Tagesgericht\nSuppe mit Brot, 4,50 Euro.\nGetränke extra.',s:'Getränke kosten extra.',a:true,e:'Getränke extra = পানীয়ের দাম আলাদা। Richtig।'}
 ]
}
];
