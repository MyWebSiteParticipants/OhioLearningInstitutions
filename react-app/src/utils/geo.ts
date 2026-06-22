import type { Feature, FeatureCollection, Geometry } from 'geojson';

// Ray-casting point-in-polygon for a single linear ring.
// point is [lng, lat]; ring is an array of [lng, lat] pairs.
function pointInRing(point: [number, number], ring: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// A polygon = outer ring + optional holes. Inside outer and outside all holes.
function pointInPolygon(point: [number, number], rings: number[][][]): boolean {
  if (rings.length === 0) return false;
  if (!pointInRing(point, rings[0])) return false;
  for (let h = 1; h < rings.length; h++) {
    if (pointInRing(point, rings[h])) return false; // in a hole
  }
  return true;
}

function pointInGeometry(point: [number, number], geom: Geometry): boolean {
  if (geom.type === 'Polygon') {
    return pointInPolygon(point, geom.coordinates as number[][][]);
  }
  if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates as number[][][][]) {
      if (pointInPolygon(point, poly)) return true;
    }
  }
  return false;
}

/**
 * Find the first feature in a collection whose polygon contains the given
 * lat/lng. Returns the feature's `name` property (and the full feature) or null.
 */
export function findJurisdiction(
  lat: number,
  lng: number,
  collection: FeatureCollection
): { name: string; type?: string; feature: Feature } | null {
  const point: [number, number] = [lng, lat];
  for (const feature of collection.features) {
    if (feature.geometry && pointInGeometry(point, feature.geometry)) {
      const props = (feature.properties || {}) as Record<string, unknown>;
      return {
        name: String(props.name ?? props.NAME ?? 'Unknown'),
        type: props.type ? String(props.type) : undefined,
        feature,
      };
    }
  }
  return null;
}
