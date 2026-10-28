# Occupational Groups in Germany by Source of Funding

Status: research notes, collected 2026-10-28.

This file answers the question: which occupational groups in Germany are financed by the state, and which
by the private market? Each group gets one of three labels:

- **eindeutig öffentlich** (public): the employer is the state or a public body (Bund, Länder, Kommunen,
  Sozialversicherung). Salaries come from taxes or compulsory contributions.
- **semi-öffentlich** (semi-public): the employer is private, but the revenue comes mainly from public
  budgets, from compulsory contributions (health and care insurance), or from demand that only exists because
  of a legal obligation (for example tax law). Examples: Steuerberater, Steuerfachangestellte, employees of
  defence companies.
- **eindeutig privat** (private): the revenue comes mainly from voluntary purchases by households and firms.

There is no official statistic for this split. Destatis and the Bundesagentur für Arbeit (BA) count
employees by occupation (KldB 2010) or by economic sector (WZ 2008), but not by source of funding. The labels
below are my own assessment. Many occupations exist in all three areas (for example Büro, IT, Reinigung).
For those, the label shows the dominant area and the note names the exceptions.


## Size of the Public Sector

Öffentlicher Dienst on 30 June 2025 (preliminary): about **5.5 million** persons, about 12 % of all
Erwerbstätige. On 30 June 2024, the total was 5.38 million: 1.96 million Beamte, Richter and Soldaten
(36.4 %) and 3.42 million Arbeitnehmer (63.6 %).

| Area (Aufgabenbereich)                                   | Persons | Scope       | Date    |
| -------------------------------------------------------- | ------: | ----------- | ------- |
| Allgemeinbildende und berufliche Schulen                 | 1,069,600 | all       | 2025    |
| - of which Beamte                                        |   712,700 | Beamte    | 2025    |
| Hochschulen incl. Hochschulkliniken                      |   651,300 | all       | 2025    |
| Kommunale Kindertageseinrichtungen                       |   298,000 | all       | 2025    |
| Öffentliche Sicherheit und Ordnung (Polizei, Feuerwehr)  |   373,000 | Beamte    | 2024    |
| Verteidigung (Berufs- und Zeitsoldaten, Beamte)          |   195,000 | Beamte    | 2024    |
| Finanzverwaltung (Finanzämter, Zoll)                     |   167,000 | Beamte    | 2024    |
| Politische Führung und zentrale Verwaltung               |   167,000 | Beamte    | 2024    |
| Rechtsschutz (Gerichte, Staatsanwaltschaften, Vollzug)   |   126,000 | Beamte    | 2024    |

"Beamte" means that only Beamte, Richter and Soldaten are counted. Arbeitnehmer in the same area are not
included in these rows, so the values are lower bounds. 70.1 % of all Beamte work for the Länder, 19.0 % for
the Bund and 9.7 % for the Kommunen (2024).


## Employees by Economic Sector

Sozialversicherungspflichtig Beschäftigte at the place of work on 31 December 2025, by WZ 2008 section. Total:
34,985,555. Beamte and self-employed persons are not included.

| WZ  | Sector                                                       |  Employees | Label            |
| --- | ------------------------------------------------------------ | ---------: | ---------------- |
| C   | Verarbeitendes Gewerbe                                       |  6,535,390 | privat (1)       |
| Q   | Gesundheits- und Sozialwesen                                 |  5,660,303 | semi-öffentlich  |
| G   | Handel; Instandhaltung und Reparatur von Kfz                 |  4,551,143 | privat           |
| M   | Freiberufliche, wissenschaftliche, technische Dienstleistungen |  2,600,839 | privat (2)     |
| O   | Öffentliche Verwaltung, Verteidigung; Sozialversicherung     |  2,157,089 | öffentlich       |
| N   | Sonstige wirtschaftliche Dienstleistungen                    |  2,149,248 | privat           |
| H   | Verkehr und Lagerei                                          |  2,007,838 | privat (3)       |
| F   | Baugewerbe                                                   |  1,950,038 | privat (4)       |
| P   | Erziehung und Unterricht                                     |  1,492,633 | öffentlich (5)   |
| J   | Information und Kommunikation                                |  1,336,425 | privat           |
| I   | Gastgewerbe                                                  |  1,087,819 | privat           |
| K   | Finanz- und Versicherungsdienstleistungen                    |  1,020,739 | privat           |
| S   | Sonstige Dienstleistungen                                    |    870,317 | mixed (6)        |
| L   | Grundstücks- und Wohnungswesen                               |    319,962 | privat           |
| R   | Kunst, Unterhaltung und Erholung                             |    313,589 | mixed (7)        |
| D   | Energieversorgung                                            |    303,156 | mixed (8)        |
| E   | Wasserversorgung, Entsorgung                                 |    287,492 | semi-öffentlich  |
| A   | Land- und Forstwirtschaft, Fischerei                         |    227,717 | privat (9)       |
| B   | Bergbau, Gewinnung von Steinen und Erden                     |     55,131 | privat           |
| T   | Private Haushalte                                            |     41,679 | privat           |
| U   | Exterritoriale Organisationen                                |     15,359 | öffentlich       |

