import { describe, expect, it } from "vitest";

describe("barrel export của feature monolith-to-mesh", () => {
  it("export MeshExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/monolith-to-mesh");
    expect(typeof mod.MeshExperience).toBe("function");
  });
});
