'use client';

import React, { useEffect, useState } from 'react';
import { LordIcon } from '@/components/ui/LordIcon';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <span className="w-5 h-5 inline-block opacity-0" aria-hidden="true" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="p-1.5 rounded inline-flex items-center justify-center text-secondary hover:text-foreground transition-colors cursor-pointer min-w-[32px] min-h-[32px]"
    >
      <LordIcon
        src={
          theme === 'light'
            ? 'https://cdn.lordicon.com/yxyampao.json' // Moon
            : 'https://cdn.lordicon.com/tqywkdcz.json' // Sun
        }
        trigger="hover"
        palette="gear"
        size={18}
        fallback={<span className="text-xs">◐</span>}
      />
    </button>
  );
}
