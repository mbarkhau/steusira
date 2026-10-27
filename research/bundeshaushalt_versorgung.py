#!/usr/bin/env python3
"""Sum the expenditure of the Bund for the pensions of civil servants and soldiers (Versorgung).

The categories use the Gruppierungsplan (first three digits of the Titel) and the text of the Titel.
The input files are the same as for bundeshaushalt_summary.py.

Usage: python3 research/bundeshaushalt_versorgung.py research/bundeshaushalt/HH_2026_ALL.csv
       python3 research/bundeshaushalt_versorgung.py research/bundeshaushalt/rechnung_2025.xml
"""

import sys
from collections import defaultdict

from bundeshaushalt_summary import read_titel


def category(kapitel, titel, text):
    gruppe = titel[:3]
    if gruppe == "432":
        return "Versorgungsbezüge Beamte und Richter (432)"
    if gruppe == "433":
        return "Versorgungsbezüge Soldaten, incl. Übergangsgebührnisse (433)"
    if gruppe in ("431", "437", "439"):
        return "Sonstige Versorgungsbezüge (431, 437, 439)"
    if gruppe == "446":
        return "Beihilfen für Versorgungsempfänger (446)"
    if "Postbeamtenversorgungskasse" in text:
        return "Zuschuss an die Postbeamtenversorgungskasse"
    if kapitel == "1216" and titel == "63401":
        return "Erstattung an das Bundeseisenbahnvermögen"
    if gruppe == "434" or (gruppe == "424" and "Versorgungsrücklage" in text):
        return "Zuführung an die Versorgungsrücklage (Vorsorge)"
    if gruppe == "634" and "Versorgungsfonds" in text:
        return "Zuweisungen an den Versorgungsfonds (Vorsorge)"
    return None


def main(path):
    totals = defaultdict(float)
    for row in read_titel(path):
        key = category(row.kap, row.titel, row.text)
        if key:
            totals[key] += row.euro

    print("| Kategorie | Mrd. Euro |")
    print("| --------- | --------: |")
    for key, value in sorted(totals.items(), key=lambda item: -item[1]):
        print(f"| {key} | {value / 1e9:.2f} |")
    print(f"| **Summe** | **{sum(totals.values()) / 1e9:.2f}** |")


if __name__ == "__main__":
    main(sys.argv[1])
