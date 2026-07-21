import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import KnowledgeRelayConceptPage, {
  metadata,
} from "@/app/concepts/knowledge-relay/page";

vi.mock("@/features/concepts/knowledge-relay", () => ({
  RelayExperience: () => <div data-testid="relay-experience" />,
}));

describe("trang /concepts/knowledge-relay", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Knowledge Relay — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><KnowledgeRelayConceptPage /></MemoryRouter>);
    const concept = getConcept("knowledge-relay");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount RelayExperience bên trong shell", () => {
    render(<MemoryRouter><KnowledgeRelayConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("relay-experience")).toBeInTheDocument();
  });
});
