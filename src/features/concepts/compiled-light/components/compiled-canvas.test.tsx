import { describe, expect, it } from "vitest";

// Canvas không render trong jsdom — smoke-test export.
describe("CompiledCanvas — smoke test export", () => {
  it("module export hàm component CompiledCanvas", async () => {
    const mod = await import(
      "@/features/concepts/compiled-light/components/compiled-canvas"
    );
    expect(typeof mod.CompiledCanvas).toBe("function");
  });
});
