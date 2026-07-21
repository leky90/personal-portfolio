import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("CabinetCanvas — smoke test export", () => {
  it("module export hàm component CabinetCanvas", async () => {
    const mod = await import(
      "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas"
    );
    expect(typeof mod.CabinetCanvas).toBe("function");
  });
});
