import { test } from "node:test";
import assert from "node:assert/strict";
import { ableiten, arbeitgeberAusBrutto, nettoAusBrutto, partner } from "../public/einkommen.js";

test("Monat und Jahr bilden Paare", () => {
  assert.equal(partner("nettoMonat"), "nettoJahr");
  assert.equal(partner("agJahr"), "agMonat");
});

test("Brutto 50.000 €: Netto und Arbeitgeberbrutto", () => {
  // Einkommensteuer 6.796 €, Sozialabgaben 10.875 € (siehe steuern.test.js)
  assert.equal(Math.round(nettoAusBrutto(50000)), 50000 - 6796 - 4650 - 650 - 4375 - 1200);
  assert.equal(arbeitgeberAusBrutto(50000), 50000 + 4650 + 650 + 4375 + 900);
});

test("Das bearbeitete Feld bleibt fest, sein Gegenstück ist mal 12", () => {
  const w = ableiten("bruttoMonat", 4000);
  assert.equal(w.bruttoMonat, 4000);
  assert.equal(w.bruttoJahr, 48000);
  assert.equal(w.nettoMonat, Math.round(w.nettoJahr / 12));
});

// Der Tarif rundet auf ganze Euro, daher ist die Umkehrung nur auf etwa 2 € genau.
test("Umkehrung: Netto und Arbeitgeberbrutto führen zum selben Brutto", () => {
  const lagen = [{}, { verheiratet: true, kinder: 2, kirche: 0.09 }];
  for (const lage of lagen) {
    for (const brutto of [20000, 50000, 90000, 150000]) {
      const netto = nettoAusBrutto(brutto, lage);
      assert.ok(Math.abs(ableiten("nettoJahr", netto, lage).bruttoJahr - brutto) <= 2, `netto ${brutto}`);
      const ag = arbeitgeberAusBrutto(brutto, lage);
      assert.ok(Math.abs(ableiten("agJahr", ag, lage).bruttoJahr - brutto) <= 2, `ag ${brutto}`);
    }
  }
});

test("Kein Einkommen ergibt null", () => {
  assert.deepEqual(ableiten("nettoJahr", 0), {
    nettoJahr: 0, nettoMonat: 0, bruttoJahr: 0, bruttoMonat: 0, agJahr: 0, agMonat: 0,
  });
});
