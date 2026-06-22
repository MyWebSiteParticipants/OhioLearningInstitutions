import raw from './institutions.json';
import type { Institution } from '../types';

export const institutions = raw as Institution[];

// Ohio bounding box for "fly back to state" behavior
export const OHIO_CENTER: [number, number] = [40.2, -82.6];
export const OHIO_BOUNDS: [[number, number], [number, number]] = [
  [38.3, -84.9],
  [42.1, -80.4],
];
