import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import CompiledLightConceptPage, {
  metadata,
} from "@/app/concepts/compiled-light/page";

vi.mock("@/features/concepts/compiled-light", () => ({
  CompiledExperience: () => <div data-testid="compiled-experience" />,
}));

describe("trang /concepts/compiled-light", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Compiled Light — 3D Concept");
  });

  it("render ConceptShell với thông tin concept từ registry", () => {
    render(<MemoryRouter><CompiledLightConceptPage /></MemoryRouter>);
    const concept = getConcept("compiled-light");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount CompiledExperience bên trong shell", () => {
    render(<MemoryRouter><CompiledLightConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("compiled-experience")).toBeInTheDocument();
  });
});
