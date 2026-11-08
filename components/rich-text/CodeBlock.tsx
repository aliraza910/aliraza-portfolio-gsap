'use client';

import React, { useState, useEffect } from 'react';
import { LordIcon } from '@/components/ui/LordIcon';

interface CodeBlockProps {
  code?: string;
  language?: string;
  filename?: string;
  highlightLines?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code = '',
  language = 'text',
  filename,
  highlightLines,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const cleanLang = (language || 'text').toLowerCase();
  const displayLabel = filename || cleanLang;

  const highlightedLineSet = React.useMemo(() => {
    const set = new Set<number>();
    if (!highlightLines) return set;
    const parts = highlightLines.split(',').map((p) => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) set.add(i);
        }
      } else {
        const num = Number(part);
        if (!isNaN(num)) set.add(num);
      }
    }
    return set;
  }, [highlightLines]);

  useEffect(() => {
    let isMounted = true;

    async function highlight() {
      if (!code) return;
      try {
        const { codeToHtml } = await import('shiki');
        const isDark = document.documentElement.classList.contains('dark');
        const theme = isDark ? 'github-dark' : 'github-light';

        const html = await codeToHtml(code, {
          lang: cleanLang,
          theme,
        });

        if (isMounted) {
          setHighlightedHtml(html);
        }
      } catch (err) {
        if (isMounted) {
          setHighlightedHtml(null);
        }
      }
    }

    highlight();

    return () => {
      isMounted = false;
    };
  }, [code, cleanLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="my-5 border border-border bg-code-bg text-xs font-mono overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border text-secondary select-none text-[11px]">
        <div className="flex items-center gap-1.5">
          <LordIcon
            src="https://cdn.lordicon.com/qhgmphtg.json" // Code icon
            trigger="hover"
            size={13}
            className="opacity-70"
          />
          <span>{displayLabel}</span>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer text-[11px]"
        >
          <LordIcon
            src={
              copied
                ? 'https://cdn.lordicon.com/oqdmuxru.json' // Check
                : 'https://cdn.lordicon.com/depeqmsz.json' // Copy
            }
            trigger="hover"
            size={13}
          />
          <span>{copied ? 'copied' : 'copy'}</span>
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-3.5 leading-relaxed">
        {highlightedHtml ? (
          <div
            className="shiki-container [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&_code]:!font-mono text-xs"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlighted = highlightedLineSet.has(lineNum);
                return (
                  <tr
                    key={idx}
                    className={isHighlighted ? 'bg-muted/10' : ''}
                  >
                    {showLineNumbers && (
                      <td className="pr-4 select-none text-right text-muted/50 w-8 align-top">
                        {lineNum}
                      </td>
                    )}
                    <td className="whitespace-pre text-foreground font-mono">
                      {line || ' '}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
