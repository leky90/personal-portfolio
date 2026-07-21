import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("DeskCanvas — smoke test export", () => {
  it("module export hàm component DeskCanvas", async () => {
    const mod = await import(
      "@/features/concepts/desk-version-controlled/components/desk-canvas"
    );
    expect(typeof mod.DeskCanvas).toBe("function");
  });
});
