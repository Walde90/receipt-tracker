# Receipt Tracker — Claude Context

## Projekt
iPhone/Android App zum Scannen von Quittungen mit artikel-genauer Kategorisierung und Haushaltsbuch.
Ziel: App Store + Google Play, Freemium-Modell.

## Stack
- React Native + Expo (TypeScript strict)
- SQLite via Drizzle ORM
- Zustand (State), Fuse.js (Fuzzy Matching), Victory Native (Charts)
- Tests: ts-jest, @testing-library/react-native
- CI: GitHub Actions (läuft bei jedem Push)

## Architektur: Clean Architecture
```
src/
  domain/          # Kern — keine Abhängigkeiten auf Frameworks
    entities/      # Datentypen (Category, Receipt, LineItem, Budget, FuzzyAlias)
    repositories/  # Interfaces (ICategoryRepository, etc.)
    usecases/      # Business-Logik
  data/            # Implementierungen
    db/            # Drizzle Schema + SQLite Verbindung
    repositories/  # Konkrete Repository-Implementierungen
    services/      # FuzzyMatcherService, OcrParserService
  presentation/    # UI
    screens/       # Screen-Komponenten
    components/    # Wiederverwendbare UI-Teile
    stores/        # Zustand Stores
    navigation/    # React Navigation
  shared/
    constants/     # Schwellenwerte, Free-Tier-Limits
    utils/         # Hilfsfunktionen
```

## Coding-Regeln
- **Sprache**: TypeScript strict, keine `any` außer in Drizzle self-references
- **Clean Code**: Single Responsibility, kleine Funktionen, sprechende Namen
- **Kommentare**: Nur wenn das WARUM nicht offensichtlich ist — niemals WAS
- **Tests**: Jede neue Service-Methode und Business-Logik bekommt Unit Tests in `__tests__/`
- **Keine Kommentare** die erklären was der Code tut — nur warum
- **Keine Magic Numbers** — immer Konstanten aus `src/shared/constants/`

## Commit-Konventionen (Conventional Commits)
- `feat:` neues Feature
- `fix:` Bugfix
- `test:` Tests hinzugefügt/geändert
- `refactor:` Refactoring ohne Funktionsänderung
- `chore:` Konfiguration, Dependencies
- Sprache: Englisch

## Branch-Strategie
- `main` — stabil, CI muss grün sein
- Feature-Branches: `feature/category-management`, `feature/ocr-scanner`, etc.
- Kein direktes Pushen auf `main` für Features

## Meilensteine (aktueller Stand: Milestone 2 abgeschlossen)
1. ✅ Projekt-Setup, Datenbankschema, Navigation-Skeleton
2. ✅ Kategorienverwaltung (Baum-CRUD) — branch: feature/category-management
3. ✅ Budget-Eingabe + Suspicious-Flag — branch: feature/budget-management (PR #2)
4. ⬜ Kamera + OCR Pipeline
5. ⬜ Kategorisierung + Fuzzy Matching
6. ⬜ Monatsberichte + Charts
7. ⬜ Polish + App Store

## Wichtige Entscheidungen
- `raw_name` auf LineItem wird NIE überschrieben — das ist das OCR-Original
- Suspicious Flag sitzt auf `budget_entries`, nicht auf `line_items`
- Fuzzy-Matching: Auto-Apply ab 0.85 Confidence, Vorschlag ab 0.70
- Free Tier: 10 Scans/Monat, 3 Kategorieebenen, 3 Monate Historie
- Monetarisierung via RevenueCat (abstrahiert Apple/Google IAP)
- Cloud (Phase 2): Supabase

## GitHub
- Repo: https://github.com/Walde90/receipt-tracker
- CI: GitHub Actions (`ci.yml`) — Type Check + Tests bei jedem Push
- Status prüfen: `gh run list --repo Walde90/receipt-tracker`
