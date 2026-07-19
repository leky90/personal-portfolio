import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { z } from "zod";

/**
 * Pipeline nội dung MDX: prose dài (case study, bài viết) sống trong
 * content/, dữ liệu có cấu trúc sống trong lib/data — mỗi loại đúng định
 * dạng tự nhiên của nó. Frontmatter validate bằng Zod NGAY lúc đọc:
 * frontmatter sai → build fail, không bao giờ lọt trang trắng lên prod.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export const writingFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** ISO yyyy-mm-dd để sort lexicographic = sort thời gian */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).default([]),
});

export type WritingFrontmatter = z.infer<typeof writingFrontmatterSchema>;

export interface WritingPostMeta extends WritingFrontmatter {
  slug: string;
}

function mdxFilesIn(dir: string): string[] {
  const abs = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readMdxFile(dir: string, slug: string): matter.GrayMatterFile<string> | null {
  // Chặn path traversal từ slug động của route
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const abs = path.join(CONTENT_ROOT, dir, `${slug}.mdx`);
  if (!fs.existsSync(abs)) return null;
  return matter(fs.readFileSync(abs, "utf8"));
}

/** Danh sách bài viết, mới nhất trước. Frontmatter sai → throw (fail build). */
export function listWritingPosts(): WritingPostMeta[] {
  return mdxFilesIn("writing")
    .map((slug) => {
      const file = readMdxFile("writing", slug)!;
      const meta = writingFrontmatterSchema.parse(file.data);
      return { ...meta, slug };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWritingPost(
  slug: string,
): { meta: WritingPostMeta; source: string } | null {
  const file = readMdxFile("writing", slug);
  if (!file) return null;
  const meta = writingFrontmatterSchema.parse(file.data);
  return { meta: { ...meta, slug }, source: file.content };
}

/** Case study: prose thuộc MDX, còn meta card (role/stack/metrics) là PROJECTS. */
export function listProjectStudySlugs(): string[] {
  return mdxFilesIn("projects");
}

export function getProjectStudySource(slug: string): string | null {
  const file = readMdxFile("projects", slug);
  return file ? file.content : null;
}

/** Compile MDX → React element (RSC), code block highlight bằng shiki. */
export async function compileMdxBody(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, { theme: "vesper", keepBackground: false }],
        ],
      },
    },
  });
  return content;
}
