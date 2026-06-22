import { useMemo } from 'react';
import Panel from './Panel';
import { ALL_TYPES } from '../types';
import type { Institution } from '../types';

interface TotalsPanelProps {
  visible: Institution[];
  mobileOpen?: boolean;
}

export default function TotalsPanel({ visible, mobileOpen }: TotalsPanelProps) {
  const { byType, publicCount, privateCount, enrollment } = useMemo(() => {
    const byType: Record<string, number> = {};
    let publicCount = 0;
    let privateCount = 0;
    let enrollment = 0;
    for (const d of visible) {
      byType[d.type] = (byType[d.type] || 0) + 1;
      if (d.control === 'Public') publicCount++;
      else privateCount++;
      enrollment += d.enrollment || 0;
    }
    return { byType, publicCount, privateCount, enrollment };
  }, [visible]);

  return (
    <Panel id="totals-panel" title="&#128202; TOTALS" mobileOpen={mobileOpen}>
      {ALL_TYPES.filter((t) => byType[t]).map((t) => (
        <div className="total-item" key={t}>
          <span className="total-label">{t}</span>
          <span className="total-val">{byType[t]}</span>
        </div>
      ))}
      <div className="total-item">
        <span className="total-label">Public</span>
        <span className="total-val">{publicCount}</span>
      </div>
      <div className="total-item">
        <span className="total-label">Private</span>
        <span className="total-val">{privateCount}</span>
      </div>
      <div className="total-item" style={{ borderTop: '2px solid #ddd', marginTop: 4 }}>
        <span className="total-label">Enrollment</span>
        <span className="total-val">{enrollment.toLocaleString()}</span>
      </div>
      <div className="total-item">
        <span className="total-label">Shown</span>
        <span className="total-val">{visible.length}</span>
      </div>
    </Panel>
  );
}
