# Receipt Tracker

iPhone & Android App zum Scannen von Quittungen mit artikel-genauer Kategorisierung und Haushaltsbuch.

**Kernidee:** Andere Apps buchen eine Quittung als einen Eintrag. Diese App extrahiert jeden einzelnen Artikel und kategorisiert ihn separat — so weißt du nicht nur "47€ bei Rewe", sondern genau wofür.

## Features

- **Receipt Scanner** — Foto → OCR → einzelne Artikel automatisch extrahiert
- **Intelligente Kategorisierung** — manuell zuerst, dann lernt die App via Fuzzy Matching
- **Hierarchische Kategorien** — selbst definierbar, mehrere Ebenen (z.B. Lebensmittel > Getränke > Säfte)
- **Mehrfachkategorien** — ein Artikel kann in mehreren Kategorien stecken
- **Suspicious Flag** — manuell eingetragene Ausgaben werden als "unbestätigt" markiert bis ein Beleg vorliegt
- **Haushaltsbuch** — fixe & variable Kosten, Einnahmen
- **Monatsberichte** — Einnahmen vs. Ausgaben, aufgeschlüsselt nach Kategorien

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | React Native + Expo |
| Sprache | TypeScript (strict) |
| Datenbank | SQLite via Drizzle ORM |
| State | Zustand |
| Fuzzy Matching | Fuse.js |
| Charts | Victory Native |
| Tests | ts-jest |
| CI | GitHub Actions |

## Architektur

Clean Architecture mit strikter Schichtentrennung:

```
src/
  domain/        # Business-Logik, Entities, Repository-Interfaces
  data/          # DB-Schema, Repository-Implementierungen, Services
  presentation/  # Screens, Komponenten, Navigation, Stores
  shared/        # Konstanten, Utilities
```

## Setup

**Voraussetzungen:** Node.js 20+, Expo Go App auf dem Handy

```bash
git clone https://github.com/Walde90/receipt-tracker.git
cd receipt-tracker
npm install --legacy-peer-deps

# App starten
npm start

# Tests ausführen
npm test

# Tests mit Coverage
npm run test:ci
```

QR-Code mit Expo Go scannen → App läuft auf dem Handy.

## Entwicklung

```bash
# Feature-Branch erstellen
git checkout -b feature/category-management

# Tests lokal prüfen vor dem Push
npm test

# CI-Status auf GitHub prüfen
gh run list --repo Walde90/receipt-tracker
```

## Monetarisierung

| Tier | Limits |
|---|---|
| Kostenlos | 10 Scans/Monat, 3 Kategorieebenen, 3 Monate Historie |
| Pro (3,99€/Monat) | Unbegrenzt, Cloud-Sync, geteilter Haushalt, Export |
