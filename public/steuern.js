// Rechenlogik für die gesamte Steuer- und Abgabenbelastung eines Haushalts.
// Alle Beträge in Euro pro Jahr. Rechtsstand: Kalenderjahre 2024 bis 2027.
// Quellen: research/steuerrechner-parameter-2026.md

const BASIS = {
  // Einkommensteuer (§32a EStG, ab VZ 2026)
  grundfreibetrag: 12348,
  tarif: {
    zone2: { bis: 17799, a: 914.51 },
    zone3: { bis: 69878, a: 173.1, c: 1034.87 },
    linear: [[277825, 0.42, 11135.63], [Infinity, 0.45, 19470.38]],
  },
  werbungskostenPausch: 1230,
  sonderausgabenPausch: 36,
  sparerPausch: 1000,
  kinderFreibetrag: 9756, // Kinderfreibetrag 6.828 + BEA 2.928, beide Elternteile
  kindergeldMonat: 259,

  // Solidaritätszuschlag (§§3, 4 SolZG)
  soliFreigrenze: 20350,
  soliSatz: 0.055,
  soliMilderung: 0.119,

  abgeltungSatz: 0.25,

  // Sozialversicherung
  bbgRv: 101400,
  bbgKv: 69750,
  rv: 0.186,
  av: 0.026,
  kv: 0.146,
  kvZusatz: 0.029,
  pv: 0.036,
  pvKinderlos: 0.006,
  pvKinderAbschlag: 0.0025,

  // Umsatzsteuer
  ust: 0.19,
  ustErm: 0.07,
  ustGastroSpeisen: 0.07, // ab 1.1.2026, vorher 19 %
  gastroSpeisenAnteil: 0.7, // Rest sind Getränke mit 19 %

  // Energie (Energiesteuer, Stromsteuer, CO2-Preis nach BEHG)
  stromsteuerKwh: 0.0205,
  energieBenzinL: 0.6545,
  energieDieselL: 0.4704,
  energieHeizoelL: 0.06135,
  energieGasKwh: 0.0055,
  co2BenzinKgL: 2.37,
  co2DieselKgL: 2.65,
  co2HeizoelKgL: 2.676,
  co2GasKgKwh: 0.182,
  co2Preis: 60, // Vorgabe für das Eingabefeld
  co2Hinweis: "Preiskorridor 2026: 55 bis 65 €/t",

  // Tabaksteuer, Stufe 1.1.2026 bis 14.2.2027 (§2 TabStG)
  zigaretteStueck: 0.1228,
  zigaretteWert: 0.1984,
  zigaretteMinStueck: 0.25106, // abzüglich Umsatzsteuer
  feinschnittKg: 61.58,
  feinschnittWert: 0.174,
  feinschnittMinKg: 128.83, // abzüglich Umsatzsteuer

  // Alkohol und Kaffee
  bierHlPlato: 0.787,
  bierPlato: 11.5,
  schaumweinFlasche: 1.02, // 136 €/hl, 0,75 l
  alkoholHlA: 1303, // je hl reiner Alkohol
  spirituosenLiter: 0.7,
  spirituosenVol: 0.4,
  kaffeeKg: 2.19,

  versicherungsteuer: 0.19,
  lotteriesteuer: 0.2, // auf den Preis ohne Steuer
  luftverkehr: { kurz: 13.03, mittel: 33.01, lang: 59.43 }, // ab 1.7.2026
  rundfunkMonat: 18.36,
};

