import { describe, expect, it } from "vitest";

import {
  COLOR_SWATCHES,
  IMAGE_REFERENCES,
  INTERACTION_CUES,
  MOODBOARD_SECTIONS,
  MOOD_KEYWORDS,
  SPATIAL_DIRECTIONS,
  TYPOGRAPHY_DIRECTIONS,
} from "./moodboardContent";

describe("moodboardContent", () => {
  it("covers the core moodboard categories", () => {
    expect(MOODBOARD_SECTIONS).toEqual([
      "Mood Vocabulary",
      "Image Direction",
      "Color System",
      "Typography",
      "Texture & Material",
      "Spatial Composition",
      "Motion Language",
      "Interface Notes",
      "Avoid",
    ]);
  });

  it("anchors the visual direction in the toroidal body-field concept", () => {
    const imageText = JSON.stringify(IMAGE_REFERENCES).toLowerCase();

    expect(imageText).toContain("toroidal");
    expect(imageText).toContain("human form dissolving");
    expect(imageText).toContain("particles");
  });

  it("defines a complete color and typography palette", () => {
    expect(COLOR_SWATCHES.length).toBeGreaterThanOrEqual(6);
    expect(TYPOGRAPHY_DIRECTIONS.map((font) => font.role)).toEqual([
      "Display",
      "Body",
      "Technical",
    ]);
  });

  it("includes motion and composition guidance for an interactive board", () => {
    expect(MOOD_KEYWORDS).toContain("witness");
    expect(SPATIAL_DIRECTIONS.length).toBeGreaterThanOrEqual(4);
    expect(INTERACTION_CUES.map((cue) => cue.title)).toContain("Clarity reveal");
  });
});
