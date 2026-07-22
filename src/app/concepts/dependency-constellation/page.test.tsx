import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import DependencyConstellationConceptPage, {
  metadata,
} from "@/app/concepts/dependency-constellation/page";

vi.mock("@/features/concepts/dependency-constellation", () => ({
  ConstellationExperience: () => (
    <div data-testid="constellation-experience" />
  ),
}));

describe("trang /concepts/dependency-constellation", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Dependency Constellation — 3D Concept");
  });

  it("metadata description neo đúng 12 năm sự nghiệp (2014 → 2026)", () => {
    expect(metadata.description).toContain("12 năm sự nghiệp (2014 → 2026)");
    expect(metadata.description).not.toMatch(/2012|14 năm/);
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><DependencyConstellationConceptPage /></MemoryRouter>);
    const concept = getConcept("dependency-constellation");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount ConstellationExperience bên trong shell", () => {
    render(<MemoryRouter><DependencyConstellationConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("constellation-experience")).toBeInTheDocument();
  });
});
