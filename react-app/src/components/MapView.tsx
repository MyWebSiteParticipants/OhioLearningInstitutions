import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  GeoJSON,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import type { FeatureCollection } from 'geojson';
import type { Institution } from '../types';
import { makeLeafletIcon } from '../utils/icons';
import { OHIO_CENTER, OHIO_BOUNDS } from '../data';
import {
  BOUNDARY_LAYERS,
  loadBoundary,
  type BoundaryLayerId,
} from '../data/boundaries';

export interface UserLocation {
  lat: number;
  lng: number;
  inArea: boolean;
}

interface MapViewProps {
  institutions: Institution[];
  highlighted: Institution | null;
  flyTarget: Institution | null;
  activeBoundaries: Set<BoundaryLayerId>;
  locateRequest: number;
  onMarkerClick: (inst: Institution) => void;
  onLocated: (loc: UserLocation) => void;
  onLocateError: (message: string) => void;
}

function inOhio(lat: number, lng: number): boolean {
  const [[s, w], [n, e]] = OHIO_BOUNDS;
  return lat >= s && lat <= n && lng >= w && lng <= e;
}

function MapController({
  flyTarget,
  highlighted,
  locateRequest,
  onLocated,
  onLocateError,
}: {
  flyTarget: Institution | null;
  highlighted: Institution | null;
  locateRequest: number;
  onLocated: (loc: UserLocation) => void;
  onLocateError: (message: string) => void;
}) {
  const map = useMap();
  const ringRef = useRef<L.Marker | null>(null);
  const userRef = useRef<L.Marker | null>(null);
  const hasFlownToUser = useRef(false);

  useEffect(() => {
    if (flyTarget) {
      map.flyTo([flyTarget.lat, flyTarget.lng], 14, { duration: 1.1 });
    }
  }, [flyTarget, map]);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.remove();
      ringRef.current = null;
    }
    if (highlighted) {
      const ringIcon = L.divIcon({
        className: '',
        html: '<div class="highlight-ring" style="width:46px;height:46px"></div>',
        iconSize: [46, 46],
        iconAnchor: [23, 23],
      });
      ringRef.current = L.marker([highlighted.lat, highlighted.lng], {
        icon: ringIcon,
        interactive: false,
        zIndexOffset: -1000,
      }).addTo(map);
    }
    return () => {
      if (ringRef.current) {
        ringRef.current.remove();
        ringRef.current = null;
      }
    };
  }, [highlighted, map]);

  useEffect(() => {
    if (locateRequest === 0) return;
    if (!('geolocation' in navigator)) {
      onLocateError('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const area = inOhio(lat, lng);

        if (userRef.current) userRef.current.remove();
        const userIcon = L.divIcon({
          className: '',
          html: `
            <div class="you-are-here">
              <div class="yah-label">You Are Here</div>
              <svg class="yah-pin" width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.16 0 0 7.16 0 16c0 11 16 26 16 26s16-15 16-26C32 7.16 24.84 0 16 0z"
                      fill="#2563eb" stroke="#ffffff" stroke-width="2.5"/>
                <circle cx="16" cy="16" r="6" fill="#ffffff"/>
              </svg>
              <div class="yah-pulse"></div>
            </div>`,
          iconSize: [32, 54],
          iconAnchor: [16, 42],
        });
        userRef.current = L.marker([lat, lng], {
          icon: userIcon,
          interactive: false,
          zIndexOffset: 2000,
        }).addTo(map);

        if (area) {
          if (!hasFlownToUser.current) {
            map.flyTo([lat, lng], 9, { duration: 1.1 });
            hasFlownToUser.current = true;
          }
        } else {
          map.flyToBounds(OHIO_BOUNDS, { duration: 1.1, padding: [40, 40] });
        }
        onLocated({ lat, lng, inArea: area });
      },
      (err) => {
        onLocateError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : 'Could not determine your location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [locateRequest, map, onLocated, onLocateError]);

  return null;
}

// Lazy-loads a single boundary layer's GeoJSON the first time it's shown.
function BoundaryLayer({ id }: { id: BoundaryLayerId }) {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const meta = BOUNDARY_LAYERS.find((l) => l.id === id)!;

  useEffect(() => {
    let alive = true;
    loadBoundary(id)
      .then((fc) => {
        if (alive) setData(fc);
      })
      .catch(() => {
        /* network error — silently skip rendering this layer */
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (!data) return null;
  return (
    <GeoJSON
      data={data}
      style={{ color: meta.color, weight: meta.weight, fill: false, opacity: 0.85 }}
      interactive={false}
    />
  );
}

export default function MapView({
  institutions,
  highlighted,
  flyTarget,
  activeBoundaries,
  locateRequest,
  onMarkerClick,
  onLocated,
  onLocateError,
}: MapViewProps) {
  return (
    <MapContainer id="map" center={OHIO_CENTER} zoom={7} zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {BOUNDARY_LAYERS.filter((l) => activeBoundaries.has(l.id)).map((layer) => (
        <BoundaryLayer key={layer.id} id={layer.id} />
      ))}

      <MapController
        flyTarget={flyTarget}
        highlighted={highlighted}
        locateRequest={locateRequest}
        onLocated={onLocated}
        onLocateError={onLocateError}
      />

      {institutions.map((inst) => (
        <Marker
          key={inst.name}
          position={[inst.lat, inst.lng]}
          icon={makeLeafletIcon(inst.type, inst.control)}
          eventHandlers={{ click: () => onMarkerClick(inst) }}
        >
          <Tooltip className="inst-tip" sticky offset={[10, 0]}>
            <b>{inst.name}</b>
            <br />
            {inst.address}, {inst.city}, {inst.state} {inst.zip}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
