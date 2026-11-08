import React from 'react';
import type { Metadata } from 'next';
import { LordIcon } from '@/components/ui/LordIcon';
import { getProjects, getProjectHighlights, getProxiedMediaUrl } from '@/lib/payload/client';

export const revalidate = 30; // 30s ISR for fast dynamic updates

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected backend, systems engineering, and open-source projects by Ali Raza.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-10 max-w-content">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground inline-flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/qhgmphtg.json"
            trigger="hover"
            palette="code"
            size={24}
          />
          <span>Projects</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted font-mono">
          Systems software, network utilities, distributed engines, and backend services.
        </p>
      </header>

      <div className="space-y-8">
        {projects.map((project) => {
          const highlights = getProjectHighlights(project);
          const coverImageUrl =
            project.coverImage && typeof project.coverImage === 'object' && 'url' in project.coverImage
              ? getProxiedMediaUrl(project.coverImage.url)
              : null;

          return (
            <article
              key={project.id || project.slug || project.name}
              className="space-y-3 border-b border-border/60 pb-7 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    {project.name}
                  </h2>
                  {project.category && (
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-muted/10 text-muted border border-border/40">
                      {project.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono text-muted flex-wrap">
                  <span>{project.stack}</span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-foreground underline transition-colors"
                    >
                      [source]
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-foreground underline transition-colors"
                    >
                      [live]
                    </a>
                  )}
                </div>
              </div>

              {coverImageUrl && (
                <div className="my-3 overflow-hidden rounded-md border border-border max-w-lg">
                  <img
                    src={coverImageUrl}
                    alt={project.name}
                    className="w-full h-auto object-cover max-h-64"
                    loading="lazy"
                  />
                </div>
              )}

              <p className="text-base text-secondary leading-relaxed">
                {project.description}
              </p>

              {highlights.length > 0 && (
                <ul className="text-sm sm:text-[15px] text-secondary pl-5 list-disc space-y-1.5 pt-1">
                  {highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
