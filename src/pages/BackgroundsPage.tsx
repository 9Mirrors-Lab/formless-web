import { useCallback, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { ShaderHero } from '@/components/ShaderHero';
import { CurtainReveal } from '@/components/CurtainReveal';
import { BackgroundSelectionProvider } from '@/components/shader/BackgroundSelectionContext';
import {
  DEFAULT_BACKGROUND_ID,
  parseBackgroundId,
  type BackgroundId,
} from '@/components/shader/backgroundOptions';

function readBackgroundFromUrl(): BackgroundId {
  if (typeof window === 'undefined') {
    return DEFAULT_BACKGROUND_ID;
  }
  const params = new URLSearchParams(window.location.search);
  return parseBackgroundId(params.get('bg'));
}

function writeBackgroundToUrl(id: BackgroundId) {
  const url = new URL(window.location.href);
  if (id === DEFAULT_BACKGROUND_ID) {
    url.searchParams.delete('bg');
  } else {
    url.searchParams.set('bg', id);
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function BackgroundsPage() {
  const [backgroundId, setBackgroundId] = useState<BackgroundId>(() => readBackgroundFromUrl());

  const handleBackgroundChange = useCallback((id: BackgroundId) => {
    setBackgroundId(id);
    writeBackgroundToUrl(id);
  }, []);

  return (
    <BackgroundSelectionProvider value={backgroundId} onChange={handleBackgroundChange}>
      <PageLayout>
        <ShaderHero theme={backgroundId} />
        <div id="reflection">
          <CurtainReveal />
        </div>
      </PageLayout>
    </BackgroundSelectionProvider>
  );
}
