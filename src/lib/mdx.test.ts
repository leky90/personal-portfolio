import { describe, expect, it } from "vitest";
import {
  getProjectStudySource,
  getWritingPost,
  listProjectStudySlugs,
  listWritingPosts,
  writingFrontmatterSchema,
} from "@/lib/mdx";
import { PROJECTS } from "@/lib/data/projects";

describe("writing frontmatter schema (Zod)", () => {
  it("chặn frontmatter thiếu title hoặc date sai định dạng", () => {
    expect(
      writingFrontmatterSchema.safeParse({
        title: "",
        description: "x",
        date: "2026-07-19",
      }).success,
    ).toBe(false);
    expect(
      writingFrontmatterSchema.safeParse({
        title: "A",
        description: "x",
        date: "19/07/2026",
      }).success,
    ).toBe(false);
  });

  it("chấp nhận frontmatter hợp lệ, tags mặc định rỗng", () => {
    const parsed = writingFrontmatterSchema.parse({
      title: "A",
      description: "x",
      date: "2026-07-19",
    });
    expect(parsed.tags).toEqual([]);
  });
});

describe("listWritingPosts — đọc content/writing", () => {
  it("có ≥ 2 bài, slug duy nhất, sắp xếp mới nhất trước", () => {
    const posts = listWritingPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
    for (let i = 1; i < posts.length; i += 1) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("getWritingPost trả meta + source; slug lạ → null", () => {
    const [first] = listWritingPosts();
    const post = getWritingPost(first.slug);
    expect(post).not.toBeNull();
    expect(post!.meta.title).toBe(first.title);
    expect(post!.source.length).toBeGreaterThan(100);
    expect(getWritingPost("khong-ton-tai")).toBeNull();
  });
});

describe("case studies — mỗi project trong data đều có bài MDX", () => {
  it("slug khớp 1-1 với PROJECTS", () => {
    const slugs = listProjectStudySlugs().sort();
    expect(slugs).toEqual(PROJECTS.map((p) => p.slug).sort());
  });

  it("getProjectStudySource trả prose; slug lạ → null", () => {
    const source = getProjectStudySource(PROJECTS[0].slug);
    expect(source).not.toBeNull();
    expect(source!).toContain("## ");
    expect(getProjectStudySource("khong-ton-tai")).toBeNull();
  });
});
