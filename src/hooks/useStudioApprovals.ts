import { useCallback, useState } from 'react';

const STORAGE_KEY = 'formless.editorial2.approvedChapters';

function readApprovedIds(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((value): value is number => Number.isInteger(value)),
    );
  } catch {
    return new Set();
  }
}

function writeApprovedIds(ids: Set<number>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useStudioApprovals() {
  const [approvedIds, setApprovedIds] = useState<Set<number>>(readApprovedIds);

  const approve = useCallback((chapterId: number) => {
    setApprovedIds((current) => {
      const next = new Set(current);
      next.add(chapterId);
      writeApprovedIds(next);
      return next;
    });
  }, []);

  const revoke = useCallback((chapterId: number) => {
    setApprovedIds((current) => {
      const next = new Set(current);
      next.delete(chapterId);
      writeApprovedIds(next);
      return next;
    });
  }, []);

  return { approvedIds, approve, revoke };
}
