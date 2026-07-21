import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("BadgeScene — smoke test export", () => {
  it("module export hàm component BadgeScene", async () => {
    const mod = await import(
      "@/features/concepts/lanyard-badge/components/badge-scene"
    );
    expect(typeof mod.BadgeScene).toBe("function");
  });
});
