import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/desk-version-controlled";

describe("barrel export của feature desk-version-controlled", () => {
  it("export DeskExperience và DESK_OBJECTS", () => {
    expect(typeof barrel.DeskExperience).toBe("function");
    expect(Array.isArray(barrel.DESK_OBJECTS)).toBe(true);
    expect(barrel.DESK_OBJECTS.length).toBeGreaterThan(0);
  });
});
