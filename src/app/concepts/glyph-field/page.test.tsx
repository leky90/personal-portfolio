import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import GlyphFieldConceptPage, {
  metadata,
} from "@/app/concepts/glyph-field/page";

vi.mock("@/features/concepts/glyph-field", () => ({
  GlyphExperience: () => <div data-testid="glyph-experience" />,
}));

describe("trang /concepts/glyph-field", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Glyph Field — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><GlyphFieldConceptPage /></MemoryRouter>);
    const concept = getConcept("glyph-field");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount GlyphExperience bên trong shell", () => {
    render(<MemoryRouter><GlyphFieldConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("glyph-experience")).toBeInTheDocument();
  });
});
