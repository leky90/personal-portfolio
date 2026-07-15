import { describe, expect, it } from "vitest";

describe("barrel export của feature compiled-light", () => {
  it("export CompiledExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/compiled-light");
    expect(typeof mod.CompiledExperience).toBe("function");
  });
});
