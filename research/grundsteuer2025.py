#!/usr/bin/env python3
"""Reference implementation of the Grundsteuer B from 2025 for residential property.

Sources: BewG §§ 243-262 with Anlagen 36 to 41 (Bundesmodell), GrStG § 15, the state laws BayGrStG,
HmbGrStG, HGrStG, NGrStG, LGrStG BW, and the state Messzahl laws of Berlin, Bremen, Saarland and Sachsen.
See grundsteuer-2025.md.

Scope: Ein-/Zweifamilienhaus, Wohnungseigentum and Mietwohngrundstück, without reductions for
Sozialwohnungen or Denkmäler. Not covered: Anlage 36 (Umrechnungskoeffizienten for the land of EFH/ZFH),
garages, Nichtwohnflächen, large plots in the area models.

Run without arguments to print example calculations.
"""

import csv
import math
from pathlib import Path

HAUPTFESTSTELLUNG = 2022
GESAMTNUTZUNGSDAUER = 80  # Anlage 38, all residential types

MIETNIVEAUSTUFE = {1: -0.20, 2: -0.10, 3: 0.0, 4: 0.10, 5: 0.20, 6: 0.30, 7: 0.40}  # Anlage 39 Teil II

# Anlage 40: Bewirtschaftungskosten in % of the Rohertrag, by Restnutzungsdauer (>= 60, 40-59, 20-39, < 20)
BEWIRTSCHAFTUNG = {
    "efh": (18, 21, 25, 27),
    "zfh": (18, 21, 25, 27),
    "we" : (23, 25, 29, 31),
    "mwg": (21, 23, 27, 29),
}

# Steuermesszahl in Promille for Wohngrundstücke in the states that use the Bundesmodell
MESSZAHL_WOHNEN = {
    "Berlin"     : 0.31,  # Nichtwohn and unbebaut: 0.45
    "Bremen"     : 0.31,  # Nichtwohn and unbebaut: 0.75
    "Saarland"   : 0.34,  # Nichtwohn and unbebaut: 0.64
    "Sachsen"    : 0.36,  # Nichtwohn: 0.72, unbebaut: 0.36
}
MESSZAHL_WOHNEN_BUND = 0.31  # § 15 (1) Nr. 2a GrStG; Nichtwohn and unbebaut: 0.34

FLAECHENMODELL_LAENDER = {"Bayern", "Hamburg", "Hessen", "Niedersachsen"}

CSV_PATH = Path(__file__).with_name("grundsteuer-nettokaltmieten-2022.csv")


def _load_mieten():
    with CSV_PATH.open(encoding="utf-8") as f:
        return {(r["land"], r["gebaeudeart"], r["wohnflaeche"]): r for r in csv.DictReader(f)}


MIETEN = _load_mieten()


def nettokaltmiete(land, art, wohnflaeche, baujahr):
    """Monthly Nettokaltmiete in €/m² from Anlage 39 Teil I (Wohnungseigentum uses the mwg values)."""
    art = "mwg" if art == "we" else art
    klasse = "lt60" if wohnflaeche < 60 else "60to100" if wohnflaeche < 100 else "ge100"
    row = MIETEN[land, art, klasse]
    if baujahr <= 1948:
        col = "bis1948"
    elif baujahr <= 1978:
        col = "1949_1978"
    elif baujahr <= 1990:
        col = "1979_1990"
    elif baujahr <= 2000:
        col = "1991_2000"
    else:
        col = "ab2001"
    return float(row[col])


