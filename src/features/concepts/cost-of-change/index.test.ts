import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/cost-of-change";

describe("barrel export của feature cost-of-change", () => {
  it("export ChangeExperience và LEDGER", () => {
    expect(typeof barrel.ChangeExperience).toBe("function");
    expect(Array.isArray(barrel.LEDGER)).toBe(true);
    expect(barrel.LEDGER.length).toBeGreaterThan(0);
  });
});
