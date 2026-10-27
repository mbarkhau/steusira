# Changelog

## 2026.10001

Tax calculator for the total tax and levy burden of a person or household (no plan).

- `public/steuern.js`: calculation with the legal state of 2026. Income tax with Splitting and the
  comparison of Kinderfreibetrag and Kindergeld, Solidaritätszuschlag, Kirchensteuer, Abgeltungsteuer,
  employee social insurance contributions and optionally the employer share.
- Consumption taxes from expenditure: Umsatzsteuer (19 % and 7 %, restaurant food 7 %), Energiesteuer,
  Stromsteuer, Tabaksteuer for cigarettes and Feinschnitt, Biersteuer, Schaumweinsteuer, Alkoholsteuer,
  Kaffeesteuer, Versicherungsteuer, Kraftfahrzeugsteuer, Luftverkehrsteuer, Lotteriesteuer, Grundsteuer and
  Hundesteuer. CO₂ price and Rundfunkbeitrag are separate as other levies.
- `public/index.html`, `public/rechner.js`, `public/style.css`: form in sections with a tax sum per section,
  results by tax type and by area, the day in the year up to which a person works for taxes, and a budget
  table. The URL hash keeps the inputs, so a result can be shared as a link.
- Parameters and sources: `research/steuerrechner-parameter-2026.md`.
- Validation: `npm test` (9 tests, all pass). Manual check with screenshots in headless Chromium at
  1280 px and 390 px width.


## 2026.10000

Initial tracked baseline.
