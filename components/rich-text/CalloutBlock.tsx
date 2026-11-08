import React from 'react';

interface CalloutBlockProps {
  calloutType?: 'info' | 'warning' | 'important' | 'danger' | 'tip' | 'note';
  title?: string;
  content?: string;
  children?: React.ReactNode;
}

export function CalloutBlock({
  calloutType = 'note',
  title,
  content,
  children,
}: CalloutBlockProps) {
  const typeLabels: Record<string, string> = {
    note: 'Note',
    info: 'Info',
    tip: 'Tip',
    warning: 'Warning',
    important: 'Important',
    danger: 'Caution',
  };

  const label = typeLabels[calloutType] || 'Note';

  return (
    <aside
      className="my-5 border-l-2 border-foreground/60 bg-muted/5 pl-4 pr-3 py-2.5 text-sm"
      role="note"
    >
      <div className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">
        {title || label}
      </div>
      <div className="text-secondary text-xs leading-relaxed [&>p]:my-1">
        {content && <p>{content}</p>}
        {children}
      </div>
    </aside>
  );
}
