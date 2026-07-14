import { describe, expect, it } from "vitest";

// Chủ thể ASCII sống trong <View> của R3F — không render trong jsdom,
// chỉ smoke-test kiểu export qua dynamic import.
describe("AsciiSubject — smoke test export", () => {
  it("module export hàm component AsciiSubject", async () => {
    const mod = await import(
      "@/features/concepts/resolution/components/ascii-subject"
    );
    expect(typeof mod.AsciiSubject).toBe("function");
  });
});
