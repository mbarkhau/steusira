import { test } from "node:test";
import assert from "node:assert/strict";
import {
  berechne, einkommensteuer, JAHRE, PARAMETER, soli, sozialabgaben, standard, tabakSchachtel, tarif,
} from "../public/steuern.js";

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

test("Steuerjahre 2024 bis 2027", () => {
  assert.deepEqual(JAHRE, [2024, 2025, 2026, 2027]);
  assert.equal(berechne({}).jahr, 2026);
  assert.equal(berechne({ jahr: 1999 }).jahr, 2026);
});

test("Tarif ist in jedem Jahr stetig an den Zonengrenzen", () => {
  for (const jahr of JAHRE) {
    const p = PARAMETER[jahr];
    assert.equal(tarif(p.grundfreibetrag, p), 0);
    assert.ok(tarif(p.grundfreibetrag + 100, p) > 0);
    const grenzen = [p.tarif.zone2.bis, p.tarif.zone3.bis, ...p.tarif.linear.slice(0, -1).map(([bis]) => bis)];
    for (const g of grenzen) assert.ok(tarif(g + 1, p) - tarif(g, p) <= 1, `${jahr}: ${g}`);
  }
});

test("Tarif 2024, 2025 und 2027", () => {
  assert.equal(tarif(50000, PARAMETER[2024]), 10872);
  assert.equal(tarif(50000, PARAMETER[2025]), 10691);
  assert.equal(tarif(50000, PARAMETER[2027]), 10482);
  // 2027: 47 % ab 280.000 €
  const p = PARAMETER[2027];
  assert.equal(tarif(300000, p) - tarif(290000, p), 4700);
  assert.equal(soli(18130, false, PARAMETER[2024]), 0);
  assert.ok(soli(19000, false, PARAMETER[2024]) > 0);
});

test("Vorgaben und Parameter hängen vom Jahr ab", () => {
  assert.equal(standard(2024).kvZusatz, 1.7);
  assert.equal(standard(2025).co2Preis, 55);
  assert.equal(berechne({ jahr: 2024, kinder: 1 }).kindergeld, 250 * 12);
  assert.equal(berechne({ jahr: 2027, kinder: 1 }).kindergeld, 267 * 12);
  // 2027: Arbeitnehmer-Pauschbetrag 1.430 €
  assert.equal(berechne({}).zvE - berechne({ jahr: 2027 }).zvE, 200);
  // 2024: Speisen in der Gastronomie mit 19 %
  const gastro = (jahr) => berechne({ jahr, gastro: 100 }).gruppen.konsum - berechne({ jahr, gastro: 0 }).gruppen.konsum;
  assert.ok(Math.abs(gastro(2024) - (1200 * 0.19) / 1.19) < 0.05);
  assert.ok(gastro(2026) < gastro(2024));
  // Sozialabgaben 2024: BBG KV 62.100 €, PV 3,4 %
  const s = sozialabgaben(200000, { kinder: 1, p: PARAMETER[2024] });
  assert.equal(s.an.pv, 62100 * 0.017);
});

test("Tabaksteuer 2027", () => {
  const p = PARAMETER[2027];
  assert.ok(tabakSchachtel(9, p) > tabakSchachtel(9));
  assert.ok(Math.abs(tabakSchachtel(12, p) - (20 * 0.1434 + 0.2105 * 12)) < 1e-9);
});
