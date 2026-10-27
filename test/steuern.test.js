import { test } from "node:test";
import assert from "node:assert/strict";
import { berechne, einkommensteuer, soli, sozialabgaben, tabakSchachtel, tarif } from "../public/steuern.js";

test("Tarif 2026 an den Zonengrenzen", () => {
  assert.equal(tarif(12348), 0);
  assert.equal(tarif(17799), 1034);
  assert.equal(tarif(50000), 10548);
  assert.equal(tarif(69878), 18213);
  assert.equal(tarif(277825), 105550);
  assert.equal(tarif(300000), 115529);
});

test("Splitting verdoppelt den Tarif auf das halbe Einkommen", () => {
  assert.equal(einkommensteuer(100000, true), 2 * tarif(50000));
});

test("Soli: Freigrenze und Milderungszone", () => {
  assert.equal(soli(20350, false), 0);
  assert.equal(soli(21000, false), 77.35);
  assert.equal(soli(60000, false), 3300);
  assert.equal(soli(40700, true), 0);
});

test("Sozialabgaben: Bemessungsgrenzen und Kinder in der Pflegeversicherung", () => {
  const s = sozialabgaben(50000, { kinder: 0 });
  assert.deepEqual(s.an, { rv: 4650, av: 650, kv: 4375, pv: 1200 });
  const hoch = sozialabgaben(200000, { kinder: 3 });
  assert.equal(hoch.an.rv, 9430.2);
  assert.equal(hoch.an.pv, 906.75);
});

test("Tabaksteuer je Schachtel", () => {
  assert.ok(Math.abs(tabakSchachtel(9) - (20 * 0.1228 + 0.1984 * 9)) < 1e-9);
});

test("Ledig, 50.000 € brutto, Standardkonsum", () => {
  const r = berechne({});
  assert.equal(r.zvE, 38684);
  assert.equal(r.gruppen.einkommen, 6796);
  assert.equal(r.gruppen.sozial, 10875);
  assert.ok(r.gruppen.konsum > 2000 && r.gruppen.konsum < 3000);
});

test("Rauchen erhöht die Konsumsteuern", () => {
  const ohne = berechne({});
  const mit = berechne({ zigaretten: 7, zigarettenPreis: 9 });
  const erwartet = 7 * 52 * (tabakSchachtel(9) + (9 * 0.19) / 1.19);
  assert.ok(Math.abs(mit.gruppen.konsum - ohne.gruppen.konsum - erwartet) < 0.05);
});

test("Kinderfreibetrag statt Kindergeld bei hohem Einkommen", () => {
  const r = berechne({ verheiratet: true, brutto: 150000, bruttoPartner: 80000, kinder: 2 });
  assert.equal(r.freibetragGuenstiger, true);
  assert.equal(r.kindergeld, 2 * 259 * 12);
  const n = berechne({ brutto: 30000, kinder: 1 });
  assert.equal(n.freibetragGuenstiger, false);
});

test("Arbeitgeberanteil und sonstige Abgaben sind optional", () => {
  const basis = berechne({ abgaben: false });
  assert.equal(basis.gruppen.abgabe, 0);
  const ag = berechne({ abgaben: false, arbeitgeber: true });
  assert.ok(ag.gruppen.arbeitgeber > 10000);
  assert.equal(ag.einkommen, 50000 + ag.gruppen.arbeitgeber);
});