// Abweichungen der einzelnen Jahre von BASIS (Rechtsstand 2026).
const JAHRE_ABWEICHUNG = {
  2024: {
    // Grundfreibetrag und Kinderfreibetrag rückwirkend erhöht (Steuerfortentwicklungsgesetz)
    grundfreibetrag: 11784,
    tarif: {
      zone2: { bis: 17005, a: 954.8 },
      zone3: { bis: 66760, a: 181.19, c: 991.21 },
      linear: [[277825, 0.42, 10636.31], [Infinity, 0.45, 18971.06]],
    },
    kinderFreibetrag: 9540, // 6.612 + 2.928
    kindergeldMonat: 250,
    soliFreigrenze: 18130,
    bbgRv: 90600, // West; Ost 89.400
    bbgKv: 62100,
    kvZusatz: 0.017,
    pv: 0.034,
    ustGastroSpeisen: 0.19,
    co2Preis: 45,
    co2Hinweis: "Festpreis 2024: 45 €/t",
    zigaretteStueck: 0.1115,
    zigaretteMinStueck: 0.22888,
    feinschnittKg: 54.39,
    feinschnittWert: 0.17,
    feinschnittMinKg: 111.78,
    luftverkehr: { kurz: 15.53, mittel: 39.34, lang: 70.83 }, // ab 1.5.2024
  },
  2025: {
    grundfreibetrag: 12096,
    tarif: {
      zone2: { bis: 17443, a: 932.3 },
      zone3: { bis: 68480, a: 176.64, c: 1015.13 },
      linear: [[277825, 0.42, 10911.92], [Infinity, 0.45, 19246.67]],
    },
    kinderFreibetrag: 9600, // 6.672 + 2.928
    kindergeldMonat: 255,
    soliFreigrenze: 19950,
    bbgRv: 96600,
    bbgKv: 66150,
    kvZusatz: 0.025,
    ustGastroSpeisen: 0.19,
    co2Preis: 55,
    co2Hinweis: "Festpreis 2025: 55 €/t",
    zigaretteStueck: 0.1171,
    zigaretteMinStueck: 0.24163,
    feinschnittKg: 57.85,
    feinschnittWert: 0.172,
    feinschnittMinKg: 121.51,
    luftverkehr: { kurz: 15.53, mittel: 39.34, lang: 70.83 },
  },
  2026: {},
  2027: {
    // Entwurf Einkommensteuerreformgesetz 2027 (BT-Drs. 21/8235), noch nicht verkündet
    entwurf: true,
    grundfreibetrag: 12564,
    tarif: {
      zone2: { bis: 17799, a: 952.24 },
      zone3: { bis: 70600, a: 170.74, c: 993.86 },
      linear: [[249999, 0.42, 11241.73], [279999, 0.45, 18741.7], [Infinity, 0.47, 24341.68]],
    },
    werbungskostenPausch: 1430,
    kinderFreibetrag: 10056,
    kindergeldMonat: 267,
    // Soli-Freigrenze 2027: kein Wert gefunden, Annahme wie 2026
    bbgRv: 106200, // SV-Rechengrößenverordnung 2027, Kabinett 7.10.2026
    bbgKv: 76500,
    co2Hinweis: "Preiskorridor 2027 (Entwurf): 55 bis 65 €/t",
    // Tabaksteuermodernisierung, ab 1.1.2027
    zigaretteStueck: 0.1434,
    zigaretteWert: 0.2105,
    zigaretteMinStueck: 0.29492,
    feinschnittKg: 75.8,
    feinschnittWert: 0.1797,
    feinschnittMinKg: 151.34, // Schätzung: Anstieg wie bei Zigaretten (+17,5 %)
  },
};

