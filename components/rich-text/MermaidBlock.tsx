'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidBlockProps {
  diagram?: string;
  caption?: string;
}

let mermaidInitialized = false;

export function MermaidBlock({ diagram = '', caption }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!diagram) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function renderMermaid() {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import mermaid to keep initial bundle ultra small
        const mermaid = (await import('mermaid')).default;

        if (!mermaidInitialized) {
          const isDark = document.documentElement.classList.contains('dark');
          mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'neutral',
            securityLevel: 'loose',
            fontFamily: 'ui-monospace, SFMono-Regular, "JetBrains Mono", monospace',
          });
          mermaidInitialized = true;
        }

        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, diagram);

        if (isMounted) {
          setSvgHtml(svg);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          setError(err.message || 'Failed to render architecture diagram');
          setLoading(false);
        }
      }
    }

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [diagram]);

  if (!diagram) return null;

  return (
    <figure className="my-6 border border-border bg-background p-4 overflow-x-auto">
      {loading && (
        <div className="py-8 text-center font-mono text-xs text-muted-foreground animate-pulse">
          Rendering diagram...
        </div>
      )}

      {error && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground">
            [Diagram syntax preview]
          </div>
          <pre className="p-3 bg-muted/40 font-mono text-xs overflow-x-auto border border-border">
            {diagram}
          </pre>
        </div>
      )}

      {!loading && !error && svgHtml && (
        <div
          ref={containerRef}
          className="flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      )}

      {caption && (
        <figcaption className="mt-3 text-center text-xs font-mono text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

