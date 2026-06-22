# CHANGES

## Initial React PWA Port

Ported the `PrototypeHTML/Index.html` single-file Leaflet prototype into a
React + TypeScript + Vite PWA following the established civic-map portfolio
conventions.

### Added

- **Project scaffold:** React 18, TypeScript (project references), Vite 6,
  vite-plugin-pwa, GitHub Pages base path `/OhioLearningInstitutions/`.
- **Typed data:** merged `INSTITUTIONS` (94) + `BRANCHES` (21) and the `COORDS`
  lookup into a single typed `institutions.json` (115 records, all with
  lat/lng — no missing coordinates).
- **Components:** Header, collapsible Panel, FilterPanel, TotalsPanel, Legend,
  DetailModal, MapView, ListView.
- **Map:** react-leaflet markers with per-type SVG `divIcon`s colored by
  control; sticky tooltips; OSM tiles.
- **Filters:** Institution Type + Control checkboxes with live Totals
  (per-type counts, Public/Private, enrollment sum, shown count).
- **Detail modal:** institution website, Google Maps directions, city website,
  and **Go To on Map**.
- **Pulsing amber highlight ring** dropped on the selected institution via an
  imperative `MapController` (`useMap`).
- **Map / List view toggle**; list view has name/city search.
- **CSV export** of the filtered set with UTF-8 BOM.
- **PWA:** manifest, generated 192/512 icons, OSM tile runtime caching,
  precache ceiling raised to 5MB.
- **CI:** GitHub Actions build + deploy workflow (`tsc -b && vite build`).

### Notes

- Leaflet `divIcon`s are cached by `type|control` key to avoid rebuilding SVG
  markup on every render.
- The highlight ring is cleaned up on unmount / change to avoid stale markers.
