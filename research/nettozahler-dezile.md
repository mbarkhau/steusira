# Net Contributors and Net Recipients in Germany by Decile

Status: research notes, collected 2026-10-27.

This file answers the question: how many people in Germany pay more to the state than they receive
(Nettozahler), and how many receive more than they pay (Nettoempfänger)? The answer uses income deciles.

There is no official statistic for this question. Destatis does not publish a net balance per person. The
only detailed source that I found is a microsimulation study by the Institut der deutschen Wirtschaft (IW
Köln): Beznoska (2020). It uses SOEP 2017 data, extrapolated to the legal and income state of 2019. I did not
find a newer study with the same scope (search date 2026-10-27).


## Definitions in the IW Study

- **Ranking.** Households are sorted by equivalised gross household income (new OECD scale) and divided into
  ten deciles. Each decile holds 10 % of persons, not 10 % of households (see note 1). The euro values are
  per household.
- **Payments to the state.** Income tax, Solidaritätszuschlag, employee social security contributions, and
  indirect taxes (VAT, energy, tobacco, alcohol, Grundsteuer and others).
- **Payments from the state.** Monetary transfers: statutory pensions, Beamten-Pensionen, ALG I, ALG II and
  Grundsicherung, Kindergeld, Elterngeld, BAföG, Wohngeld and other social transfers.
- **Not included.** Employer social security contributions, corporate taxes (Gewerbesteuer,
  Körperschaftsteuer), and in-kind benefits (Sachleistungen) such as schools, universities, health care,
  child care and infrastructure.


## Result by Decile

Net balance = taxes and contributions paid minus monetary transfers received. A positive value means net
contributor. Euro values are per household per year, reference year 2019 (IW table A-4). The percent values
are the net balance as a share of gross household income (IW table 3-5).

| Decile  | Upper limit | Paid to state | Received | Net balance | Net, % of gross | Persons | Households |
| ------- | ----------: | ------------: | -------: | ----------: | --------------: | ------: | ---------: |
| D1      |       1,314 |         4,047 |    8,467 |      -4,420 |           -34.7 |   8.3 M |      4.4 M |
| D2      |       1,712 |         6,171 |   12,616 |      -6,446 |           -31.5 |   8.3 M |      4.7 M |
| D3      |       2,072 |         8,368 |   14,615 |      -6,247 |           -23.0 |   8.3 M |      4.5 M |
| D4      |       2,407 |        10,562 |   15,728 |      -5,166 |           -15.7 |   8.3 M |      4.4 M |
| D5      |       2,790 |        13,375 |   13,853 |        -478 |            -1.2 |   8.3 M |      4.2 M |
| D6      |       3,246 |        16,408 |   13,548 |      +2,860 |            +6.0 |   8.3 M |      4.0 M |
| D7      |       3,774 |        20,710 |   10,914 |      +9,796 |           +17.1 |   8.3 M |      3.8 M |
| D8      |       4,514 |        24,952 |    9,016 |     +15,936 |           +23.9 |   8.3 M |      3.8 M |
| D9      |       5,836 |        31,680 |    9,791 |     +21,889 |           +26.6 |   8.3 M |      3.8 M |
| D10     |           . |        54,683 |    7,059 |     +47,624 |           +34.1 |   8.3 M |      4.0 M |
| Top 1 % |           . |       121,467 |    3,279 |    +118,188 |           +38.0 |         |            |
| All     |             |        18,398 |   11,660 |      +6,738 |           +13.2 |  82.8 M |     41.5 M |

- **Upper limit.** Monthly equivalised gross household income in euro (IW table 3-2).
- **Persons.** 82.8 million persons in private households in 2019 (Mikrozensus), divided by ten.
- **Households.** 41.5 million private households in 2019 (Mikrozensus), multiplied by the household share
  of each decile. I derived these shares (note 1). They are not published in the study.

On average, D1 to D4 are clear net recipients and D6 to D10 are net contributors. D5 is almost at
break-even. D2 and D3 receive the most, because many pensioner households are in these deciles. The balance
changes sign at the 47th percentile.


## Number of People and Households

A decile average does not tell how many single households are net contributors. There are two views:

| View                                                       | Net recipients             | Net contributors           |
| ---------------------------------------------------------- | -------------------------- | -------------------------- |
| Decile average, break-even at the 47th percentile          | 38.9 M persons, ~20.9 M HH | 43.9 M persons, ~20.6 M HH |
| Per single household, incl. social insurance and pensions  | 43 % of HH = 17.8 M HH     | 57 % of HH = 23.7 M HH     |
| Per single household, only taxes vs. non-pension transfers | 16 % of HH = 6.6 M HH      | 84 % of HH = 34.9 M HH     |

- **First row.** 47 % of 82.8 million persons. For the households, I added D1 to D4 and 70 % of D5.
- **Second and third row.** The 43 % and 16 % shares come from Beznoska, cited in a dpa fact check (2020).
  The study gives no person count for these shares. The household counts are my calculation with 41.5
  million households.

Children count as members of their household, not as separate recipients.


## Notes

1. **Deciles hold equal person counts.** The study text says only "zehn gleichgroße Klassen". Two
   independent checks show that the deciles do not hold equal household counts:
   - The "Insgesamt" row of table A-4 (net +6,738 euro per household) is not the simple mean of the ten
     decile rows (+7,535 euro).
   - Table 3-2 gives the share of each decile in total payments and in total transfers. Share divided by
     euro per household gives the household share of each decile. Both columns give the same household
     shares: from 11.3 % in D2 down to 9.1 % in D7.

   With these household shares, the weighted means agree with the "Insgesamt" row (paid 18,398, received
   11,660, net 6,738). The lower deciles hold more and smaller households, for example single pensioners.
   This agrees with deciles of equal person count, which is the usual method for SOEP distribution analysis.
2. **Pensions.** Statutory pensions count as transfers, but the recipients financed them with their own
   contributions. Over the full life cycle, many pensioner households are not net recipients. If pensions
   and contributions are both removed, only 16 % of households are net recipients.
3. **In-kind benefits are missing.** Education, health care and infrastructure are not in the balance. If
   they are added, the number of net recipients increases, mainly for families with children. The study
   author states this, but gives no number.
4. **Top incomes are underestimated.** The SOEP does not capture very high incomes well, and the study does
   not integrate the income tax statistic. The net payments of D10 are thus a lower bound.
5. **Employer contributions are excluded.** If the incidence of employer contributions falls on employees,
   the net payments of the upper deciles increase.
6. **Age of data.** SOEP 2017 and EVS 2013, extrapolated to 2019. Pension increases, the Bürgergeld reform
   (2023) and the larger Kindergeld since 2023 can shift the break-even point. I found no update.
7. **Claims with low quality.** Social media claims such as "17 % of the population keep the country
   running" or "27 million net tax payers" have no study as a source. dpa rated them as incorrect.


## Sources

- Beznoska, M. (2020): Die Verteilung von Steuern, Sozialabgaben und Transfereinkommen der privaten
  Haushalte, IW-Report 6/2020 (tables 3-2, 3-5 and A-4):
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
