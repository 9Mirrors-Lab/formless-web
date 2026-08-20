import { useEffect, useState } from "react";

import {
  LAUNCH_COUNTDOWN,
  LAUNCH_PROCESS_HREF,
  tickLaunchCountdown,
  type LaunchCountdownTick,
} from "@/lib/launchCountdown";

const STYLE_ID = "launch-countdown-css";

/**
 * Same markup + CSS as audible-process countdown (public/launch-countdown.css).
 * No iframe.
 */
export function LaunchCountdownLink() {
  const [tick, setTick] = useState<LaunchCountdownTick>(() =>
    tickLaunchCountdown(),
  );

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const link = document.createElement("link");
      link.id = STYLE_ID;
      link.rel = "stylesheet";
      link.href = "/launch-countdown.css";
      document.head.appendChild(link);
    }

    const run = () => setTick(tickLaunchCountdown());
    run();
    const id = window.setInterval(run, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const fitClass =
    tick.fitKind === "ok"
      ? "ok"
      : tick.fitKind === "tight"
        ? "tight"
        : tick.fitKind === "late"
          ? "late"
          : "";

  return (
    <a
      href={LAUNCH_PROCESS_HREF}
      className="launch-countdown-root mb-2 block w-full max-w-[1080px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9fb5aa]"
      aria-label="Launch countdown. Open Audible process."
    >
      <section className="countdown" aria-live="polite">
        <div>
          <div className="cd-label">{LAUNCH_COUNTDOWN.label}</div>
          <div className="cd-title">{LAUNCH_COUNTDOWN.title}</div>
          <p className="cd-note">{LAUNCH_COUNTDOWN.note}</p>
        </div>
        <div className="cd-digits" aria-hidden="true">
          <div className="cd-unit">
            <div className="num">{tick.days}</div>
            <div className="u">Days</div>
          </div>
          <div className="cd-unit">
            <div className="num">{tick.hours}</div>
            <div className="u">Hrs</div>
          </div>
          <div className="cd-unit">
            <div className="num">{tick.minutes}</div>
            <div className="u">Min</div>
          </div>
        </div>
        {tick.fitKind ? (
          <p className={`cd-fit ${fitClass}`}>{tick.fitMessage}</p>
        ) : null}
      </section>
    </a>
  );
}
