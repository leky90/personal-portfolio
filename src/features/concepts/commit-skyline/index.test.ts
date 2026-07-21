import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/commit-skyline";

describe("barrel export của feature commit-skyline", () => {
  it("export SkylineExperience và LANDMARKS", () => {
    expect(typeof barrel.SkylineExperience).toBe("function");
    expect(Array.isArray(barrel.LANDMARKS)).toBe(true);
    expect(barrel.LANDMARKS.length).toBeGreaterThan(0);
  });
});
