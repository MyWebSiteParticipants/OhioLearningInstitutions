# Ohio Learning Institutions

Interactive PWA mapping Ohio's universities, colleges, community colleges, and
university branch campuses. Built as part of the civic-tech portfolio.

**Live:** https://mikecostarella.github.io/OhioLearningInstitutions/

## Data

115 institutions (94 main + 21 branch campuses) with Fall 2024 enrollment,
control (Public/Private), sector, address, geocoded coordinates, institution
website, and city government website.

## Stack

- React 18 + TypeScript
- Vite 6
- react-leaflet 4 / Leaflet 1.9 (OpenStreetMap tiles)
- vite-plugin-pwa (installable, offline tile caching)
- Deployed to GitHub Pages via GitHub Actions

## Features

- Map view with custom per-type SVG markers, colored by control
- List view with name/city search
- Map / List toggle
- Type and Control filters with live totals (counts + enrollment sum)
- Detail modal: website, Google Maps directions, city website, **Go To on Map**
- Pulsing amber highlight ring on the selected institution
- CSV export (UTF-8 BOM) of the currently filtered set
- Mobile-responsive with hamburger-accessible panels

## Repository Layout

```
OhioLearningInstitutions/
  PrototypeHTML/        original single-file Leaflet prototype
  react-app/            this React PWA (build & deploy from here)
  .github/workflows/    Pages deploy (builds from react-app/)
```

## Develop

```bash
cd react-app
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build      # tsc -b && vite build
npm run preview    # serve the production build locally
```

Pushing to `main` triggers the GitHub Actions workflow that builds and publishes
to GitHub Pages. (Enable Pages → Source: GitHub Actions in repo settings.)

## Project Structure

```
src/
  components/   Header, Panel, FilterPanel, TotalsPanel, Legend,
                DetailModal, MapView, ListView
  data/         institutions.json + typed loader, Ohio bounds
  utils/        icons (SVG + Leaflet divIcons), CSV export
  types.ts      Institution / Filters types
  App.tsx       state, filtering, view toggle, go-to-map wiring
```
