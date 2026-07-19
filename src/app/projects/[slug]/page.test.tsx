import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectCaseStudyPage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/projects/[slug]/page";
import { PROJECTS } from "@/lib/data/projects";

// Compile MDX thật quá nặng cho jsdom — mock lib, pipeline test riêng ở lib/mdx.test
vi.mock("@/lib/mdx", () => ({
  listProjectStudySlugs: () => PROJECTS.map((p) => p.slug),
  getProjectStudySource: (slug: string) =>
    PROJECTS.some((p) => p.slug === slug) ? "## Mock heading" : null,
  compileMdxBody: async () => <div data-testid="mdx-body">mock body</div>,
}));

const params = (slug: string) => Promise.resolve({ slug });

describe("trang case study /projects/[slug]", () => {
  it("generateStaticParams trả đủ slug từ content", async () => {
    expect(await generateStaticParams()).toEqual(
      PROJECTS.map((p) => ({ slug: p.slug })),
    );
  });

  it("generateMetadata dùng title project", async () => {
    const metadata = await generateMetadata({
      params: params("atlas-platform"),
    });
    expect(String(metadata.title)).toMatch(/Atlas Platform/);
  });

  it("render header project + body MDX + link quay về work", async () => {
    render(await ProjectCaseStudyPage({ params: params("atlas-platform") }));
    const project = PROJECTS[0];
    expect(
      screen.getByRole("heading", { level: 1, name: project.title }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mdx-body")).toBeInTheDocument();
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/#work");
    for (const item of project.stack) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });
});
