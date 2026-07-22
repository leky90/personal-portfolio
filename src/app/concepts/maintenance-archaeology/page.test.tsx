import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import MaintenanceArchaeologyConceptPage, {
  metadata,
} from "@/app/concepts/maintenance-archaeology/page";

vi.mock("@/features/concepts/maintenance-archaeology", () => ({
  DigExperience: () => <div data-testid="dig-experience" />,
}));

describe("trang /concepts/maintenance-archaeology", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Maintenance Archaeology — 3D Concept");
  });

  it("metadata description neo đúng 12 năm nghề (2014 tới 2026)", () => {
    expect(metadata.description).toContain("12 năm nghề (2014 tới 2026)");
    expect(metadata.description).not.toContain("2012");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><MaintenanceArchaeologyConceptPage /></MemoryRouter>);
    const concept = getConcept("maintenance-archaeology");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount DigExperience bên trong shell", () => {
    render(<MemoryRouter><MaintenanceArchaeologyConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("dig-experience")).toBeInTheDocument();
  });
});
