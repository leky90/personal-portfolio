import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("TraceScene — smoke test export", () => {
  it("module export hàm component TraceScene", async () => {
    const mod = await import(
      "@/features/concepts/request-lifecycle/components/trace-scene"
    );
    expect(typeof mod.TraceScene).toBe("function");
  });
});
