import { useMemo, useState } from 'react';
import type { Institution } from '../types';
import { TYPE_BADGE_COLOR, CONTROL_COLOR } from '../utils/icons';

interface ListViewProps {
  institutions: Institution[];
  onSelect: (inst: Institution) => void;
}

export default function ListView({ institutions, onSelect }: ListViewProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? institutions.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.city.toLowerCase().includes(q)
        )
      : institutions;
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }, [institutions, query]);

  return (
    <div id="list-view">
      <div className="list-toolbar">
        <input
          className="list-search"
          placeholder="Search by name or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="list-count">{filtered.length} shown</span>
      </div>
      {filtered.map((inst) => (
        <div
          className="inst-card"
          key={inst.name}
          style={{ borderLeftColor: CONTROL_COLOR[inst.control] }}
          onClick={() => onSelect(inst)}
        >
          <h3>{inst.name}</h3>
          <div className="meta-line">
            {inst.city}, {inst.state} {inst.zip}
            {inst.enrollment ? ` \u2022 ${inst.enrollment.toLocaleString()} students` : ''}
          </div>
          <div className="badges">
            <span className="badge" style={{ background: TYPE_BADGE_COLOR[inst.type] }}>
              {inst.type}
            </span>
            <span className="badge" style={{ background: CONTROL_COLOR[inst.control] }}>
              {inst.control}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
