import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import TerrainConceptPage, { metadata } from "@/app/concepts/terrain/page";

// Experience là client component nặng canvas — stub lại, page chỉ cần shell.
vi.mock("@/features/concepts/terrain", () => ({
  TerrainExperience: () => <div data-testid="terrain-experience" />,
}));

describe("trang /concepts/terrain", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Twelve Years of Terrain — 3D Concept");
  });

  it("render ConceptShell với thông tin concept terrain từ registry", () => {
    render(<MemoryRouter><TerrainConceptPage /></MemoryRouter>);
    const concept = getConcept("terrain");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount TerrainExperience bên trong shell", () => {
    render(<MemoryRouter><TerrainConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("terrain-experience")).toBeInTheDocument();
  });
});
