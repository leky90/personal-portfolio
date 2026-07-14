import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TerrainConceptPage, { metadata } from "@/app/concepts/terrain/page";

// Experience là client component nặng canvas — stub lại, page chỉ cần shell.
vi.mock("@/features/concepts/terrain", () => ({
  TerrainExperience: () => <div data-testid="terrain-experience" />,
}));

describe("trang /concepts/terrain", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Ten Years of Terrain — 3D Concept");
  });

  it("render ConceptShell với thông tin concept terrain từ registry", () => {
    render(<TerrainConceptPage />);
    expect(screen.getByText(/01 · Ten Years of Terrain/)).toBeInTheDocument();
    expect(screen.getByText("8.7/10")).toBeInTheDocument();
  });

  it("mount TerrainExperience bên trong shell", () => {
    render(<TerrainConceptPage />);
    expect(screen.getByTestId("terrain-experience")).toBeInTheDocument();
  });
});
