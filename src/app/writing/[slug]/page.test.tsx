import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WritingPostPage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/writing/[slug]/page";

vi.mock("@/lib/mdx", () => ({
  listWritingPosts: () => [
    {
      slug: "bai-mau",
      title: "Bài mẫu",
      description: "Mô tả mẫu",
      date: "2026-07-16",
      tags: ["three.js"],
    },
  ],
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
          source: "## Mock",
        }
      : null,
  compileMdxBody: async () => <div data-testid="mdx-body">mock body</div>,
}));

const params = (slug: string) => Promise.resolve({ slug });

describe("trang bài viết /writing/[slug]", () => {
  it("generateStaticParams từ danh sách bài", async () => {
    expect(await generateStaticParams()).toEqual([{ slug: "bai-mau" }]);
  });

  it("generateMetadata lấy title + description của bài", async () => {
    const metadata = await generateMetadata({ params: params("bai-mau") });
    expect(String(metadata.title)).toMatch(/Bài mẫu/);
    expect(metadata.description).toBe("Mô tả mẫu");
  });

  it("nhúng JSON-LD Article", async () => {
    const { container } = render(
      await WritingPostPage({ params: params("bai-mau") }),
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).not.toBeNull();
    expect(script!.textContent).toContain('"Article"');
  });

  it("render title, date, tags và body", async () => {
    render(await WritingPostPage({ params: params("bai-mau") }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Bài mẫu" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2026-07-16")).toBeInTheDocument();
    expect(screen.getByText("three.js")).toBeInTheDocument();
    expect(screen.getByTestId("mdx-body")).toBeInTheDocument();
  });
});
