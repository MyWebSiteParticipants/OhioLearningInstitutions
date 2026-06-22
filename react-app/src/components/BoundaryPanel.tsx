import Panel from './Panel';
import { BOUNDARY_LAYERS, type BoundaryLayerId } from '../data/boundaries';

interface BoundaryPanelProps {
  active: Set<BoundaryLayerId>;
  onToggle: (id: BoundaryLayerId) => void;
  onLocate: () => void;
  mobileOpen?: boolean;
}

export default function BoundaryPanel({
  active,
  onToggle,
  onLocate,
  mobileOpen,
}: BoundaryPanelProps) {
  return (
    <Panel id="boundary-panel" title="&#128506; LAYERS" mobileOpen={mobileOpen}>
      <div className="filter-group">
        <div className="filter-group-title">Boundary Overlays</div>
        {BOUNDARY_LAYERS.map((layer) => (
          <label className="filter-item" key={layer.id}>
            <input
              type="checkbox"
              checked={active.has(layer.id)}
              onChange={() => onToggle(layer.id)}
            />
            <span
              className="boundary-swatch"
              style={{ background: layer.color }}
            />
            {layer.label}
          </label>
        ))}
      </div>
      <button className="filter-btn" onClick={onLocate}>
        &#128205; Locate Me
      </button>
    </Panel>
  );
}
