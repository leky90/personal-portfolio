import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { ProjectsSection } from "@/components/sections/projects-section";
import { PROJECTS } from "@/lib/data/projects";

describe("ProjectsSection", () => {
  it("section id=work với đủ 3 project card", () => {
    render(<MemoryRouter><ProjectsSection /></MemoryRouter>);
    expect(document.getElementById("work")).not.toBeNull();
    for (const project of PROJECTS) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.summary)).toBeInTheDocument();
    }
  });

  it("stack hiển thị dạng badge", () => {
    render(<MemoryRouter><ProjectsSection /></MemoryRouter>);
    for (const item of PROJECTS[0].stack) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("mỗi card dẫn tới trang case study", () => {
    render(<MemoryRouter><ProjectsSection /></MemoryRouter>);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const project of PROJECTS) {
      expect(hrefs).toContain(`/projects/${project.slug}`);
    }
  });
});
