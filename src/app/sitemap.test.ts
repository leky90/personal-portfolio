import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/data/site";
import { listProjectStudySlugs, listWritingPosts } from "@/lib/mdx";

describe("sitemap.xml", () => {
  it("chứa home, writing index, mọi case study và bài viết — URL tuyệt đối", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(SITE.url);
    expect(urls).toContain(`${SITE.url}/writing`);
    for (const slug of listProjectStudySlugs()) {
      expect(urls).toContain(`${SITE.url}/projects/${slug}`);
    }
    for (const post of listWritingPosts()) {
      expect(urls).toContain(`${SITE.url}/writing/${post.slug}`);
    }
  });

  it("không đưa /lab và /concepts (kho lưu trữ) vào sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.includes("/lab"))).toBe(false);
    expect(urls.some((url) => url.includes("/concepts"))).toBe(false);
  });
});
