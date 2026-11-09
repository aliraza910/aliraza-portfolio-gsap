import React from 'react';
import Link from 'next/link';
import { getLatestPosts, getProjects, getSiteSettings } from '@/lib/payload/client';
import { formatDate } from '@/components/blog/PostMeta';
import { LordIcon } from '@/components/ui/LordIcon';
import { ContactForm } from '@/components/ui/ContactForm';

export const revalidate = 30; // 30 seconds ISR (fast updates for newly published posts and projects)

export default async function HomePage() {
  const [latestPosts, featuredProjects, siteSettings] = await Promise.all([
    getLatestPosts(6),
    getProjects({ featured: true, limit: 4 }),
    getSiteSettings(),
  ]);

  const experiences = [
    {
      role: 'FullStack Developer ',
      company: 'Emenac Inc',
      period: 'May 2025 — Present',
      desc: 'Develop high-quality web applications using modern technologies and best practices. Working on concurrency using Golang to develop high available backend and infra',
    },
    {
      role: 'MERN Developer',
      company: 'Webbuggs',
      period: 'Jan 2024 - May 2025',
      desc: 'Learn to developer backend infrastrcuture, maintan and scalable API and database. Develop university of california enrollment system.',
    },
    {
      role: 'FrontEnd Developer',
      company: 'Pak Xolpria',
      period: 'Aug 2023 — Dec 2023',
      desc: "interactive and user-friendly web interfaces using modern frontend technologies.",
    },
    {
      role: 'FrontEnd Developer Intern',
      company: 'Pak Xolpria',
      period: 'March 2023 — June 2023',
      desc: "Learn the basics of web development. Deep dive into Javascript and React",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <section className="space-y-3.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {siteSettings.authorName || 'Ali Raza'}
        </h1>
        <p className="text-secondary text-base leading-relaxed">
          {siteSettings.authorBio ||
            'I am a backend and distributed systems engineer based in Lahore. I build network services, storage primitives, and backend platforms with a focus on simplicity, mechanical sympathy, and predictable latency.'}
        </p>
        <p className="text-secondary text-base leading-relaxed">
          This site is my personal engineering notebook and technical publishing archive,
          where I share research, notes, and post-mortems on distributed protocols, databases,
          and network systems.
        </p>
      </section>

      {/* Current Focus */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/xulqnnzg.json" // Database / storage
            trigger="hover"
            palette="colored"
            size={22}
          />
          <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
            Current Focus
          </h2>
        </div>
        <ul className="space-y-2 text-base text-secondary list-disc pl-5">
          <li>
            <strong className="text-foreground font-medium">Backend Engineering:</strong>{' '}
            Go, concurrent programming, distributed systems fundamentals, API architecture, and high-performance backend services.          </li>
          <li>
            <strong className="text-foreground font-medium">Infrastructure & Cloud:</strong>{' '}
            Linux internals, Docker, AWS, networking, CI/CD, and infrastructure automation.
          </li>
          <li>
            <strong className="text-foreground font-medium">Systems & Security:</strong>{' '}
            Database internals, observability, system reliability, cloud security, and performance optimization.
          </li>
        </ul>
      </section>

      {/* Selected Projects */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2.5">
            <LordIcon
              src="https://cdn.lordicon.com/qhgmphtg.json" // Code
              trigger="hover"
              palette="code"
              size={22}
            />
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
              Projects
            </h2>
          </div>
          <Link href="/projects" className="text-xs font-mono text-muted hover:text-foreground no-underline">
            all projects →
          </Link>
        </div>

        <div className="space-y-4">
          {featuredProjects.map((project) => (
            <div key={project.id || project.slug || project.name} className="space-y-1 border-b border-border/60 pb-3.5 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                <span className="font-semibold text-foreground text-base">
                  {project.name}
                </span>
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono text-muted flex-wrap">
                  <span>{project.stack}</span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-foreground inline-flex items-center gap-1"
                    >
                      <span>[code]</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-foreground inline-flex items-center gap-1"
                    >
                      <span>[live]</span>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2.5">
            <LordIcon
              src="https://cdn.lordicon.com/wxnxiano.json" // Document
              trigger="hover"
              palette="doc"
              size={22}
            />
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
              Writing
            </h2>
          </div>
          <Link href="/blog" className="text-xs font-mono text-muted hover:text-foreground no-underline">
            all writing →
          </Link>
        </div>

        {latestPosts && latestPosts.length > 0 ? (
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-border/50 pb-3 last:border-b-0"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-medium text-foreground hover:underline text-base"
                >
                  {post.title}
                </Link>
                <span className="text-xs font-mono text-muted shrink-0">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted font-mono">
            New articles and engineering breakdowns will appear here soon.
          </p>
        )}
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/bhfjfgqz.json" // User / experience
            trigger="hover"
            palette="user"
            size={22}
          />
          <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
            Experience
          </h2>
        </div>
        <div className="space-y-3.5">
          {experiences.map((exp, i) => (
            <div key={i} className="space-y-1 border-b border-border/50 pb-3 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                <span className="font-medium text-foreground text-base">
                  {exp.role} · {exp.company}
                </span>
                <span className="text-xs font-mono text-muted shrink-0">
                  {exp.period}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="space-y-4 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LordIcon
              src="https://cdn.lordicon.com/diihvcfp.json" // Mail / contact
              trigger="hover"
              palette="mail"
              size={24}
            />
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wider">
              Contact
            </h2>
          </div>
          <Link href="/contact" className="text-xs font-mono text-muted hover:text-foreground no-underline">
            open full page →
          </Link>
        </div>

        <div className="space-y-4 text-secondary">
          <p className="text-base">
            Feel free to reach out via{' '}
            <a
              href={`mailto:${siteSettings.authorEmail || 'prod.ali9100@gmail.com'}`}
              className="text-foreground underline underline-offset-4"
            >
              {siteSettings.authorEmail || 'prod.ali9100@gmail.com'}
            </a>{' '}
            or send a note directly below:
          </p>

          <div className="pt-2">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
