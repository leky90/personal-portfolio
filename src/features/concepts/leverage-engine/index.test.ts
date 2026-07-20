import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/leverage-engine";

describe("barrel export của feature leverage-engine", () => {
  it("export EngineExperience và OUTPUTS", () => {
    expect(typeof barrel.EngineExperience).toBe("function");
    expect(Array.isArray(barrel.OUTPUTS)).toBe(true);
    expect(barrel.OUTPUTS.length).toBeGreaterThan(0);
  });
});
