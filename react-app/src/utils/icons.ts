import L from 'leaflet';
import type { InstitutionType, Control } from '../types';

export const CONTROL_COLOR: Record<Control, string> = {
  Public: '#1a56c4',
  Private: '#c0392b',
};

export const TYPE_BADGE_COLOR: Record<InstitutionType, string> = {
  University: '#002868',
  'University Branch': '#1a56c4',
  College: '#BF0A30',
  'Community College': '#8B0000',
};

export function makeIconSVG(type: InstitutionType | string, color: string): string {
  const c = color || '#666';
  switch (type) {
    case 'University':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="34" viewBox="0 0 28 34">
        <path d="M14 0L0 8v2h2v16H0v4h28v-4h-2V10h2V8z" fill="${c}" stroke="white" stroke-width="1.2"/>
        <rect x="6" y="10" width="4" height="10" fill="white" opacity="0.7"/>
        <rect x="12" y="10" width="4" height="10" fill="white" opacity="0.7"/>
        <rect x="18" y="10" width="4" height="10" fill="white" opacity="0.7"/>
        <rect x="9" y="23" width="10" height="7" fill="white" opacity="0.8"/>
        <path d="M14 2 2 8h24z" fill="white" opacity="0.25"/>
        <circle cx="14" cy="34" r="4" fill="${c}" opacity="0.3"/>
      </svg>`;
    case 'University Branch':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 26 32">
        <path d="M13 0L1 7v2h2v14H1v4h24v-4h-2V9h2V7z" fill="${c}" stroke="white" stroke-width="1.2"/>
        <rect x="5" y="9" width="3" height="9" fill="white" opacity="0.65"/>
        <rect x="11" y="9" width="4" height="9" fill="white" opacity="0.65"/>
        <rect x="18" y="9" width="3" height="9" fill="white" opacity="0.65"/>
        <rect x="8" y="21" width="10" height="6" fill="white" opacity="0.75"/>
        <line x1="13" y1="0" x2="13" y2="4" stroke="white" stroke-width="2"/>
        <circle cx="13" cy="32" r="4" fill="${c}" opacity="0.3"/>
      </svg>`;
    case 'College':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 26 32">
        <rect x="1" y="8" width="24" height="18" rx="2" fill="${c}" stroke="white" stroke-width="1.2"/>
        <polygon points="13,0 0,7 26,7" fill="${c}" stroke="white" stroke-width="1.2"/>
        <rect x="4" y="11" width="5" height="7" fill="white" opacity="0.7"/>
        <rect x="17" y="11" width="5" height="7" fill="white" opacity="0.7"/>
        <rect x="9" y="17" width="8" height="9" fill="white" opacity="0.8"/>
        <circle cx="13" cy="32" r="4" fill="${c}" opacity="0.3"/>
      </svg>`;
    case 'Community College':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32">
        <rect x="0" y="10" width="28" height="16" rx="2" fill="${c}" stroke="white" stroke-width="1.2"/>
        <rect x="3" y="6" width="22" height="5" rx="1" fill="${c}" stroke="white" stroke-width="1"/>
        <rect x="6" y="3" width="16" height="4" rx="1" fill="${c}" stroke="white" stroke-width="1"/>
        <rect x="3" y="14" width="5" height="5" fill="white" opacity="0.7"/>
        <rect x="20" y="14" width="5" height="5" fill="white" opacity="0.7"/>
        <rect x="10" y="19" width="8" height="7" fill="white" opacity="0.8"/>
        <circle cx="14" cy="32" r="4" fill="${c}" opacity="0.3"/>
      </svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30"><circle cx="12" cy="12" r="10" fill="${c}" stroke="white" stroke-width="1.5"/><circle cx="12" cy="30" r="4" fill="${c}" opacity="0.3"/></svg>`;
  }
}

const iconCache = new Map<string, L.DivIcon>();

export function makeLeafletIcon(type: InstitutionType, control: Control): L.DivIcon {
  const key = `${type}|${control}`;
  const cached = iconCache.get(key);
  if (cached) return cached;
  const color = CONTROL_COLOR[control] || '#555';
  const icon = L.divIcon({
    html: makeIconSVG(type, color),
    className: '',
    iconSize: [28, 34],
    iconAnchor: [14, 34],
    popupAnchor: [0, -34],
  });
  iconCache.set(key, icon);
  return icon;
}
