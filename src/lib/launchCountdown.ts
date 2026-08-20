/** Shared Formless launch countdown config + tick helpers. */

export const LAUNCH_PROCESS_HREF = "/audio/process";

export const LAUNCH_COUNTDOWN = {
  iso: "2026-09-01T00:00:00-07:00",
  label: "Launch countdown",
  title: "September 1",
  note: "Kindle / Audible launch target. Preorder manuscript must be in more than 72 hours before this date.",
  showFit: true,
  reviewDaysMax: 7,
} as const;

export type LaunchCountdownTick = {
  days: number;
  hours: number;
  minutes: number;
  fitKind: "ok" | "tight" | "late" | null;
  fitMessage: string;
};

export function tickLaunchCountdown(
  now = Date.now(),
  config = LAUNCH_COUNTDOWN,
): LaunchCountdownTick {
  const target = new Date(config.iso).getTime();
  let diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  diff -= days * 86_400_000;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);

  if (!config.showFit) {
    return { days, hours, minutes, fitKind: null, fitMessage: "" };
  }

  if (days > config.reviewDaysMax) {
    return {
      days,
      hours,
      minutes,
      fitKind: "ok",
      fitMessage: `If you submit today, a ${config.reviewDaysMax}-day ACX review still fits before this date.`,
    };
  }
  if (days >= 2) {
    return {
      days,
      hours,
      minutes,
      fitKind: "tight",
      fitMessage: `Tight: ACX review is 2–${config.reviewDaysMax} business days. Submit immediately if this meeting depends on approval.`,
    };
  }
  return {
    days,
    hours,
    minutes,
    fitKind: "late",
    fitMessage:
      "Unlikely to clear ACX review before this date if you have not already submitted.",
  };
}
