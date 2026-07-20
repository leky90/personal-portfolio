import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import CostOfChangeConceptPage, {
  metadata,
} from "@/app/concepts/cost-of-change/page";

vi.mock("@/features/concepts/cost-of-change", () => ({
  ChangeExperience: () => <div data-testid="change-experience" />,
}));

describe("trang /concepts/cost-of-change", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Cost of Change — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<CostOfChangeConceptPage />);
    const concept = getConcept("cost-of-change");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount ChangeExperience bên trong shell", () => {
    render(<CostOfChangeConceptPage />);
    expect(screen.getByTestId("change-experience")).toBeInTheDocument();
  });
});
