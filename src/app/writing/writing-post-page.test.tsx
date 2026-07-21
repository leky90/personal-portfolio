import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import WritingPostPage from "@/app/writing/writing-post-page";

vi.mock("@/lib/mdx", () => ({
  getWritingPost: (slug: string) =>
    slug === "bai-mau"
      ? {
          meta: {
            slug,
            title: "Bài mẫu",
            description: "Mô tả mẫu",
            date: "2026-07-16",
            tags: ["three.js"],
          },
          Body: () => <div data-testid="mdx-body">mock body</div>,
        }
      : null,
}));

function renderAt(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/writing/${slug}`]}>
      <Routes>
        <Route path="/writing/:slug" element={<WritingPostPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("trang bài viết /writing/:slug (SPA)", () => {
  it("render title, tags, MDX body và JSON-LD từ bài viết", () => {
    const { container } = renderAt("bai-mau");
    expect(
      screen.getByRole("heading", { level: 1, name: "Bài mẫu" }),
    ).toBeInTheDocument();
    expect(screen.getByText("three.js")).toBeInTheDocument();
    expect(screen.getByTestId("mdx-body")).toBeInTheDocument();
    const jsonLd = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(jsonLd?.textContent).toContain("Bài mẫu");
  });

  it("slug lạ render NotFoundPage thay vì trang trắng", () => {
    renderAt("khong-ton-tai");
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});
