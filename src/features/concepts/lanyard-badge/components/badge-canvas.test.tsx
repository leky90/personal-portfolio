import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("BadgeCanvas — smoke test export", () => {
  it("module export hàm component BadgeCanvas", async () => {
    const mod = await import(
      "@/features/concepts/lanyard-badge/components/badge-canvas"
    );
    expect(typeof mod.BadgeCanvas).toBe("function");
  });
});
