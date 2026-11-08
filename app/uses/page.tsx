import React from 'react';
import type { Metadata } from 'next';
import { LordIcon } from '@/components/ui/LordIcon';

export const metadata: Metadata = {
  title: 'Uses',
  description:
    'Hardware, software, terminal configuration, and development tools used by Ali Raza.',
};

export default function UsesPage() {
  const sections = [
    {
      title: 'Hardware',
      items: [
        {
          label: 'Primary Workstation',
          desc: 'Custom Linux workstation (AMD Ryzen 9 7900X, 64 GB DDR5 RAM, 2 TB NVMe SSD). Fast compilation times and plenty of memory for multi-node cluster testing.',
        },
        {
          label: 'Mobile Laptop',
          desc: 'ThinkPad X1 Carbon Gen 10 running Arch Linux (kernel 6.x) with Wayland and Sway.',
        },
        {
          label: 'Display',
          desc: 'Dell UltraSharp U2723QE 27-inch 4K IPS display connected via USB-C DP.',
        },
        {
          label: 'Keyboard & Mouse',
          desc: 'HHKB Professional Classic (45g Topre) + Logitech MX Master 3S.',
        },
      ],
    },
    {
      title: 'Editor & Terminal',
      items: [
        {
          label: 'Editor',
          desc: 'Neovim with Lua configuration (gopls, tsserver, treesitter, telescope).',
        },
        {
          label: 'Terminal',
          desc: 'Alacritty + tmux with vim-style pane navigation.',
        },
        {
          label: 'Shell',
          desc: 'Zsh with lightweight pure prompt.',
        },
        {
          label: 'Font',
          desc: 'JetBrains Mono, 14px.',
        },
      ],
    },
    {
      title: 'Toolchain & Infrastructure',
      items: [
        {
          label: 'Languages',
          desc: 'Go (1.23+), TypeScript, SQL, Bash.',
        },
        {
          label: 'Databases',
          desc: 'PostgreSQL 16, SQLite 3, Redis.',
        },
        {
          label: 'Web & Documentation',
          desc: 'Next.js, TypeScript, Tailwind CSS, structured Lexical content.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-10 max-w-content">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground inline-flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/gsqxdxog.json"
            trigger="hover"
            palette="gear"
            size={24}
          />
          <span>Uses</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted font-mono">
          Hardware, software, and development environment.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3.5">
            <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider">
              {section.title}
            </h2>
            <ul className="space-y-3.5 pl-5 list-disc text-base text-secondary">
              {section.items.map((item) => (
                <li key={item.label} className="leading-relaxed">
                  <strong className="text-foreground font-medium">{item.label}:</strong>{' '}
                  {item.desc}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
