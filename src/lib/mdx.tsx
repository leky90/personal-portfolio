import type { ComponentType } from "react";
import { z } from "zod";

/**
 * Pipeline nội dung MDX sau khi bỏ Next: file .mdx được @mdx-js/rollup
 * compile thành component NGAY LÚC BUILD (highlight shiki qua
 * rehype-pretty-code), frontmatter export qua remark-mdx-frontmatter.
 * Load bằng import.meta.glob eager → mọi lỗi frontmatter nổ khi build,
 * không bao giờ lọt trang trắng lên prod (giữ nguyên bảo chứng Zod cũ).
 */

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

export type MdxBody = ComponentType<Record<string, unknown>>;

interface MdxModule {
  default: MdxBody;
  frontmatter?: Record<string, unknown>;
}

const writingModules = import.meta.glob<MdxModule>("/content/writing/*.mdx", {
  eager: true,
});
const projectModules = import.meta.glob<MdxModule>(
  "/content/projects/*.mdx",
  { eager: true },
);

function slugOf(filePath: string): string {
  return filePath.split("/").pop()!.replace(/\.mdx$/, "");
}

const WRITING = Object.entries(writingModules)
  .map(([filePath, mod]) => ({
    meta: {
      ...writingFrontmatterSchema.parse(mod.frontmatter ?? {}),
      slug: slugOf(filePath),
    },
    Body: mod.default,
  }))
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

const PROJECT_STUDIES = new Map(
  Object.entries(projectModules).map(([filePath, mod]) => [
    slugOf(filePath),
    mod.default,
  ]),
);

/** Danh sách bài viết, mới nhất trước. */
export function listWritingPosts(): WritingPostMeta[] {
  return WRITING.map((post) => post.meta);
}

export function getWritingPost(
  slug: string,
): { meta: WritingPostMeta; Body: MdxBody } | null {
  return WRITING.find((post) => post.meta.slug === slug) ?? null;
}

/** Case study: prose thuộc MDX, meta card (role/stack/metrics) là PROJECTS. */
export function listProjectStudySlugs(): string[] {
  return [...PROJECT_STUDIES.keys()];
}

export function getProjectStudy(slug: string): { Body: MdxBody } | null {
  const Body = PROJECT_STUDIES.get(slug);
  return Body ? { Body } : null;
}
