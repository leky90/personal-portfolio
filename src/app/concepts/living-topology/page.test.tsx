import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import LivingTopologyConceptPage, {
  metadata,
} from "@/app/concepts/living-topology/page";

vi.mock("@/features/concepts/living-topology", () => ({
  TopologyExperience: () => <div data-testid="topology-experience" />,
}));

describe("trang /concepts/living-topology", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Living Topology — 3D Concept");
  });

  it("render ConceptShell với thông tin concept từ registry", () => {
    render(<MemoryRouter><LivingTopologyConceptPage /></MemoryRouter>);
    const concept = getConcept("living-topology");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount TopologyExperience bên trong shell", () => {
    render(<MemoryRouter><LivingTopologyConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("topology-experience")).toBeInTheDocument();
  });
});
