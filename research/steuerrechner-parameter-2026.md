# Parameters of the Tax Calculator for 2026

Status: research notes, collected 2026-10-27.

This file lists the legal values that `public/steuern.js` uses, with the sources. All values apply to the
calendar year 2026, unless the note says otherwise. The section [Other Years](#other-years) lists the values
that differ in 2024, 2025 and 2027.


## Income Tax and Surcharges

| Parameter                                    | Value                                     | Source |
| -------------------------------------------- | ----------------------------------------- | ------ |
| Grundfreibetrag                              | 12,348 €                                  | [1]    |
| Zone 2, up to 17,799 €                       | (914.51·y + 1,400)·y                      | [1]    |
| Zone 3, up to 69,878 €                       | (173.10·z + 2,397)·z + 1,034.87           | [1]    |
| Zone 4, up to 277,825 €                      | 0.42·x − 11,135.63                        | [1]    |
| Zone 5                                       | 0.45·x − 19,470.38                        | [1]    |
| Solidaritätszuschlag Freigrenze              | 20,350 € single, 40,700 € joint           | [2]    |
| Solidaritätszuschlag rate, Milderungszone    | 5.5 %, at most 11.9 % of the excess       | [3]    |
| Kinderfreibetrag + BEA, both parents         | 6,828 € + 2,928 € = 9,756 € per child     | [4]    |
| Kindergeld                                   | 259 € per month and child                 | [5]    |
| Arbeitnehmer-Pauschbetrag                    | 1,230 €                                   | [6]    |
| Sparerpauschbetrag                           | 1,000 € single, 2,000 € joint             | §20 (9) EStG |


## Social Insurance

| Parameter                       | Value                                                                   | Source |
| ------------------------------- | ----------------------------------------------------------------------- | ------ |
| Beitragsbemessungsgrenze RV/AV  | 101,400 € per year                                                      | [7]    |
| Beitragsbemessungsgrenze KV/PV  | 69,750 € per year                                                       | [7]    |
| Rentenversicherung              | 18.6 %                                                                  | [8]    |
| Arbeitslosenversicherung        | 2.6 %                                                                   | [8]    |
| Krankenversicherung             | 14.6 % + average Zusatzbeitrag 2.9 %                                    | [8]    |
| Pflegeversicherung              | 3.6 %; +0.6 pp without children; −0.25 pp per child from child 2 to 5   | [9]    |


## Consumption Taxes

| Tax                          | Value                                                                       | Source |
| ---------------------------- | --------------------------------------------------------------------------- | ------ |
| Umsatzsteuer                 | 19 %, reduced 7 %; restaurant food 7 % since 2026-01-01, drinks 19 %        | [10]   |
| Tabaksteuer, cigarettes      | 12.28 ct per piece + 19.84 % of retail price, min. 25.106 ct less VAT       | [11]   |
| Tabaksteuer, Feinschnitt     | 61.58 €/kg + 17.40 %, min. 128.83 €/kg less VAT                             | [11]   |
| Biersteuer                   | 0.787 €/hl per °Plato                                                       | [12]   |
| Schaumweinsteuer             | 136 €/hl (1.02 € per 0.75 l)                                                | [13]   |
| Alkoholsteuer                | 1,303 €/hl pure alcohol                                                     | [14]   |
| Kaffeesteuer                 | 2.19 €/kg roasted coffee                                                    | [15]   |
| Energiesteuer                | Benzin 65.45 ct/l, Diesel 47.04 ct/l, Heizöl 6.135 ct/l, Erdgas 0.55 ct/kWh | [16]   |
| Stromsteuer, households      | 2.05 ct/kWh (the 2026 reduction applies only to industry)                   | [17]   |
| Luftverkehrsteuer from 07-01 | 13.03 € / 33.01 € / 59.43 € per departure                                   | [18]   |
| Versicherungsteuer           | 19 % of the premium                                                         | §6 VersStG |
| Lotteriesteuer               | 20 % of the price without tax (16.7 % of the stake)                         | [19]   |


## Other Levies

- **CO₂ price (BEHG).** Price corridor 55 to 65 €/t in 2026. The calculator uses 60 €/t as the default.
  Emission factors: Benzin 2.37 kg/l, Diesel 2.65 kg/l, Heizöl 2.676 kg/l, Erdgas 0.182 kg/kWh (Hs). Source:
  §10 BEHG and [20]. The auction result is not verified.
- **Rundfunkbeitrag.** 18.36 € per month and household. Source: [21].
- **Grundsteuer.** Revenue of Grundsteuer B in 2025 was 15.8 billion euro, about 380 € per household
  including business property. The calculator uses 300 € per household as the default. Source: [22].


## Other Years

Status: collected 2026-10-27. The calculator supports the years 2024 to 2027. Values that are not in this
table are the same as in 2026.

| Parameter                         | 2024                         | 2025                    | 2027 (draft)                  |
| --------------------------------- | ---------------------------- | ----------------------- | ----------------------------- |
| Grundfreibetrag                   | 11,784 €                     | 12,096 €                | 12,564 €                      |
| Zone 2: end, coefficient          | 17,005 €, 954.80             | 17,443 €, 932.30        | 17,799 €, 952.24              |
| Zone 3: end, coefficient, const.  | 66,760 €, 181.19, 991.21     | 68,480 €, 176.64, 1,015.13 | 70,600 €, 170.74, 993.86   |
| Zone 4 (42 %)                     | 0.42·x − 10,636.31           | 0.42·x − 10,911.92      | 0.42·x − 11,241.73, to 249,999 € |
| Zone 5 (45 %)                     | 0.45·x − 18,971.06           | 0.45·x − 19,246.67      | 0.45·x − 18,741.70, to 279,999 € |
| Zone 6 (47 %)                     | –                            | –                       | 0.47·x − 24,341.68            |
| Kinderfreibetrag + BEA            | 9,540 €                      | 9,600 €                 | 10,056 €                      |
| Kindergeld per month              | 250 €                        | 255 €                   | 267 €                         |
| Arbeitnehmer-Pauschbetrag         | 1,230 €                      | 1,230 €                 | 1,430 €                       |
| Soli Freigrenze (single)          | 18,130 €                     | 19,950 €                | 20,350 € (assumption)         |
| BBG RV/AV                         | 90,600 € (West)              | 96,600 €                | 106,200 €                     |
| BBG KV/PV                         | 62,100 €                     | 66,150 €                | 76,500 €                      |
| Average KV Zusatzbeitrag          | 1.7 %                        | 2.5 %                   | 2.9 % (estimate)              |
| Pflegeversicherung                | 3.4 %                        | 3.6 %                   | 3.6 % (assumption)            |
| USt on restaurant food            | 19 %                         | 19 %                    | 7 %                           |
| Cigarettes: ct/piece, %, min. ct  | 11.15, 19.84 %, 22.888       | 11.71, 19.84 %, 24.163  | 14.34, 21.05 %, 29.492        |
| Feinschnitt: €/kg, %, min. €/kg   | 54.39, 17.00 %, 111.78       | 57.85, 17.20 %, 121.51  | 75.80, 17.97 %, 151.34 (est.) |
| CO₂ price (default)               | 45 €/t fixed                 | 55 €/t fixed            | 60 €/t, corridor 55 to 65     |
| Luftverkehrsteuer                 | 15.53 / 39.34 / 70.83 €      | 15.53 / 39.34 / 70.83 € | 13.03 / 33.01 / 59.43 €       |

Notes:

- 2024: The Grundfreibetrag and the Kinderfreibetrag were raised retroactively by the
  Steuerfortentwicklungsgesetz in December 2024. The table uses these final values. The BBG RV uses the West
  value; East was 89,400 €. The Luftverkehrsteuer rose on 2024-05-01 (before: 12.73 / 32.25 / 58.06 €); the
  calculator uses the higher rate.
- 2027: Most values are drafts, status 2026-10-27. The tariff and the child values come from the government
  draft of the Einkommensteuerreformgesetz 2027 (BT-Drucksache 21/8235) [23, 24, 25]. The tariff is
  continuous at all zone limits; this was checked in `test/steuern.test.js`. The BBG values come from the
  Sozialversicherungsrechengrößen-Verordnung 2027, cabinet decision of 2026-10-07; the Bundesrat must still
  agree [26]. The Bundesrat approved the Tabaksteuer increase on 2026-10-16 [27]. The CO₂ corridor 55 to 65
  €/t for 2027 is in the draft of the third BEHG amendment [28]. The Schätzerkreis estimate for the average
  Zusatzbeitrag 2027 is 2.9 % [29].
- 2027 open values: No source gives the Soli Freigrenze 2027; the calculator keeps 20,350 €. No source gives
  the Mindeststeuer for Feinschnitt 2027; the calculator raises the 2026 value by the same factor as the
  Mindeststeuer for cigarettes (29.492 / 25.106). The Pflegeversicherung rate stays at 3.6 %.
- Tabaksteuer 2022 to 2026: [11] lists all steps of §2 TabStG.


## Sources

1. https://www.gesetze-im-internet.de/estg/__32a.html
2. https://www.gesetze-im-internet.de/solzg_1995/__3.html
3. https://www.gesetze-im-internet.de/solzg_1995/__4.html
4. https://www.gesetze-im-internet.de/estg/__32.html
5. https://www.finanz.de/news/kindergeld-freibetrag-2026-10451/
6. https://www.gesetze-im-internet.de/estg/__9a.html
7. https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Presse/Meldungen/2025/250910-sv-rechengroessen-vo-2026.html
8. https://www.dehoga-nrw.de/fileadmin/NRW/Download/Rechengroessen_Sozialversicherung_2026.pdf
9. https://sozialversicherung-kompetent.de/pflegeversicherung/versicherungsrecht/1636-beitragssatz-pflegeversicherung-2026.html
10. https://www.dihk.de/de/newsroom/ermaessigter-mehrwertsteuersatz-fuer-gastronomie-161492
11. https://lxgesetze.de/tabstg/2 (step from 2026-01-01 to 2027-02-14; the text amended on 2026-10-21 shows
    the rates from 2027)
