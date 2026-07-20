import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/gravity-toybox";

describe("barrel export của feature gravity-toybox", () => {
  it("export ToyboxExperience và SKILLS", () => {
    expect(typeof barrel.ToyboxExperience).toBe("function");
    expect(Array.isArray(barrel.SKILLS)).toBe(true);
    expect(barrel.SKILLS.length).toBeGreaterThan(0);
  });
});
