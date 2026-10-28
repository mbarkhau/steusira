# Grundsteuer from 2025: Rules, Parameters and Hebesätze

Status: research notes, collected 2026-10-28.

This file collects the rules to calculate the Grundsteuer B for residential property after the reform
(effective 2025-01-01). The values of the Hauptfeststellung on 2022-01-01 apply until the next
Hauptfeststellung (2029). A reference implementation is in `grundsteuer2025.py`. The rent table of Anlage 39
BewG is in `grundsteuer-nettokaltmieten-2022.csv`. To print example calculations, run
`python3 research/grundsteuer2025.py`.

Currently the calculator uses a flat 300 € per household (see `steuerrechner-parameter-2026.md`). The data
here makes an estimate possible from the answers of the questionnaire: Bundesland, Wohnfläche and,
optionally, Baujahr and Gemeinde.


## Basic Formula

    Grundsteuer = Grundsteuermessbetrag × Hebesatz
    Grundsteuermessbetrag = Grundsteuerwert (or Äquivalenzbetrag) × Steuermesszahl

- The Finanzamt determines the Grundsteuerwert (or, in the area models, the Äquivalenzbetrag) and the
  Grundsteuermessbetrag.
- The Gemeinde sets the Hebesatz (§ 25 GrStG) and collects the tax.
- A landlord can pass the Grundsteuer to tenants as Betriebskosten (§ 2 Nr. 1 BetrKV). So tenants also pay
  it, as part of the Nebenkosten.

There are three groups of states:

| Model                                  | States                                                           |
| -------------------------------------- | ---------------------------------------------------------------- |
| Bundesmodell (Ertragswertverfahren)    | Brandenburg, Mecklenburg-Vorpommern, Nordrhein-Westfalen,        |
|                                        | Rheinland-Pfalz, Sachsen-Anhalt, Schleswig-Holstein, Thüringen   |
| Bundesmodell, own Steuermesszahlen     | Berlin, Bremen, Saarland, Sachsen                                |
| Own model (Länderöffnungsklausel)      | Baden-Württemberg, Bayern, Hamburg, Hessen, Niedersachsen        |


## Bundesmodell

For Ein- and Zweifamilienhäuser, Mietwohngrundstücke and Wohnungseigentum, the Finanzamt uses the
Ertragswertverfahren (§§ 252 to 257 BewG):

    Grundsteuerwert = Reinertrag × Vervielfältiger + Bodenwert × Abzinsungsfaktor
    Reinertrag      = Rohertrag × (1 − Bewirtschaftungskosten)
    Rohertrag       = Nettokaltmiete (Anlage 39) × (1 + Mietniveau-Zuschlag) × Wohnfläche × 12
    Bodenwert       = Grundstücksfläche (or share of the plot for Wohnungseigentum) × Bodenrichtwert

| Step                         | Rule                                                                            | Source         |
| ---------------------------- | ------------------------------------------------------------------------------- | -------------- |
| Nettokaltmiete               | €/m² per month by Land, Gebäudeart, Wohnfläche (<60, 60–100, ≥100 m²) and       | Anlage 39 I    |
|                              | Baujahr (≤1948, 1949–78, 1979–90, 1991–2000, ≥2001). Wohnungseigentum uses the  |                |
|                              | values for Mietwohngrundstück. Garage: 35 € per month.                          |                |
| Mietniveaustufe              | 1: −20 %, 2: −10 %, 3: 0 %, 4: +10 %, 5: +20 %, 6: +30 %, 7: +40 %. Gemeinden   | Anlage 39 II   |
|                              | that are not in the ordinance to § 254 BewG are in Stufe 3.                     |                |
| Gesamtnutzungsdauer          | 80 years for all residential types                                              | Anlage 38      |
| Restnutzungsdauer (RND)      | 80 − (2022 − Baujahr), at least 30 % of 80 = 24 years                           | § 253 (2) BewG |
| Bewirtschaftungskosten       | % of Rohertrag, by RND ≥60 / 40–59 / 20–39 / <20 years:                         | Anlage 40      |
|                              | EFH/ZFH 18/21/25/27, Wohnungseigentum 23/25/29/31, Mietwohngrundstück 21/23/27/29 |              |
| Liegenschaftszins            | EFH/ZFH 2.5 %, Wohnungseigentum 3.0 %, Mietwohngrundstück 4.0 % (≤6 Wohnungen)  | § 256 BewG     |
|                              | or 4.5 % (>6). EFH/ZFH: −0.1 pp per full 100 € Bodenrichtwert above 500 €/m²,   |                |
|                              | 1.5 % from 1,500 €/m². WE: −0.1 pp per full 100 € above 2,000 €/m², 2.0 % from  |                |
|                              | 3,000 €/m².                                                                     |                |
| Vervielfältiger              | Barwertfaktor (1 − q⁻ⁿ) / (q − 1), q = 1 + Zins, n = RND, 2 decimals            | Anlage 37      |
| Abzinsungsfaktor             | q⁻ⁿ, 4 decimals                                                                 | Anlage 41      |
| Land of EFH/ZFH              | Umrechnungskoeffizienten by plot size (not in the reference implementation)     | Anlage 36      |
| Mindestwert                  | at least 75 % of the Bodenwert                                                  | § 251 BewG     |
| Rounding                     | Grundsteuerwert down to full 100 €                                              | § 230 BewG     |

