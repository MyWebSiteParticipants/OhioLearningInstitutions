import { useState, type ReactNode } from 'react';

interface PanelProps {
  id: string;
  title: string;
  mobileOpen?: boolean;
  children: ReactNode;
}

export default function Panel({ id, title, mobileOpen, children }: PanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const classes = ['panel'];
  if (collapsed) classes.push('collapsed');
  if (mobileOpen) classes.push('mobile-open');

  return (
    <div className={classes.join(' ')} id={id}>
      <div className="panel-header" onClick={() => setCollapsed((c) => !c)}>
        <span>{title}</span>
        <span className="panel-toggle">&#9660;</span>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}
