import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/daily-driver";

describe("barrel export của feature daily-driver", () => {
  it("export DriverExperience và COMMANDS", () => {
    expect(typeof barrel.DriverExperience).toBe("function");
    expect(Array.isArray(barrel.COMMANDS)).toBe(true);
    expect(barrel.COMMANDS.length).toBeGreaterThan(0);
  });
});
