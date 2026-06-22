export type InstitutionType =
  | 'University'
  | 'University Branch'
  | 'College'
  | 'Community College';

export type Control = 'Public' | 'Private';

export interface Institution {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: InstitutionType;
  control: Control;
  sector?: string;
  enrollment?: number;
  enrYear?: number;
  website?: string;
  cityWebsite?: string;
  parentUniversity?: string;
  tab: 'main' | 'branch';
  lat: number;
  lng: number;
}

export interface Filters {
  types: Set<InstitutionType>;
  controls: Set<Control>;
}

export const ALL_TYPES: InstitutionType[] = [
  'University',
  'University Branch',
  'College',
  'Community College',
];

export const ALL_CONTROLS: Control[] = ['Public', 'Private'];
