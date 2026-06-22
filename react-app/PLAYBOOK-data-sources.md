# PLAYBOOK — Data Sources

Provenance and processing notes for the data behind OhioLearningInstitutions.

## Institutions (`src/data/institutions.json`)

115 records: 94 main institutions + 21 university branch campuses.

- **Attributes:** name, type (University / University Branch / College /
  Community College), control (Public / Private), sector, Fall 2024 enrollment,
  address, ZIP, institution website, city-government website, parent university
  (branches), and geocoded lat/lng.
- **Origin:** ported from the `PrototypeHTML/Index.html` single-file prototype,
  merging its `INSTITUTIONS`, `BRANCHES`, and `COORDS` structures into one typed
  array.
- **Caveat — coordinates are approximate.** Several branch campuses share
  rounded coordinate values. These are good enough for a statewide overview but
  are **not survey-grade**. Refining pin placement = editing this one file.

## Boundary layers (`public/boundaries/`)

Statewide jurisdiction boundaries, served as static assets and fetched on
demand (cached per layer).

| File | Layer | Features |
|---|---|---|
| `ohio-boundary.json` | State outline (dissolved from counties) | 1 |
| `ohio-counties-layer.json` | Counties | 88 |
| `ohio-municipalities-layer.json` | Incorporated cities + villages | 931 |
| `ohio-townships-layer.json` | Townships | 1,326 |

- **Source:** U.S. Census Bureau cartographic boundary files, 2018 vintage,
  500k resolution (`cb_2018_39_*`). Counties from the national county file
  filtered to STATE FIPS 39; places and county-subdivisions from the Ohio
  state-level files. Public domain (Census requests attribution).
- **Processing:** geometry simplified (Shapely, ~0.0008° tolerance for
  places/townships, 0.002° for counties) to keep payload reasonable;
  `representative_point()` used to compute a `labelLat`/`labelLon` for each
  feature; properties normalized to `name` / `type` (+ `geoid`/`fips`).
- **Municipalities exclude CDPs.** Census place LSAD codes: 25 = City,
  47 = Village, 57 = Census Designated Place (unincorporated). Only 25 and 47
  are kept — CDPs are dropped so jurisdiction lookup doesn't falsely report a
  location as inside an unincorporated community.
- **Townships** are county-subdivisions with LSAD 44, suffixed `" Township"`.

## Jurisdiction resolution

`src/utils/geo.ts` performs offline point-in-polygon (ray-casting, handles
Polygon + MultiPolygon and interior holes). Given an institution's lat/lng it
resolves the containing county, municipality, and township. Spot-checked 9/9
against known institution locations (OSU→Franklin, UC→Hamilton, YSU→Mahoning,
Kent State→Portage, etc.).

## Refresh notes

To update to a newer Census vintage, re-fetch the `cb_YYYY_39_*` files, re-run
the same simplify + normalize steps, and replace the files in
`public/boundaries/`. The property schema must stay `name` / `type` /
`labelLat` / `labelLon` for the app and jurisdiction lookup to keep working.
