import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { WritingPreview } from "@/components/sections/writing-preview";
import { listWritingPosts } from "@/lib/mdx";

describe("WritingPreview trên trang chủ", () => {
  it("hiện tối đa 3 bài mới nhất với link chi tiết + link All posts", () => {
    render(<MemoryRouter><WritingPreview /></MemoryRouter>);
    const posts = listWritingPosts().slice(0, 3);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const post of posts) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(hrefs).toContain(`/writing/${post.slug}`);
    }
    expect(hrefs).toContain("/writing");
  });
});
