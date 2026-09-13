import type { ReactNode } from 'react';

import type { ServiceMarkId } from '@/data/continuityAtlas';

/**
 * Monochrome service marks drawn on a 24×24 grid so a logo can stand in for a
 * service name anywhere in Continuity. Recognisable silhouettes, one ink.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const GLYPHS: Record<ServiceMarkId, ReactNode> = {
  'eyes-closed': (
    <>
      <path {...STROKE} d="M2.8 10.6c3.2 4.6 6.3 6.9 9.2 6.9s6-2.3 9.2-6.9" />
      <path {...STROKE} d="M4.6 15.1 3.1 17.8M9 17.1l-.7 3M15 17.1l.7 3M19.4 15.1l1.5 2.7" />
    </>
  ),
  website: (
    <>
      <rect {...STROKE} x="2.5" y="4.5" width="19" height="15" rx="1.6" />
      <path {...STROKE} d="M2.5 9h19" />
      <circle cx="5.6" cy="6.8" r="0.8" fill="currentColor" />
      <circle cx="8.2" cy="6.8" r="0.8" fill="currentColor" />
    </>
  ),
  domain: (
    <>
      <circle {...STROKE} cx="12" cy="12" r="9" />
      <path {...STROKE} d="M3 12h18M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9Z" />
    </>
  ),
  vercel: <path d="M12 3.2 22.6 20.8H1.4Z" fill="currentColor" />,
  github: (
    <path
      fill="currentColor"
      d="M12 1.2a10.8 10.8 0 0 0-3.4 21c.54.1.74-.23.74-.52v-2c-3 .65-3.64-1.45-3.64-1.45-.5-1.25-1.2-1.58-1.2-1.58-.98-.67.07-.66.07-.66 1.08.08 1.65 1.12 1.65 1.12.96 1.65 2.53 1.17 3.15.9.1-.7.38-1.17.68-1.44-2.4-.27-4.92-1.2-4.92-5.33 0-1.18.42-2.14 1.11-2.9-.11-.27-.48-1.37.1-2.85 0 0 .9-.3 2.97 1.1a10.3 10.3 0 0 1 5.42 0c2.06-1.4 2.97-1.1 2.97-1.1.58 1.48.21 2.58.1 2.85.7.76 1.11 1.72 1.11 2.9 0 4.14-2.53 5.05-4.94 5.32.39.34.73 1 .73 2.01v2.98c0 .29.2.63.75.52A10.8 10.8 0 0 0 12 1.2Z"
    />
  ),
  supabase: (
    <>
      <path fill="currentColor" d="M12.7 1.6 4 12.6c-.5.6-.05 1.5.72 1.5h6.06v7.9c0 .9 1.13 1.3 1.7.6l8.7-11c.5-.6.05-1.5-.72-1.5h-6.06V2.2c0-.9-1.13-1.3-1.7-.6Z" />
    </>
  ),
  amazon: (
    <>
      <path {...STROKE} d="M2.6 16.4c3.4 2.3 7.4 3.4 11.2 3.4 2.6 0 5.3-.5 7.8-1.7" />
      <path {...STROKE} d="M19.1 20.6c1.9-1.6 2.6-3.5 2.2-3.9-.35-.35-1.6-.3-2.9.1" />
      <path {...STROKE} d="M7.6 4.4c1.8-1 4.6-1.1 5.8.4.8 1 .7 2.4.7 3.7v3c0 .9.3 1.4.6 1.9" />
    </>
  ),
  kindle: (
    <>
      <rect {...STROKE} x="5" y="2.5" width="14" height="19" rx="2" />
      <path {...STROKE} d="M8.5 7h7M8.5 10.5h7M8.5 14h4.5" />
    </>
  ),
  audible: (
    <>
      <path {...STROKE} d="M3.2 13.4a9 9 0 0 1 17.6 0" />
      <path {...STROKE} d="M6.4 16.6 12 13l5.6 3.6" />
      <path {...STROKE} d="M2.4 18.6 12 24.4" opacity="0" />
    </>
  ),
  'google-drive': (
    <path
      fill="currentColor"
      d="M12 10.2v3.5h4.9a4.4 4.4 0 0 1-1.85 2.85l2.95 2.3c1.75-1.6 2.75-4 2.75-6.85 0-.66-.06-1.3-.17-1.9Zm-8.6 1.85a8.6 8.6 0 0 1 13.2-7.3l-2.6 2.55A5 5 0 0 0 7.1 10.1a5 5 0 0 0 6.9 6.05l2.85 2.25A8.6 8.6 0 0 1 3.4 12.05Z"
    />
  ),
  onepassword: (
    <>
      <circle {...STROKE} cx="12" cy="12" r="9.2" />
      <path {...STROKE} d="M10.6 9.3 12.6 8.2v7.8" />
    </>
  ),
  zoho: (
    <>
      <rect {...STROKE} x="2.5" y="5" width="19" height="14" rx="1.8" />
      <path {...STROKE} d="m3.4 6.6 8.6 6.2 8.6-6.2" />
      <path {...STROKE} d="M6.8 16.2h4" />
    </>
  ),
  instagram: (
    <>
      <rect {...STROKE} x="3" y="3" width="18" height="18" rx="5" />
      <circle {...STROKE} cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.9" r="1.1" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect {...STROKE} x="3" y="3" width="18" height="18" rx="2.4" />
      <path {...STROKE} d="M7.4 10.4V17M7.4 7.3v.1M11.4 17v-3.6c0-1.6 1-2.6 2.4-2.6s2.4 1 2.4 2.6V17" />
    </>
  ),
  posthog: (
    <>
      <rect {...STROKE} x="3" y="3" width="18" height="18" rx="3" />
      <path {...STROKE} d="M7.6 16.6v-3.4M12 16.6V9.4M16.4 16.6V11.8" />
    </>
  ),
  canva: (
    <>
      <circle {...STROKE} cx="12" cy="12" r="9.2" />
      <path {...STROKE} d="M15 9.6a3.4 3.4 0 0 0-4.9.5c-1.5 1.8-1.4 4.3.2 5.1 1.2.6 2.6 0 3.4-1" />
    </>
  ),
  email: (
    <>
      <rect {...STROKE} x="2.5" y="5" width="19" height="14" rx="1.8" />
      <path {...STROKE} d="m3.4 6.6 8.6 6.2 8.6-6.2" />
    </>
  ),
  formless: (
    <>
      <path {...STROKE} d="M12 6.4c-2-1.6-4.3-2.2-7.2-2.2v13.6c2.9 0 5.2.6 7.2 2.2 2-1.6 4.3-2.2 7.2-2.2V4.2c-2.9 0-5.2.6-7.2 2.2Z" />
      <path {...STROKE} d="M12 6.4V20" />
    </>
  ),
  assets: (
    <>
      <path {...STROKE} d="m12 2.8 9 4.6-9 4.6-9-4.6z" />
      <path {...STROKE} d="m3 12.4 9 4.6 9-4.6M3 16.9l9 4.6 9-4.6" />
    </>
  ),
  accounts: (
    <>
      <circle {...STROKE} cx="8.4" cy="12" r="4.2" />
      <path {...STROKE} d="M12.6 12H21M18.2 12v3.2M15.4 12v2.2" />
    </>
  ),
  payments: (
    <>
      <rect {...STROKE} x="2.5" y="5.2" width="19" height="13.6" rx="2" />
      <path {...STROKE} d="M2.5 9.8h19M6 14.8h3.4" />
    </>
  ),
  people: (
    <>
      <circle {...STROKE} cx="9.2" cy="8.4" r="3.4" />
      <path {...STROKE} d="M3.2 19.4c0-3.1 2.7-5.2 6-5.2s6 2.1 6 5.2" />
      <path {...STROKE} d="M16.2 5.6a3.4 3.4 0 0 1 0 6.6M17.6 14.6c2.1.6 3.6 2.4 3.6 4.8" />
    </>
  ),
  social: (
    <>
      <circle {...STROKE} cx="12" cy="12" r="2.6" />
      <path {...STROKE} d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4M4.8 4.8a10.2 10.2 0 0 0 0 14.4M19.2 19.2a10.2 10.2 0 0 0 0-14.4" />
    </>
  ),
  publishing: (
    <>
      <path {...STROKE} d="M4.2 5.2h6.2a2 2 0 0 1 2 2v12a2.4 2.4 0 0 0-2.2-1.4H4.2Z" />
      <path {...STROKE} d="M19.8 5.2h-5.2a2 2 0 0 0-2 2v12a2.4 2.4 0 0 1 2.2-1.4h5Z" />
      <path {...STROKE} d="M16 9h2.2M16 12h2.2" />
    </>
  ),
};

type ServiceMarkProps = {
  id: ServiceMarkId;
  className?: string;
  title?: string;
};

export function ServiceMark({ id, className = 'size-5', title }: ServiceMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {GLYPHS[id]}
    </svg>
  );
}
