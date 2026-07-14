import { describe, expect, it } from "vitest";

// Cover ASCII sống trong <View> của R3F — không render trong jsdom,
// chỉ smoke-test kiểu export qua dynamic import.
describe("AsciiCover — smoke test export", () => {
  it("module export hàm component AsciiCover", async () => {
    const mod = await import(
      "@/features/concepts/resolution/components/ascii-cover"
    );
    expect(typeof mod.AsciiCover).toBe("function");
  });
});
