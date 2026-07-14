import { describe, expect, it } from "vitest";

// Component Canvas không render được trong jsdom (không có WebGL) —
// chỉ smoke-test kiểu export qua dynamic import.
describe("ResolutionCanvas — smoke test export", () => {
  it("module export hàm component ResolutionCanvas", async () => {
    const mod = await import(
      "@/features/concepts/resolution/components/resolution-canvas"
    );
    expect(typeof mod.ResolutionCanvas).toBe("function");
  });
});
