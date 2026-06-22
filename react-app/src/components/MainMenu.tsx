import { useState, useEffect, useRef } from 'react';
import { ALL_TYPES, ALL_CONTROLS } from '../types';
import type { Filters, InstitutionType, Control } from '../types';
import { BOUNDARY_LAYERS, type BoundaryLayerId } from '../data/boundaries';

type View = 'map' | 'list';
type SectionId = 'views' | 'filters' | 'layers';

interface MainMenuProps {
  open: boolean;
  onClose: () => void;
  view: View;
  onViewChange: (v: View) => void;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  onResetFilters: () => void;
  onExport: () => void;
  activeBoundaries: Set<BoundaryLayerId>;
  onToggleBoundary: (id: BoundaryLayerId) => void;
  onLocate: () => void;
}

export default function MainMenu({
  open,
  onClose,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  onResetFilters,
  onExport,
  activeBoundaries,
  onToggleBoundary,
  onLocate,
}: MainMenuProps) {
  // Which accordion sections are expanded. Views open by default.
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set(['views']));
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape and on outside click.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, onClose]);

  function toggleSection(id: SectionId) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleType(t: InstitutionType) {
    const types = new Set(filters.types);
    types.has(t) ? types.delete(t) : types.add(t);
    onFiltersChange({ ...filters, types });
  }
  function toggleControl(c: Control) {
    const controls = new Set(filters.controls);
    controls.has(c) ? controls.delete(c) : controls.add(c);
    onFiltersChange({ ...filters, controls });
  }

  if (!open) return null;

  const sec = (id: SectionId, label: string) => (
    <button
      className={`accordion-head ${expanded.has(id) ? 'open' : ''}`}
      onClick={() => toggleSection(id)}
      aria-expanded={expanded.has(id)}
    >
      <span>{label}</span>
      <span className="accordion-chevron">&#9656;</span>
    </button>
  );

  return (
    <div id="main-menu" ref={menuRef} role="menu">
      {/* ── VIEWS ── */}
      {sec('views', 'Views')}
      {expanded.has('views') && (
        <div className="accordion-body">
          <button
            className={`menu-option ${view === 'map' ? 'selected' : ''}`}
            onClick={() => onViewChange('map')}
          >
            &#128506;&nbsp; Map
          </button>
          <button
            className={`menu-option ${view === 'list' ? 'selected' : ''}`}
            onClick={() => onViewChange('list')}
          >
            &#9776;&nbsp; List
          </button>
        </div>
      )}

      {/* ── FILTERS ── */}
      {sec('filters', 'Filters')}
      {expanded.has('filters') && (
        <div className="accordion-body">
          <div className="menu-group-title">Institution Type</div>
          {ALL_TYPES.map((t) => (
            <label className="menu-check" key={t}>
              <input
                type="checkbox"
                checked={filters.types.has(t)}
                onChange={() => toggleType(t)}
              />
              {t}
            </label>
          ))}
          <div className="menu-group-title">Control</div>
          {ALL_CONTROLS.map((c) => (
            <label className="menu-check" key={c}>
              <input
                type="checkbox"
                checked={filters.controls.has(c)}
                onChange={() => toggleControl(c)}
              />
              {c}
            </label>
          ))}
          <button className="menu-btn" onClick={onResetFilters}>
            Reset All
          </button>
          <button className="menu-btn secondary" onClick={onExport}>
            &#11015; Export CSV
          </button>
        </div>
      )}

      {/* ── LAYERS ── */}
      {sec('layers', 'Layers')}
      {expanded.has('layers') && (
        <div className="accordion-body">
          <div className="menu-group-title">Boundary Overlays</div>
          {BOUNDARY_LAYERS.map((layer) => (
            <label className="menu-check" key={layer.id}>
              <input
                type="checkbox"
                checked={activeBoundaries.has(layer.id)}
                onChange={() => onToggleBoundary(layer.id)}
              />
              <span className="boundary-swatch" style={{ background: layer.color }} />
              {layer.label}
            </label>
          ))}
          <button className="menu-btn" onClick={onLocate}>
            &#128205; Locate Me
          </button>
        </div>
      )}
    </div>
  );
}
