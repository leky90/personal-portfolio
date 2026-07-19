import { describe, expect, it } from "vitest";
import { SITE } from "@/lib/data/site";

describe("site config — nguồn sự thật cho brand/liên hệ", () => {
  it("có tên, title và tagline", () => {
    expect(SITE.name.length).toBeGreaterThan(0);
    expect(SITE.title).toMatch(/engineer/i);
    expect(SITE.tagline.length).toBeGreaterThan(0);
  });

  it("email hợp lệ, socials có url https", () => {
    expect(SITE.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(SITE.socials.length).toBeGreaterThanOrEqual(2);
    for (const social of SITE.socials) {
      expect(social.label.length).toBeGreaterThan(0);
      expect(social.href).toMatch(/^https:\/\//);
    }
  });
});
