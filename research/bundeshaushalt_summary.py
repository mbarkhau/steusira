#!/usr/bin/env python3
"""Summarize the expenditure of the federal budget (Bundeshaushalt) by purpose.

The input is a file from the download portal of bundeshaushalt.de:

- a CSV file of the budget plan (Soll), for example bundeshaushalt/HH_2026_ALL.csv,
  where the column "soll" is in thousand euro;
- an XML file of the budget accounts (Haushaltsrechnung), for example bundeshaushalt/rechnung_2025.xml,
  where the actual expenditure (Ist) is in euro.

Kapitel with a number that ends in 90 to 99 are Anlagen (special funds such as Sondervermögen Bundeswehr,
Klima- und Transformationsfonds, and the EU own resources). They are not part of the core budget
(Kernhaushalt) and the script lists them in a separate table.

Usage: python3 -I research/bundeshaushalt_summary.py research/bundeshaushalt/HH_2026_ALL.csv
       python3 -I research/bundeshaushalt_summary.py research/bundeshaushalt/rechnung_2025.xml
"""

import csv
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict

# Hauptfunktionen of the Funktionenplan (first digit of the Funktion)
HAUPTFUNKTIONEN = {
    "0": "Allgemeine Dienste (Verwaltung, Verteidigung, Sicherheit, Auswärtiges)",
    "1": "Bildung, Wissenschaft, Forschung, Kultur",
    "2": "Soziale Sicherung, Familie, Jugend, Arbeitsmarkt",
    "3": "Gesundheit, Umwelt, Sport und Erholung",
    "4": "Wohnungswesen, Städtebau, Raumordnung",
    "5": "Ernährung, Landwirtschaft, Forsten",
    "6": "Energie, Wasser, Gewerbe, Dienstleistungen",
    "7": "Verkehrs- und Nachrichtenwesen",
    "8": "Finanzwirtschaft (u. a. Zinsen der Bundesschuld)",
}


def read_csv(path):
    """Yield (einzelplan, einzelplan text, kapitel, kapitel text, funktion, euro) for each expenditure."""
    with open(path, encoding="utf-8-sig", newline="") as fobj:
        reader = csv.DictReader(fobj, delimiter=";")
        reader.fieldnames = [name.strip() for name in reader.fieldnames]
        for row in reader:
            if row["einahmen-ausgaben"] == "A":
                euro = int(row["soll"] or 0) * 1000
                yield (
                    row["einzelplan"],
                    row["einzelplan-text"],
                    row["kapitel"],
                    row["kapitel-text"],
                    row["funktion"],
                    euro,
                )


def parse_euro(text):
    """Parse "1.055.795,73" and also negative values with a trailing minus, for example "2.500,00-"."""
    sign = -1 if text.endswith("-") else 1
    return sign * float(text.rstrip("-").replace(".", "").replace(",", "."))


def read_xml(path):
    """Same as read_csv, but for the Ist values of a Haushaltsrechnung XML file."""
    root = ET.parse(path).getroot()
    for epl in root.iter("einzelplan"):
        epl_text = epl.findtext("text")
        for kap in epl.iter("kapitel"):
            kap_text = kap.findtext("text") or f"Kapitel {kap.get('nr')}"
            for ausgaben in kap.findall("ausgaben"):
                for titel in ausgaben.iter("titel"):
                    euro = parse_euro(titel.find("ist").get("wert"))
                    yield (epl.get("nr"), epl_text, kap.get("nr"), kap_text, titel.get("fkt"), euro)


def print_table(title, totals, labels):
    total = sum(totals.values())
    print(f"## {title}\n")
    print("| Key  | Bezeichnung | Mrd. Euro | Anteil |")
    print("| ---- | ----------- | --------: | -----: |")
    for key, value in sorted(totals.items(), key=lambda item: -item[1]):
        if round(value / 1e9, 1):
            print(f"| {key} | {labels[key]} | {value / 1e9:.1f} | {value / total:.1%} |")
    print(f"|      | **Summe** | **{total / 1e9:.1f}** |        |\n")


def main(path):
    rows = read_xml(path) if path.endswith(".xml") else read_csv(path)
    by_epl = defaultdict(float)
    by_func = defaultdict(float)
    by_anlage = defaultdict(float)
    labels = {}
    for epl, epl_text, kap, kap_text, funktion, euro in rows:
        if kap[2:] >= "90":
            by_anlage[kap] += euro
            labels[kap] = kap_text.replace('"', "")
        else:
            by_epl[epl] += euro
            labels[epl] = epl_text
            by_func[funktion[:1]] += euro

    print_table("Kernhaushalt nach Einzelplan", by_epl, labels)
    print_table("Kernhaushalt nach Hauptfunktion", by_func, HAUPTFUNKTIONEN)
    print_table("Anlagen (Sondervermögen, EU-Eigenmittel)", by_anlage, labels)


if __name__ == "__main__":
    main(sys.argv[1])
