import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/request-lifecycle";

describe("barrel export của feature request-lifecycle", () => {
  it("export TraceExperience và SPANS", () => {
    expect(typeof barrel.TraceExperience).toBe("function");
    expect(Array.isArray(barrel.SPANS)).toBe(true);
    expect(barrel.SPANS.length).toBeGreaterThan(0);
  });
});
