'use client';

import React, { useState } from 'react';
import { LordIcon } from './LordIcon';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl text-sm">
      {status === 'success' && (
        <div className="p-4 border border-border bg-code-bg font-mono text-xs text-foreground space-y-1">
          <div className="font-semibold text-foreground flex items-center gap-2">
            <LordIcon
              src="https://cdn.lordicon.com/lupuorrc.json" // Checkmark
              trigger="hover"
              palette="success"
              size={18}
            />
            <span>Message sent</span>
          </div>
          <p className="text-secondary">
            Thank you for reaching out. I have received your note and will reply to you soon.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-3 border border-red-500/50 bg-red-500/10 font-mono text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-secondary">
            Name <span className="text-foreground">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 text-base sm:text-sm bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-colors font-sans text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-secondary">
            Email <span className="text-foreground">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="w-full px-3 py-2 text-base sm:text-sm bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-colors font-sans text-foreground"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-secondary">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Consensus protocols / technical collaboration"
          className="w-full px-3 py-2 text-base sm:text-sm bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-colors font-sans text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-secondary">
          Message <span className="text-foreground">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your note or question here..."
          className="w-full px-3 py-2 text-base sm:text-sm bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-colors font-sans resize-y text-foreground"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto justify-center group inline-flex items-center gap-2.5 px-5 py-2.5 border border-foreground/70 hover:border-foreground bg-foreground/5 hover:bg-foreground/10 text-foreground font-mono text-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <LordIcon
            src="https://cdn.lordicon.com/diihvcfp.json" // Mail send
            trigger="hover"
            palette="mail"
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
          />
          <span className="font-medium">
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </span>
        </button>
      </div>
    </form>
  );
}
