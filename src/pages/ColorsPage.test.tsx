import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ColorsPage from "./ColorsPage";

describe("ColorsPage", () => {
  it("lists all four theme explorations", () => {
    const html = renderToStaticMarkup(<ColorsPage />);

    expect(html).toContain("Basalt translation");
    expect(html).toContain("Nocturne elevated");
    expect(html).toContain("Meridian immersive");
    expect(html).toContain("Brief spectrum");
    expect(html).toContain("colors-explore-t1");
    expect(html).toContain("colors-explore-t3");
  });
});
