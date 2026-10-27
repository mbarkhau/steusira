# Parameters of the Tax Calculator for 2026

Status: research notes, collected 2026-10-27.

This file lists the legal values that `public/steuern.js` uses, with the sources. All values apply to the
calendar year 2026, unless the note says otherwise.


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
