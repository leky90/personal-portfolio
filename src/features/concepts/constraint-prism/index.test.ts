import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/constraint-prism";

describe("barrel export của feature constraint-prism", () => {
  it("export PrismExperience và CONSTRAINTS", () => {
    expect(typeof barrel.PrismExperience).toBe("function");
    expect(Array.isArray(barrel.CONSTRAINTS)).toBe(true);
    expect(barrel.CONSTRAINTS.length).toBeGreaterThan(0);
  });
});
