import { ContinuityV2 } from '@/components/continuity-v2/ContinuityV2';
import { CONTINUITY_V2_META } from '@/data/continuityAtlas';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ContinuityV2Page() {
  usePageMeta({
    title: CONTINUITY_V2_META.title,
    description: CONTINUITY_V2_META.description,
  });

  return <ContinuityV2 />;
}
