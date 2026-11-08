import React from 'react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/ui/ContactForm';
import { LordIcon } from '@/components/ui/LordIcon';
import { getSiteSettings } from '@/lib/payload/client';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ali Raza regarding backend engineering, distributed systems, or technical inquiries.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.authorEmail || 'prod.ali9100@gmail.com';
  const github = settings.github || 'https://github.com/aliraza910';
  const linkedin = settings.linkedin || 'https://linkedin.com/in/aliraza910';
  const twitter = settings.twitter;

  return (
    <div className="space-y-8 max-w-content">
      <header className="space-y-2 border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <LordIcon
            src="https://cdn.lordicon.com/diihvcfp.json" // Mail
            trigger="hover"
            palette="mail"
            size={24}
          />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Contact
          </h1>
        </div>
        <p className="text-secondary text-base leading-relaxed">
          I am always interested in discussing distributed systems, database internals, and systems engineering.
          Send a note using the form below or reach out directly.
        </p>
      </header>

      {/* Direct Contact Information */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Direct Channels
        </h2>
        <div className="text-sm space-y-2 font-mono text-secondary">
          <div>
            <span className="text-muted w-24 inline-block">email:</span>
            <a href={`mailto:${email}`} className="text-foreground underline">
              {email}
            </a>
          </div>
          {github && (
            <div>
              <span className="text-muted w-24 inline-block">github:</span>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline"
              >
                {github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
          {linkedin && (
            <div>
              <span className="text-muted w-24 inline-block">linkedin:</span>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline"
              >
                {linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
          {twitter && (
            <div>
              <span className="text-muted w-24 inline-block">x / twitter:</span>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline"
              >
                {twitter.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Send a Message
          </h2>
          <p className="text-sm text-secondary">
            Send a direct note. I read all inquiries and try to respond within a couple of days.
          </p>
        </div>

        <ContactForm />
      </section>
    </div>
  );
}

