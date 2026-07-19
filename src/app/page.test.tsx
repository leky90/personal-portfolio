import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import { SITE } from "@/lib/data/site";
import { EXPERIENCE } from "@/lib/data/experience";
import { PROJECTS } from "@/lib/data/projects";

// Stage là client component nặng canvas — passthrough children trong jsdom.
vi.mock("@/components/three/terrain-stage", () => ({
  TerrainStage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="terrain-stage">{children}</div>
  ),
}));

describe("Trang chủ portfolio — Terrain art direction", () => {
  it("bọc toàn bộ nội dung trong TerrainStage duy nhất", () => {
    render(<Home />);
    expect(screen.getAllByTestId("terrain-stage")).toHaveLength(1);
  });

  it("hero là h1 tên thật từ site config", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      SITE.name,
    );
  });

  it("đủ các section chính theo thứ tự hành trình", () => {
    render(<Home />);
    for (const id of ["about", "experience", "work", "skills", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("4 era card gắn data-era-index cho camera terrain", () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll("[data-era-index]")).toHaveLength(
      EXPERIENCE.length,
    );
  });

  it("đủ 3 project và footer có link /lab", () => {
    render(<Home />);
    for (const project of PROJECTS) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/lab");
  });

  it("section writing preview dẫn tới /writing", () => {
    render(<Home />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/writing");
    expect(hrefs.some((href) => href?.startsWith("/writing/"))).toBe(true);
  });
});
