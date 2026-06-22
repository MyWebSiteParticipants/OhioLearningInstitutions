import { useMemo, useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import TotalsPanel from './components/TotalsPanel';
import Legend from './components/Legend';
import DetailModal from './components/DetailModal';
import MapView, { type UserLocation } from './components/MapView';
import ListView from './components/ListView';
import { institutions } from './data';
import { exportInstitutionsCSV } from './utils/csv';
import { findJurisdiction } from './utils/geo';
import { loadBoundary, BOUNDARY_LAYERS } from './data/boundaries';
import { ALL_TYPES, ALL_CONTROLS } from './types';
import type { Filters, Institution } from './types';
import type { BoundaryLayerId } from './data/boundaries';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Institution | null>(null);
  const [highlighted, setHighlighted] = useState<Institution | null>(null);
  const [flyTarget, setFlyTarget] = useState<Institution | null>(null);
  const [activeBoundaries, setActiveBoundaries] = useState<Set<BoundaryLayerId>>(
    () => new Set(BOUNDARY_LAYERS.map((l) => l.id))
  );
  const [locateRequest, setLocateRequest] = useState(0);
  const [autoLocate, setAutoLocate] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Mobile is treated as <=760px (matches the CSS breakpoint); used to start
  // the Legend/Totals panels collapsed on small screens.
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 760px)').matches;

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
    setFlyTarget({ ...inst });
  }

  function toggleBoundary(id: BoundaryLayerId) {
    setActiveBoundaries((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Auto-prompt for location once on first load.
  useEffect(() => {
    setLocateRequest((n) => n + 1);
  }, []);

  function handleLocate() {
    setView('map');
    setMenuOpen(false);
    setAutoLocate(false);
    setToast('Locating\u2026');
    setLocateRequest((n) => n + 1);
  }

  const handleLocated = useCallback((loc: UserLocation) => {
    setAutoLocate(false);
    if (!loc.inArea) {
      setToast('You appear to be outside Ohio \u2014 showing the whole state.');
      window.setTimeout(() => setToast(null), 4000);
      return;
    }
    loadBoundary('counties')
      .then((counties) => {
        const county = findJurisdiction(loc.lat, loc.lng, counties);
        setToast(county ? `You are here \u2014 ${county.name} County.` : 'You are here.');
      })
      .catch(() => setToast('You are here.'))
      .finally(() => window.setTimeout(() => setToast(null), 4000));
  }, []);

  const handleLocateError = useCallback(
    (message: string) => {
      // Don't nag with an error toast on the silent auto-prompt (e.g. denied).
      if (autoLocate) {
        setAutoLocate(false);
        return;
      }
      setToast(message);
      window.setTimeout(() => setToast(null), 4000);
    },
    [autoLocate]
  );

  return (
    <>
      <Header
        onToggleMenu={() => setMenuOpen((o) => !o)}
        menuOpen={menuOpen}
      />

      <MainMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        view={view}
        onViewChange={(v) => {
          setView(v);
          setMenuOpen(false);
        }}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={() => setFilters(defaultFilters())}
        onExport={() => exportInstitutionsCSV(visible)}
        activeBoundaries={activeBoundaries}
        onToggleBoundary={toggleBoundary}
        onLocate={handleLocate}
      />

      {view === 'map' ? (
        <MapView
          institutions={visible}
          highlighted={highlighted}
          flyTarget={flyTarget}
          activeBoundaries={activeBoundaries}
          locateRequest={locateRequest}
          onMarkerClick={setSelected}
          onLocated={handleLocated}
          onLocateError={handleLocateError}
        />
      ) : (
        <ListView institutions={visible} onSelect={setSelected} />
      )}

      {view === 'map' && (
        <div id="right-rail">
          <Legend defaultCollapsed={isMobile} />
          <TotalsPanel visible={visible} defaultCollapsed={isMobile} />
        </div>
      )}

      {toast && <div id="toast">{toast}</div>}

      <DetailModal
        institution={selected}
        onClose={() => setSelected(null)}
        onGoToMap={handleGoToMap}
      />
    </>
  );
}
