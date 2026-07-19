import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Kho lưu trữ concept lab không dành cho search index
        disallow: ["/lab", "/concepts/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
