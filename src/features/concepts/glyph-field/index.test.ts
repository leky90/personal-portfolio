import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/glyph-field";

describe("barrel export của feature glyph-field", () => {
  it("export GlyphExperience và HEADINGS", () => {
    expect(typeof barrel.GlyphExperience).toBe("function");
    expect(Array.isArray(barrel.HEADINGS)).toBe(true);
    expect(barrel.HEADINGS.length).toBeGreaterThan(0);
  });
});
