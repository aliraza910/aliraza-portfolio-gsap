import React from 'react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/payload/client';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = await getSiteSettings();
  const authorName = settings.authorName || 'Ali Raza';

  const socialLinks: Array<{ label: string; url: string }> = [];
  if (settings.github) socialLinks.push({ label: 'github', url: settings.github });
  if (settings.linkedin) socialLinks.push({ label: 'linkedin', url: settings.linkedin });
  if (settings.twitter) socialLinks.push({ label: 'x', url: settings.twitter });

  if (Array.isArray(settings.socialLinks)) {
    settings.socialLinks.forEach((item) => {
      if (item?.platform && item?.url) {
        const label = item.platform.toLowerCase();
        if (!socialLinks.some((l) => l.label === label)) {
          socialLinks.push({ label, url: item.url });
        }
      }
    });
  }

  if (socialLinks.length === 0) {
    socialLinks.push(
      { label: 'github', url: 'https://github.com/aliraza910' },
      { label: 'linkedin', url: 'https://linkedin.com/in/aliraza910' },
      { label: 'x', url: 'https://x.com/aliiraza' }
    );
  }

  return (
    <footer className="pt-12 pb-14 mt-20 border-t border-border text-sm text-muted space-y-6">
      {/* Remaining Pages Section Above Social Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/60">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          {/* Index & References */}
        </span>

        <div className="flex items-center gap-5 text-secondary text-sm flex-wrap font-mono">
          <Link href="/learning" className="hover:text-foreground no-underline">
            current learning
          </Link>
          <Link href="/uses" className="hover:text-foreground no-underline">
            uses
          </Link>
          <Link href="/sitemap" className="hover:text-foreground no-underline">
            sitemap
          </Link>
          <Link href="/feed.xml" className="hover:text-foreground no-underline">
            rss
          </Link>
        </div>
      </div>

      {/* Identity & Social Links */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-medium text-foreground">{authorName}</span> · <span>{currentYear}</span>
        </div>

        <div className="flex items-center gap-5 text-secondary flex-wrap">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground no-underline"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
