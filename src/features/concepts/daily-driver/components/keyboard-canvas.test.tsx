import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("KeyboardCanvas — smoke test export", () => {
  it("module export hàm component KeyboardCanvas", async () => {
    const mod = await import(
      "@/features/concepts/daily-driver/components/keyboard-canvas"
    );
    expect(typeof mod.KeyboardCanvas).toBe("function");
  });
});
