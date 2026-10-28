# Changelog

## 2026.10003

Label of the draft year (no plan).

- `public/rechner.js`: the year selector shows "2027*" instead of "2027 (Entwurf)".
- `public/index.html`: new footer text "*Zahlen unter Vorbehalt".
- Validation: `node --test`, 14 of 14 pass.


## 2026.10002

Selection of the tax year: 2024, 2025, 2026 and 2027 (no plan).

- `public/steuern.js`: one parameter set per year (`PARAMETER`, `parameter(jahr)`), derived from the 2026
  values and the differences per year. The tariff is data instead of fixed code, so 2027 can have the new 47 %
  zone. New input `jahr` (default 2026). `standard(jahr)` gives the year defaults for the average
  Zusatzbeitrag and the CO₂ price. The functions `tarif`, `einkommensteuer`, `soli`, `sozialabgaben`,
  `tabakSchachtel` and `tabakBeutel` take the parameters as an optional argument.
- Year-dependent values: tariff, Kinderfreibetrag, Kindergeld, Arbeitnehmer-Pauschbetrag, Soli Freigrenze,
  Beitragsbemessungsgrenzen, Zusatzbeitrag, Pflegeversicherung, USt on restaurant food, Tabaksteuer, CO₂
  price and Luftverkehrsteuer.
- 2027 uses drafts (status 2026-10-27). The page shows a note for this year. Assumptions: Soli Freigrenze as
  in 2026, Mindeststeuer for Feinschnitt estimated.
- `public/rechner.js`, `public/index.html`, `public/style.css`: year selector above the form. Hints and the
  list of assumptions follow the year. The URL hash keeps the year. On a change of the year, the Zusatzbeitrag
  and the CO₂ price follow the new default, unless the user changed them.
- Parameters and sources: section "Other Years" in `research/steuerrechner-parameter-2026.md`.
- Validation: `npm test` (14 tests, all pass). Manual check in headless Chromium at 1280 px and 390 px
  width; a click on a year updates the defaults, the hints and the URL hash.


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
