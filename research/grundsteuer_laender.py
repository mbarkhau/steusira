#!/usr/bin/env python3
"""Grundsteuer B and Grunderwerbsteuer per m² Wohnfläche and year, by Land.

Kennwert = tax revenue of the Land / inhabited Wohnfläche of the Land. This is an artificial value: it assigns
all revenue to the residents in proportion to their Wohnfläche, also the revenue from commercial property.
See grundsteuer-2025.md and grunderwerbsteuer-2026.md.

Run without arguments to print the table and the values for public/steuern.js.
"""

LAENDER = ["NW", "BY", "BW", "NI", "HE", "SN", "RP", "ST", "SH", "TH", "BB", "MV", "SL", "BE", "HH", "HB"]

# BMF, Umsatzsteuerverteilung und Finanzkraftausgleich 2025, vorläufige Abrechnung, in 1,000 €.
# Grunderwerbsteuer: row 8.3, "nachrichtlich: Aufkommen" (the actual revenue, not the Steuerkraftzahl).
GREST_2025 = [3592702, 1904625, 2161960, 1274168, 1399680, 495516, 633218, 210760,
              728680, 145166, 512396, 227197, 172866, 990911, 530772, 116423]
# Grundsteuer B: row 14, "Grundbetrag Grundsteuer B (2024)" = Σ revenue / Hebesatz of the Gemeinden.
GRUNDBETRAG_B_2024 = [684327, 481161, 468204, 339749, 256226, 104211, 149609, 58195,
                      118898, 55210, 68918, 44261, 34733, 107456, 92626, 30872]
GRUNDSTEUER_B_2025 = 15850000  # same source, Aufkommen Grundsteuer B in total

# Hebesatz Grundsteuer B 2022, average of the Gemeinden weighted by population
# (Statistische Ämter, "Hebesätze der Realsteuern 2022"). Bremen: Stadt Bremen 695 %, Bremerhaven 645 %.
HEBESATZ_B_2022 = {
    "SH": 415.1, "HH": 540.0, "NI": 441.6, "HB": 686.7, "NW": 595.5, "HE": 516.1, "RP": 422.8, "BW": 409.5,
    "BY": 392.6, "SL": 467.7, "BE": 810.0, "BB": 416.3, "MV": 441.3, "SN": 503.9, "ST": 429.0, "TH": 440.3,
}

# Mikrozensus 2022, Wohnen: Haushalte in 1,000 and average Wohnfläche in m² per Wohnung
# (statistikportal.de/de/wohnen).
WOHNEN_2022 = {
    "BB": (1241, 90.1), "BE": (1850, 74.8), "BW": (4991, 100.5), "BY": (6068, 101.2), "HB": (341, 82.5),
    "HE": (2844, 100.4), "HH": (902, 76.5), "MV": (804, 85.1), "NI": (3521, 106.8), "NW": (8517, 94.6),
    "RP": (1865, 109.8), "SH": (1421, 96.2), "SL": (484, 113.3), "SN": (2023, 81.0), "ST": (1083, 86.4),
    "TH": (1036, 87.5),
}
WOHNEN_DE = (38992, 96.0)


def tabelle():
    grest = dict(zip(LAENDER, GREST_2025))
    # Grundsteuer B by Land: Grundbetrag × Hebesatz, scaled to the total revenue of 2025.
    roh = {land: gb * HEBESATZ_B_2022[land] / 100 for land, gb in zip(LAENDER, GRUNDBETRAG_B_2024)}
    faktor = GRUNDSTEUER_B_2025 / sum(roh.values())
    grundsteuer = {land: x * faktor for land, x in roh.items()}
    zeilen = {}
    for land in LAENDER:
        haushalte, m2 = WOHNEN_2022[land]
        flaeche = haushalte * m2  # 1,000 m²
        zeilen[land] = (flaeche, grundsteuer[land], grest[land], m2)
    return zeilen


def main():
    zeilen = tabelle()
    flaeche_de = sum(z[0] for z in zeilen.values())
    gst_de = sum(z[1] for z in zeilen.values())
    grest_de = sum(z[2] for z in zeilen.values())
    print(f"{'Land':<5}{'Mio m²':>9}{'GrSt B Mio €':>14}{'€/m²':>7}{'GrESt Mio €':>13}{'€/m²':>7}{'m²/Whg':>8}")
    for land, (flaeche, gst, grest, m2) in sorted(zeilen.items()):
        print(f"{land:<5}{flaeche / 1000:>9.1f}{gst / 1000:>14.1f}{gst / flaeche:>7.2f}"
              f"{grest / 1000:>13.1f}{grest / flaeche:>7.2f}{m2:>8.1f}")
    print(f"{'DE':<5}{flaeche_de / 1000:>9.1f}{gst_de / 1000:>14.1f}{gst_de / flaeche_de:>7.2f}"
          f"{grest_de / 1000:>13.1f}{grest_de / flaeche_de:>7.2f}{WOHNEN_DE[1]:>8.1f}")
    print()
    print("// Land: [Grundsteuer €/m², Grunderwerbsteuer €/m², Wohnfläche m²/Wohnung]")
    for land, (flaeche, gst, grest, m2) in sorted(zeilen.items()):
        print(f"  {land}: [{gst / flaeche:.2f}, {grest / flaeche:.2f}, {m2}],")


if __name__ == "__main__":
    assert abs(sum(GREST_2025) - 15097041) <= 1  # total in the source: 15,097,041 (rounding)
    main()
