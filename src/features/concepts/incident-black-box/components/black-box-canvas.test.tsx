import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("BlackBoxCanvas — smoke test export", () => {
  it("module export hàm component BlackBoxCanvas", async () => {
    const mod = await import(
      "@/features/concepts/incident-black-box/components/black-box-canvas"
    );
    expect(typeof mod.BlackBoxCanvas).toBe("function");
  });
});
