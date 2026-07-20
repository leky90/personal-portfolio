import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import MonolithToMeshConceptPage, {
  metadata,
} from "@/app/concepts/monolith-to-mesh/page";

vi.mock("@/features/concepts/monolith-to-mesh", () => ({
  MeshExperience: () => <div data-testid="mesh-experience" />,
}));

describe("trang /concepts/monolith-to-mesh", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Monolith to Mesh — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MonolithToMeshConceptPage />);
    const concept = getConcept("monolith-to-mesh");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount MeshExperience bên trong shell", () => {
    render(<MonolithToMeshConceptPage />);
    expect(screen.getByTestId("mesh-experience")).toBeInTheDocument();
  });
});
