import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import matter from "gray-matter";
import { SITE } from "../src/lib/data/site";
import {
  buildRobotsTxt,
  buildSitemapXml,
  portfolioSitemapEntries,
} from "../src/lib/static-seo";

function mdxSlugs(contentDir: string): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function writingLastModified(contentDir: string, slug: string): string | undefined {
  const parsed = matter(
    fs.readFileSync(path.join(contentDir, `${slug}.mdx`), "utf8"),
  );
  return typeof parsed.data.date === "string" ? parsed.data.date : undefined;
}

/**
 * Sau khi vite build xong: ghi sitemap.xml + robots.txt vào dist,
 * copy index.html → 404.html (SPA fallback chuẩn của GH Pages) và
 * tạo .nojekyll để Pages không chạy Jekyll lên output.
 */
export function staticSeoPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "portfolio:static-seo",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const projectsDir = path.resolve(config.root, "content/projects");
      const writingDir = path.resolve(config.root, "content/writing");

      const entries = portfolioSitemapEntries(
        SITE.url,
        mdxSlugs(projectsDir),
        mdxSlugs(writingDir),
      ).map((entry) => {
        const writingSlug = entry.url.match(/\/writing\/([a-z0-9-]+)$/)?.[1];
        return writingSlug
          ? { ...entry, lastModified: writingLastModified(writingDir, writingSlug) }
          : entry;
      });

      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        buildSitemapXml(entries),
      );
      fs.writeFileSync(path.join(outDir, "robots.txt"), buildRobotsTxt(SITE.url));
      fs.copyFileSync(
        path.join(outDir, "index.html"),
        path.join(outDir, "404.html"),
      );
      fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
    },
  };
}
