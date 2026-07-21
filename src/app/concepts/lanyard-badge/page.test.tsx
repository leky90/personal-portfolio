import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import LanyardBadgeConceptPage, {
  metadata,
} from "@/app/concepts/lanyard-badge/page";

vi.mock("@/features/concepts/lanyard-badge", () => ({
  BadgeExperience: () => <div data-testid="badge-experience" />,
}));

describe("trang /concepts/lanyard-badge", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("The Credential — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><LanyardBadgeConceptPage /></MemoryRouter>);
    const concept = getConcept("lanyard-badge");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount BadgeExperience bên trong shell", () => {
    render(<MemoryRouter><LanyardBadgeConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("badge-experience")).toBeInTheDocument();
  });
});
