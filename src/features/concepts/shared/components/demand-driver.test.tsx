import { describe, expect, it } from "vitest";

// DemandDriver sống trong <Canvas> (cần useThree) — không render trong jsdom,
// chỉ smoke-test kiểu export.
describe("DemandDriver — smoke test export", () => {
  it("module export hàm component DemandDriver", async () => {
    const mod = await import(
      "@/features/concepts/shared/components/demand-driver"
    );
    expect(typeof mod.DemandDriver).toBe("function");
  });
});