Notes on the labels:

1. Contains the defence industry (semi-öffentlich). I did not find a reliable employee count for it.
2. Contains Steuerberatung, Wirtschaftsprüfung and parts of Rechtsberatung (semi-öffentlich), and public
   research institutes.
3. Contains Deutsche Bahn and public transport (ÖPNV), which are owned or subsidised by the state.
4. Tiefbau (roads, bridges, rail) depends mainly on public contracts.
5. Verbeamtete Lehrkräfte are not in this count, because Beamte are not sozialversicherungspflichtig.
   Private schools are mostly financed by the Länder.
6. Contains churches and Interessenvertretungen; churches receive Kirchensteuer, which the state collects.
7. Contains public theatres, museums and libraries.
8. Many Stadtwerke are owned by Kommunen.
9. Agriculture receives a large share of its income from EU and national subsidies.


## Occupational Groups with Labels

KldB 2010 Berufsgruppen (three-digit codes). The counts are from the sources above where available. For most
Berufsgruppen I could not retrieve a current count (see Open Points). The groups are sorted by label.

### Eindeutig öffentlich

| KldB | Berufsgruppe                                                  | Count / indicator                 | Note |
| ---- | ------------------------------------------------------------- | --------------------------------- | ---- |
| 841  | Lehrtätigkeit an allgemeinbildenden Schulen                   | schools total 1,069,600 (2025)    | private schools: semi-öffentlich |
| 842  | Lehrtätigkeit für berufsbildende Fächer                       | included in the schools total     | |
| 843  | Lehr- und Forschungstätigkeit an Hochschulen                  | Hochschulen 651,300 (2025)        | incl. Hochschulkliniken |
| 532  | Polizeivollzugs-, Kriminaldienst, Gerichts-, Justizvollzug    | 373,000 + 126,000 Beamte (2024)   | |
| 011  | Offiziere                                                     | Verteidigung 195,000 (2024)       | |
| 012  | Unteroffiziere mit Portepee                                   | included in Verteidigung          | |
| 013  | Unteroffiziere ohne Portepee                                  | included in Verteidigung          | |
| 014  | Angehörige der regulären Streitkräfte in sonstigen Rängen     | included in Verteidigung          | |
| 732  | Verwaltung (öffentliche Verwaltung)                           | WZ O 2,157,089 (2025)             | |
| 731  | Rechtsberatung, -sprechung und -ordnung                       | Richter, Staatsanwälte            | Rechtsanwälte: privat |
| 723  | Steuerberatung (in the Finanzverwaltung)                      | Finanzverwaltung 167,000 (2024)   | Finanzbeamte |
| 712  | Angehörige gesetzgebender Körperschaften                      |                                   | Abgeordnete |
| 831  | Erziehung, Sozialarbeit (kommunale Träger)                    | kommunale Kitas 298,000 (2025)    | freie Träger: semi-öffentlich |
| 531  | Brandschutz (Berufsfeuerwehr)                                 | included in Öffentliche Sicherheit | Objekt- und Personenschutz: privat |

### Semi-öffentlich