// Grundsteuer B und Grunderwerbsteuer je m² Wohnfläche und Jahr: Aufkommen 2025 des Landes geteilt durch
// die bewohnte Wohnfläche des Landes (Mikrozensus 2022). Ein künstlicher Kennwert: er verteilt auch die
// Steuer auf Gewerbeimmobilien nach der Wohnfläche auf die Haushalte. Die Werte gelten für alle Jahre.
// Quelle und Rechnung: research/grundsteuer_laender.py
export const LAENDER = {
  DE: { name: "Durchschnitt Deutschland", grundsteuer: 4.23, grunderwerbsteuer: 4.03, wohnflaeche: 96 },
  BW: { name: "Baden-Württemberg", grundsteuer: 4.02, grunderwerbsteuer: 4.31, wohnflaeche: 100.5 },
  BY: { name: "Bayern", grundsteuer: 3.23, grunderwerbsteuer: 3.1, wohnflaeche: 101.2 },
  BE: { name: "Berlin", grundsteuer: 6.61, grunderwerbsteuer: 7.16, wohnflaeche: 74.8 },
  BB: { name: "Brandenburg", grundsteuer: 2.7, grunderwerbsteuer: 4.58, wohnflaeche: 90.1 },
  HB: { name: "Bremen", grundsteuer: 7.92, grunderwerbsteuer: 4.14, wohnflaeche: 82.5 },
  HH: { name: "Hamburg", grundsteuer: 7.62, grunderwerbsteuer: 7.69, wohnflaeche: 76.5 },
  HE: { name: "Hessen", grundsteuer: 4.87, grunderwerbsteuer: 4.9, wohnflaeche: 100.4 },
  MV: { name: "Mecklenburg-Vorpommern", grundsteuer: 3, grunderwerbsteuer: 3.32, wohnflaeche: 85.1 },
  NI: { name: "Niedersachsen", grundsteuer: 4.19, grunderwerbsteuer: 3.39, wohnflaeche: 106.8 },
  NW: { name: "Nordrhein-Westfalen", grundsteuer: 5.32, grunderwerbsteuer: 4.46, wohnflaeche: 94.6 },
  RP: { name: "Rheinland-Pfalz", grundsteuer: 3.25, grunderwerbsteuer: 3.09, wohnflaeche: 109.8 },
  SL: { name: "Saarland", grundsteuer: 3.11, grunderwerbsteuer: 3.15, wohnflaeche: 113.3 },
  SN: { name: "Sachsen", grundsteuer: 3.37, grunderwerbsteuer: 3.02, wohnflaeche: 81 },
  ST: { name: "Sachsen-Anhalt", grundsteuer: 2.81, grunderwerbsteuer: 2.25, wohnflaeche: 86.4 },
  SH: { name: "Schleswig-Holstein", grundsteuer: 3.8, grunderwerbsteuer: 5.33, wohnflaeche: 96.2 },
  TH: { name: "Thüringen", grundsteuer: 2.82, grunderwerbsteuer: 1.6, wohnflaeche: 87.5 },
};

export const land = (kurz) => LAENDER[kurz] || LAENDER.DE;

export const JAHRE = Object.keys(JAHRE_ABWEICHUNG).map(Number);

export const PARAMETER = Object.fromEntries(JAHRE.map((jahr) =>
  [jahr, { ...BASIS, entwurf: false, ...JAHRE_ABWEICHUNG[jahr], jahr }]));

export const P = PARAMETER[2026];

export const parameter = (jahr) => PARAMETER[jahr] || P;

const runde = (x) => Math.round(x * 100) / 100;
const ust = (brutto, satz) => (brutto * satz) / (1 + satz);

export function tarif(zvE, p = P) {
  const x = Math.floor(Math.max(0, zvE));
  const { zone2, zone3, linear } = p.tarif;
  let st;
  if (x <= p.grundfreibetrag) {
    st = 0;
  } else if (x <= zone2.bis) {
    const y = (x - p.grundfreibetrag) / 1e4;
    st = (zone2.a * y + 1400) * y;
  } else if (x <= zone3.bis) {
    const z = (x - zone2.bis) / 1e4;
    st = (zone3.a * z + 2397) * z + zone3.c;
  } else {
    const [, satz, abzug] = linear.find(([bis]) => x <= bis);
    st = satz * x - abzug;
  }
  return Math.floor(st);
}

export function einkommensteuer(zvE, splitting, p = P) {
  return splitting ? 2 * tarif(zvE / 2, p) : tarif(zvE, p);
}

