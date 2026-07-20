import { describe, expect, it } from "vitest";

describe("barrel export của feature incident-black-box", () => {
  it("export BlackBoxExperience cho page dùng", async () => {
    const mod = await import("@/features/concepts/incident-black-box");
    expect(typeof mod.BlackBoxExperience).toBe("function");
  });
});