def liegenschaftszins(art, bodenrichtwert, wohnungen=1):
    """§ 256 BewG, in percent."""
    if art in ("efh", "zfh"):
        if bodenrichtwert >= 1500:
            return 1.5
        return 2.5 - 0.1 * max(0, (bodenrichtwert - 500) // 100)
    if art == "we":
        if bodenrichtwert >= 3000:
            return 2.0
        return 3.0 - 0.1 * max(0, (bodenrichtwert - 2000) // 100)
    return 4.0 if wohnungen <= 6 else 4.5


def restnutzungsdauer(baujahr):
    """§ 253 (2) BewG: at least 30 % of the Gesamtnutzungsdauer."""
    alter = HAUPTFESTSTELLUNG - baujahr
    return max(GESAMTNUTZUNGSDAUER - alter, math.ceil(0.3 * GESAMTNUTZUNGSDAUER))


def vervielfaeltiger(zins_pct, rnd):
    """Anlage 37: Barwertfaktor, rounded to two decimals."""
    q = 1 + zins_pct / 100
    return round((1 - q**-rnd) / (q - 1), 2)


def abzinsungsfaktor(zins_pct, rnd):
    """Anlage 41, rounded to four decimals."""
    return round((1 + zins_pct / 100) ** -rnd, 4)


def grundsteuerwert(
    land, art, wohnflaeche, baujahr, mietniveaustufe, grundflaeche, bodenrichtwert, wohnungen=1
):
    """Ertragswertverfahren (§§ 252-257 BewG). grundflaeche: plot area or the share of the plot for WE."""
    miete = nettokaltmiete(land, art, wohnflaeche, baujahr) * (1 + MIETNIVEAUSTUFE[mietniveaustufe])
    rohertrag = miete * wohnflaeche * 12
    rnd = restnutzungsdauer(baujahr)
    stufe = 0 if rnd >= 60 else 1 if rnd >= 40 else 2 if rnd >= 20 else 3
    reinertrag = rohertrag * (1 - BEWIRTSCHAFTUNG[art][stufe] / 100)
    zins = liegenschaftszins(art, bodenrichtwert, wohnungen)
    bodenwert = grundflaeche * bodenrichtwert
    wert = reinertrag * vervielfaeltiger(zins, rnd) + bodenwert * abzinsungsfaktor(zins, rnd)
    wert = max(wert, 0.75 * bodenwert)  # § 251 BewG Mindestwert
    return math.floor(wert / 100) * 100  # § 230 BewG: round down to full 100 €


def messbetrag_bundesmodell(land, **kw):
    messzahl = MESSZAHL_WOHNEN.get(land, MESSZAHL_WOHNEN_BUND) / 1000
    return math.floor(grundsteuerwert(land, **kw) * messzahl * 100) / 100


def messbetrag_flaechenmodell(land, wohnflaeche, grundflaeche, lagefaktor=1.0, normale_wohnlage=True):
    """Bayern, Hamburg, Hessen, Niedersachsen. lagefaktor = (BRW / Ø-BRW of the Gemeinde) ** 0.3 (HE, NI)."""
    boden = grundflaeche * 0.04 * 1.00
    wohnen = wohnflaeche * 0.50 * 0.70
    if land == "Hamburg" and normale_wohnlage:
        wohnen *= 0.75
    if land in ("Hessen", "Niedersachsen"):
        return math.floor((boden + wohnen) * lagefaktor * 100) / 100
    return math.floor(boden * 100) / 100 + math.floor(wohnen * 100) / 100


def messbetrag_bw(grundflaeche, bodenrichtwert):
    """Baden-Württemberg: Bodenwert × 1.30 ‰, reduced by 30 % for überwiegend Wohnzwecke (0.91 ‰)."""
    grundsteuerwert = math.floor(grundflaeche * bodenrichtwert / 100) * 100
    return math.floor(grundsteuerwert * 0.00091 * 100) / 100


def grundsteuer(messbetrag, hebesatz_pct):
    return math.floor(messbetrag * hebesatz_pct) / 100


def _beispiele():
    # Same flat everywhere: 70 m² Wohnungseigentum, Baujahr 1965, 25 m² share of the plot.
    wohnung = dict(art="we", wohnflaeche=70, baujahr=1965, grundflaeche=25)
    faelle = [
        ("Berlin",              4, 1500, 470),
        ("Bremen",              3,  600, 755),
        ("Nordrhein-Westfalen", 4, 1000, 475),  # Köln 2025
        ("Sachsen",             3,  400, 650),  # Hebesatz is an assumption
        ("Saarland",            2,  200, 500),  # Hebesatz is an assumption
    ]
    print(f"{'Land':<22}{'GSW €':>10}{'Messbetrag':>12}{'Hebesatz':>10}{'Grundsteuer':>13}{'€/m²/Monat':>12}")
    for land, stufe, brw, hebesatz in faelle:
        gsw = grundsteuerwert(land, mietniveaustufe=stufe, bodenrichtwert=brw, **wohnung)
        mb = messbetrag_bundesmodell(land, mietniveaustufe=stufe, bodenrichtwert=brw, **wohnung)
        gst = grundsteuer(mb, hebesatz)
        print(f"{land:<22}{gsw:>10,}{mb:>12.2f}{hebesatz:>9}%{gst:>13.2f}{gst / 12 / 70:>12.3f}")
    for land, hebesatz, kw in [
        ("Bayern", 824, {}),         # München
        ("Hamburg", 975, {}),
        ("Hessen", 854.69, {}),      # Frankfurt, lagefaktor 1.0
        ("Niedersachsen", 600, {}),  # Hebesatz is an assumption
    ]:
        mb = messbetrag_flaechenmodell(land, 70, 25, **kw)
        gst = grundsteuer(mb, hebesatz)
        print(f"{land:<22}{'-':>10}{mb:>12.2f}{hebesatz:>9}%{gst:>13.2f}{gst / 12 / 70:>12.3f}")
    mb = messbetrag_bw(25, 1500)  # Stuttgart, Bodenrichtwert is an assumption
    gst = grundsteuer(mb, 160)
    print(f"{'Baden-Württemberg':<22}{25 * 1500:>10,}{mb:>12.2f}{160:>9}%{gst:>13.2f}{gst / 12 / 70:>12.3f}")


if __name__ == "__main__":
    assert vervielfaeltiger(4.0, 50) == 21.48 and abzinsungsfaktor(4.0, 50) == 0.1407  # Anlage 37/41
    assert vervielfaeltiger(2.5, 24) == 17.88 and abzinsungsfaktor(2.5, 24) == 0.5529
    _beispiele()
