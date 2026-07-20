import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("DigCanvas — smoke test export", () => {
  it("module export hàm component DigCanvas", async () => {
    const mod = await import(
      "@/features/concepts/maintenance-archaeology/components/dig-canvas"
    );
    expect(typeof mod.DigCanvas).toBe("function");
  });
});
