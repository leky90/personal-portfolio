import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/dependency-constellation";

describe("barrel export của feature dependency-constellation", () => {
  it("export ConstellationExperience và NODES", () => {
    expect(typeof barrel.ConstellationExperience).toBe("function");
    expect(Array.isArray(barrel.NODES)).toBe(true);
    expect(barrel.NODES.length).toBeGreaterThan(0);
  });
});