export function soli(est, splitting, p = P) {
  const freigrenze = p.soliFreigrenze * (splitting ? 2 : 1);
  if (est <= freigrenze) return 0;
  return runde(Math.min(p.soliSatz * est, p.soliMilderung * (est - freigrenze)));
}

// Anteile von Arbeitnehmer (an) und Arbeitgeber (ag), gesetzlich versichert.
export function sozialabgaben(brutto, { kinder = 0, p = P, kvZusatz = p.kvZusatz } = {}) {
  const rvBasis = Math.min(brutto, p.bbgRv);
  const kvBasis = Math.min(brutto, p.bbgKv);
  const kvHalb = (p.kv + kvZusatz) / 2;
  const kinderAbschlag = p.pvKinderAbschlag * Math.max(0, Math.min(kinder, 5) - 1);
  const pvAn = p.pv / 2 + (kinder === 0 ? p.pvKinderlos : 0) - kinderAbschlag;
  return {
    an: {
      rv: runde((rvBasis * p.rv) / 2),
      av: runde((rvBasis * p.av) / 2),
      kv: runde(kvBasis * kvHalb),
      pv: runde(kvBasis * pvAn),
    },
    ag: {
      rv: runde((rvBasis * p.rv) / 2),
      av: runde((rvBasis * p.av) / 2),
      kv: runde(kvBasis * kvHalb),
      pv: runde((kvBasis * p.pv) / 2),
    },
  };
}

// Abziehbare Vorsorgeaufwendungen: Rente voll, Basis-KV ohne Krankengeldanteil (4 %), PV voll.
// Die Arbeitslosenversicherung fällt praktisch immer über den Höchstbetrag von 1.900 €.
function vorsorge(an) {
  return an.rv + 0.96 * an.kv + an.pv;
}

const summe = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

export const STANDARD = {
  jahr: 2026,
  brutto: 50000,
  verheiratet: false,
  bruttoPartner: 0,
  kinder: 0,
  kirche: 0,
  kvZusatz: 2.9,
  werbungskosten: 0,
  kapital: 0,
  arbeitgeber: false,
  abgaben: true,

  lebensmittel: 350,
  getraenke: 25,
  gastro: 120,
  konsum19: 350,
  konsum7: 40,

  land: "DE",
  wohnflaeche: 96, // Durchschnitt je Wohnung, Mikrozensus 2022
  stromKwh: 2000,
  stromPreis: 38,
  gasKwh: 0,
  gasPreis: 12,
  heizoelL: 0,
  heizoelPreis: 1.05,
  co2Preis: 60,

  benzinL: 40,
  benzinPreis: 1.75,
  dieselL: 0,
  dieselPreis: 1.65,
  kfzSteuer: 150,
  fluegeKurz: 1,
  fluegeMittel: 0,
  fluegeLang: 0,

  zigaretten: 0,
  zigarettenPreis: 9,
  tabakG: 0,
  tabakPreis: 9,
  bier: 2,
  bierPreis: 2,
  wein: 2,
  weinPreis: 6,
  sekt: 0,
  sektPreis: 6,
  spirituosen: 0,
  spirituosenPreis: 15,
  kaffee: 0.5,

  versicherungen: 600,
  lotto: 0,
  hundesteuer: 0,
  rundfunk: true,
};

// Vorgaben für ein Jahr: Zusatzbeitrag und CO₂-Preis hängen vom Jahr ab.
export function standard(jahr = STANDARD.jahr) {
  const p = parameter(jahr);
  return { ...STANDARD, jahr: p.jahr, kvZusatz: runde(p.kvZusatz * 100), co2Preis: p.co2Preis };
}

