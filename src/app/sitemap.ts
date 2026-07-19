import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data/site";
import { listProjectStudySlugs, listWritingPosts } from "@/lib/mdx";

/**
 * Sitemap chỉ chứa các trang dành cho người tuyển dụng — /lab và /concepts
 * là kho lưu trữ quá trình chọn concept, không đưa vào index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, priority: 1 },
    { url: `${SITE.url}/writing`, priority: 0.8 },
    ...listProjectStudySlugs().map((slug) => ({
      url: `${SITE.url}/projects/${slug}`,
      priority: 0.7,
    })),
    ...listWritingPosts().map((post) => ({
      url: `${SITE.url}/writing/${post.slug}`,
      lastModified: post.date,
      priority: 0.6,
    })),
  ];
}
