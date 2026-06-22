import type { Institution } from '../types';

const COLUMNS: { key: keyof Institution; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'control', label: 'Control' },
  { key: 'sector', label: 'Sector' },
  { key: 'enrollment', label: 'Enrollment' },
  { key: 'enrYear', label: 'Enrollment Year' },
  { key: 'parentUniversity', label: 'Parent University' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zip', label: 'ZIP' },
  { key: 'lat', label: 'Latitude' },
  { key: 'lng', label: 'Longitude' },
  { key: 'website', label: 'Website' },
];

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportInstitutionsCSV(rows: Institution[], filename = 'ohio-learning-institutions.csv') {
  const header = COLUMNS.map((c) => c.label).join(',');
  const body = rows
    .map((r) => COLUMNS.map((c) => escapeCell(r[c.key])).join(','))
    .join('\r\n');
  // UTF-8 BOM so Excel reads accented characters correctly
  const csv = '\uFEFF' + header + '\r\n' + body;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
