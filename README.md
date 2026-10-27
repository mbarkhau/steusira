# Steusira

Steusira berechnet die reale Steuerlast einer Person. Die Berechnung berücksichtigt die persönlichen Umstände
der Person, zum Beispiel Einkommen, Familienstand, Kinder und Wohnort. Das Ziel ist eine klare Antwort auf die
Frage: Wie viel Steuern zahle ich tatsächlich?

Ein nominaler Steuersatz oder eine einzelne Steuerart gibt diese Antwort oft nicht. Steusira zeigt deshalb die
gesamte Belastung, die sich aus der individuellen Situation ergibt.


## Status

Das Projekt ist in einer frühen Phase. Die Website unter
[steusira.mbarkhau.workers.dev](https://steusira.mbarkhau.workers.dev) enthält einen ersten Steuerrechner
für die Steuerjahre 2024 bis 2027 (2027 nach Gesetzentwürfen). Er addiert die Steuern auf das Einkommen, die Sozialabgaben und die Steuern auf Konsum,
zum Beispiel Umsatzsteuer, Energiesteuer, Tabaksteuer und Alkoholsteuer. Die Parameter und Quellen stehen in
[research/steuerrechner-parameter-2026.md](research/steuerrechner-parameter-2026.md).

Die aktuelle Version steht in der Datei `VERSION`, die Änderungen stehen in `CHANGELOG.md`.


## Entwicklung

Die Website ist eine statische Seite im Verzeichnis `public/`. Die Auslieferung erfolgt über
[Cloudflare Workers](https://developers.cloudflare.com/workers/) mit
[Wrangler](https://developers.cloudflare.com/workers/wrangler/).

```bash
npm install       # Abhängigkeiten installieren
npm run dev       # lokalen Entwicklungsserver starten
npm run deploy    # auf Cloudflare Workers veröffentlichen
npm test          # Rechenlogik testen
```

Die Rechenlogik steht in `public/steuern.js`. Das Modul hat keine Abhängigkeit vom Browser.