The Bodenrichtwerte come from the Gutachterausschüsse. They are public in BORIS-D
(https://www.bodenrichtwerte-boris.de/).


### Steuermesszahlen

| State                | Wohngrundstücke | Nichtwohngrundstücke | Unbebaut | Source                     |
| -------------------- | --------------- | -------------------- | -------- | -------------------------- |
| Bund (default)       | 0.31 ‰          | 0.34 ‰               | 0.34 ‰   | § 15 (1) GrStG             |
| Berlin               | 0.31 ‰          | 0.45 ‰               | 0.45 ‰   | Bln GrStMG [3]             |
| Bremen               | 0.31 ‰          | 0.75 ‰               | 0.75 ‰   | Brem. GrStMG [4]           |
| Saarland             | 0.34 ‰          | 0.64 ‰               | 0.64 ‰   | GrStG-Saar [2]             |
| Sachsen              | 0.36 ‰          | 0.72 ‰               | 0.36 ‰   | SächsGrStMG [2]            |

Reductions of the Steuermesszahl for Wohngrundstücke (§ 15 (2) to (5) GrStG): −25 % for social housing with
a Förderzusage, for municipal or gemeinnützige Wohnungsbaugesellschaften and for exempt
Wohnungsgenossenschaften. −10 % for Baudenkmäler.


## Area Models (Bayern, Hamburg, Hessen, Niedersachsen)

These models do not use the value of the property. The base is the area:

    Äquivalenzbetrag = Grundfläche × 0.04 €/m² + Gebäudefläche × 0.50 €/m²
    Messbetrag       = Σ Äquivalenzbetrag × Grundsteuermesszahl  (× Lagefaktor in HE and NI)

| State          | Grund und Boden | Wohnfläche  | Nutzfläche (not residential) | Location component                     |
| -------------- | --------------- | ----------- | ---------------------------- | -------------------------------------- |
| Bayern         | 100 %           | 70 %        | 100 %                        | none                                   |
| Hamburg        | 100 %           | 70 %        | 100 %                        | Wohnfläche −25 % in normale Wohnlage   |
| Hessen         | 100 %           | 70 %        | 100 %                        | Faktor = (BRW / Ø-BRW Gemeinde) ^ 0.3  |
| Niedersachsen  | 100 %           | 70 %        | 100 %                        | Lagefaktor = (BRW / Ø-BRW Gemeinde) ^ 0.3 |

Notes:

- **Bayern** (BayGrStG Art. 1 to 4, verified in the law text): areas are rounded down to full m². Garages up
  to 50 m² and Nebengebäude up to 30 m² are free. If the buildings serve at least 90 % for Wohnen, the land
  above ten times the Wohnfläche counts only at 50 %. Reductions of 25 % for social housing, Baudenkmäler and
  housing on farms. A plot with less than 30 m² of building area counts as unbebaut.
- **Hamburg** (HmbGrStG §§ 1 to 4): the same structure and the same Äquivalenzzahlen as in Bayern. A
  directory of the Senat assigns each address to a normale or gute Wohnlage. Without an entry, a normale
  Wohnlage applies. Effective Messzahl for Wohnfläche in normale Wohnlage: 70 % × 75 % = 52.5 %.
- **Hessen** (HGrStG §§ 5 to 7) and **Niedersachsen** (NGrStG): BRW is the Bodenrichtwert of the zone of the
  property. Ø-BRW is the average Bodenrichtwert of the Gemeinde, which the Finanzverwaltung publishes. If the
  BRW is twice the average, the factor is 2 ^ 0.3 ≈ 1.23. Reductions of 25 % for social housing and
  Kulturdenkmäler.


## Baden-Württemberg (Bodenwertmodell)

    Grundsteuerwert = Grundstücksfläche × Bodenrichtwert
    Messbetrag      = Grundsteuerwert × 1.30 ‰, reduced by 30 % (to 0.91 ‰) for Grundstücke überwiegend zu
                      Wohnzwecken

The building does not count. Source: LGrStG BW (§ 40). For flats, the tax is thus low, because the share of
the plot is small. For houses with a large plot in an expensive zone, the tax is high.


## Hebesätze

The Hebesätze from 2025 are not comparable between states, because the Messbeträge are different. Destatis
states that a federal average Hebesatz for the Grundsteuer B is "nicht mehr möglich" [5]. Most Gemeinden
set a Hebesatz that keeps the revenue the same as in 2024 (aufkommensneutral). The states published
recommended aufkommensneutrale Hebesätze in Transparenzregister.

| City       | State | Hebesatz 2024 | Hebesatz 2025 | Note                                        | Source |
| ---------- | ----- | ------------- | ------------- | ------------------------------------------- | ------ |
| Berlin     | BE    | 810 %         | 470 %         |                                             | [3]    |
| Hamburg    | HH    | 540 %         | 975 %         | secondary sources only                      | [9]    |
| München    | BY    | 535 %         | 824 %         | Satzung                                     | [6]    |
| Köln       | NW    | 515 %         | 475 %         | 550 % from 2026                             | [7]    |
| Frankfurt  | HE    | 500 %         | 854.69 %      | equal to the recommendation of the state    | [8]    |
| Stuttgart  | BW    | 520 %         | 160 %         |                                             | [10]   |
| Bremen     | HB    | 695 %         | 755 %         | Bremerhaven: about 898 %                    | [4]    |
| Dortmund   | NW    | –             | 625 % / 1,245 % | Wohn / Nichtwohn (differenziert)          | [11]   |

**Differenzierte Hebesätze.** Some states allow a Gemeinde to set a higher Hebesatz for Nichtwohngrundstücke
than for Wohngrundstücke: Nordrhein-Westfalen (NWGrStHsG) and Rheinland-Pfalz. The VG Düsseldorf held the
differentiated Hebesätze of Krefeld (506 % / 995 %) to be unlawful in 2026 (not final). Some cities, for
example Duisburg, thus went back to one Hebesatz in 2026. Since 2025, a Gemeinde can also set a separate
Grundsteuer C on baureife unbebaute Grundstücke (§ 25 (5) GrStG).


## Revenue and Average Burden

- Revenue 2025 (Destatis [5]): Grundsteuer B 15.8 billion euro (+0.7 %), Grundsteuer A 0.3 billion euro
  (−19.6 %), Grundsteuer C 5.8 million euro. Total 16.1 billion euro, same as 2024. Average Hebesatz of the
  Grundsteuer A: 377 %.
- The Betriebskostenspiegel of the Deutscher Mieterbund (data year 2024) gives 2.67 €/m² per month for all
  Betriebskosten. The last separate value for the Grundsteuer that we found is 0.19 €/m² per month (data
  year 2011, Berlin 0.25 €/m²) [12]. The current Betriebskostenspiegel is a PDF on mieterbund.de and was not
  checked in detail.


## Example Calculations

Output of `grundsteuer2025.py`: the same flat in each state. Wohnungseigentum with 70 m², Baujahr 1965 and a
25 m² share of the plot. Mietniveaustufe, Bodenrichtwert and some Hebesätze are assumptions for a typical
city in the state, not official values.

| State                | Assumptions (Stufe, BRW €/m², Hebesatz)  | Messbetrag | Grundsteuer/year | €/m² per month |
| -------------------- | ---------------------------------------- | ---------- | ---------------- | -------------- |
| Berlin               | 4, 1,500, 470 %                          | 27.15      | 127.60           | 0.15           |
| Bremen               | 3, 600, 755 %                            | 22.25      | 167.98           | 0.20           |
| Nordrhein-Westfalen  | 4, 1,000, 475 % (Köln 2025)              | 25.48      | 121.03           | 0.14           |
| Sachsen              | 3, 400, 650 % (assumed)                  | 23.61      | 153.46           | 0.18           |
| Saarland             | 2, 200, 500 % (assumed)                  | 21.62      | 108.10           | 0.13           |
| Bayern               | 824 % (München)                          | 25.50      | 210.12           | 0.25           |
| Hamburg              | normale Wohnlage, 975 %                  | 19.37      | 188.85           | 0.22           |
| Hessen               | Faktor 1.0, 854.69 % (Frankfurt)         | 25.50      | 217.94           | 0.26           |
| Niedersachsen        | Lagefaktor 1.0, 600 % (assumed)          | 25.50      | 153.00           | 0.18           |
| Baden-Württemberg    | BRW 1,500, 160 % (Stuttgart)             | 34.12      | 54.59            | 0.07           |

Result: for a flat in a city, the Grundsteuer is about 0.13 to 0.26 €/m² Wohnfläche per month, or about 1.5
to 3 €/m² per year. This agrees with the Betriebskostenspiegel. For a household with 70 m², this is about
110 to 220 € per year. Houses with a large plot pay more, especially in Baden-Württemberg.


## Proposal for the Calculator

A simple estimate that uses only the answers of the questionnaire:

    Grundsteuer per year ≈ Wohnfläche × rate per m² and year (by Bundesland)

The rate per state can come from the example calculations above, with a default of about 2.4 €/m² per year
(0.20 €/m² per month). A more exact calculation needs the Gemeinde (Hebesatz, Mietniveaustufe) and the
Baujahr. That is not in the questionnaire at this time.


## Sources

1. Federal law (Bundesmodell): BewG §§ 243 to 262 and Anlagen 36 to 41, GrStG §§ 13, 15 and 25.
   https://www.gesetze-im-internet.de/bewg/ and https://www.gesetze-im-internet.de/grstg_1973/
   Anlage 39: https://www.gesetze-im-internet.de/bewg/anlage_39.html
2. Overview of the state models: https://www.deubner-steuern.de/themen/grundsteuerreform/laender.html and
   https://www.haufe.de/steuern/steuerwissen-tipps/ueberblick-ueber-landesrechtliche-regelungen-zur-grundsteuerreform_170_562768.html
3. Berlin: https://www.berlin.de/grundsteuer/ and
   https://www.berlin.de/sen/finanzen/presse/pressemitteilungen/pressemitteilung.1419266.php
4. Bremen, Drucksache 21/1135 of the Bremische Bürgerschaft:
   https://www.bremische-buergerschaft.de/dokumente/wp21/land/drucksache/D21L1135.pdf
5. Destatis press release 2026-10 on Gewerbesteuer and Grundsteuer 2025:
   https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_369_712.html
6. München, Satzung Grundsteuerhebesatz 2025:
   https://lhm.muenchen.swm.de/dam/jcr:f9b9b77b-42f9-4789-92cf-e47e93636daf/Satzung_Grundsteuerhebesatz_2025.pdf
7. Köln, Grundsteuerhebesatzsatzung 2025 and 2026:
   https://www.stadt-koeln.de/mediaasset/content/bekanntmachungen/2024/2024.12.18_0289-01_grundsteuerhebesatzung_2025.pdf
   and https://www.stadt-koeln.de/mediaasset/content/satzungen/grundsteuerhebesatzsatzung_20251217.pdf
8. IHK Frankfurt, Realsteuerhebesätze 2025 and 2026:
   https://www.frankfurt-main.ihk.de/recht/uebersicht-alle-rechtsthemen/steuerrecht/gewerbe-und-grundsteuer/realsteuerhebesaetze-5195618
9. Hamburg Hebesatz (secondary): https://grundsteuer-ratgeber.de/ratgeber/hebesaetze-2025-uebersicht.html
10. Stuttgart, press release 2024-11:
    https://www.stuttgart.de/service/aktuelle-meldungen/2024/november/grundsteuer-gemeinderat-beschliesst-neue-hebesaetze-auf-160-prozent-zu-senken
11. Dortmund, differentiated Hebesätze:
    https://www.dortmund.de/newsroom/nachrichten-dortmund.de/wohnen-soll-bezahlbar-bleiben-dortmund-beschliesst-unterschiedliche-grundsteuer-hebesaetze.html
12. Deutscher Mieterbund, Betriebskostenspiegel: https://www.mieterbund.de/betriebskostenspiegel/ and
    the 2011 values: https://www.baulinks.de/webplugin/2013/1626.php4
13. Bayern, BayGrStG: https://www.gesetze-bayern.de/Content/Document/BayGrStG/true
14. Hessen, Faktor and Messzahlen: https://www.ihk.de/wiesbaden/recht/rechtsberatung/steuern/durchschnittliche-bodenrichtwerte-5820362
15. Niedersachsen, Flächen-Lage-Modell:
    https://www.mf.niedersachsen.de/download/167261/Schematische_Darstellung_des_Flaechen-Lage-Modells.pdf


## Open Points

- The Hamburg Hebesätze 2024 and 2025 come from secondary sources and are not verified in a Satzung.
- The ordinance with the Mietniveaustufen of all Gemeinden (§ 254 BewG) is not yet extracted.
- Hamburg: § 3 (2) and § 4 HmbGrStG come from a secondary source; the official text was not available.
- The current Betriebskostenspiegel value for the Grundsteuer alone (data year 2024) is not checked.
- Hebesätze for 2026 changed in some cities (Köln 550 %). A table of all Gemeinden is not in this file.
