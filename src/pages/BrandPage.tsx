import { useEffect, useMemo, useState } from "react";

import { BrandAmazonPreorders } from "@/components/BrandAmazonPreorders";
import { BrandAmazonRankings } from "@/components/BrandAmazonRankings";
import { BrandAudienceCharts } from "@/components/BrandAudienceCharts";
import { BrandShell } from "@/components/app-sidebar";
import { ShaderBackdrop } from "@/components/shader/ShaderBackdrop";
import { signupPulse, type PulseLoad } from "@/lib/brandPulse";
import {
  emptySignupSummary,
  fetchSiteSignups,
  summarizeSignups,
  type SiteSignup,
} from "@/lib/siteSignups";

const MATERIALS = [
  {
    href: "/brand/schedule",
    title: "Schedule",
    detail: "Who does what, when, on which channel.",
  },
  {
    href: "/brand/book-launch-campaign",
    title: "Book launch campaign",
    detail: "Runway into September 1, then ninety days of teaching.",
  },
  {
    href: "/brand/endorsements",
    title: "Endorsements",
    detail: "Quote cuts for cover, Amazon, and press.",
  },
  {
    href: "/brand/designs",
    title: "Designs",
    detail: "Live pages, what they are for, and the files they rest on.",
  },
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
  const [signupState, setSignupState] = useState<PulseLoad>("loading");
  const [signupRows, setSignupRows] = useState<SiteSignup[]>([]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const signups = await fetchSiteSignups();
      if (cancelled) return;

      if (signups.ok) {
        setSignupRows(signups.rows);
        setSignupState("ready");
      } else {
        setSignupRows([]);
        setSignupState("error");
      }
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

  const audience = signupPulse(signupState, signupSummary, signupRows[0] ?? null);

  return (
    <BrandShell activeId="brand" crumb="Overview" noise={false}>
      <div className="relative min-h-[calc(100dvh-2.5rem)] overflow-hidden">
        <ShaderBackdrop theme="forest" position="absolute" overlay={false} />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#080a09e6_0%,#080a09a3_36%,#080a0900_74%),linear-gradient(to_bottom,#080a09d4_0%,#080a0970_32%,#080a0900_58%)]"
          aria-hidden
        />

        <article className="relative z-10 flex min-h-[calc(100dvh-2.5rem)] flex-col justify-start px-5 pb-10 pt-7 md:px-12 md:pb-14 md:pt-9 lg:max-w-[72rem] lg:px-14">
          <h1 className="sr-only">Brand Toolkit</h1>

          <div className="flex flex-col gap-10 lg:gap-12">
            <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
              <div className="max-w-[34rem]">
                <BrandAmazonPreorders />
              </div>
              <div className="max-w-[34rem]">
                <BrandAmazonRankings />
              </div>
            </div>

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
          </div>

          <ul className="mt-14 max-w-[42rem] divide-y divide-cream/10 border-t border-cream/12">
            {MATERIALS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex min-h-11 items-baseline justify-between gap-6 py-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
                >
                  <span className="text-[13px] tracking-wide text-cream/80 transition-colors group-hover:text-cream">
                    {item.title}
                  </span>
                  <span className="max-w-[32ch] text-right text-[11px] leading-snug text-cream/55">
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