// Gruppen: einkommen, sozial, arbeitgeber, konsum, abgabe, transfer
export function berechne(eingabe) {
  const e = { ...standard(eingabe.jahr), ...eingabe };
  const p = parameter(e.jahr);
  e.jahr = p.jahr;
  const posten = [];
  const ausgaben = {}; // Konsumausgaben je Bereich
  const add = (gruppe, art, bereich, betrag) => {
    if (betrag > 0) posten.push({ gruppe, art, bereich, betrag: runde(betrag) });
  };
  const ausgabe = (bereich, betrag) => {
    ausgaben[bereich] = (ausgaben[bereich] || 0) + betrag;
  };

  // --- Einkommen ---
  const splitting = Boolean(e.verheiratet);
  const verdiener = [{ brutto: e.brutto, wk: e.werbungskosten }];
  if (splitting) verdiener.push({ brutto: e.bruttoPartner, wk: 0 });

  const sv = { an: { rv: 0, av: 0, kv: 0, pv: 0 }, ag: { rv: 0, av: 0, kv: 0, pv: 0 } };
  let einkuenfte = 0;
  let vorsorgeAbzug = 0;
  for (const v of verdiener) {
    if (v.brutto <= 0) continue;
    const s = sozialabgaben(v.brutto, { kinder: e.kinder, kvZusatz: e.kvZusatz / 100, p });
    for (const k of Object.keys(s.an)) {
      sv.an[k] += s.an[k];
      sv.ag[k] += s.ag[k];
    }
    einkuenfte += Math.max(0, v.brutto - Math.max(p.werbungskostenPausch, v.wk));
    vorsorgeAbzug += vorsorge(s.an);
  }
  const sonderausgaben = p.sonderausgabenPausch * (splitting ? 2 : 1);
  const zvE = Math.max(0, Math.floor(einkuenfte - vorsorgeAbzug - sonderausgaben));

  // Günstigerprüfung Kindergeld gegen Kinderfreibetrag (§31 EStG)
  const kindergeld = e.kinder * p.kindergeldMonat * 12;
  const estOhneKfb = einkommensteuer(zvE, splitting, p);
  const estMitKfb = einkommensteuer(Math.max(0, zvE - e.kinder * p.kinderFreibetrag), splitting, p);
  const freibetragGuenstiger = estOhneKfb - estMitKfb > kindergeld;
  const est = freibetragGuenstiger ? estMitKfb + kindergeld : estOhneKfb;

  add("einkommen", "Einkommensteuer", "Einkommen", est);
  add("einkommen", "Solidaritätszuschlag", "Einkommen", soli(estMitKfb, splitting, p));
  add("einkommen", "Kirchensteuer", "Einkommen", estMitKfb * e.kirche);

  // Abgeltungsteuer mit Kirchensteuerabzug (§32d Abs. 1 EStG)
  const kapPflichtig = Math.max(0, e.kapital - p.sparerPausch * (splitting ? 2 : 1));
  const abgeltung = kapPflichtig / (4 + e.kirche);
  add("einkommen", "Abgeltungsteuer", "Einkommen", abgeltung);
  add("einkommen", "Solidaritätszuschlag", "Einkommen", abgeltung * p.soliSatz);
  add("einkommen", "Kirchensteuer", "Einkommen", abgeltung * e.kirche);

  add("sozial", "Rentenversicherung", "Einkommen", sv.an.rv);
  add("sozial", "Krankenversicherung", "Einkommen", sv.an.kv);
  add("sozial", "Pflegeversicherung", "Einkommen", sv.an.pv);
  add("sozial", "Arbeitslosenversicherung", "Einkommen", sv.an.av);
  if (e.arbeitgeber) add("arbeitgeber", "Arbeitgeberanteil Sozialversicherung", "Einkommen", summe(sv.ag));

  // --- Konsum ---
  const ernaehrung = "Ernährung";
  ausgabe(ernaehrung, (e.lebensmittel + e.getraenke + e.gastro) * 12);
  add("konsum", "Umsatzsteuer", ernaehrung, ust(e.lebensmittel * 12, p.ustErm));
  add("konsum", "Umsatzsteuer", ernaehrung, ust(e.getraenke * 12, p.ust));
  const gastroJahr = e.gastro * 12;
  add("konsum", "Umsatzsteuer", ernaehrung, ust(gastroJahr * p.gastroSpeisenAnteil, p.ustGastroSpeisen));
  add("konsum", "Umsatzsteuer", ernaehrung, ust(gastroJahr * (1 - p.gastroSpeisenAnteil), p.ust));

  const alltag = "Konsum";
  ausgabe(alltag, (e.konsum19 + e.konsum7) * 12);
  add("konsum", "Umsatzsteuer", alltag, ust(e.konsum19 * 12, p.ust));
  add("konsum", "Umsatzsteuer", alltag, ust(e.konsum7 * 12, p.ustErm));

  // Wohnen und Energie
  const wohnen = "Wohnen und Energie";
  const co2 = (kg) => (kg / 1000) * e.co2Preis;
  const strom = (e.stromKwh * e.stromPreis) / 100;
  const gas = (e.gasKwh * e.gasPreis) / 100;
  const heizoel = e.heizoelL * e.heizoelPreis;
  // Mieter zahlen die Grundsteuer über die Nebenkosten, die Grunderwerbsteuer nur indirekt über die Miete.
  const grundsteuer = e.wohnflaeche * land(e.land).grundsteuer;
  ausgabe(wohnen, strom + gas + heizoel + grundsteuer);
  add("konsum", "Grundsteuer", wohnen, grundsteuer);
  add("konsum", "Grunderwerbsteuer (anteilig)", wohnen, e.wohnflaeche * land(e.land).grunderwerbsteuer);
  add("konsum", "Stromsteuer", wohnen, e.stromKwh * p.stromsteuerKwh);
  add("konsum", "Umsatzsteuer", wohnen, ust(strom + gas + heizoel, p.ust));
  add("konsum", "Energiesteuer", wohnen, e.gasKwh * p.energieGasKwh + e.heizoelL * p.energieHeizoelL);
  add("abgabe", "CO₂-Preis", wohnen, co2(e.gasKwh * p.co2GasKgKwh + e.heizoelL * p.co2HeizoelKgL));

  // Mobilität
  const mobil = "Mobilität";
  const benzinL = e.benzinL * 12;
  const dieselL = e.dieselL * 12;
  const kraftstoff = benzinL * e.benzinPreis + dieselL * e.dieselPreis;
  const fluege = e.fluegeKurz * p.luftverkehr.kurz + e.fluegeMittel * p.luftverkehr.mittel
    + e.fluegeLang * p.luftverkehr.lang;
  ausgabe(mobil, kraftstoff + e.kfzSteuer);
  add("konsum", "Energiesteuer", mobil, benzinL * p.energieBenzinL + dieselL * p.energieDieselL);
  add("konsum", "Umsatzsteuer", mobil, ust(kraftstoff, p.ust));
  add("abgabe", "CO₂-Preis", mobil, co2(benzinL * p.co2BenzinKgL + dieselL * p.co2DieselKgL));
  add("konsum", "Kraftfahrzeugsteuer", mobil, e.kfzSteuer);
  add("konsum", "Luftverkehrsteuer", mobil, fluege);

  // Tabak: Schachteln à 20 Stück pro Woche, Feinschnitt in Gramm pro Woche (Beutel à 40 g)
  const rauchen = "Tabak";
  const schachteln = e.zigaretten * 52;
  const beutel = (e.tabakG * 52) / 40;
  ausgabe(rauchen, schachteln * e.zigarettenPreis + beutel * e.tabakPreis);
  add("konsum", "Tabaksteuer", rauchen, schachteln * tabakSchachtel(e.zigarettenPreis, p)
    + beutel * tabakBeutel(e.tabakPreis, p));
  add("konsum", "Umsatzsteuer", rauchen,
    ust(schachteln * e.zigarettenPreis + beutel * e.tabakPreis, p.ust));

  // Alkohol: Bier in Litern pro Woche, sonst Flaschen pro Monat
  const alkohol = "Alkohol";
  const bierL = e.bier * 52;
  const alkoholAusgaben = bierL * e.bierPreis
    + 12 * (e.wein * e.weinPreis + e.sekt * e.sektPreis + e.spirituosen * e.spirituosenPreis);
  ausgabe(alkohol, alkoholAusgaben);
  add("konsum", "Biersteuer", alkohol, bierL * (p.bierHlPlato * p.bierPlato) / 100);
  add("konsum", "Schaumweinsteuer", alkohol, e.sekt * 12 * p.schaumweinFlasche);
  add("konsum", "Alkoholsteuer", alkohol,
    e.spirituosen * 12 * p.spirituosenLiter * p.spirituosenVol * (p.alkoholHlA / 100));
  add("konsum", "Umsatzsteuer", alkohol, ust(alkoholAusgaben, p.ust));

  // Kaffee: Ausgaben sind in den Lebensmitteln enthalten
  add("konsum", "Kaffeesteuer", ernaehrung, e.kaffee * 12 * p.kaffeeKg);

  // Sonstiges
  const sonst = "Sonstiges";
  ausgabe(sonst, e.versicherungen + e.lotto * 12 + e.hundesteuer + (e.rundfunk ? p.rundfunkMonat * 12 : 0));
  add("konsum", "Versicherungsteuer", sonst, ust(e.versicherungen, p.versicherungsteuer));
  add("konsum", "Lotteriesteuer", sonst, ust(e.lotto * 12, p.lotteriesteuer));
  add("konsum", "Hundesteuer", sonst, e.hundesteuer);
  if (e.rundfunk) add("abgabe", "Rundfunkbeitrag", sonst, p.rundfunkMonat * 12);

  // --- Summen ---
  const gruppen = { einkommen: 0, sozial: 0, arbeitgeber: 0, konsum: 0, abgabe: 0 };
  const aktiv = posten.filter((p) => p.gruppe !== "abgabe" || e.abgaben);
  for (const x of aktiv) gruppen[x.gruppe] += x.betrag;

  const brutto = e.brutto + (splitting ? e.bruttoPartner : 0);
  const einkommen = brutto + e.kapital + gruppen.arbeitgeber;
  const steuern = gruppen.einkommen + gruppen.konsum;
  const gesamt = steuern + gruppen.sozial + gruppen.arbeitgeber + gruppen.abgabe;
  const netto = brutto + e.kapital - gruppen.einkommen - gruppen.sozial + kindergeld;
  const konsumausgaben = summe(ausgaben);

  return {
    eingabe: e,
    jahr: e.jahr,
    parameter: p,
    posten: aktiv,
    ausgaben,
    gruppen: Object.fromEntries(Object.entries(gruppen).map(([k, v]) => [k, runde(v)])),
    zvE,
    splitting,
    freibetragGuenstiger,
    kindergeld,
    einkommen: runde(einkommen),
    steuern: runde(steuern),
    gesamt: runde(gesamt),
    nachKindergeld: runde(gesamt - kindergeld),
    quote: einkommen > 0 ? (gesamt - kindergeld) / einkommen : 0,
    netto: runde(netto),
    konsumausgaben: runde(konsumausgaben),
    rest: runde(netto - konsumausgaben),
  };
}

export function tabakSchachtel(preis, p = P, stueck = 20) {
  const nachWert = stueck * p.zigaretteStueck + p.zigaretteWert * preis;
  const mindest = stueck * p.zigaretteMinStueck - ust(preis, p.ust);
  return Math.max(nachWert, mindest);
}

export function tabakBeutel(preis, p = P, gramm = 40) {
  const kg = gramm / 1000;
  const nachWert = kg * p.feinschnittKg + p.feinschnittWert * preis;
  const mindest = kg * p.feinschnittMinKg - ust(preis, p.ust);
  return Math.max(nachWert, mindest);
}
