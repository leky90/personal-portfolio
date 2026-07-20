import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/knowledge-relay";

describe("barrel export của feature knowledge-relay", () => {
  it("export RelayExperience và BATONS", () => {
    expect(typeof barrel.RelayExperience).toBe("function");
    expect(Array.isArray(barrel.BATONS)).toBe(true);
    expect(barrel.BATONS.length).toBeGreaterThan(0);
  });
});
