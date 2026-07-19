import { SITE } from "@/lib/data/site";
import type { WritingPostMeta } from "@/lib/mdx";

/**
 * Structured data cho rich results — hàm thuần, page nhúng qua
 * <script type="application/ld+json">.
 */

/**
 * Serialize an toàn để nhúng vào <script>: escape "<" thành < —
 * nội dung là dữ liệu typed của chính site, nhưng escape loại hẳn khả năng
 * đóng sớm thẻ script (pattern khuyến nghị của Next docs).
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person" as const,
    name: SITE.name,
    jobTitle: SITE.title,
    email: `mailto:${SITE.email}`,
    url: SITE.url,
    sameAs: SITE.socials.map((social) => social.href),
  };
}

export function articleJsonLd(post: WritingPostMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article" as const,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.tags.join(", "),
    url: `${SITE.url}/writing/${post.slug}`,
    author: {
      "@type": "Person" as const,
      name: SITE.name,
      url: SITE.url,
    },
  };
}
