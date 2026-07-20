import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import DecisionDiffConceptPage, {
  metadata,
} from "@/app/concepts/decision-diff/page";

vi.mock("@/features/concepts/decision-diff", () => ({
  DecisionExperience: () => <div data-testid="decision-experience" />,
}));

describe("trang /concepts/decision-diff", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Decision Diff — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<DecisionDiffConceptPage />);
    const concept = getConcept("decision-diff");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount DecisionExperience bên trong shell", () => {
    render(<DecisionDiffConceptPage />);
    expect(screen.getByTestId("decision-experience")).toBeInTheDocument();
  });
});
