import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { SITE } from "@/lib/data/site";

describe("robots.txt", () => {
  it("cho crawl site, chặn kho lưu trữ /lab và /concepts, trỏ sitemap", () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules!;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toEqual(["/lab", "/concepts/"]);
    expect(result.sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });
});
