import React from 'react';

export function TargetDart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12A10 10 0 1 1 12 2" />
      <path d="M16 12A4 4 0 1 1 12 8" />
      <path d="M12 12l8-8" />
      <path d="M14 4l6 6" />
      <path d="M20 4l-4 4" />
    </svg>
  );
}
