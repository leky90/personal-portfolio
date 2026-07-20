import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import ConstraintPrismConceptPage, {
  metadata,
} from "@/app/concepts/constraint-prism/page";

vi.mock("@/features/concepts/constraint-prism", () => ({
  PrismExperience: () => <div data-testid="prism-experience" />,
}));

describe("trang /concepts/constraint-prism", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Constraint Prism — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<ConstraintPrismConceptPage />);
    const concept = getConcept("constraint-prism");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount PrismExperience bên trong shell", () => {
    render(<ConstraintPrismConceptPage />);
    expect(screen.getByTestId("prism-experience")).toBeInTheDocument();
  });
});
