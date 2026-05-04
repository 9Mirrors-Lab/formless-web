import { describe, expect, it } from "vitest";
import { ALL_SUBSTEPS, DESIGN_FRAMEWORK_PHASES } from "./designFramework";

describe("designFramework data", () => {
  it("has four phases", () => {
    expect(DESIGN_FRAMEWORK_PHASES).toHaveLength(4);
  });

  it("has eleven substeps", () => {
    expect(ALL_SUBSTEPS).toHaveLength(11);
  });

  it("has unique hash slugs", () => {
    const hashes = ALL_SUBSTEPS.map((s) => s.hash);
    expect(new Set(hashes).size).toBe(hashes.length);
  });

  it("each substep has required fields", () => {
    for (const s of ALL_SUBSTEPS) {
      expect(s.id.length).toBeGreaterThan(0);
      expect(s.hash.length).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.guide.length).toBeGreaterThan(0);
      expect(s.prompt.length).toBeGreaterThan(0);
      expect(s.output.length).toBeGreaterThan(0);
    }
  });
});
