import { describe, expect, it } from "vitest";
import {
  BRIEF_SECTIONS,
  HOMEPAGE_FLOW,
  POSITIONING_STATEMENT,
  WEBSITE_BRIEF,
} from "./briefContent";

describe("briefContent", () => {
  it("contains the full requested website strategy brief structure", () => {
    expect(WEBSITE_BRIEF.title).toBe("Website Strategy & Creative Brief");
    expect(BRIEF_SECTIONS.map((section) => section.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
  });

  it("anchors the strategy in the client meeting language", () => {
    const searchableBrief = JSON.stringify({
      WEBSITE_BRIEF,
      BRIEF_SECTIONS,
      HOMEPAGE_FLOW,
      POSITIONING_STATEMENT,
    }).toLowerCase();

    expect(searchableBrief).toContain("anyone who has had enough");
    expect(searchableBrief).toContain("voice in the head");
    expect(searchableBrief).toContain("a moment to reflect");
    expect(searchableBrief).toContain("allow");
    expect(searchableBrief).toContain("no judgment");
  });

  it("defines a practical homepage section sequence", () => {
    expect(HOMEPAGE_FLOW.length).toBeGreaterThanOrEqual(7);
    expect(HOMEPAGE_FLOW[0].sectionName).toBe("Hero: Stop, Pause, Go Within");
    expect(HOMEPAGE_FLOW.some((section) => section.sectionName.includes("Science"))).toBe(true);
    expect(HOMEPAGE_FLOW.every((section) => section.purpose.length > 0)).toBe(true);
  });
});
