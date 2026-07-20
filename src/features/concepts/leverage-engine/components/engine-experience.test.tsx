import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OUTPUTS } from "@/features/concepts/leverage-engine/lib/gear-data";
import { EngineExperience } from "@/features/concepts/leverage-engine/components/engine-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/leverage-engine/components/engine-canvas-loader",
  () => ({
    EngineCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("EngineExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline LEVERAGE ENGINE", () => {
    render(<EngineExperience />);
    expect(screen.getByText(/LEVERAGE ENGINE/i)).toBeInTheDocument();
  });

  it("4 section đầu ra với nhãn và tỷ số đòn bẩy ×8..×24", () => {
    render(<EngineExperience />);
    for (const output of OUTPUTS) {
      expect(screen.getAllByText(output.label).length).toBeGreaterThanOrEqual(
        1,
      );
    }
    for (const ratio of ["×8", "×12", "×16", "×24"]) {
      expect(screen.getAllByText(new RegExp(ratio)).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("odometer HUD mặc định nêu tổng đòn bẩy ×60", () => {
    render(<EngineExperience />);
    expect(screen.getByTestId("engine-odometer").textContent).toMatch(/×60/);
  });

  it("ArrowRight quay tay quay: dòng tốc độ cập nhật từ DOM", () => {
    render(<EngineExperience />);
    fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });
    expect(screen.getByTestId("engine-speed").textContent).toMatch(/0\.6/);
  });

  it("core idea nhắc DAG, draw call và demand", () => {
    render(<EngineExperience />);
    expect(screen.getAllByText(/DAG/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<EngineExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
