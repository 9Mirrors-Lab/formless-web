import { describe, expect, it } from "vitest";

import {
  SCHEDULE_CHANNELS,
  SCHEDULE_DESK_PATH,
  SCHEDULE_LISTS,
  SCHEDULE_OWNERS,
  SCHEDULE_PHASES,
  SCHEDULE_WORK,
  currentPhaseId,
  filterScheduleWork,
  findScheduleWork,
  itemsForOwner,
  itemsForPhase,
  listsFor,
  scheduleDeskHref,
  scheduleFiltersFromSearch,
  statusLabel,
  summarizeSchedule,
  workInCell,
  workInChannelCell,
  workInListCell,
  workTouchesChannel,
  workTouchesList,
} from "@/data/launchCommsSchedule";

describe("launchCommsSchedule", () => {
  it("keeps Instagram, email, and LinkedIn as channels, and waitlist as lists", () => {
    expect(SCHEDULE_CHANNELS.map((channel) => channel.id)).toEqual([
      "email",
      "linkedin",
      "instagram",
    ]);
    expect(SCHEDULE_LISTS.map((list) => list.id)).toEqual([
      "waitlist",
      "stay-close",
      "advance",
    ]);
  });

  it("places every activity on a known date, owner, and channel or surface", () => {
    const phaseIds = new Set(SCHEDULE_PHASES.map((phase) => phase.id));
    const ownerIds = new Set(SCHEDULE_OWNERS.map((owner) => owner.id));
    const channelIds = new Set(SCHEDULE_CHANNELS.map((channel) => channel.id));
    const listIds = new Set(SCHEDULE_LISTS.map((list) => list.id));

    expect(SCHEDULE_WORK).toHaveLength(17);
    for (const item of SCHEDULE_WORK) {
      expect(phaseIds.has(item.phase)).toBe(true);
      expect(ownerIds.has(item.owner)).toBe(true);
      if (item.channel) expect(channelIds.has(item.channel)).toBe(true);
      else expect(item.surface).toBeTruthy();
      for (const list of listsFor(item)) {
        expect(listIds.has(list)).toBe(true);
      }
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.when.length).toBeGreaterThan(0);
    }
  });

  it("keeps people work in date cells and email work on lists, not as channels", () => {
    expect(itemsForPhase("day").map((item) => item.id)).toEqual([
      "site-flip",
      "launch-email",
      "launch-li",
      "advance-listen",
    ]);
    expect(workInCell(SCHEDULE_WORK, "soni", "day").map((item) => item.id)).toEqual([
      "launch-li",
    ]);
    expect(
      workInChannelCell(SCHEDULE_WORK, "email", "day").map((item) => item.id),
    ).toEqual(["launch-email", "advance-listen"]);
    expect(
      workInListCell(SCHEDULE_WORK, "waitlist", "day").map((item) => item.id),
    ).toEqual(["launch-email"]);
    expect(workTouchesList(findScheduleWork("launch-email")!, "stay-close")).toBe(
      true,
    );
    expect(workTouchesChannel(findScheduleWork("launch-email")!, "email")).toBe(
      true,
    );
  });

  it("filters by person and window without dropping the rest of the runway data", () => {
    expect(itemsForOwner("ops").every((item) => item.owner === "ops")).toBe(true);
    expect(filterScheduleWork({ who: "copy", window: "now", phase: "all" }).map((item) => item.id)).toEqual(
      ["voice", "listing", "book-page", "waitlist-almost"],
    );
    expect(
      filterScheduleWork({ who: "all", window: "after", phase: "settle" }).map(
        (item) => item.id,
      ),
    ).toEqual(["thanks", "reviews"]);
  });

  it("marks Aug 21 as lock and Sep 1 as launch day", () => {
    expect(currentPhaseId(new Date("2026-08-21T12:00:00-07:00"))).toBe("lock");
    expect(currentPhaseId(new Date("2026-09-01T08:00:00-07:00"))).toBe("day");
    expect(currentPhaseId(new Date("2026-09-10T08:00:00-07:00"))).toBe("teach");
    expect(currentPhaseId(new Date("2026-08-01T08:00:00-07:00"))).toBeNull();
  });

  it("summarizes who still needs a decision this week", () => {
    const summary = summarizeSchedule();
    expect(summary.total).toBe(17);
    expect(summary.blocked).toBe(2);
    expect(summary.next).toBe(6);
    expect(summary.byOwner.soni + summary.byOwner.ops + summary.byOwner.copy).toBe(
      17,
    );
    expect(statusLabel("blocked")).toBe("Needs a decision");
  });

  it("round-trips desk filters in the schedule URL", () => {
    expect(scheduleDeskHref()).toBe(SCHEDULE_DESK_PATH);
    expect(
      scheduleDeskHref({
        view: "channels",
        who: "soni",
        window: "day",
        item: "launch-li",
      }),
    ).toBe("/brand/schedule?view=channels&who=soni&window=day&item=launch-li");

    const parsed = scheduleFiltersFromSearch(
      "?view=channels&who=ops&phase=lock&item=sender",
    );
    expect(parsed).toEqual({
      view: "channels",
      who: "ops",
      window: "all",
      phase: "lock",
      item: "sender",
    });
    expect(scheduleFiltersFromSearch("?who=nobody&item=missing").who).toBe("all");
    expect(scheduleFiltersFromSearch("?item=missing").item).toBeNull();
  });
});
