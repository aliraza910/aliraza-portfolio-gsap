'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme/ThemeToggle';
import { LordIcon, LordIconPalette } from '@/components/ui/LordIcon';

export function Header() {
  const pathname = usePathname();

  const navItems: Array<{
    label: string;
    href: string;
    icon: string;
    palette: LordIconPalette;
  }> = [
    {
      label: 'about',
      href: '/about',
      icon: 'https://cdn.lordicon.com/bhfjfgqz.json', // User
      palette: 'user',
    },
    {
      label: 'projects',
      href: '/projects',
      icon: 'https://cdn.lordicon.com/qhgmphtg.json', // Code
      palette: 'code',
    },
    {
      label: 'blogs',
      href: '/blog',
      icon: 'https://cdn.lordicon.com/wxnxiano.json', // Document
      palette: 'doc',
    },
    {
      label: 'contact',
      href: '/contact',
      icon: 'https://cdn.lordicon.com/diihvcfp.json', // Mail / contact
      palette: 'mail',
    },
    {
      label: 'search',
      href: '/search',
      icon: 'https://cdn.lordicon.com/fkdjnafc.json', // Search
      palette: 'search',
    },
  ];

  return (
    <header className="pt-6 sm:pt-8 pb-5 sm:pb-7 border-b border-border mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-foreground hover:text-foreground no-underline text-xl tracking-tight inline-flex items-center gap-2.5 group"
          >
            <LordIcon
              src="https://cdn.lordicon.com/qhgmphtg.json"
              trigger="hover"
              palette="code"
              size={24}
              className="text-foreground"
            />
            <span>Ali Raza</span>
          </Link>
          <div className="sm:hidden flex items-center">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex items-center gap-x-4 gap-y-2 text-sm font-medium text-secondary flex-wrap">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`no-underline inline-flex items-center gap-1.5 py-0.5 transition-colors group ${
                  isActive
                    ? 'text-foreground font-semibold underline underline-offset-4 decoration-foreground'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                <LordIcon
                  src={item.icon}
                  trigger="hover"
                  palette={item.palette}
                  size={18}
                  className="opacity-85 group-hover:opacity-100 transition-opacity"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <span className="text-border select-none hidden sm:inline">/</span>
          <div className="hidden sm:inline-flex items-center">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
