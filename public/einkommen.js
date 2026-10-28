// Umrechnung zwischen Netto, Brutto (Arbeitnehmer) und Brutto (Arbeitgeber).
// Das Feld, das der Nutzer bearbeitet, ist fest. Die anderen Felder sind vorläufige Schätzungen.
// Annahme: ein Verdiener, gesetzlich versichert, ohne weitere Einkünfte.

import { berechne, parameter, sozialabgaben, STANDARD } from "./steuern.js";

export const FELDER = ["nettoMonat", "nettoJahr", "bruttoMonat", "bruttoJahr", "agMonat", "agJahr"];

// Gegenstück eines Feldes: Monat und Jahr bilden ein Paar.
export const partner = (feld) => feld.endsWith("Monat") ? feld.replace("Monat", "Jahr") : feld.replace("Jahr", "Monat");

const summe = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

export function nettoAusBrutto(brutto, lage = {}) {
  const r = berechne({
    jahr: lage.jahr ?? STANDARD.jahr,
    brutto,
    verheiratet: Boolean(lage.verheiratet),
    bruttoPartner: 0,
    kinder: lage.kinder ?? 0,
    kirche: lage.kirche ?? 0,
  });
  return brutto - r.gruppen.einkommen - r.gruppen.sozial;
}

export function arbeitgeberAusBrutto(brutto, lage = {}) {
  const p = parameter(lage.jahr ?? STANDARD.jahr);
  return brutto + summe(sozialabgaben(brutto, { kinder: lage.kinder ?? 0, p }).ag);
}

// Umkehrung einer monoton steigenden Funktion durch Bisektion, auf 1 Cent genau.
function umkehren(f, ziel) {
  if (ziel <= 0) return 0;
  let lo = 0;
  let hi = Math.max(ziel * 2, 1000);
  while (f(hi) < ziel) hi *= 2;
  while (hi - lo > 0.01) {
    const mitte = (lo + hi) / 2;
    if (f(mitte) < ziel) lo = mitte;
    else hi = mitte;
  }
  return (lo + hi) / 2;
}

const runde = (x) => Math.round(x);

// Leitet alle sechs Felder aus dem Wert eines Feldes ab.
export function ableiten(feld, wert, lage = {}) {
  const jahr = feld.endsWith("Monat") ? wert * 12 : wert;
  const art = feld.replace(/(Monat|Jahr)$/, "");
  let brutto;
  if (art === "netto") brutto = umkehren((b) => nettoAusBrutto(b, lage), jahr);
  else if (art === "ag") brutto = umkehren((b) => arbeitgeberAusBrutto(b, lage), jahr);
  else brutto = jahr;

  const werte = {
    nettoJahr: runde(nettoAusBrutto(brutto, lage)),
    bruttoJahr: runde(brutto),
    agJahr: runde(arbeitgeberAusBrutto(brutto, lage)),
  };
  for (const k of Object.keys(werte)) werte[partner(k)] = runde(werte[k] / 12);

  // Das bearbeitete Feld und sein Gegenstück folgen nur der einfachen Rechnung Monat mal 12.
  werte[feld] = wert;
  werte[partner(feld)] = feld.endsWith("Monat") ? wert * 12 : Math.round((wert / 12) * 100) / 100;
  return werte;
}