| KldB | Berufsgruppe                                                   | Count / indicator               | Note |
| ---- | -------------------------------------------------------------- | ------------------------------- | ---- |
| 813  | Gesundheit, Krankenpflege, Rettungsdienst, Geburtshilfe        | Gesundheitswesen ~6.2 M (2024)  | financed by GKV, PKV, Pflegeversicherung |
| 821  | Altenpflege                                                    | Pflegehilfskräfte 485,000 (2024) | Pflegeversicherung, Sozialhilfe |
| 814  | Human- und Zahnmedizin                                         | included in Gesundheitswesen    | mainly GKV |
| 811  | Arzt- und Praxishilfe                                          | included in Gesundheitswesen    | mainly GKV |
| 817  | Nicht ärztliche Therapie und Heilkunde (Physio, Ergo)          | included in Gesundheitswesen    | mainly GKV |
| 818  | Pharmazie (Apotheke)                                           | included in Gesundheitswesen    | mainly GKV |
| 825  | Medizin-, Orthopädie- und Rehatechnik                          | included in Gesundheitswesen    | mainly GKV |
| 831  | Erziehung, Sozialarbeit, Heilerziehungspflege (freie Träger)   | Gesundheits- und Sozialwesen    | Kitas, Jugendhilfe, Eingliederungshilfe |
| 723  | Steuerberatung (private Kanzleien)                             |                                 | demand from tax law |
| 722  | Rechnungswesen, Controlling und Revision (Wirtschaftsprüfung)  |                                 | mixed; audits are a legal obligation |
| 322  | Tiefbau                                                        |                                 | mainly public contracts |
| 343  | Ver- und Entsorgung                                            | WZ E 287,492 (2025)             | mostly kommunale Betriebe |
| 522  | Fahrzeugführung im Eisenbahnverkehr                            |                                 | Deutsche Bahn, state-owned |
| 521  | Fahrzeugführung im Straßenverkehr (ÖPNV only)                  |                                 | truck drivers: privat |
| —    | Employees of defence companies (all occupations)               |                                 | label by employer, not occupation |
| —    | Employees of churches and church welfare (Caritas, Diakonie)   |                                 | Kirchensteuer, Sozialversicherung |
| —    | Employees of public broadcasters (ARD, ZDF, Deutschlandradio)  |                                 | Rundfunkbeitrag |

### Eindeutig privat

| KldB | Berufsgruppe                                                    | Count / indicator                | Note |
| ---- | --------------------------------------------------------------- | -------------------------------- | ---- |
| 251  | Maschinenbau- und Betriebstechnik                               | Produktion/Fertigung 6.85 M (2025) | |
| 252  | Fahrzeug-, Luft-, Raumfahrt- und Schiffbautechnik               | included above                   | defence: semi-öffentlich |
| 242  | Metallbearbeitung                                               | included above                   | |
| 244  | Metallbau und Schweißtechnik                                    | included above                   | |
| 263  | Elektrotechnik                                                  | included above                   | |
| 292  | Lebensmittel- und Genussmittelherstellung                       | included above                   | |
| 321  | Hochbau                                                         | Bau 2.07 M (2025)                | public buildings: semi-öffentlich |
| 342  | Klempnerei, Sanitär, Heizung, Klimatechnik                      | included in Bau                  | |
| 513  | Lagerwirtschaft, Post und Zustellung, Güterumschlag             | Verkehr/Logistik 4.61 M (2025)   | |
| 521  | Fahrzeugführung im Straßenverkehr (Güterverkehr, Taxi)          | included above                   | ÖPNV: semi-öffentlich |
| 621  | Verkauf (ohne Produktspezialisierung)                           | Handel/Verkauf 4.00 M (2025)     | |
| 623  | Verkauf von Lebensmitteln                                       | included above                   | |
| 611  | Einkauf und Vertrieb                                            |                                  | |
| 633  | Gastronomie                                                     | WZ I 1,087,819 (2025)            | |
| 293  | Speisenzubereitung (Köche)                                      | included in WZ I                 | |
| 713  | Unternehmensorganisation und -strategie                         | Unternehmensorg. 7.19 M (2025)   | the 7.19 M include public administration |
| 714  | Büro und Sekretariat                                            | included above                   | mixed; dominant privat |
| 711  | Geschäftsführung und Vorstand                                   | included above                   | |
| 721  | Versicherungs- und Finanzdienstleistungen                       | WZ K 1,020,739 (2025)            | |
| 431  | Informatik                                                      | IT/Naturwiss. 1.65 M (2025)      | |
| 434  | Softwareentwicklung und Programmierung                          | included above                   | |
| 541  | Reinigung                                                       |                                  | mixed; also in public buildings |
| 531  | Objekt-, Personen-, Brandschutz, Arbeitssicherheit (Wachdienst) |                                  | Berufsfeuerwehr: öffentlich |
| 823  | Körperpflege (Friseur, Kosmetik)                                |                                  | |
| 921  | Werbung und Marketing                                           |                                  | |
| 111  | Landwirtschaft                                                  | WZ A 227,717 (2025)              | high share of subsidies |

