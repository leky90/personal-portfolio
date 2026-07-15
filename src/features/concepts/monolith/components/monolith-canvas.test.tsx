import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("MonolithCanvas — smoke test export", () => {
  it("module export hàm component MonolithCanvas", async () => {
    const mod = await import(
      "@/features/concepts/monolith/components/monolith-canvas"
    );
    expect(typeof mod.MonolithCanvas).toBe("function");
  });
});
