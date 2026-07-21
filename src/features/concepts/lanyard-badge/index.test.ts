import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/lanyard-badge";

describe("barrel export của feature lanyard-badge", () => {
  it("export BadgeExperience và BADGE_SPECS", () => {
    expect(typeof barrel.BadgeExperience).toBe("function");
    expect(Array.isArray(barrel.BADGE_SPECS)).toBe(true);
    expect(barrel.BADGE_SPECS.length).toBeGreaterThan(0);
  });
});
