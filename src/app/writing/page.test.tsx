import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import WritingIndexPage, { metadata } from "@/app/writing/page";
import { listWritingPosts } from "@/lib/mdx";

describe("trang /writing — index bài viết", () => {
  it("metadata có title Writing", () => {
    expect(String(metadata.title)).toMatch(/writing/i);
  });

  it("liệt kê mọi bài với link tới trang chi tiết", () => {
    render(<MemoryRouter><WritingIndexPage /></MemoryRouter>);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const post of listWritingPosts()) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(hrefs).toContain(`/writing/${post.slug}`);
    }
  });
});
