# Grunderwerbsteuer 2026: Rates, Rules and Revenue

Status: research notes, collected 2026-10-28.

The Grunderwerbsteuer (real estate transfer tax) applies once, when a person buys a property in Germany.
The revenue goes to the Länder. Since 2006, each Land sets its own rate (Art. 105 (2a) GG). The federal
default rate of 3.5 % (§ 11 (1) GrEStG) applies only in Bayern. See also `grundsteuer-2025.md` for the yearly
Grundsteuer.


## Formula

    Grunderwerbsteuer = Bemessungsgrundlage × Steuersatz of the Land, rounded down to full euro

- Bemessungsgrundlage is the Gegenleistung, normally the purchase price (§§ 8, 9 GrEStG). It also includes
  other payments that the buyer makes to the seller, for example liabilities that the buyer takes over.
- Movable items (for example a fitted kitchen or furniture) are not part of the Grundstück. If the contract
  states a separate price for them, this part is not taxed.
- Notary fees, Grundbuch fees and the commission of the estate agent are not part of the Bemessungsgrundlage.
- The buyer and the seller are both Steuerschuldner (§ 13 GrEStG). In practice, the contract makes the
  buyer pay.
- Rounding: down to full euro (§ 11 (2) GrEStG).


## Rates by Land (2026)

| Land                   | Rate   | Since      | Previous rate | Change in 2026 |
| ---------------------- | ------ | ---------- | ------------- | -------------- |
| Bayern                 | 3.5 %  | 1997-01-01 | 2.0 %         | none           |
| Baden-Württemberg      | 5.0 %  | 2011-11-05 | 3.5 %         | none           |
| Niedersachsen          | 5.0 %  | 2014       | 4.5 %         | none           |
| Rheinland-Pfalz        | 5.0 %  | 2012-03-01 | 3.5 %         | none           |
| Sachsen-Anhalt         | 5.0 %  | 2012       | 4.5 %         | none           |
| Thüringen              | 5.0 %  | 2024-01-01 | 6.5 %         | none           |
| Bremen                 | 5.5 %  | 2025-07-01 | 5.0 %         | none           |
| Hamburg                | 5.5 %  | 2023-01-01 | 4.5 %         | none           |
| Sachsen                | 5.5 %  | 2023-01-01 | 3.5 %         | none           |
| Berlin                 | 6.0 %  | 2014-01-01 | 5.0 %         | none           |
| Hessen                 | 6.0 %  | 2014-08-01 | 5.0 %         | none           |
| Mecklenburg-Vorpommern | 6.0 %  | 2019-07-01 | 5.0 %         | none           |
| Brandenburg            | 6.5 %  | 2015-07-01 | 5.0 %         | none           |
| Nordrhein-Westfalen    | 6.5 %  | 2015-01-01 | 5.0 %         | none           |
| Saarland               | 6.5 %  | 2015-01-01 | 5.5 %         | none           |
| Schleswig-Holstein     | 6.5 %  | 2014-01-01 | 5.0 %         | none           |

Source: [3], a secondary source. Several sources agree on the rates and on the recent changes (Thüringen
2024, Bremen 2025). Some older tables still show 5.0 % for Bremen or 6.5 % for Thüringen. Those values are
out of date.

For a calculator that supports 2024 to 2027: Bremen has 5.0 % until 2025-06-30 and 5.5 % from 2025-07-01.
All other rates are the same from 2024 to 2026. As of 2026-10, no change for 2027 is decided.


## Exemptions (§ 3 GrEStG)

Verified in the law text [1]. The most relevant exemptions for private households:

| No. | Exemption                                                                                       |
| --- | ----------------------------------------------------------------------------------------------- |
| 1   | Bemessungsgrundlage of not more than 2,500 € (Freigrenze, not a Freibetrag)                     |
| 2   | Erwerb von Todes wegen and Schenkung (these fall under the Erbschaft- und Schenkungsteuer)      |
| 3   | Division of an estate among Miterben                                                            |
| 4   | Erwerb by the spouse or Lebenspartner of the seller                                             |
| 5   | Erwerb by the former spouse or Lebenspartner after a divorce, as part of the division of assets |
| 6   | Erwerb by relatives in a straight line (children, grandchildren, parents), also stepchildren    |
|     | and the spouses of these persons. Siblings are not exempt.                                      |

There is no general Freibetrag for first-time buyers. The federal coalition and several associations
discuss a Freibetrag for selbstgenutztes Wohneigentum (proposals of 250,000 to 400,000 €). As of 2026-10,
no law exists [6].


## Support in Hessen: Hessengeld

Hessen pays a grant to first-time buyers of a selbstgenutzte home: 10,000 € per buyer (at most 20,000 €) and
5,000 € per child under 18 in the household. The grant is at most the Grunderwerbsteuer that was paid. It
applies to purchase contracts from 2024-03-01. Hessen pays it in ten yearly parts. Applications are
possible until 2029-12-31, via the WIBank. Source: [5], secondary sources.

