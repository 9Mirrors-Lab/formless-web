import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BriefPage from "./BriefPage";

describe("BriefPage", () => {
  it("renders the brief shell, frequency-of-mind visual, and dev links", () => {
    const html = renderToStaticMarkup(<BriefPage />);

    expect(html).toContain("brief-dark");
    expect(html).toContain("Website Strategy");
    expect(html).toContain("/moodboard");
    expect(html).toContain("Frequency of Mind");
    expect(html).toContain("frequency-of-mind-line");
  });
});
