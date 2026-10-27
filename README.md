# Steusira

Steusira berechnet die reale Steuerlast einer Person. Die Berechnung berücksichtigt die persönlichen Umstände
der Person, zum Beispiel Einkommen, Familienstand, Kinder und Wohnort. Das Ziel ist eine klare Antwort auf die
Frage: Wie viel Steuern zahle ich tatsächlich?

Ein nominaler Steuersatz oder eine einzelne Steuerart gibt diese Antwort oft nicht. Steusira zeigt deshalb die
gesamte Belastung, die sich aus der individuellen Situation ergibt.


## Status

Das Projekt ist in einer frühen Phase. Die Website unter
[steusira.mbarkhau.workers.dev](https://steusira.mbarkhau.workers.dev) ist aktuell nur ein Platzhalter.


## Entwicklung

Die Website ist eine statische Seite im Verzeichnis `public/`. Die Auslieferung erfolgt über
[Cloudflare Workers](https://developers.cloudflare.com/workers/) mit
[Wrangler](https://developers.cloudflare.com/workers/wrangler/).

```bash
npm install       # Abhängigkeiten installieren
npm run dev       # lokalen Entwicklungsserver starten
npm run deploy    # auf Cloudflare Workers veröffentlichen
```
