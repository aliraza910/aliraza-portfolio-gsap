import React from 'react';
import Link from 'next/link';
import { BackButton } from '@/components/ui/BackButton';

export default function NotFound() {
  return (
    <div className="py-16 sm:py-32 max-w-md mx-auto text-center space-y-4 px-4">
      <h1 className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-foreground">
        404
      </h1>
      <p className="text-base text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="pt-4 flex items-center justify-center gap-5 text-sm font-mono">
        <BackButton />
        <span className="text-border">·</span>
        <Link
          href="/"
          className="text-secondary hover:text-foreground underline underline-offset-4"
        >
          home page →
        </Link>
      </div>
    </div>
  );
}
