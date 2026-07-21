import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import TenYearGalaxyConceptPage, {
  metadata,
} from "@/app/concepts/ten-year-galaxy/page";

vi.mock("@/features/concepts/ten-year-galaxy", () => ({
  GalaxyExperience: () => <div data-testid="galaxy-experience" />,
}));

describe("trang /concepts/ten-year-galaxy", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Ten-Year Galaxy — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<TenYearGalaxyConceptPage />);
    const concept = getConcept("ten-year-galaxy");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount GalaxyExperience bên trong shell", () => {
    render(<TenYearGalaxyConceptPage />);
    expect(screen.getByTestId("galaxy-experience")).toBeInTheDocument();
  });
});