Effect: for a family with two buyers and two children, the grant is up to 30,000 €. This is the full
Grunderwerbsteuer (6.0 %) on a price of up to 500,000 €.


## Share Deals

When a buyer acquires shares of a company that owns property, the Grunderwerbsteuer applies only if at least
90 % of the shares change within ten years (§ 1 (2a) to (3a) GrEStG, verified in the law text). The
threshold was 95 % until 2021-06-30. Thus large investors can avoid the tax, but private buyers cannot.

The Neuntes Steuerberatungsänderungsgesetz (promulgated 2026-07-02, effective 2026-07-03) changes the share
deal rules: the signing is now the taxable event, the company that owns the property is also Steuerschuldner,
and the notification deadline is one month for all cases. The rates and the 90 % threshold did not change
[7].


## Revenue

| Year | Revenue (billion euro) | Source                                      |
| ---- | ---------------------- | ------------------------------------------- |
| 2021 | 18.3                   | Bundestag, hib 90/2025 [4] (maximum)        |
| 2024 | 12.7                   | Bundestag, hib 90/2025 [4]                  |
| 2025 | 15.1                   | BMF, see `steuereinnahmen-deutschland.md`   |

In 2025, the revenue increased by 18 %. The main reason is a higher number of transactions, not higher
prices. In Nordrhein-Westfalen, the revenue increased by 53 % [8].


## Example Calculations

| Purchase                           | Land    | Price     | Rate  | Grunderwerbsteuer |
| ---------------------------------- | ------- | --------- | ----- | ----------------- |
| Flat, 70 m²                        | Bayern  | 350,000 € | 3.5 % | 12,250 €          |
| Flat, 70 m²                        | Berlin  | 350,000 € | 6.0 % | 21,000 €          |
| House, with 15,000 € fitted kitchen | NRW     | 450,000 € | 6.5 % | 28,275 € (on 435,000 €) |
| Flat bought by a child from parent | any     | 300,000 € | –     | 0 € (§ 3 Nr. 6)   |

Per year of ownership: with a typical period of ownership of 20 years, the Grunderwerbsteuer of 21,000 € is
about 1,050 € per year. In the high-rate Länder, this is more than the yearly Grundsteuer on the same flat.


## Use in the Calculator

Since version 2026.10008, the calculator adds an anteilige Grunderwerbsteuer for all households, also for
tenants: Wohnfläche × (Grunderwerbsteuer revenue of the Land in 2025 / inhabited Wohnfläche of the Land).
Average: 4.03 €/m² per year, from 1.60 €/m² in Thüringen to 7.69 €/m² in Hamburg. See the section
"Kennwert per m² Wohnfläche" in `grundsteuer-2025.md` for the data and the table of all Länder.

A more exact calculation for owners distributes the tax over the years of ownership:

    Grunderwerbsteuer per year = Kaufpreis × rate of the Land / years of ownership

The questionnaire does not ask about property at this time. Questions for a later extension: Wohneigentum
(yes / no), year of purchase, purchase price.


## Sources

1. GrEStG §§ 1, 3, 8, 9, 11 and 13: https://www.gesetze-im-internet.de/grestg_1983/
2. Art. 105 (2a) GG: https://www.gesetze-im-internet.de/gg/art_105.html
3. Rates by Land, as of 2026-06: https://rechenbar.de/ratgeber/grunderwerbsteuer-2026-bundeslaender/ and
   https://baukostenplan.de/ratgeber/grunderwerbsteuer-2026-bundeslaender-steuersaetze-tipps
4. Bundestag, hib 90/2025 (revenue 2021 and 2024): https://www.bundestag.de/presse/hib/kurzmeldungen-1050734
5. Hessengeld: https://www.fertighaus.de/ratgeber/news/hessengeld and
   https://baufivergleich.de/hessengeld-beantragen-eigenheimfoerderung-hessen/
6. Discussion of a Freibetrag for first-time buyers:
   https://vdiv.de/news-details/ersterwerb-selbstgenutzter-wohnimmobilien-bald-grunderwerbssteuerfrei and
   https://rechner-hub.de/news/grunderwerbsteuer-reform-share-deal-2026/
7. Share deal reform 2026:
   https://www.morganlewis.com/de/pubs/2026/07/major-changes-to-real-estate-transfer-tax-for-share-deals-finally-enacted
8. Revenue 2025 by Land:
   https://www.immowelt.de/ratgeber/news/die-hauskaeufer-kommen-zurueck-bayern-kann-aber-nicht-mithalten


## Open Points

- The rates table comes from secondary sources. The laws of the Länder were not checked one by one.
- Hessengeld: the official page of the Hessian Ministry of Finance or the WIBank was not checked.
- Share deal reform: the BGBl reference is not checked.
- Revenue by Land for 2025 is not in this file.
