import { describe, expect, it } from "vitest";

// Sống trong <Canvas> R3F — smoke-test export.
describe("TerminalPass — smoke test export", () => {
  it("module export hàm component TerminalPass", async () => {
    const mod = await import(
      "@/features/concepts/compiled-light/components/terminal-pass"
    );
    expect(typeof mod.TerminalPass).toBe("function");
  });
});
