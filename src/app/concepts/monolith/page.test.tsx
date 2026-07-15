import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MonolithConceptPage, {
  metadata,
} from "@/app/concepts/monolith/page";

vi.mock("@/features/concepts/monolith", () => ({
  MonolithExperience: () => <div data-testid="monolith-experience" />,
}));

describe("trang /concepts/monolith", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Monolith — 3D Concept");
  });

  it("render ConceptShell với thông tin concept từ registry", () => {
    render(<MonolithConceptPage />);
    expect(screen.getByText(/03 · Monolith/)).toBeInTheDocument();
    expect(screen.getByText("7.7/10")).toBeInTheDocument();
  });

  it("mount MonolithExperience bên trong shell", () => {
    render(<MonolithConceptPage />);
    expect(screen.getByTestId("monolith-experience")).toBeInTheDocument();
  });
});
