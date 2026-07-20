import { describe, expect, it } from "vitest";

// Canvas R3F cần WebGL thật — smoke-test export.
describe("TraceCanvas — smoke test export", () => {
  it("module export hàm component TraceCanvas", async () => {
    const mod = await import(
      "@/features/concepts/request-lifecycle/components/trace-canvas"
    );
    expect(typeof mod.TraceCanvas).toBe("function");
  });
});
