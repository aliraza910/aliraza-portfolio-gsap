import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathBlockProps {
  expression?: string;
  displayMode?: boolean;
}

export function MathBlock({ expression = '', displayMode = true }: MathBlockProps) {
  if (!expression) return null;

  try {
    const html = katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
    });

    if (displayMode) {
      return (
        <div
          className="my-5 overflow-x-auto py-2 text-center text-foreground font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <span
        className="inline-block px-1 font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    return (
      <pre className="my-3 font-mono text-xs text-muted-foreground p-2 border border-border">
        {expression}
      </pre>
    );
  }
}

