import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("RelayScene — smoke test export", () => {
  it("module export hàm component RelayScene", async () => {
    const mod = await import(
      "@/features/concepts/knowledge-relay/components/relay-scene"
    );
    expect(typeof mod.RelayScene).toBe("function");
  });
});
