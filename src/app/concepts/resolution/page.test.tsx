import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import ResolutionConceptPage, {
  metadata,
} from "@/app/concepts/resolution/page";

// Experience là client component nặng canvas — stub lại, page chỉ cần shell.
vi.mock("@/features/concepts/resolution", () => ({
  ResolutionExperience: () => <div data-testid="resolution-experience" />,
}));

describe("trang /concepts/resolution", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Resolution — 3D Concept");
  });

  it("render ConceptShell với thông tin concept resolution từ registry", () => {
    render(<ResolutionConceptPage />);
    const concept = getConcept("resolution");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount ResolutionExperience bên trong shell", () => {
    render(<ResolutionConceptPage />);
    expect(screen.getByTestId("resolution-experience")).toBeInTheDocument();
  });
});
