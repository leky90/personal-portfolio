import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NODES } from "@/features/concepts/dependency-constellation/lib/constellation-data";
import { ConstellationExperience } from "@/features/concepts/dependency-constellation/components/constellation-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/dependency-constellation/components/constellation-canvas-loader",
  () => ({
    ConstellationCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("ConstellationExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline DEPENDENCY CONSTELLATION", () => {
    render(<ConstellationExperience />);
    expect(
      screen.getByText(/DEPENDENCY CONSTELLATION/i),
    ).toBeInTheDocument();
  });

  it("terminal HUD mặc định mời chạy pnpm why", () => {
    render(<ConstellationExperience />);
    expect(screen.getByTestId("why-terminal").textContent).toMatch(
      /pnpm why/i,
    );
  });

  it("ba section liệt kê đủ role, project, skill từ dữ liệu", () => {
    render(<ConstellationExperience />);
    for (const node of NODES) {
      expect(screen.getAllByText(node.label).length).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  it("core idea nhắc BFS bake, draw call và demand", () => {
    render(<ConstellationExperience />);
    expect(screen.getAllByText(/BFS/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<ConstellationExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
