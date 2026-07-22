import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TopologyExperience } from "@/features/concepts/living-topology/components/topology-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/living-topology/components/topology-canvas-loader",
  () => ({
    TopologyCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("TopologyExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline LIVING TOPOLOGY", () => {
    render(<TopologyExperience />);
    expect(screen.getByText(/LIVING TOPOLOGY/i)).toBeInTheDocument();
  });

  it("HUD telemetry mặc định mời hover node", () => {
    render(<TopologyExperience />);
    const hud = screen.getByTestId("telemetry");
    expect(hud.textContent).toMatch(/node/i);
  });

  it("timeline mọc theo 4 chặng nghề 2012 → 2021", () => {
    render(<TopologyExperience />);
    for (const year of ["2012", "2017", "2019", "2021"]) {
      expect(screen.getByText(year)).toBeInTheDocument();
    }
  });

  it("3 project card để isolate subgraph khi hover", () => {
    render(<TopologyExperience />);
    expect(screen.getByText("Treehouse dApp")).toBeInTheDocument();
    expect(screen.getByText("Build-to-Rent")).toBeInTheDocument();
    expect(screen.getByText("FoodMap")).toBeInTheDocument();
  });

  it("panel core idea nhắc layout bake và draw call", () => {
    render(<TopologyExperience />);
    expect(screen.getAllByText(/bake/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<TopologyExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
