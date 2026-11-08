'use client';

import React, { useEffect, useState, useRef } from 'react';

export type LordIconPalette =
  | 'default'
  | 'colored'
  | 'code'
  | 'doc'
  | 'search'
  | 'mail'
  | 'gear'
  | 'user'
  | 'warning'
  | 'success'
  | 'mono';

interface LordIconProps {
  src: string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang' | 'in';
  size?: number;
  className?: string;
  colors?: string;
  palette?: LordIconPalette;
  target?: string;
  fallback?: React.ReactNode;
}

const PALETTES: Record<LordIconPalette, { light: string; dark: string }> = {
  default: {
    light: 'primary:#2563eb,secondary:#059669', // Rich royal blue + emerald
    dark: 'primary:#60a5fa,secondary:#34d399',  // Vibrant sky blue + bright mint
  },
  colored: {
    light: 'primary:#0284c7,secondary:#10b981', // Cyan + bright green
    dark: 'primary:#38bdf8,secondary:#4ade80',  // Radiant cyan + light emerald
  },
  code: {
    light: 'primary:#7c3aed,secondary:#0284c7', // Indigo + sky blue
    dark: 'primary:#a78bfa,secondary:#38bdf8',  // Purple + cyan
  },
  doc: {
    light: 'primary:#0284c7,secondary:#f59e0b', // Sky blue + amber
    dark: 'primary:#38bdf8,secondary:#fbbf24',  // Cyan + warm amber
  },
  search: {
    light: 'primary:#2563eb,secondary:#8b5cf6', // Sapphire blue + purple
    dark: 'primary:#60a5fa,secondary:#c084fc',  // Bright blue + lilac
  },
  mail: {
    light: 'primary:#059669,secondary:#0284c7', // Emerald + cyan
    dark: 'primary:#34d399,secondary:#38bdf8',  // Mint + sky blue
  },
  gear: {
    light: 'primary:#d97706,secondary:#0284c7', // Amber + sky blue
    dark: 'primary:#fbbf24,secondary:#38bdf8',  // Bright amber + cyan
  },
  user: {
    light: 'primary:#2563eb,secondary:#7c3aed', // Royal blue + violet
    dark: 'primary:#60a5fa,secondary:#a78bfa',  // Sky blue + lavender
  },
  warning: {
    light: 'primary:#e11d48,secondary:#f59e0b', // Crimson rose + amber
    dark: 'primary:#fb7185,secondary:#fbbf24',  // Coral pink + gold
  },
  success: {
    light: 'primary:#059669,secondary:#10b981', // Forest + emerald
    dark: 'primary:#34d399,secondary:#6ee7b7',  // Mint + pastel green
  },
  mono: {
    light: 'primary:#18181b,secondary:#52525b', // Charcoal + slate
    dark: 'primary:#f4f4f5,secondary:#a1a1aa',  // Bright white-silver + muted silver
  },
};

export function LordIcon({
  src,
  trigger = 'hover',
  size = 22,
  className = '',
  colors,
  palette = 'colored',
  target,
  fallback,
}: LordIconProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLElement | null>(null);

  // Monitor dark mode changes dynamically via MutationObserver
  useEffect(() => {
    setMounted(true);

    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Connect hover animation to parent element (e.g. parent button, link, or text wrapper)
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Find closest parent clickable or container (a, button, label, .group, etc.)
    const parent =
      containerRef.current.closest('button, a, [data-lord-hover], .group, li') ||
      containerRef.current.parentElement;

    if (!parent) return;

    const handleParentHover = () => {
      const el = iconRef.current || (containerRef.current?.querySelector('lord-icon') as any);
      if (el) {
        try {
          if (typeof el.play === 'function') {
            el.play();
          } else if (typeof el.trigger === 'function') {
            el.trigger(trigger || 'hover');
          } else {
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          }
        } catch (e) {
          // ignore
        }
      }
    };

    parent.addEventListener('mouseenter', handleParentHover);

    return () => {
      parent.removeEventListener('mouseenter', handleParentHover);
    };
  }, [mounted, trigger]);

  // Compute final colors: custom string > selected palette (light/dark adaptive)
  const computedColors =
    colors ||
    (isDark ? PALETTES[palette].dark : PALETTES[palette].light);

  if (!mounted) {
    return (
      <span
        ref={containerRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
      >
        {fallback || null}
      </span>
    );
  }

  // Create <lord-icon> custom web component with React.createElement
  const element = React.createElement('lord-icon', {
    ref: iconRef,
    src,
    trigger,
    target: target || 'a, button, [data-lord-hover], .group',
    colors: computedColors,
    style: { width: `${size}px`, height: `${size}px` },
  });

  return (
    <span
      ref={containerRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`inline-flex items-center justify-center shrink-0 leading-none ${className}`}
    >
      {element}
    </span>
  );
}
