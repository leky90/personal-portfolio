import { describe, expect, it } from "vitest";
import { articleJsonLd, personJsonLd } from "@/lib/json-ld";
import { SITE } from "@/lib/data/site";

describe("JSON-LD structured data", () => {
  it("jsonLdScript escape '<' — không thể đóng sớm thẻ script", async () => {
    const { jsonLdScript } = await import("@/lib/json-ld");
    const out = jsonLdScript({ x: "</script><script>alert(1)" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c");
  });

  it("Person: đủ name/jobTitle/email/url, sameAs là socials", () => {
    const person = personJsonLd();
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe(SITE.name);
    expect(person.jobTitle).toBe(SITE.title);
    expect(person.email).toBe(`mailto:${SITE.email}`);
    expect(person.url).toBe(SITE.url);
    expect(person.sameAs).toEqual(SITE.socials.map((s) => s.href));
  });

  it("Article: map từ frontmatter bài viết, author là Person", () => {
    const article = articleJsonLd({
      slug: "bai-mau",
      title: "Bài mẫu",
      description: "Mô tả",
      date: "2026-07-16",
      tags: ["three.js"],
    });
    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe("Bài mẫu");
    expect(article.datePublished).toBe("2026-07-16");
    expect(article.url).toBe(`${SITE.url}/writing/bai-mau`);
    expect(article.author.name).toBe(SITE.name);
  });
});
