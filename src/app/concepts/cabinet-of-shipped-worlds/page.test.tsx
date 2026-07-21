import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import CabinetConceptPage, {
  metadata,
} from "@/app/concepts/cabinet-of-shipped-worlds/page";

vi.mock("@/features/concepts/cabinet-of-shipped-worlds", () => ({
  CabinetExperience: () => <div data-testid="cabinet-experience" />,
}));

describe("trang /concepts/cabinet-of-shipped-worlds", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Cabinet of Shipped Worlds — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<CabinetConceptPage />);
    const concept = getConcept("cabinet-of-shipped-worlds");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount CabinetExperience bên trong shell", () => {
    render(<CabinetConceptPage />);
    expect(screen.getByTestId("cabinet-experience")).toBeInTheDocument();
  });
});
