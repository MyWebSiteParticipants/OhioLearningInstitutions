import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Institution } from '../types';
import { makeLeafletIcon } from '../utils/icons';
import { OHIO_CENTER } from '../data';

interface MapViewProps {
  institutions: Institution[];
  highlighted: Institution | null;
  flyTarget: Institution | null;
  onMarkerClick: (inst: Institution) => void;
}

// Imperative controller: flies to a target and drops a pulsing highlight ring.
function MapController({
  flyTarget,
  highlighted,
}: {
  flyTarget: Institution | null;
  highlighted: Institution | null;
}) {
  const map = useMap();
  const ringRef = useRef<L.Marker | null>(null);

  // Fly to a requested target
  useEffect(() => {
    if (flyTarget) {
      map.flyTo([flyTarget.lat, flyTarget.lng], 14, { duration: 1.1 });
    }
  }, [flyTarget, map]);

  // Manage the pulsing highlight ring
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

  return null;
}

export default function MapView({
  institutions,
  highlighted,
  flyTarget,
  onMarkerClick,
}: MapViewProps) {
  return (
    <MapContainer
      id="map"
      center={OHIO_CENTER}
      zoom={7}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapController flyTarget={flyTarget} highlighted={highlighted} />
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
