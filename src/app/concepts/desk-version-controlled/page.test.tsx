import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import DeskVersionControlledConceptPage, {
  metadata,
} from "@/app/concepts/desk-version-controlled/page";

vi.mock("@/features/concepts/desk-version-controlled", () => ({
  DeskExperience: () => <div data-testid="desk-experience" />,
}));

describe("trang /concepts/desk-version-controlled", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Desk, Version-Controlled — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<DeskVersionControlledConceptPage />);
    const concept = getConcept("desk-version-controlled");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount DeskExperience bên trong shell", () => {
    render(<DeskVersionControlledConceptPage />);
    expect(screen.getByTestId("desk-experience")).toBeInTheDocument();
  });
});
