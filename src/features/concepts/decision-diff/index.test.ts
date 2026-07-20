import { describe, expect, it } from "vitest";

describe("barrel export của feature decision-diff", () => {
  it("export DecisionExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/decision-diff");
    expect(typeof mod.DecisionExperience).toBe("function");
  });
});
