import { describe, expect, it } from "vitest";

// Scene sống trong <Canvas> R3F — smoke-test export.
describe("TapeScene — smoke test export", () => {
  it("module export hàm component TapeScene", async () => {
    const mod = await import(
      "@/features/concepts/incident-black-box/components/tape-scene"
    );
    expect(typeof mod.TapeScene).toBe("function");
  });
});
