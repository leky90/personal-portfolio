import { describe, expect, it } from "vitest";
import {
  getProjectStudy,
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

describe("listWritingPosts — glob content/writing qua @mdx-js/rollup", () => {
  it("có ≥ 2 bài, slug duy nhất, sắp xếp mới nhất trước", () => {
    const posts = listWritingPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
    for (let i = 1; i < posts.length; i += 1) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("getWritingPost trả meta + Body component; slug lạ → null", () => {
    const [first] = listWritingPosts();
    const post = getWritingPost(first.slug);
    expect(post).not.toBeNull();
    expect(post!.meta.title).toBe(first.title);
    expect(typeof post!.Body).toBe("function");
    expect(getWritingPost("khong-ton-tai")).toBeNull();
  });
});

describe("case studies — mỗi project trong data đều có bài MDX", () => {
  it("slug khớp 1-1 với PROJECTS, mỗi bài là một component", () => {
    const slugs = listProjectStudySlugs().sort();
    expect(slugs).toEqual(PROJECTS.map((p) => p.slug).sort());
    for (const slug of slugs) {
      const study = getProjectStudy(slug);
      expect(study).not.toBeNull();
      expect(typeof study!.Body).toBe("function");
    }
    expect(getProjectStudy("khong-ton-tai")).toBeNull();
  });
});
