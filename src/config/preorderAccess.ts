export type PreorderAudience = 'waitlist' | 'stay-close';

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '').toLowerCase() || '/';
}

export function isPreorderPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    path === '/special-preview' ||
    path === '/preorder' ||
    path === '/preorder/stay-close'
  );
}

export function preorderAudienceFromPath(pathname: string): PreorderAudience | null {
  const path = normalizePath(pathname);
  if (path === '/special-preview' || path === '/preorder') return 'waitlist';
  if (path === '/preorder/stay-close') return 'stay-close';
  return null;
}
