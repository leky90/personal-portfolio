import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import ProjectCaseStudyPage from "@/app/projects/case-study-page";
import { PROJECTS } from "@/lib/data/projects";

vi.mock("@/lib/mdx", () => ({
  getProjectStudy: (slug: string) =>
    slug === "khong-co-mdx"
      ? null
      : { Body: () => <div data-testid="mdx-body">mock study</div> },
}));

function renderAt(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectCaseStudyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("trang case study /projects/:slug (SPA)", () => {
  it("render meta card từ PROJECTS + MDX body", () => {
    const project = PROJECTS[0];
    renderAt(project.slug);
    expect(
      screen.getByRole("heading", { level: 1, name: project.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(project.role)).toBeInTheDocument();
    expect(screen.getByTestId("mdx-body")).toBeInTheDocument();
    for (const item of project.stack) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("slug không có trong PROJECTS render NotFoundPage", () => {
    renderAt("khong-ton-tai-trong-projects");
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});
