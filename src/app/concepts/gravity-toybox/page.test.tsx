import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import GravityToyboxConceptPage, {
  metadata,
} from "@/app/concepts/gravity-toybox/page";

vi.mock("@/features/concepts/gravity-toybox", () => ({
  ToyboxExperience: () => <div data-testid="toybox-experience" />,
}));

describe("trang /concepts/gravity-toybox", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Weight of Experience — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<GravityToyboxConceptPage />);
    const concept = getConcept("gravity-toybox");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount ToyboxExperience bên trong shell", () => {
    render(<GravityToyboxConceptPage />);
    expect(screen.getByTestId("toybox-experience")).toBeInTheDocument();
  });
});