The column "Count / indicator" shows the count of the Berufsbereich (KldB one-digit) or of the WZ section
that contains the group. It is not the count of the group itself.


## Employees by Berufsbereich (KldB 2010, one-digit)

Sozialversicherungspflichtig Beschäftigte on 31 December 2025, total 34,985,555.

| KldB | Berufsbereich                                                        |  Employees | Dominant label   |
| ---- | -------------------------------------------------------------------- | ---------: | ---------------- |
| 7    | Unternehmensorganisation, Buchhaltung, Recht und Verwaltung          |  7,188,212 | mixed            |
| 8    | Gesundheit, Soziales, Lehre und Erziehung                            |  7,005,718 | semi-öffentlich  |
| 2    | Rohstoffgewinnung, Produktion und Fertigung                          |  6,850,263 | privat           |
| 5    | Verkehr, Logistik, Schutz und Sicherheit                             |  4,605,112 | privat           |
| 6    | Kaufmännische Dienstleistungen, Handel, Vertrieb, Hotel und Tourismus |  3,998,833 | privat          |
| 3    | Bau, Architektur, Vermessung und Gebäudetechnik                      |  2,070,479 | privat           |
| 4    | Naturwissenschaft, Geografie und Informatik                          |  1,646,625 | privat           |
| 9    | Sprach-, Literatur-, Geistes-, Gesellschafts- und Wirtschaftswiss., Medien, Kunst, Kultur, Gestaltung |    956,673 | mixed |
| 1    | Land-, Forst- und Tierwirtschaft und Gartenbau                       |    491,652 | privat           |
| 0    | Militär, sonstige / keine Angabe                                     |    171,988 | öffentlich (1)   |

1. Soldaten are not sozialversicherungspflichtig. This row contains mainly "keine Angabe" and is not a count of
   the armed forces.


## Open Points

- **Counts per Berufsgruppe.** The BA publishes counts per three-digit KldB group (Statistik der BA,
  Beschäftigung nach Berufen). Automated download was blocked (HTTP 429) on 2026-10-28. The Destatis table
  12211-0009 (Mikrozensus, Erwerbstätige nach Stellung im Beruf und Berufen) also contains Beamte and
  Selbstständige, but the GENESIS API returns data only for registered users (free account).
- **Kitas by Träger.** The share of Kita staff at freie Träger for 2025 is in the Fachkräftebarometer Frühe
  Bildung 2025 (section on Träger). I did not extract it.
- **Defence industry.** No reliable count of employees found.
- **Overlap.** Kommunale Krankenhäuser and Hochschulkliniken are in the öffentlicher Dienst and in the
  Gesundheitswesen. The counts of the groups must not be added.


## Sources

- Destatis (2026-06-22): Öffentlicher Dienst 2025: Mehr Beschäftigte in der Bildung und Kinderbetreuung,
  https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/06/PD26_215_741.html
- Destatis (2026-05-04): 54,6 % aller Beamtinnen und Beamten sind an Schulen und im Bereich "Öffentliche
  Sicherheit und Ordnung" im Einsatz,
  https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/05/PD26_N027_741.html
- Destatis: Themenseite Öffentlicher Dienst,
  https://www.destatis.de/DE/Themen/Staat/Oeffentlicher-Dienst/_inhalt.html
- Destatis: Sozialversicherungspflichtig Beschäftigte am Arbeitsort nach Wirtschaftsabschnitten (31.12.2025),
  https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/wirtschaftsabschnitte.html
- Destatis: Sozialversicherungspflichtig Beschäftigte nach der ausgeübten Tätigkeit (31.12.2025),
  https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/berufsbereiche.html
- Deutsches Ärzteblatt: Im Gesundheitswesen arbeiten wieder mehr Menschen (Gesundheitspersonal 2024),
  https://www.aerzteblatt.de/themen/pflegepersonal/im-gesundheitswesen-arbeiten-wieder-mehr-menschen-ed167af9-5f29-4e63-95b1-8ae644402c25
- Fachkräftebarometer Frühe Bildung 2025,
  https://www.pedocs.de/volltexte/2026/34825/pdf/Fachkraeftebarometer_Fruehe_Bildung_2025.pdf
- BA: Klassifikation der Berufe 2010, überarbeitete Fassung 2020,
  https://statistik.arbeitsagentur.de/DE/Navigation/Grundlagen/Klassifikationen/Klassifikation-der-Berufe/KldB2010-Fassung2020/Systematik-Verzeichnisse/Systematik-Verzeichnisse-Nav.html
