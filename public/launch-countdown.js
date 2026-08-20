/** Shared launch countdown tick — keep in sync with src/lib/launchCountdown.ts */
window.LAUNCH_COUNTDOWN = {
  iso: "2026-09-01T00:00:00-07:00",
  label: "Launch countdown",
  title: "September 1",
  note: "Kindle / Audible launch target. Preorder manuscript must be in more than 72 hours before this date.",
  showFit: true,
  reviewDaysMax: 7,
};

window.tickLaunchCountdown = function tickLaunchCountdown(now) {
  const config = window.LAUNCH_COUNTDOWN;
  const target = new Date(config.iso).getTime();
  let diff = Math.max(0, target - (now || Date.now()));
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);

  let fitKind = null;
  let fitMessage = "";
  if (config.showFit) {
    if (days > config.reviewDaysMax) {
      fitKind = "ok";
      fitMessage =
        "If you submit today, a " +
        config.reviewDaysMax +
        "-day ACX review still fits before this date.";
    } else if (days >= 2) {
      fitKind = "tight";
      fitMessage =
        "Tight: ACX review is 2–" +
        config.reviewDaysMax +
        " business days. Submit immediately if this meeting depends on approval.";
    } else {
      fitKind = "late";
      fitMessage =
        "Unlikely to clear ACX review before this date if you have not already submitted.";
    }
  }

  return { days: days, hours: hours, minutes: minutes, fitKind: fitKind, fitMessage: fitMessage };
};

window.mountLaunchCountdown = function mountLaunchCountdown(root) {
  if (!root) return;

  function paint() {
    const config = window.LAUNCH_COUNTDOWN;
    const tick = window.tickLaunchCountdown();
    root.hidden = false;
    const label = root.querySelector(".cd-label");
    const title = root.querySelector(".cd-title");
    const note = root.querySelector(".cd-note");
    const d = root.querySelector(".cd-unit .num");
    const units = root.querySelectorAll(".cd-unit .num");
    const fit = root.querySelector(".cd-fit");
    if (label) label.textContent = config.label;
    if (title) title.textContent = config.title;
    if (note) note.textContent = config.note;
    if (units[0]) units[0].textContent = String(tick.days);
    if (units[1]) units[1].textContent = String(tick.hours);
    if (units[2]) units[2].textContent = String(tick.minutes);
    if (fit) {
      if (tick.fitKind) {
        fit.hidden = false;
        fit.classList.remove("ok", "tight", "late");
        fit.classList.add(tick.fitKind);
        fit.textContent = tick.fitMessage;
      } else {
        fit.hidden = true;
      }
    }
  }

  paint();
  setInterval(paint, 30000);
};
