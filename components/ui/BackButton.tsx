'use client';

import React from 'react';

export function BackButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-secondary hover:text-foreground underline underline-offset-4 cursor-pointer"
    >
      ← previous page
    </button>
  );
}

