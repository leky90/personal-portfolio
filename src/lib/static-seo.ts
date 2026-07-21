/**
 * SEO tĩnh cho GH Pages: thay các route handler sitemap/robots của Next
 * bằng builder thuần — vite plugin (scripts/static-seo-plugin.ts) gọi
 * chúng lúc closeBundle để ghi file thẳng vào dist/. Giữ nguyên chính
 * sách cũ: /lab và /concepts là kho lưu trữ, không vào sitemap và bị
 * disallow trong robots.
 */

export interface SitemapEntry {
  url: string;
  lastModified?: string;
}

/** Danh sách URL công khai của portfolio — kho lưu trữ bị loại từ gốc. */
export function portfolioSitemapEntries(
  siteUrl: string,
  projectSlugs: readonly string[],
  writingSlugs: readonly string[],
): SitemapEntry[] {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/writing` },
    ...projectSlugs.map((slug) => ({ url: `${siteUrl}/projects/${slug}` })),
    ...writingSlugs.map((slug) => ({ url: `${siteUrl}/writing/${slug}` })),
  ];
}

export function buildSitemapXml(entries: readonly SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `<lastmod>${entry.lastModified}</lastmod>`
        : "";
      return `  <url><loc>${entry.url}</loc>${lastModified}</url>`;
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</urlset>",
    "",
  ].join("\n");
}

export function buildRobotsTxt(siteUrl: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /lab",
    "Disallow: /concepts/",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}
