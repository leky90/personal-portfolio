import { describe, expect, it } from "vitest";

// ImageResponse render bằng satori lúc build — trong jsdom chỉ smoke-test
// export shape (default fn + size/alt/contentType) để route hợp lệ.
describe("opengraph-image — smoke test export", () => {
  it("export default function + metadata tĩnh", async () => {
    const mod = await import("@/app/opengraph-image");
    expect(typeof mod.default).toBe("function");
    expect(mod.size).toEqual({ width: 1200, height: 630 });
    expect(mod.contentType).toBe("image/png");
    expect(mod.alt.length).toBeGreaterThan(0);
  });
});
