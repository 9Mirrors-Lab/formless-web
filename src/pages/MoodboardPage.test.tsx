import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import MoodboardPage from "./MoodboardPage";

describe("MoodboardPage", () => {
  it("renders the Formless moodboard sections", () => {
    const html = renderToStaticMarkup(<MoodboardPage />);

    expect(html).toContain("Formless Moodboard");
    expect(html).toContain("Mood Vocabulary");
    expect(html).toContain("Image Direction");
    expect(html).toContain("Typography");
    expect(html).toContain("Clarity reveal");
    expect(html).toContain("moodboard-lens");
    expect(html).toContain("Human form dissolving into particles");
  });
});
