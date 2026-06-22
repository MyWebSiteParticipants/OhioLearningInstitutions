import Panel from './Panel';
import { ALL_TYPES } from '../types';
import { makeIconSVG, CONTROL_COLOR } from '../utils/icons';

interface LegendProps {
  defaultCollapsed?: boolean;
}

export default function Legend({ defaultCollapsed }: LegendProps) {
  return (
    <Panel id="legend" title="&#128506; LEGEND" defaultCollapsed={defaultCollapsed}>
      <div className="legend-section">
        <div className="legend-section-title">Institution Type</div>
        {ALL_TYPES.map((t) => (
          <div className="legend-item" key={t}>
            <div
              className="legend-icon"
              dangerouslySetInnerHTML={{ __html: makeIconSVG(t, '#888') }}
            />
            <span>{t}</span>
          </div>
        ))}
      </div>
      <div className="legend-section">
        <div className="legend-section-title">Control</div>
        <div className="legend-item">
          <div className="color-swatch" style={{ background: CONTROL_COLOR.Public }} />
          <span>Public</span>
        </div>
        <div className="legend-item">
          <div className="color-swatch" style={{ background: CONTROL_COLOR.Private }} />
          <span>Private</span>
        </div>
      </div>
      <div className="legend-section" style={{ marginBottom: 0 }}>
        <div className="legend-section-title">Click any marker for details</div>
      </div>
    </Panel>
  );
}
