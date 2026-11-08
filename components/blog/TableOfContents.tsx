'use client';

import React, { useEffect, useState } from 'react';
import { LexicalRootNode } from '@/lib/payload/types';
import { slugify } from '../rich-text/RichText';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content?: LexicalRootNode;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!content?.root?.children) return;

    const items: TocItem[] = [];

    function extractText(node: any): string {
      if (node.type === 'text') return node.text || '';
      if (node.children) return node.children.map(extractText).join('');
      return '';
    }

    content.root.children.forEach((child: any) => {
      if (child.type === 'heading') {
        const text = extractText(child);
        const tag = child.tag || 'h2';
        const level = parseInt(tag.replace('h', ''), 10) || 2;
        if (text.trim() && (level === 2 || level === 3)) {
          items.push({
            id: slugify(text),
            text: text.trim(),
            level,
          });
        }
      }
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="my-6 p-4 border border-border text-xs">
      <div className="font-semibold text-foreground mb-2">
        Contents
      </div>
      <ul className="space-y-1 list-none pl-0">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={`${heading.level === 3 ? 'pl-3' : 'pl-0'}`}
            >
              <a
                href={`#${heading.id}`}
                className={`no-underline block truncate transition-colors ${
                  isActive
                    ? 'text-foreground font-semibold underline underline-offset-2'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
