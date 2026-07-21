import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/ten-year-galaxy";

describe("barrel export của feature ten-year-galaxy", () => {
  it("export GalaxyExperience và GALAXY_ERAS", () => {
    expect(typeof barrel.GalaxyExperience).toBe("function");
    expect(Array.isArray(barrel.GALAXY_ERAS)).toBe(true);
    expect(barrel.GALAXY_ERAS.length).toBe(4);
  });
});
