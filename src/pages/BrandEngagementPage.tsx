import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { BrandShell } from '@/components/app-sidebar';
import { BrandPageBody, BrandPageHeader } from '@/components/BrandPageHeader';
import { InquiriesDesk } from '@/components/InquiriesDesk';
import { SignupsDesk } from '@/components/SignupsDesk';
import {
  ENGAGEMENT_TABS,
  engagementTabFromSearch,
  setEngagementTabInUrl,
  type EngagementTab,
} from '@/lib/engagementDesk';

const TAB_LABELS: Record<EngagementTab, string> = {
  signups: 'Signups',
  inquiries: 'Inquiries',
};

export default function BrandEngagementPage() {
  const [tab, setTab] = useState<EngagementTab>(() =>
    engagementTabFromSearch(window.location.search),
  );
  const [actions, setActions] = useState<ReactNode>(null);

  const onActionsChange = useCallback((next: ReactNode) => {
    setActions(next);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setTab(engagementTabFromSearch(window.location.search));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function selectTab(next: EngagementTab) {
    setTab(next);
    setEngagementTabInUrl(next);
    setActions(null);
  }

  const title = TAB_LABELS[tab];

  return (
    <BrandShell activeId="engagement" crumb="Engagement">
      <BrandPageBody>
        <div className="flex flex-col gap-6 md:gap-8">
          <BrandPageHeader
            title={title}
            description="Signups and Sonika inquiries in one desk."
            tone="desk"
            actions={actions}
          />

          <div
            className="flex flex-wrap gap-1.5 border-b border-cream/10 pb-3"
            role="tablist"
            aria-label="Engagement sections"
          >
            {ENGAGEMENT_TABS.map((id) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTab(id)}
                  className={[
                    'h-10 rounded-full px-4 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                    active
                      ? 'bg-cream/12 text-cream'
                      : 'text-cream/45 hover:bg-cream/[0.06] hover:text-cream/75',
                  ].join(' ')}
                >
                  {TAB_LABELS[id]}
                </button>
              );
            })}
          </div>

          {tab === 'signups' ? (
            <SignupsDesk onActionsChange={onActionsChange} />
          ) : (
            <InquiriesDesk onActionsChange={onActionsChange} />
          )}
        </div>
      </BrandPageBody>
    </BrandShell>
  );
}
