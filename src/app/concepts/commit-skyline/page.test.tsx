import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import CommitSkylineConceptPage, {
  metadata,
} from "@/app/concepts/commit-skyline/page";

vi.mock("@/features/concepts/commit-skyline", () => ({
  SkylineExperience: () => <div data-testid="skyline-experience" />,
}));

describe("trang /concepts/commit-skyline", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Commit Skyline — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><CommitSkylineConceptPage /></MemoryRouter>);
    const concept = getConcept("commit-skyline");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount SkylineExperience bên trong shell", () => {
    render(<MemoryRouter><CommitSkylineConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("skyline-experience")).toBeInTheDocument();
  });
});
