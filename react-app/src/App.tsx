import { useMemo, useState } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import TotalsPanel from './components/TotalsPanel';
import Legend from './components/Legend';
import DetailModal from './components/DetailModal';
import MapView from './components/MapView';
import ListView from './components/ListView';
import { institutions } from './data';
import { exportInstitutionsCSV } from './utils/csv';
import { ALL_TYPES, ALL_CONTROLS } from './types';
import type { Filters, Institution } from './types';

function defaultFilters(): Filters {
  return {
    types: new Set(ALL_TYPES),
    controls: new Set(ALL_CONTROLS),
  };
}

type View = 'map' | 'list';

export default function App() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [view, setView] = useState<View>('map');
  const [selected, setSelected] = useState<Institution | null>(null);
  const [highlighted, setHighlighted] = useState<Institution | null>(null);
  const [flyTarget, setFlyTarget] = useState<Institution | null>(null);
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      institutions.filter(
        (i) => filters.types.has(i.type) && filters.controls.has(i.control)
      ),
    [filters]
  );

  function handleGoToMap(inst: Institution) {
    setSelected(null);
    setView('map');
    setHighlighted(inst);
    // Re-fly each time by passing a fresh reference
    setFlyTarget({ ...inst });
  }

  function toggleMobilePanel(id: string) {
    setMobilePanel((cur) => (cur === id ? null : id));
  }

  return (
    <>
      <Header onToggleMobileMenu={() => toggleMobilePanel('filter-panel')} />

      <div id="top-controls">
        <button
          className={`ctrl-chip ${view === 'map' ? 'active' : ''}`}
          onClick={() => setView('map')}
        >
          &#128506; Map
        </button>
        <button
          className={`ctrl-chip ${view === 'list' ? 'active' : ''}`}
          onClick={() => setView('list')}
        >
          &#9776; List
        </button>
      </div>

      {view === 'map' ? (
        <MapView
          institutions={visible}
          highlighted={highlighted}
          flyTarget={flyTarget}
          onMarkerClick={setSelected}
        />
      ) : (
        <ListView institutions={visible} onSelect={setSelected} />
      )}

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters())}
        onExport={() => exportInstitutionsCSV(visible)}
        mobileOpen={mobilePanel === 'filter-panel'}
      />
      <TotalsPanel visible={visible} mobileOpen={mobilePanel === 'totals-panel'} />
      <Legend mobileOpen={mobilePanel === 'legend'} />

      <DetailModal
        institution={selected}
        onClose={() => setSelected(null)}
        onGoToMap={handleGoToMap}
      />
    </>
  );
}