12. https://www.steuertipps.de/lexikon/b/biersteuer
13. https://www.gesetze-im-internet.de/schaumwzwstg_2009/__2.html
14. https://www.gesetze-im-internet.de/alkstg/__2.html
15. https://www.gesetze-im-internet.de/kaffeestg_2009/__2.html
16. https://www.gesetze-im-internet.de/energiestg/__2.html
17. https://www.bundesregierung.de/breg-de/aktuelles/senkung-energiepreise-haushalt-2358526
18. https://www.bundesfinanzministerium.de/Content/DE/Pressemitteilungen/Finanzpolitik/2026/04/2026-04-01-senkung-der-luftverkehrsteuer.html
19. https://www.finanzen.bremen.de/sixcms/media.php/13/Merkblatt%2BBesteuerung%2Bvon%2BLotterien%2Bund%2BAusspielungen%2B2022%2BElster.pdf
20. https://ema-energiewelt.de/wissen/co2-preis-2026-versteigerung-eex-heizkosten
21. https://finanztip.de/rundfunkbeitrag/
22. https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_369_712.html
23. https://www.bundesregierung.de/breg-de/aktuelles/einkommensteuerreform-2027-2451192
24. https://www.deutschland-rechner.de/einkommensteuer-rechner (tariff formulas of the draft 2027)
25. https://www.finanz.de/steuern/steuerreform-2027/
26. https://www.bmas.de/DE/Service/Presse/Pressemitteilungen/2026/bundeskabinett-beschliesst-sozialversicherungsrechengroessen-2027.html
27. https://www.netz-trends.de/tabaksteuer-bundesrat-billigt-erhoehung-2027-2030-14-34-cent-zigarette-16-oktober-2026/
28. https://www.advant-beiten.com/aktuelles/behg-novelle-co2-preis-bleibt-2027-im-korridor-von-55-bis-65-euro
29. https://www.apotheken-umschau.de/gesundheitspolitik/zusatzbeitrag-2027-bleibt-bei-2-9-prozent-doch-kassen-warnen-1605019.html
