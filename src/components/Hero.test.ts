import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const heroSource = readFileSync(fileURLToPath(new URL("./Hero.tsx", import.meta.url)), "utf8");

describe("Hero shader background", () => {
  it("renders the shader experiment directly with stable motion anchors", () => {
    expect(heroSource).toContain("MeshGradient");
    expect(heroSource).toContain("PulsingBorder");
    expect(heroSource).toContain("PARTICLE_ANCHORS");
    expect(heroSource).not.toContain("Math.random");
  });
});
