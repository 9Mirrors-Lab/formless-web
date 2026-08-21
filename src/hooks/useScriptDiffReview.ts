import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  persistScriptDiffReview,
  syncScriptDiffReviews,
} from '@/lib/scriptDiffReviewApi';
import {
  readReviewStore,
  upsertReviewStatus,
  writeReviewStore,
  type DiffReviewStatus,
  type DiffReviewStore,
} from '@/lib/scriptDiffReview';

export function useScriptDiffReview() {
  const { user } = useAuth();
  const [store, setStore] = useState<DiffReviewStore>(readReviewStore);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const merged = await syncScriptDiffReviews(user?.id);
      if (!cancelled) setStore(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const setStatus = useCallback(
    (input: {
      chapterId: number;
      model: string;
      fingerprint: string;
      status: DiffReviewStatus | null;
    }) => {
      setStore((current) => {
        const next = upsertReviewStatus(current, input);
        writeReviewStore(next);
        return next;
      });
      void persistScriptDiffReview({
        ...input,
        userId: user?.id,
      });
    },
    [user?.id],
  );

  return { store, setStatus };
}
