# Changelog

## 2026.10006

Questionnaire: Berufsgruppe, Besoldungsgruppe, Geburtsjahr and Berufseintritt (no plan).

- `public/fragebogen.html`, `public/fragebogen.js`: three new steps after Bundesland. The order is now:
  Verheiratet, Kinder, Kirchensteuer, Krankenversicherung, Bundesland, Berufsgruppe, Besoldungsgruppe,
  Geburtsjahr und Berufseintritt, Haushaltseinkommen, Raucher, Wohnraum.
- Berufsgruppe: six buttons, grouped by the source of funding (see
  `research/berufsgruppen-finanzierung.md`): Selbstständig, Angestellt in der Privatwirtschaft (default),
  Angestellt in Gesundheit, Pflege, Soziales, Angestellt im öffentlichen Dienst, Beamte, Richter, Soldaten,
  Nicht erwerbstätig.
- Besoldungsgruppe: only for Beamte. 20 buttons in four columns: A3 to A16, B, R1, R2, R3+, W2, W3. For other
  groups, the step is skipped. The progress bar shows 10 or 11 segments, depending on the Berufsgruppe.
- Geburtsjahr und Berufseintritt: two optional year fields. The step accepts the Geburtsjahr from 1920 to the
  current year minus 14, and a Berufseintritt not before 14 years after the Geburtsjahr. The summary shows the
  years in the job.
- The summary shows the new answers with links to change them.
- Not yet used in the calculation: Berufsgruppe, Besoldungsgruppe, Geburtsjahr and Berufseintritt.
- Validation: `npm test` (all pass). Manual check in headless Chromium at 1280 px and 390 px width: Beamte see
  the Besoldungsgruppe (11 steps), other groups skip it (10 steps) also with the back button, the year
  validation shows a message, and the summary shows no script errors.


## 2026.10005

Step-by-step questionnaire at `/fragebogen` (no plan).

- `public/fragebogen.html`, `public/fragebogen.js`: one question per view, in this order: Verheiratet,
  Kinder (with the number of children), Kirchensteuer, Krankenversicherung, Bundesland, Haushaltseinkommen,
  Raucher (with packs per week), Wohnraum (m² and Kaltmiete). A progress bar with 8 segments and a back button
  are at the top. A summary page shows the total burden, all answers with links to change them, and a link to
  the detailed calculator with the answers in the URL hash.
- The question area has a fixed height. The default answer ("Nein", "Gesetzlich") is always the right button at
  the same position, and it has the focus. A user can answer the first four questions with the Enter key or
  four clicks at the same place.
- Bundesland: 16 buttons of equal size in two columns. Bayern and Baden-Württemberg use 8 % Kirchensteuer, the
  other states 9 %.
- `public/einkommen.js`: Netto (Arbeitnehmer), Brutto (Arbeitnehmer) and Brutto (Arbeitgeber), each per month
  and per year. The field that the user edits is fixed. Its pair (month times 12) follows directly; the
  other four fields are derived with `steuern.js` (inverse by bisection) and show "*Vorläufige Schätzung".
  Assumptions: one earner, statutory health insurance also for "Privat", no special payments.
- `public/index.html`: link to the questionnaire.
- Not yet used in the calculation: Krankenversicherung "Privat", Wohnfläche and Kaltmiete.
- Validation: `npm test` (19 tests, all pass; 5 new in `test/einkommen.test.js`). Manual check in headless
  Chromium at 1280 px and 390 px width: the default buttons of the first four steps are at the same position
  (Enter key only), the income fields derive as expected, and the summary shows no script errors.


## 2026.10004

Remove the personal name from the website content (no plan).

- `public/index.html`: the footer shows "Steusira" in place of "mbarkhau".
- Validation: `npm test` (all pass). No reference to "mbarkhau" remains in `public/`.


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
