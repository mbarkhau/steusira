# Lohnsteuer 2026: Tables and Calculation Formulas

Status: research notes, collected 2026-10-27.

This file collects the official rules for the calculation of Lohnsteuer (wage tax), Solidaritätszuschlag
(SolZ) and the Kirchensteuer base for 2026. The primary source is the Programmablaufplan (PAP) of the
Bundesministerium der Finanzen (BMF). A reference implementation is in `lohnsteuer2026.py`. It reproduces
all 258 values of the two official Prüftabellen in the PAP. To check it, run
`python3 research/lohnsteuer2026.py`.


## Sources

- BMF-Schreiben (koordinierter Ländererlass) vom 12.11.2025, IV C 5 - S 2361/00025/016/028, BStBl I 2025,
  S. 1948. It has three attachments:
  - Anlage 1: PAP for the machine calculation of Lohnsteuer, SolZ and Kirchensteuer base 2026. Also valid for
    the Lohnsteuer-Jahresausgleich by the employer (§ 42b EStG).
    Copy: [IHK München, PDF](https://www.ihk-muenchen.de/ihk/documents/Recht-Steuern/Steuerrecht/Einkommensteuer/2025-11-12-PAP-2026-anlage-1.pdf)
  - Anlage 2: PAP for the creation of Lohnsteuertabellen (manual tables) 2026.
  - Anlage 3: PAP for the limit of Lohnsteuer and SolZ on Versorgungsbezüge under double tax treaties.
  - Summaries: [Haufe](https://www.haufe.de/steuern/finanzverwaltung/programmablaufplaene-zur-lohnsteuer-ab-2026_164_665400.html),
    [DATEV Magazin](https://www.datev-magazin.de/nachrichten-steuern-recht/steuern/programmablaufplaene-zur-lohnsteuer-fuer-ab-2026-142849)
- [§ 32a EStG](https://www.gesetze-im-internet.de/estg/__32a.html) (Einkommensteuertarif), version from
  VZ 2026 by the Steuerfortentwicklungsgesetz (SteFeG).
- BMF Steuerrechner:
  - [Lohnsteuerrechner 2026](https://www.bmf-steuerrechner.de/bl/bl2026/eingabeformbl2026.xhtml)
  - [PAP as XML pseudo code](https://www.bmf-steuerrechner.de/interface/pseudocodes.xhtml) (machine readable,
    good for code generation)
  - [PAP as PDF](https://www.bmf-steuerrechner.de/interface/programmablauf.xhtml)
  - [External interface](https://www.bmf-steuerrechner.de/interface/einganginterface.xhtml) (HTTP API)

The BMF does not publish complete Lohnsteuertabellen (by month, Steuerklasse and wage). Printed or online
tables from publishers are derived from Anlage 2. For software, the PAP (Anlage 1) is the relevant source.


## Einkommensteuertarif 2026 (§ 32a Abs. 1 EStG)

x is the zu versteuerndes Einkommen (zvE), rounded down to full euro. The result is rounded down to full euro.

| Zone | zvE (euro)          | Tax (euro)                               | Marginal rate |
| ---- | ------------------- | ---------------------------------------- | ------------- |
| 1    | 0 – 12,348          | 0                                        | 0 %           |
| 2    | 12,349 – 17,799     | (914.51 · y + 1,400) · y                 | 14 % – 24 %   |
| 3    | 17,800 – 69,878     | (173.10 · z + 2,397) · z + 1,034.87      | 24 % – 42 %   |
| 4    | 69,879 – 277,825    | 0.42 · x − 11,135.63                     | 42 %          |
| 5    | from 277,826        | 0.45 · x − 19,470.38                     | 45 %          |

- y = (x − 12,348) / 10,000
- z = (x − 17,799) / 10,000
- Splitting (§ 32a Abs. 5 EStG): tax = 2 · tariff(zvE / 2). In the PAP this is `KZTAB = 2` (Steuerklasse III).

Comparison with 2025: Grundfreibetrag 12,096 euro (2025) to 12,348 euro (2026), +252 euro (+2.1 %).


## Parameters 2026

| Parameter                                         | PAP name    |          Value | 2025       |
| ------------------------------------------------- | ----------- | -------------: | ---------- |
| Grundfreibetrag                                   | GFB         |         12,348 | 12,096     |
| Arbeitnehmer-Pauschbetrag                         | ANP         |          1,230 | 1,230      |
| Sonderausgaben-Pauschbetrag                       | SAP         |             36 | 36         |
| Entlastungsbetrag Alleinerziehende (Stkl. II)     | EFA         |          4,260 | 4,260      |
| Freibeträge für Kinder per child (both parents)   | KFB         |          9,756 | 9,600      |
| Freibeträge für Kinder per child (one parent)     | KFB         |          4,878 | 4,800      |
| SolZ Freigrenze (single, double for Stkl. III)    | SOLZFREI    |         20,350 | 19,950     |
| Grenzwert 1 Stkl. V/VI                            | W1STKL5     |         14,071 |            |
| Grenzwert 2 Stkl. V/VI                            | W2STKL5     |         34,939 |            |
| Grenzwert 3 Stkl. V/VI                            | W3STKL5     |        222,260 |            |
| BBG Renten- und Arbeitslosenversicherung          | BBGRVALV    |        101,400 | 96,600     |
| BBG Kranken- und Pflegeversicherung               | BBGKVPV     |         69,750 | 66,150     |
| RV rate, employee share (18.6 % / 2)              | RVSATZAN    |         9.30 % |            |
| ALV rate, employee share (2.6 % / 2)              | AVSATZAN    |         1.30 % |            |
| KV ermäßigter rate, employee share (14.0 % / 2)   | KVSATZAN    | 7.00 % + KVZ/2 |            |
| PV rate, employee share (Sachsen: 2.30 %)         | PVSATZAN    |         1.80 % |            |
| PV Zuschlag Kinderlose                            |             |         +0.6 % |            |
| PV Abschlag per child from 2nd to 5th child       | PVA         |        −0.25 % |            |
| Average KV Zusatzbeitrag (§ 242a SGB V)           | KVZ         |         2.90 % | 2.50 %     |

The 2025 values are from memory of the PAP 2025 and the SteFeG. Check them before use in code.


## Calculation of the Jahreslohnsteuer (laufender Arbeitslohn)

All amounts in euro. The PAP calculates an annual value and divides it for the Lohnzahlungszeitraum (month:
/ 12, week: · 7 / 360, day: / 360, rounded down to cent).

1. **Jahresarbeitslohn** `ZRE4` = gross wage of the year, minus Versorgungsfreibetrag, Altersentlastungsbetrag
   and Freibetrag of the ELStAM, plus Hinzurechnungsbetrag.
2. **Tabellenfreibeträge** `ZTABFB` = EFA + ANP + SAP (+ Zuschlag zum Versorgungsfreibetrag).
   - Stkl. I–V: ANP = min(ZRE4, 1,230), SAP = 36. Stkl. VI: ANP = SAP = 0.
   - Stkl. II only: EFA = 4,260.
3. **Vorsorgepauschale** `VSP` (§ 39b Abs. 2 Satz 5 Nr. 3 EStG), see the next section.
4. **zvE** `ZVE = ZRE4 − ZTABFB − VSP`, `X = ZVE / KZTAB` rounded down to euro (KZTAB = 2 for Stkl. III,
   otherwise 1).
5. **Tax**:
   - Stkl. I–IV: `ST = tariff(X) · KZTAB`.
   - Stkl. V/VI: special procedure (MST5-6), see below.
6. **Faktorverfahren** (Stkl. IV with factor): `LSTJAHR = ST · F`.


## Vorsorgepauschale 2026

The 2026 PAP includes the changes of the Jahressteuergesetz 2020 and 2022 and of the
Kreditzweitmarktförderungsgesetz. Main points:

- **Rentenversicherung** `VSPR = min(ZRE4, 101,400) · 9.3 %` (0 if the employee is not in the statutory
  pension system, KRV = 1).
- **Kranken- und Pflegeversicherung, gesetzlich** (PKV = 0):
  `VSPKVPV = min(ZRE4, 69,750) · (7.0 % + KVZ / 2 + PV rate)`. KVZ is the individual Zusatzbeitrag of the
  Krankenkasse, not the average.
- **Kranken- und Pflegeversicherung, privat** (PKV = 1): from 2026 the employer uses the actual premiums for
  the basic insurance from the ELStAM (`PKPV`, monthly amount), minus the tax free employer subsidy
  (`PKPVAGZ`). The old Mindestvorsorgepauschale (12 % of the wage, max. 1,900 / 3,000 euro) is no longer in
  the PAP. In Stkl. VI the PKV part is 0.
- `VSP = VSPR + VSPKVPV`, rounded up to full euro.
- **Arbeitslosenversicherung** (new, § 39b Abs. 2 Satz 5 Nr. 3 Buchst. e EStG): if the employee pays ALV
  (ALV = 0), a comparison value is calculated:
  `VSPN = VSPR + min(1.3 % · min(ZRE4, 101,400) + VSPKVPV, 1,900)`, rounded up. The larger of VSP and VSPN is
  used. With statutory KV (KVZ = 2.90 %, PV with Zuschlag) the KV/PV part alone reaches 1,900 euro at a
  wage of approximately 17,500 euro. Thus the comparison has an effect only for wages below this value, or
  for employees with small PKV premiums.


## Steuerklasse V und VI (§ 39b Abs. 2 Satz 7 EStG)

The tax for X (after the deduction of the Freibeträge) is calculated with the help function UP5-6:

```
UP5-6(ZX):
    ST1  = tariff(floor(ZX · 1.25))
    ST2  = tariff(floor(ZX · 0.75))
    DIFF = (ST1 − ST2) · 2
    MIST = floor(ZX · 0.14)
    return max(DIFF, MIST)

if X > W2 (34,939):
    ST = UP5-6(W2)
    if X > W3 (222,260):
        ST = floor(ST + (W3 − W2) · 0.42)
        ST = floor(ST + (X − W3) · 0.45)
    else:
        ST = floor(ST + (X − W2) · 0.42)
else:
    ST = UP5-6(X)
    if X > W1 (14,071):
        ST = min(ST, floor(UP5-6(W1) + (X − W1) · 0.42))
```

Note: In 2026 the PAP rounds `ZX · 1.25` and `ZX · 0.75` down to full euro. With rounding to cent, the
reference implementation gives a deviation of 2 euro for Stkl. VI at 32,500 euro.


## Solidaritätszuschlag and Kirchensteuer base

- **Bemessungsgrundlage** `JBMG`: Jahreslohnsteuer, but calculated with the Freibeträge für Kinder
  (`KFB = ZKF · 9,756` in Stkl. I–III, `ZKF · 4,878` in Stkl. IV, 0 in Stkl. V/VI) as an additional
  Tabellenfreibetrag. Without children `JBMG = LSTJAHR`. The same base is used for the Kirchensteuer (§ 51a EStG).
- **SolZ**: 0 if `JBMG ≤ 20,350 · KZTAB`. Otherwise
  `SOLZ = min(JBMG · 5.5 %, (JBMG − 20,350 · KZTAB) · 11.9 %)` (Milderungszone), rounded down to cent.
- For sonstige Bezüge (one time payments) there is no Freigrenze: SolZ = 5.5 % of the tax on the payment,
  if the SolZ base for the year is above the Freigrenze.


## Prüftabelle (excerpt)

Jahreslohnsteuer 2026 in euro from the PAP (page 39). "Allgemein" means: the employee is in all social
insurance branches, KVZ = 2.90 %, PV Zuschlag for Kinderlose except Stkl. II. No children.

| Jahresbrutto | I      | II     | III    | IV     | V      | VI     |
| -----------: | -----: | -----: | -----: | -----: | -----: | -----: |
|       15,000 |      0 |      0 |      0 |      0 |  1,472 |  1,676 |
|       20,000 |    380 |      0 |      0 |    380 |  2,234 |  2,766 |
|       30,000 |  2,248 |  1,230 |      0 |  2,248 |  5,588 |  6,120 |
|       40,000 |  4,407 |  3,293 |  1,000 |  4,407 |  8,720 |  9,218 |
|       50,000 |  6,788 |  5,580 |  2,810 |  6,788 | 12,010 | 12,542 |
|       60,000 |  9,389 |  8,091 |  4,822 |  9,389 | 15,364 | 15,895 |
|       70,000 | 12,220 | 10,835 |  6,952 | 12,220 | 18,729 | 19,260 |
|       80,000 | 15,694 | 14,188 |  9,496 | 15,694 | 22,538 | 23,070 |
|      100,000 | 23,248 | 21,634 | 15,012 | 23,248 | 30,157 | 30,689 |
|      110,000 | 27,393 | 25,779 | 18,252 | 27,393 | 34,302 | 34,834 |

The full tables (5,000 to 110,000 euro in steps of 2,500, "allgemein" and "besonders") are in
`lohnsteuer2026.py`.


## Open Points

- The reference implementation does not cover Versorgungsbezüge, Altersentlastungsbetrag, sonstige Bezüge
  (Fünftelregelung was removed in the Lohnsteuerabzug from 2025), the Faktorverfahren and the
  Lohnzahlungszeiträume month, week and day.
- The Prüftabellen check only the Lohnsteuer. The SolZ and the effect of Kinderfreibeträge are implemented
  as in the PAP, but no official test values are available for them in Anlage 1.
- The BMF XML pseudo code is a better base for a complete implementation than the PDF, because the PDF
  flowcharts lose the rounding symbols in text extraction.
- Lohnsteuer is a prepayment. The final tax is set in the Einkommensteuerveranlagung. For the real tax burden
  (the goal of Steusira), the assessment with § 32a EStG is the relevant calculation; the Lohnsteuer is only
  the monthly withholding.
