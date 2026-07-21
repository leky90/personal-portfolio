import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/phosphor-lens";

describe("barrel export của feature phosphor-lens", () => {
  it("export LensExperience và buildLatheProfile", () => {
    expect(typeof barrel.LensExperience).toBe("function");
    expect(typeof barrel.buildLatheProfile).toBe("function");
  });
});
