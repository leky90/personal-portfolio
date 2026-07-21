import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import PhosphorLensConceptPage, {
  metadata,
} from "@/app/concepts/phosphor-lens/page";

vi.mock("@/features/concepts/phosphor-lens", () => ({
  LensExperience: () => <div data-testid="lens-experience" />,
}));

describe("trang /concepts/phosphor-lens", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Phosphor Lens — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<PhosphorLensConceptPage />);
    const concept = getConcept("phosphor-lens");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount LensExperience bên trong shell", () => {
    render(<PhosphorLensConceptPage />);
    expect(screen.getByTestId("lens-experience")).toBeInTheDocument();
  });
});
