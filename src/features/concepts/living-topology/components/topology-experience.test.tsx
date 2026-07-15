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

  it("timeline mọc theo 4 mốc era 2016 → 2024", () => {
    render(<TopologyExperience />);
    for (const year of ["2016", "2018", "2021", "2024"]) {
      expect(screen.getByText(year)).toBeInTheDocument();
    }
  });

  it("3 project card để isolate subgraph khi hover", () => {
    render(<TopologyExperience />);
    expect(screen.getByText("Atlas Platform")).toBeInTheDocument();
    expect(screen.getByText("Pulse Analytics")).toBeInTheDocument();
    expect(screen.getByText("Relay Payments")).toBeInTheDocument();
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
