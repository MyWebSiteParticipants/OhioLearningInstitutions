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

## Boundaries, Jurisdiction Lookup & Geolocation

Added the statewide boundary/jurisdiction features to bring this map up to spec
with the rest of the civic-map portfolio.

### Added

- **Statewide boundary overlays** (US Census 500k cartographic files, 2018):
  state outline, 88 counties, 931 incorporated municipalities (247 cities + 684
  villages), 1,326 townships. Normalized to the portfolio's `name` / `type` /
  `labelLat` / `labelLon` property schema.
- **Layer toggle panel** ("LAYERS") to switch each overlay on/off independently.
- **Build-time static GeoJSON snapshots:** boundary files live in
  `public/boundaries/` and are fetched on demand (cached per layer), not bundled
  into the JS — keeps the main bundle ~359 KB and follows the Hydrants pattern
  of static snapshots over runtime GIS fetches.
- **Offline point-in-polygon jurisdiction lookup** (`utils/geo.ts`, ray-casting,
  Polygon + MultiPolygon, hole-aware). The detail dialog now shows the
  institution's County and City/Village (or Township). Verified 9/9 against
  known institution locations.
- **Geolocation ("Locate Me")** with a user-location dot, the `hasFlownToUser`
  guard so re-locates don't yank the map, and an out-of-area `flyToBounds`
  fallback that frames the whole state when the user is outside Ohio.
- **Toast notifications** for locate results (resolves the user's county) and
  errors (permission denied, unsupported, etc.).
- **Mobile menu strip** so all four panels (Filters, Totals, Layers, Legend) are
  reachable on small screens, replacing the filters-only hamburger.

### Notes

- Census Designated Places (unincorporated CDPs) were excluded from the
  municipalities layer so point-in-polygon won't report a false "in municipality
  X" for unincorporated locations.
- Total precached payload ~2.8 MB, within the 5 MB service-worker ceiling.

## "You Are Here" Marker & Auto-Locate

- Replaced the plain location dot with a **"You Are Here" pin** carrying a
  permanent label (blue pin + caret + soft pulse at the base).
- **Auto-locate on first load** in addition to the Locate Me button. The
  auto-prompt is silent on denial (no error toast); explicit Locate Me clicks
  still surface errors.
- Locate toast reworded to "You are here — <County> County."

## Locate Zoom & Build Timestamp

- Lowered the auto-locate fly-to zoom (12 → 9) so more institutions stay in
  view when the map centers on the user.
- Added a **"Last updated"** control to the title bar, populated from a
  build-time timestamp injected via Vite `define` (`__BUILD_TIME__`). Refreshes
  on every `vite build` / deploy; full ISO time shown on hover.

## Menu & Panel UX Fixes

- The accordion menu now **closes after a terminal selection** (switching to
  Map/List, or clicking Locate Me) so it no longer covers the content. Filter
  and layer toggles keep it open for multi-select convenience.
- **Legend and Totals render only in Map view** — they're hidden in List view
  where they aren't meaningful.
- On **mobile (≤760px) the Legend and Totals start collapsed** by default
  (compact header bars, tap to expand), keeping the map unobstructed.
