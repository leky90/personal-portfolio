import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import IncidentBlackBoxConceptPage, {
  metadata,
} from "@/app/concepts/incident-black-box/page";

vi.mock("@/features/concepts/incident-black-box", () => ({
  BlackBoxExperience: () => <div data-testid="black-box-experience" />,
}));

describe("trang /concepts/incident-black-box", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Incident Black Box — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><IncidentBlackBoxConceptPage /></MemoryRouter>);
    const concept = getConcept("incident-black-box");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount BlackBoxExperience bên trong shell", () => {
    render(<MemoryRouter><IncidentBlackBoxConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("black-box-experience")).toBeInTheDocument();
  });
});
