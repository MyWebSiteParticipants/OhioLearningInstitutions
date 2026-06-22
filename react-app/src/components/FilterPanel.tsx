import Panel from './Panel';
import { ALL_TYPES, ALL_CONTROLS } from '../types';
import type { Filters, InstitutionType, Control } from '../types';

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  onExport: () => void;
  mobileOpen?: boolean;
}

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  onExport,
  mobileOpen,
}: FilterPanelProps) {
  function toggleType(t: InstitutionType) {
    const types = new Set(filters.types);
    types.has(t) ? types.delete(t) : types.add(t);
    onChange({ ...filters, types });
  }
  function toggleControl(c: Control) {
    const controls = new Set(filters.controls);
    controls.has(c) ? controls.delete(c) : controls.add(c);
    onChange({ ...filters, controls });
  }

  return (
    <Panel id="filter-panel" title="&#9881; FILTERS" mobileOpen={mobileOpen}>
      <div className="filter-group">
        <div className="filter-group-title">Institution Type</div>
        {ALL_TYPES.map((t) => (
          <label className="filter-item" key={t}>
            <input
              type="checkbox"
              checked={filters.types.has(t)}
              onChange={() => toggleType(t)}
            />
            {t}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <div className="filter-group-title">Control</div>
        {ALL_CONTROLS.map((c) => (
          <label className="filter-item" key={c}>
            <input
              type="checkbox"
              checked={filters.controls.has(c)}
              onChange={() => toggleControl(c)}
            />
            {c}
          </label>
        ))}
      </div>
      <button className="filter-btn" onClick={onReset}>
        Reset All
      </button>
      <button className="filter-btn secondary" onClick={onExport}>
        &#11015; Export CSV
      </button>
    </Panel>
  );
}
