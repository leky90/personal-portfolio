import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import LeverageEngineConceptPage, {
  metadata,
} from "@/app/concepts/leverage-engine/page";

vi.mock("@/features/concepts/leverage-engine", () => ({
  EngineExperience: () => <div data-testid="engine-experience" />,
}));

describe("trang /concepts/leverage-engine", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Leverage Engine — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><LeverageEngineConceptPage /></MemoryRouter>);
    const concept = getConcept("leverage-engine");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount EngineExperience bên trong shell", () => {
    render(<MemoryRouter><LeverageEngineConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("engine-experience")).toBeInTheDocument();
  });
});
