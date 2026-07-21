import { describe, expect, it } from "vitest";
import {
  buildRobotsTxt,
  buildSitemapXml,
  portfolioSitemapEntries,
} from "@/lib/static-seo";

const SITE_URL = "https://example.github.io/personal-portfolio";

describe("static-seo — sitemap/robots cho GH Pages (thay route handler Next)", () => {
  it("entries: home, writing index, mọi case study + bài viết, URL tuyệt đối", () => {
    const urls = portfolioSitemapEntries(
      SITE_URL,
      ["atlas-platform", "relay-payments"],
      ["one-draw-call-terrain"],
    ).map((entry) => entry.url);
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/writing`);
    expect(urls).toContain(`${SITE_URL}/projects/atlas-platform`);
    expect(urls).toContain(`${SITE_URL}/projects/relay-payments`);
    expect(urls).toContain(`${SITE_URL}/writing/one-draw-call-terrain`);
  });

  it("không đưa /lab và /concepts (kho lưu trữ) vào sitemap", () => {
    const urls = portfolioSitemapEntries(SITE_URL, ["a"], ["b"]).map(
      (entry) => entry.url,
    );
    expect(urls.some((url) => url.includes("/lab"))).toBe(false);
    expect(urls.some((url) => url.includes("/concepts"))).toBe(false);
  });

  it("buildSitemapXml: XML hợp lệ với mỗi entry một thẻ <url><loc>", () => {
    const xml = buildSitemapXml([
      { url: `${SITE_URL}` },
      { url: `${SITE_URL}/writing` },
    ]);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<urlset");
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml).toContain(`<loc>${SITE_URL}/writing</loc>`);
  });

  it("robots.txt: allow /, disallow kho lưu trữ, trỏ sitemap tuyệt đối", () => {
    const robots = buildRobotsTxt(SITE_URL);
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /lab");
    expect(robots).toContain("Disallow: /concepts/");
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});
