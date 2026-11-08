import React from 'react';

interface DetailsBlockProps {
  summary?: string;
  body?: string;
  children?: React.ReactNode;
}

export function DetailsBlock({
  summary = 'Details',
  body,
  children,
}: DetailsBlockProps) {
  return (
    <details className="my-5 border border-border p-3.5 bg-muted/20 text-sm group">
      <summary className="cursor-pointer font-mono font-medium text-foreground hover:text-foreground/80 select-none">
        {summary}
      </summary>
      <div className="mt-3 pt-3 border-t border-border text-muted-foreground leading-relaxed">
        {body && <p className="mb-2">{body}</p>}
        {children}
      </div>
    </details>
  );
}

