import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/full-stack-strata";

describe("barrel export của feature full-stack-strata", () => {
  it("export IslandExperience và LAYERS", () => {
    expect(typeof barrel.IslandExperience).toBe("function");
    expect(Array.isArray(barrel.LAYERS)).toBe(true);
    expect(barrel.LAYERS.length).toBeGreaterThan(0);
  });
});
