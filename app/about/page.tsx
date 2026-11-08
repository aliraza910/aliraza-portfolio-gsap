import React from 'react';
import type { Metadata } from 'next';
import { LordIcon } from '@/components/ui/LordIcon';
import { getSiteSettings } from '@/lib/payload/client';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const authorName = settings.authorName || 'Ali Raza';
  return {
    title: 'About',
    description: `Background, engineering philosophy, and technical focus of ${authorName}.`,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const authorName = settings.authorName || 'Ali Raza';

  return (
    <article className="space-y-10 max-w-content">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground inline-flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/bhfjfgqz.json"
            trigger="hover"
            palette="user"
            size={24}
          />
          <span>About</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted font-mono">
          Background, technical principles, and engineering philosophy of {authorName}.
        </p>
      </header>

      {/* Background */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider">
          Background
        </h2>
        <div className="text-base leading-relaxed text-secondary space-y-3.5">
          <p>
            I am a backend and distributed systems engineer based in Lahore. Over
            the past several years, I have worked on high-throughput backend services,
            distributed storage layers, network proxies, and real-time data pipelines.
          </p>
          <p>
            My work primarily centers around Go, TypeScript, PostgreSQL, and Linux
            internals. I prefer systems with well-defined state boundaries, explicit error
            handling, and minimal runtime magic.
          </p>
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider">
          Engineering Philosophy
        </h2>
        <div className="text-base leading-relaxed text-secondary space-y-4">
          <div className="border-l-2 border-border pl-4 py-0.5">
            <h3 className="font-medium text-foreground text-base">
              1. Mechanical Sympathy
            </h3>
            <p className="text-sm text-secondary mt-1">
              Understanding the hardware underneath the runtime—cache lines, syscall
              overheads, context switches, network buffers, and disk I/O patterns—matters
              more than chasing framework abstractions.
            </p>
          </div>

          <div className="border-l-2 border-border pl-4 py-0.5">
            <h3 className="font-medium text-foreground text-base">
              2. Simplicity Over Novelty
            </h3>
            <p className="text-sm text-secondary mt-1">
              The best architecture is the simplest one that solves the real operational
              problem. Every line of added abstraction is liability, latency, and cognitive
              load during a production incident.
            </p>
          </div>

          <div className="border-l-2 border-border pl-4 py-0.5">
            <h3 className="font-medium text-foreground text-base">
              3. Explicit Over Implicit
            </h3>
            <p className="text-sm text-secondary mt-1">
              Data flow should be inspectable from reading the source code without relying
              on invisible dependency injection containers or runtime monkey-patching.
            </p>
          </div>

          <div className="border-l-2 border-border pl-4 py-0.5">
            <h3 className="font-medium text-foreground text-base">
              4. Reliable Technical Documentation
            </h3>
            <p className="text-sm text-secondary mt-1">
              Clear technical writing is an engineering tool, not marketing. If a protocol
              or schema cannot be explained cleanly in text, the design is probably flawed.
            </p>
          </div>
        </div>
      </section>

      {/* Current Learning Objectives */}
      <section className="space-y-3.5">
        <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider">
          Current Learning Objectives
        </h2>
        <ul className="text-base space-y-2.5 list-disc pl-5 text-secondary">
          <li>
            Deepening understanding of Linux <code className="font-mono text-sm bg-muted/10 border border-border px-1.5 py-0.5">io_uring</code> asynchronous I/O and kernel-space zero-copy primitives.
          </li>
          <li>
            Implementing an LSM-tree (Log-Structured Merge-tree) storage engine from scratch in Go to study write amplification.
          </li>
          <li>
            Authoring comprehensive deep-dive guides for this blog on database isolation levels and anomaly prevention.
          </li>
        </ul>
      </section>
    </article>
  );
}
