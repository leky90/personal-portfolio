import { describe, expect, it } from "vitest";

describe("barrel export của feature living-topology", () => {
  it("export TopologyExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/living-topology");
    expect(typeof mod.TopologyExperience).toBe("function");
  });
});
