import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("RelayCanvas — smoke test export", () => {
  it("module export hàm component RelayCanvas", async () => {
    const mod = await import(
      "@/features/concepts/knowledge-relay/components/relay-canvas"
    );
    expect(typeof mod.RelayCanvas).toBe("function");
  });
});
