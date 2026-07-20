import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import FullStackStrataConceptPage, {
  metadata,
} from "@/app/concepts/full-stack-strata/page";

vi.mock("@/features/concepts/full-stack-strata", () => ({
  IslandExperience: () => <div data-testid="island-experience" />,
}));

describe("trang /concepts/full-stack-strata", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Full-Stack Strata — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<FullStackStrataConceptPage />);
    const concept = getConcept("full-stack-strata");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount IslandExperience bên trong shell", () => {
    render(<FullStackStrataConceptPage />);
    expect(screen.getByTestId("island-experience")).toBeInTheDocument();
  });
});
