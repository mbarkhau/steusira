# Federal Expenditure in Germany by Purpose

Status: research notes, collected 2026-10-27.

This file describes the open data of the federal budget (Bundeshaushalt) from the Bundesministerium der
Finanzen (BMF) and summarizes the expenditure by purpose. The figures are only for the Bund. They do not
include the Länder, the Gemeinden or the social insurance funds (Sozialversicherung). Amounts are in billion
euro (Mrd. Euro), rounded to one decimal.


## Data Files

The BMF publishes the data on [bundeshaushalt.de](https://www.bundeshaushalt.de/DE/Download-Portal/download-portal.html).
The files in `bundeshaushalt/` are unchanged copies, downloaded on 2026-10-27.

| File                                 | Content                                         | Unit          |
| ------------------------------------ | ----------------------------------------------- | ------------- |
| `bundeshaushalt/HH_2026_ALL.csv`     | Bundeshaushaltsplan 2026, Soll, all Titel       | thousand euro |
| `bundeshaushalt/HH_2025_ALL.csv`     | Bundeshaushaltsplan 2025, Soll, all Titel       | thousand euro |
| `bundeshaushalt/rechnung_2025.xml`   | Haushaltsrechnung 2025, Soll and Ist per Titel  | euro          |
| `bundeshaushalt/HR2025.xlsx`         | Haushaltsrechnung 2025, Ist per Titel (no Fkt.) | euro          |

Each row is one Titel (budget line). Important columns:

- `einzelplan`: the ministry or institution (for example 11 = Arbeit und Soziales, 14 = Verteidigung).
- `kapitel`: a subdivision of the Einzelplan. Kapitel numbers that end in 90 to 99 are Anlagen: special funds
  (Sondervermögen) and the EU own resources. They are not part of the core budget (Kernhaushalt).
- `funktion`: the code of the Funktionenplan. It shows the purpose of the expenditure, independent of the
  ministry. The first digit is the Hauptfunktion.
- `einahmen-ausgaben`: `E` for revenue, `A` for expenditure.

The download portal gets its file list from `https://www.bundeshaushalt.de/internalapi/dataportal?year=YYYY`.
Older years are also available there.

To regenerate the tables below, run:

```bash
python3 -I research/bundeshaushalt_summary.py research/bundeshaushalt/HH_2026_ALL.csv
python3 -I research/bundeshaushalt_summary.py research/bundeshaushalt/rechnung_2025.xml
```


## Kernhaushalt by Purpose (Hauptfunktion)

| #  | Hauptfunktion                                                 | Soll 2026 | Ist 2025 |
| -- | ------------------------------------------------------------- | --------: | -------: |
| 2  | Soziale Sicherung, Familie, Jugend, Arbeitsmarkt              |     245.1 |    234.1 |
| 0  | Allgemeine Dienste (Verwaltung, Verteidigung, Sicherheit, AA) |     153.1 |    123.2 |
| 8  | Finanzwirtschaft (u. a. Zinsen der Bundesschuld)              |      38.0 |     42.0 |
| 1  | Bildung, Wissenschaft, Forschung, Kultur                      |      30.2 |     30.3 |
| 6  | Energie, Wasser, Gewerbe, Dienstleistungen                    |      25.3 |     24.3 |
| 7  | Verkehrs- und Nachrichtenwesen                                |      21.4 |     30.9 |
| 3  | Gesundheit, Umwelt, Sport und Erholung                        |       5.1 |      4.9 |
| 4  | Wohnungswesen, Städtebau, Raumordnung                         |       4.6 |      4.5 |
| 5  | Ernährung, Landwirtschaft, Forsten                            |       1.7 |      1.3 |
|    | **Summe Kernhaushalt**                                        | **524.5** |**495.5** |

The Soll 2026 total agrees with the published volume of the Bundeshaushalt 2026 (524.5 Mrd. Euro). The Soll
2025 total from `HH_2025_ALL.csv` is 502.5 Mrd. Euro.


## Kernhaushalt 2026 by Einzelplan (Soll)

| Epl. | Einzelplan                                                     | Mrd. Euro | Anteil |
| ---- | -------------------------------------------------------------- | --------: | -----: |
| 11   | Arbeit und Soziales                                            |     197.3 |  37.6% |
| 14   | Verteidigung                                                   |      82.7 |  15.8% |
| 60   | Allgemeine Finanzverwaltung                                    |      47.4 |   9.0% |
| 32   | Bundesschuld                                                   |      33.6 |   6.4% |
| 12   | Verkehr                                                        |      27.9 |   5.3% |
| 30   | Forschung, Technologie und Raumfahrt                           |      21.8 |   4.2% |
| 15   | Gesundheit                                                     |      21.8 |   4.2% |
| 17   | Bildung, Familie, Senioren, Frauen und Jugend                  |      16.7 |   3.2% |
| 06   | Inneres                                                        |      15.8 |   3.0% |
|      | Other Einzelpläne                                              |      59.5 |  11.3% |
|      | **Summe Kernhaushalt**                                         | **524.5** |        |


## Anlagen 2026 (Soll)

These amounts are outside the Kernhaushalt. A part of them comes from transfers (Zuweisungen) of the
Kernhaushalt, so it is not correct to simply add them to the Kernhaushalt.

| Kap. | Anlage                                                  | Mrd. Euro |
| ---- | ------------------------------------------------------- | --------: |
| 6093 | Sondervermögen Infrastruktur und Klimaneutralität (SVIK) |      58.1 |
| 6090 | Erhebung der Eigenmittel der EU                         |      43.6 |
| 6092 | Klima- und Transformationsfonds (KTF)                   |      34.8 |
| 1491 | Sondervermögen Bundeswehr                               |      25.5 |
| 1090 | Mittelzuweisungen und Marktordnungsausgaben der EU      |       4.4 |
| 6098 | Sondervermögen Aufbauhilfe 2021                         |       2.5 |
|      | Other Anlagen                                           |       0.8 |


## Notes

1. The Funktionenplan assigns each Titel to one purpose. Zuweisungen to the social insurance funds (for
   example the Zuschüsse and Beitragszahlungen of the Bund to the allgemeine Rentenversicherung, Kapitel
   1102, Titel 63681, 63683 and 63684, 117.2 Mrd. Euro in 2026) are in Hauptfunktion 2.
2. Hauptfunktion 0 includes the Verteidigung of the Kernhaushalt, but not the Sondervermögen Bundeswehr.
3. Hauptfunktion 8 includes the interest on the federal debt (Zinsen, 30.2 Mrd. Euro Soll 2026) and the
   Erstattungen to the Bundeseisenbahnvermögen (about 10 Mrd. Euro).
4. The XML Haushaltsrechnung has no text for the Kapitel of the Anlagen. The script then uses "Kapitel NNNN".


## Sources

- Download-Portal Bundeshaushalt, BMF:
  https://www.bundeshaushalt.de/DE/Download-Portal/download-portal.html
- Bundeshaushaltsplan 2026, CSV: https://www.bundeshaushalt.de/static/daten/2026/soll/HH_2026_ALL.csv
- Bundeshaushaltsplan 2025, CSV: https://www.bundeshaushalt.de/static/daten/2025/soll/HH_2025_ALL.csv
- Haushaltsrechnung 2025, XML: https://www.bundeshaushalt.de/static/daten/2025/ist/rechnung_2025.xml
- Haushaltsrechnung 2025, XLSX: https://www.bundeshaushalt.de/static/daten/2025/ist/HR2025.xlsx
