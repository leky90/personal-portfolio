import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("KeyboardScene — smoke test export", () => {
  it("module export hàm component KeyboardScene", async () => {
    const mod = await import(
      "@/features/concepts/daily-driver/components/keyboard-scene"
    );
    expect(typeof mod.KeyboardScene).toBe("function");
  });
});
