import type { FeatureCollection, Feature } from 'geojson';

export type BoundaryLayerId = 'state' | 'counties' | 'municipalities' | 'townships';

export interface BoundaryLayerMeta {
  id: BoundaryLayerId;
  label: string;
  color: string;
  weight: number;
  file: string;
}

// Base path respects the Vite `base` (GitHub Pages subdirectory).
const BASE = import.meta.env.BASE_URL;

export const BOUNDARY_LAYERS: BoundaryLayerMeta[] = [
  { id: 'state', label: 'State Outline', color: '#002868', weight: 2.5, file: 'ohio-boundary.json' },
  { id: 'counties', label: 'Counties', color: '#BF0A30', weight: 1.2, file: 'ohio-counties-layer.json' },
  { id: 'municipalities', label: 'Municipalities', color: '#1a56c4', weight: 0.9, file: 'ohio-municipalities-layer.json' },
  { id: 'townships', label: 'Townships', color: '#6b7280', weight: 0.7, file: 'ohio-townships-layer.json' },
];

// In-flight + resolved cache so each layer is fetched at most once.
const cache = new Map<BoundaryLayerId, Promise<FeatureCollection>>();

function toCollection(id: BoundaryLayerId, json: unknown): FeatureCollection {
  // The state file is a bare Feature; wrap it uniformly.
  if (id === 'state') {
    return { type: 'FeatureCollection', features: [json as Feature] };
  }
  return json as FeatureCollection;
}

export function loadBoundary(id: BoundaryLayerId): Promise<FeatureCollection> {
  const cached = cache.get(id);
  if (cached) return cached;
  const meta = BOUNDARY_LAYERS.find((l) => l.id === id)!;
  const p = fetch(`${BASE}boundaries/${meta.file}`)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${meta.file}: ${r.status}`);
      return r.json();
    })
    .then((json) => toCollection(id, json));
  cache.set(id, p);
  return p;
}
