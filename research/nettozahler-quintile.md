# Net Contributors and Net Recipients in Germany by Quintile

Status: research notes, collected 2026-10-27.

This file answers the question: how many people in Germany pay more to the state than they receive
(Nettozahler), and how many receive more than they pay (Nettoempfänger)? The answer uses income quintiles.

There is no official statistic for this question. Destatis does not publish a net balance per person. The
only detailed source that I found is a microsimulation study by the Institut der deutschen Wirtschaft (IW
Köln): Beznoska (2020). It uses SOEP 2017 data, extrapolated to the legal and income state of 2019. I did not
find a newer study with the same scope (search date 2026-10-27).


## Definitions in the IW Study

- **Unit.** Private households, sorted by equivalised gross household income (new OECD scale) into ten
  deciles of equal household count. The study does not give results per person.
- **Payments to the state.** Income tax, Solidaritätszuschlag, employee social security contributions, and
  indirect taxes (VAT, energy, tobacco, alcohol, Grundsteuer and others).
- **Payments from the state.** Monetary transfers: statutory pensions, Beamten-Pensionen, ALG I, ALG II and
  Grundsicherung, Kindergeld, Elterngeld, BAföG, Wohngeld and other social transfers.
- **Not included.** Employer social security contributions, corporate taxes (Gewerbesteuer,
  Körperschaftsteuer), and in-kind benefits (Sachleistungen) such as schools, universities, health care,
  child care and infrastructure.


## Result by Quintile

Net balance = taxes and contributions paid minus monetary transfers received. A positive value means net
contributor. Values are euro per household per year, reference year 2019. I calculated the quintile values
as the mean of two adjacent deciles from IW table A-4. This is correct because all deciles have the same
household count.

| Quintile | Deciles | Paid to state | Received | Net balance | Status (average)     | Households |
| -------- | ------- | ------------: | -------: | ----------: | -------------------- | ---------: |
| Q1       | D1, D2  |         5,109 |   10,542 |      -5,432 | net recipient        |     8.3 M  |
| Q2       | D3, D4  |         9,465 |   15,172 |      -5,706 | net recipient        |     8.3 M  |
| Q3       | D5, D6  |        14,892 |   13,700 |      +1,191 | mixed, break-even    |     8.3 M  |
| Q4       | D7, D8  |        22,831 |    9,965 |     +12,866 | net contributor      |     8.3 M  |
| Q5       | D9, D10 |        43,182 |    8,425 |     +34,756 | net contributor      |     8.3 M  |

Household counts: 41.5 million private households in 2019 (Mikrozensus), divided by five.

The balance changes sign at the 47th percentile of households. Thus, in Q3 (percentiles 40 to 60) about
2.9 million households are below the break-even point on average, and about 5.4 million are above it.

Decile detail (IW table A-4, euro per household per year, 2019):

| Decile | D1     | D2     | D3     | D4     | D5   | D6     | D7     | D8      | D9      | D10     |
| ------ | -----: | -----: | -----: | -----: | ---: | -----: | -----: | ------: | ------: | ------: |
| Net    | -4,420 | -6,446 | -6,247 | -5,166 | -478 | +2,860 | +9,796 | +15,936 | +21,889 | +47,624 |

The top 1 percent of households pays net about 118,000 euro per year. D2 and D3 receive the most, because
many pensioner households are in these deciles.


## Number of Households and People

A decile average does not tell how many single households are net contributors. There are two views:

| View                                                         | Net recipients     | Net contributors   |
| ------------------------------------------------------------ | ------------------ | ------------------ |
| Average per percentile (break-even at 47th percentile)       | 47 % = 19.5 M HH   | 53 % = 22.0 M HH   |
| Per single household, incl. social insurance and pensions    | 43 % = 17.8 M HH   | 57 % = 23.7 M HH   |
| Per single household, only taxes vs. non-pension transfers   | 16 % = 6.6 M HH    | 84 % = 34.9 M HH   |

The 43 % and 16 % shares come from Beznoska, cited in a dpa fact check (2020). The household counts are my
calculation with 41.5 million households.

**People.** The study does not give person counts. A rough conversion with the mean household size of 2.0
persons (82.8 million persons in private households in 2019) gives:

- About 36 to 39 million people live in net recipient households.
- About 44 to 47 million people live in net contributor households.

This conversion is not exact. Household size is not the same in each decile: pensioner and single households
in the lower deciles are small, but single parents and large families also are frequent there. Children
are counted with the household, not as separate recipients.


## Caveats

1. **Pensions.** Statutory pensions count as transfers, but the recipients financed them with their own
   contributions. Over the full life cycle, many pensioner households are not net recipients. If pensions
   and contributions are both removed, only 16 % of households are net recipients.
2. **In-kind benefits are missing.** Education, health care and infrastructure are not in the balance. If
   they are added, the number of net recipients increases, mainly for families with children. The study
   author states this, but gives no number.
3. **Top incomes are underestimated.** The SOEP does not capture very high incomes well, and the study does
   not integrate the income tax statistic. The net payments of Q5 are thus a lower bound.
4. **Employer contributions are excluded.** If the incidence of employer contributions falls on employees,
   the net payments of Q3 to Q5 increase.
5. **Age of data.** SOEP 2017 and EVS 2013, extrapolated to 2019. Pension increases, the Bürgergeld reform
   (2023) and the larger Kindergeld since 2023 can shift the break-even point. I found no update.
6. **Claims with low quality.** Social media claims such as "17 % of the population keep the country
   running" or "27 million net tax payers" have no study as a source. dpa rated them as incorrect.


## Sources

- Beznoska, M. (2020): Die Verteilung von Steuern, Sozialabgaben und Transfereinkommen der privaten
  Haushalte, IW-Report 6/2020 (tables 3-5 and A-4):
  https://www.iwkoeln.de/fileadmin/user_upload/Studien/Report/PDF/2020/IW-Report_2020_Online-Tool_Steuern_Transfers.pdf
- IW summary page (English):
  https://www.iwkoeln.de/en/studies/iw-reports/beitrag/martin-beznoska-the-distribution-of-taxes-social-contributions-and-transfer-income-of-private-households.html
- iwd article on the study, "Die Reichen zahlen, die Armen bekommen":
  https://www.iwd.de/artikel/die-reichen-zahlen-die-armen-bekommen-459948/
- dpa fact check 2020 (16 % and 43 % shares of net recipient households):
  https://dpa-factchecking.com/germany/201013-99-925307/
- dpa fact check 2025 ("17 % keep the country running"):
  https://dpa-factchecking.com/germany/250619-99-208623/
- bpb, Bevölkerung und Haushalte (Mikrozensus 2019: 41.5 million households, 82.8 million persons):
  https://www.bpb.de/kurz-knapp/zahlen-und-fakten/soziale-situation-in-deutschland/61584/bevoelkerung-und-haushalte
- Background on the tax burden by decile: Bach, Beznoska, Steiner (2016), DIW Wochenbericht 51/2016:
  https://www.diw.de/documents/publikationen/73/diw_01.c.549401.de/16-51-1.pdf
