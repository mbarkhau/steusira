// Rechenlogik für die gesamte Steuer- und Abgabenbelastung eines Haushalts.
// Alle Beträge in Euro pro Jahr. Rechtsstand: Kalenderjahr 2026.
// Quellen: research/steuerrechner-parameter-2026.md

export const P = {
  jahr: 2026,

  // Einkommensteuer (§32a EStG, ab VZ 2026)
  grundfreibetrag: 12348,
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
  gastroSpeisenAnteil: 0.7, // Speisen 7 %, Getränke 19 %

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

const runde = (x) => Math.round(x * 100) / 100;
const ust = (brutto, satz) => (brutto * satz) / (1 + satz);

export function tarif(zvE) {
  const x = Math.floor(Math.max(0, zvE));
  let st;
  if (x <= P.grundfreibetrag) {
    st = 0;
  } else if (x <= 17799) {
    const y = (x - P.grundfreibetrag) / 1e4;
    st = (914.51 * y + 1400) * y;
  } else if (x <= 69878) {
    const z = (x - 17799) / 1e4;
    st = (173.1 * z + 2397) * z + 1034.87;
  } else if (x <= 277825) {
    st = 0.42 * x - 11135.63;
  } else {
    st = 0.45 * x - 19470.38;
  }
  return Math.floor(st);
}

export function einkommensteuer(zvE, splitting) {
  return splitting ? 2 * tarif(zvE / 2) : tarif(zvE);
}

export function soli(est, splitting) {
  const freigrenze = P.soliFreigrenze * (splitting ? 2 : 1);
  if (est <= freigrenze) return 0;
  return runde(Math.min(P.soliSatz * est, P.soliMilderung * (est - freigrenze)));
}

// Anteile von Arbeitnehmer (an) und Arbeitgeber (ag), gesetzlich versichert.
export function sozialabgaben(brutto, { kinder = 0, kvZusatz = P.kvZusatz } = {}) {
  const rvBasis = Math.min(brutto, P.bbgRv);
  const kvBasis = Math.min(brutto, P.bbgKv);
  const kvHalb = (P.kv + kvZusatz) / 2;
  const kinderAbschlag = P.pvKinderAbschlag * Math.max(0, Math.min(kinder, 5) - 1);
  const pvAn = P.pv / 2 + (kinder === 0 ? P.pvKinderlos : 0) - kinderAbschlag;
  return {
    an: {
      rv: runde((rvBasis * P.rv) / 2),
      av: runde((rvBasis * P.av) / 2),
      kv: runde(kvBasis * kvHalb),
      pv: runde(kvBasis * pvAn),
    },
    ag: {
      rv: runde((rvBasis * P.rv) / 2),
      av: runde((rvBasis * P.av) / 2),
      kv: runde(kvBasis * kvHalb),
      pv: runde((kvBasis * P.pv) / 2),
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

  grundsteuer: 300,
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

// Gruppen: einkommen, sozial, arbeitgeber, konsum, abgabe, transfer
export function berechne(eingabe) {
  const e = { ...STANDARD, ...eingabe };
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
    const s = sozialabgaben(v.brutto, { kinder: e.kinder, kvZusatz: e.kvZusatz / 100 });
    for (const k of Object.keys(s.an)) {
      sv.an[k] += s.an[k];
      sv.ag[k] += s.ag[k];
    }
    einkuenfte += Math.max(0, v.brutto - Math.max(P.werbungskostenPausch, v.wk));
    vorsorgeAbzug += vorsorge(s.an);
  }
  const sonderausgaben = P.sonderausgabenPausch * (splitting ? 2 : 1);
  const zvE = Math.max(0, Math.floor(einkuenfte - vorsorgeAbzug - sonderausgaben));

  // Günstigerprüfung Kindergeld gegen Kinderfreibetrag (§31 EStG)
  const kindergeld = e.kinder * P.kindergeldMonat * 12;
  const estOhneKfb = einkommensteuer(zvE, splitting);
  const estMitKfb = einkommensteuer(Math.max(0, zvE - e.kinder * P.kinderFreibetrag), splitting);
  const freibetragGuenstiger = estOhneKfb - estMitKfb > kindergeld;
  const est = freibetragGuenstiger ? estMitKfb + kindergeld : estOhneKfb;

  add("einkommen", "Einkommensteuer", "Einkommen", est);
  add("einkommen", "Solidaritätszuschlag", "Einkommen", soli(estMitKfb, splitting));
  add("einkommen", "Kirchensteuer", "Einkommen", estMitKfb * e.kirche);

  // Abgeltungsteuer mit Kirchensteuerabzug (§32d Abs. 1 EStG)
  const kapPflichtig = Math.max(0, e.kapital - P.sparerPausch * (splitting ? 2 : 1));
  const abgeltung = kapPflichtig / (4 + e.kirche);
  add("einkommen", "Abgeltungsteuer", "Einkommen", abgeltung);
  add("einkommen", "Solidaritätszuschlag", "Einkommen", abgeltung * P.soliSatz);
  add("einkommen", "Kirchensteuer", "Einkommen", abgeltung * e.kirche);

  add("sozial", "Rentenversicherung", "Einkommen", sv.an.rv);
  add("sozial", "Krankenversicherung", "Einkommen", sv.an.kv);
  add("sozial", "Pflegeversicherung", "Einkommen", sv.an.pv);
  add("sozial", "Arbeitslosenversicherung", "Einkommen", sv.an.av);
  if (e.arbeitgeber) add("arbeitgeber", "Arbeitgeberanteil Sozialversicherung", "Einkommen", summe(sv.ag));

  // --- Konsum ---
  const ernaehrung = "Ernährung";
  ausgabe(ernaehrung, (e.lebensmittel + e.getraenke + e.gastro) * 12);
  add("konsum", "Umsatzsteuer", ernaehrung, ust(e.lebensmittel * 12, P.ustErm));
  add("konsum", "Umsatzsteuer", ernaehrung, ust(e.getraenke * 12, P.ust));
  const gastroJahr = e.gastro * 12;
  add("konsum", "Umsatzsteuer", ernaehrung, ust(gastroJahr * P.gastroSpeisenAnteil, P.ustErm));
  add("konsum", "Umsatzsteuer", ernaehrung, ust(gastroJahr * (1 - P.gastroSpeisenAnteil), P.ust));

  const alltag = "Konsum";
  ausgabe(alltag, (e.konsum19 + e.konsum7) * 12);
  add("konsum", "Umsatzsteuer", alltag, ust(e.konsum19 * 12, P.ust));
  add("konsum", "Umsatzsteuer", alltag, ust(e.konsum7 * 12, P.ustErm));

  // Wohnen und Energie
  const wohnen = "Wohnen und Energie";
  const co2 = (kg) => (kg / 1000) * e.co2Preis;
  const strom = (e.stromKwh * e.stromPreis) / 100;
  const gas = (e.gasKwh * e.gasPreis) / 100;
  const heizoel = e.heizoelL * e.heizoelPreis;
  ausgabe(wohnen, strom + gas + heizoel + e.grundsteuer);
  add("konsum", "Grundsteuer", wohnen, e.grundsteuer);
  add("konsum", "Stromsteuer", wohnen, e.stromKwh * P.stromsteuerKwh);
  add("konsum", "Umsatzsteuer", wohnen, ust(strom + gas + heizoel, P.ust));
  add("konsum", "Energiesteuer", wohnen, e.gasKwh * P.energieGasKwh + e.heizoelL * P.energieHeizoelL);
  add("abgabe", "CO₂-Preis", wohnen, co2(e.gasKwh * P.co2GasKgKwh + e.heizoelL * P.co2HeizoelKgL));

  // Mobilität
  const mobil = "Mobilität";
  const benzinL = e.benzinL * 12;
  const dieselL = e.dieselL * 12;
  const kraftstoff = benzinL * e.benzinPreis + dieselL * e.dieselPreis;
  const fluege = e.fluegeKurz * P.luftverkehr.kurz + e.fluegeMittel * P.luftverkehr.mittel
    + e.fluegeLang * P.luftverkehr.lang;
  ausgabe(mobil, kraftstoff + e.kfzSteuer);
  add("konsum", "Energiesteuer", mobil, benzinL * P.energieBenzinL + dieselL * P.energieDieselL);
  add("konsum", "Umsatzsteuer", mobil, ust(kraftstoff, P.ust));
  add("abgabe", "CO₂-Preis", mobil, co2(benzinL * P.co2BenzinKgL + dieselL * P.co2DieselKgL));
  add("konsum", "Kraftfahrzeugsteuer", mobil, e.kfzSteuer);
  add("konsum", "Luftverkehrsteuer", mobil, fluege);

  // Tabak: Schachteln à 20 Stück pro Woche, Feinschnitt in Gramm pro Woche (Beutel à 40 g)
  const rauchen = "Tabak";
  const schachteln = e.zigaretten * 52;
  const beutel = (e.tabakG * 52) / 40;
  ausgabe(rauchen, schachteln * e.zigarettenPreis + beutel * e.tabakPreis);
  add("konsum", "Tabaksteuer", rauchen, schachteln * tabakSchachtel(e.zigarettenPreis)
    + beutel * tabakBeutel(e.tabakPreis));
  add("konsum", "Umsatzsteuer", rauchen,
    ust(schachteln * e.zigarettenPreis + beutel * e.tabakPreis, P.ust));

  // Alkohol: Bier in Litern pro Woche, sonst Flaschen pro Monat
  const alkohol = "Alkohol";
  const bierL = e.bier * 52;
  const alkoholAusgaben = bierL * e.bierPreis
    + 12 * (e.wein * e.weinPreis + e.sekt * e.sektPreis + e.spirituosen * e.spirituosenPreis);
  ausgabe(alkohol, alkoholAusgaben);
  add("konsum", "Biersteuer", alkohol, bierL * (P.bierHlPlato * P.bierPlato) / 100);
  add("konsum", "Schaumweinsteuer", alkohol, e.sekt * 12 * P.schaumweinFlasche);
  add("konsum", "Alkoholsteuer", alkohol,
    e.spirituosen * 12 * P.spirituosenLiter * P.spirituosenVol * (P.alkoholHlA / 100));
  add("konsum", "Umsatzsteuer", alkohol, ust(alkoholAusgaben, P.ust));

  // Kaffee: Ausgaben sind in den Lebensmitteln enthalten
  add("konsum", "Kaffeesteuer", ernaehrung, e.kaffee * 12 * P.kaffeeKg);

  // Sonstiges
  const sonst = "Sonstiges";
  ausgabe(sonst, e.versicherungen + e.lotto * 12 + e.hundesteuer + (e.rundfunk ? P.rundfunkMonat * 12 : 0));
  add("konsum", "Versicherungsteuer", sonst, ust(e.versicherungen, P.versicherungsteuer));
  add("konsum", "Lotteriesteuer", sonst, ust(e.lotto * 12, P.lotteriesteuer));
  add("konsum", "Hundesteuer", sonst, e.hundesteuer);
  if (e.rundfunk) add("abgabe", "Rundfunkbeitrag", sonst, P.rundfunkMonat * 12);

  // --- Summen ---
  const gruppen = { einkommen: 0, sozial: 0, arbeitgeber: 0, konsum: 0, abgabe: 0 };
  const aktiv = posten.filter((p) => p.gruppe !== "abgabe" || e.abgaben);
  for (const p of aktiv) gruppen[p.gruppe] += p.betrag;

  const brutto = e.brutto + (splitting ? e.bruttoPartner : 0);
  const einkommen = brutto + e.kapital + gruppen.arbeitgeber;
  const steuern = gruppen.einkommen + gruppen.konsum;
  const gesamt = steuern + gruppen.sozial + gruppen.arbeitgeber + gruppen.abgabe;
  const netto = brutto + e.kapital - gruppen.einkommen - gruppen.sozial + kindergeld;
  const konsumausgaben = summe(ausgaben);

  return {
    eingabe: e,
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

export function tabakSchachtel(preis, stueck = 20) {
  const nachWert = stueck * P.zigaretteStueck + P.zigaretteWert * preis;
  const mindest = stueck * P.zigaretteMinStueck - ust(preis, P.ust);
  return Math.max(nachWert, mindest);
}

export function tabakBeutel(preis, gramm = 40) {
  const kg = gramm / 1000;
  const nachWert = kg * P.feinschnittKg + P.feinschnittWert * preis;
  const mindest = kg * P.feinschnittMinKg - ust(preis, P.ust);
  return Math.max(nachWert, mindest);
}
