import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectsSection } from "@/components/sections/projects-section";
import { PROJECTS } from "@/lib/data/projects";

describe("ProjectsSection", () => {
  it("section id=work với đủ 3 project card", () => {
    render(<ProjectsSection />);
    expect(document.getElementById("work")).not.toBeNull();
    for (const project of PROJECTS) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.summary)).toBeInTheDocument();
    }
  });

  it("stack hiển thị dạng badge", () => {
    render(<ProjectsSection />);
    for (const item of PROJECTS[0].stack) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1);
    }
  });
});
