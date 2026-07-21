import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/signal-from-noise";

describe("barrel export của feature signal-from-noise", () => {
  it("export NoiseExperience và FORMS", () => {
    expect(typeof barrel.NoiseExperience).toBe("function");
    expect(Array.isArray(barrel.FORMS)).toBe(true);
    expect(barrel.FORMS.length).toBe(3);
  });
});
