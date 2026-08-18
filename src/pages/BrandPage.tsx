import { useEffect, useMemo, useState } from "react";

import { BrandAudienceCharts } from "@/components/BrandAudienceCharts";
import { BrandShell } from "@/components/app-sidebar";
import { ShaderBackdrop } from "@/components/shader/ShaderBackdrop";
import { RECORD_SESSION_LIST } from "@/data/audioRecordSessions";
import {
  studioBookProgress,
  studioCatalogForTracks,
} from "@/data/audiobookStudioCatalog";
import { collectBrandNeeds } from "@/lib/brandNeeds";
import { useStudioApprovals } from "@/hooks/useStudioApprovals";
import { audiblePulse, signupPulse, type PulseLoad } from "@/lib/brandPulse";
import {
  listPublishedAudiobookTracks,
  type AudiobookTrack,
} from "@/lib/audiobookTracks";
import {
  emptySignupSummary,
  fetchSiteSignups,
  summarizeSignups,
  type SiteSignup,
} from "@/lib/siteSignups";

const MATERIALS = [
  {
    href: "/brand-kit-export",
    title: "Logos",
    detail: "Marks, publishing lockup, and QR.",
  },
  {
    href: "/zoom-backgrounds",
    title: "Zoom backgrounds",
    detail: "Plates for sessions and interviews.",
  },
  {
    href: "/speaker-sheet",
    title: "Speaker sheets",
    detail: "Venue one-sheets, ready to send.",
  },
] as const;

export default function BrandPage() {
  const { approvedIds } = useStudioApprovals();
  const [signupState, setSignupState] = useState<PulseLoad>("loading");
  const [signupRows, setSignupRows] = useState<SiteSignup[]>([]);
  const [tracks, setTracks] = useState<AudiobookTrack[]>([]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [signups, catalog] = await Promise.all([
        fetchSiteSignups(),
        listPublishedAudiobookTracks(),
      ]);
      if (cancelled) return;

      if (signups.ok) {
        setSignupRows(signups.rows);
        setSignupState("ready");
      } else {
        setSignupRows([]);
        setSignupState("error");
      }

      setTracks(catalog.ok ? catalog.tracks : []);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signupSummary = useMemo(
    () =>
      signupState === "ready"
        ? summarizeSignups(signupRows)
        : emptySignupSummary(),
    [signupRows, signupState],
  );

  const records = studioCatalogForTracks(tracks, approvedIds);
  const audience = signupPulse(signupState, signupSummary, signupRows[0] ?? null);
  const production = audiblePulse(
    studioBookProgress(records),
    RECORD_SESSION_LIST.length,
  );
  const needs = collectBrandNeeds(RECORD_SESSION_LIST, records);

  return (
    <BrandShell activeId="brand" crumb="Overview" noise={false}>
      <div className="relative min-h-[calc(100dvh-2.5rem)] overflow-hidden">
        <ShaderBackdrop theme="forest" position="absolute" overlay={false} />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#080a09e6_0%,#080a09a3_36%,#080a0900_74%),linear-gradient(to_bottom,#080a09d4_0%,#080a0970_32%,#080a0900_58%)]"
          aria-hidden
        />

        <article className="relative z-10 flex min-h-[calc(100dvh-2.5rem)] flex-col justify-start px-5 pb-10 pt-7 md:px-12 md:pt-9 md:pb-14 lg:max-w-[40rem] lg:px-14">
          <h1 className="sr-only">Brand Toolkit</h1>

          <div className="max-w-[34rem]">
            <a
              href={audience.href}
              className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
            >
              <p className="font-serif text-[1.85rem] font-light italic leading-[1.08] tracking-[-0.02em] text-cream transition-colors group-hover:text-cream/90 sm:text-[2.15rem] md:text-[2.45rem]">
                {audience.headline}
              </p>
              {audience.detail ? (
                <p className="mt-3 max-w-[42ch] text-[0.8125rem] leading-relaxed text-cream/55 md:text-sm">
                  {audience.detail}
                </p>
              ) : null}
            </a>

            <BrandAudienceCharts
              state={signupState}
              rows={signupRows}
              summary={signupSummary}
            />
          </div>

          <section className="mt-10 max-w-[34rem]" aria-labelledby="brand-needs-heading">
            <h2
              id="brand-needs-heading"
              className="font-serif text-[2.5rem] font-light italic leading-[1.08] tracking-[-0.02em] text-cream"
            >
              What Ryan Needs
            </h2>
            <span className="mt-3 block h-[2px] w-[5.3rem] bg-clay opacity-90" aria-hidden />
            {needs.length === 0 ? (
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-cream/55 md:text-sm">
                Nothing is waiting.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-cream/10 border-y border-cream/12">
                {needs.map((need) => (
                  <li key={need.id}>
                    <a
                      href={need.href}
                      className="group flex min-h-11 items-baseline justify-between gap-6 py-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
                    >
                      <span className="min-w-0 text-[13px] leading-snug tracking-wide text-cream/[0.92] transition-colors group-hover:text-cream">
                        {need.sentence}
                      </span>
                      <span className="shrink-0 text-[11px] leading-snug text-cream/55">
                        {need.door}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <a
            href={production.href}
            className="group mt-8 block max-w-[34rem] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
          >
            <p className="font-serif text-[1.45rem] font-light italic leading-[1.12] tracking-[-0.02em] text-cream/92 transition-colors group-hover:text-cream sm:text-[1.7rem]">
              {production.headline}
            </p>
            <p className="mt-2.5 max-w-[46ch] text-[0.8125rem] leading-relaxed text-cream/55 md:text-sm">
              {production.detail}
            </p>
          </a>

          <ul className="mt-14 max-w-[34rem] divide-y divide-cream/10 border-t border-cream/12">
            {MATERIALS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex min-h-11 items-baseline justify-between gap-6 py-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
                >
                  <span className="text-[13px] tracking-wide text-cream/80 transition-colors group-hover:text-cream">
                    {item.title}
                  </span>
                  <span className="max-w-[22ch] text-right text-[11px] leading-snug text-cream/55">
                    {item.detail}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </BrandShell>
  );
}
