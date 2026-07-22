import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MeshExperience } from "@/features/concepts/monolith-to-mesh/components/mesh-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/monolith-to-mesh/components/mesh-canvas-loader",
  () => ({
    MeshCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("MeshExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline MONOLITH TO MESH", () => {
    render(<MeshExperience />);
    expect(screen.getByText(/MONOLITH TO MESH/i)).toBeInTheDocument();
  });

  it("5 chương theo năm 2014 → 2026, có nhịp gộp ngược 2021", () => {
    render(<MeshExperience />);
    for (const year of ["2014", "2017", "2021", "2023", "2026"]) {
      expect(screen.getAllByText(new RegExp(year)).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getAllByText(/gộp ngược/i).length).toBeGreaterThanOrEqual(1);
  });

  it("era stepper là anchor nav a11y tới từng chương", () => {
    render(<MeshExperience />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const anchor of ["#ch-2014", "#ch-2017", "#ch-2021", "#ch-2023", "#ch-2026"]) {
      expect(hrefs).toContain(anchor);
    }
  });

  it("HUD ADR whisper mặc định mời hover mảnh", () => {
    render(<MeshExperience />);
    expect(screen.getByTestId("service-hud").textContent).toMatch(/mảnh/i);
  });

  it("core idea nhắc instanced draw call và GPU-side morph", () => {
    render(<MeshExperience />);
    expect(screen.getAllByText(/instanced/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<MeshExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
