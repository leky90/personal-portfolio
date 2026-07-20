import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LAYERS } from "@/features/concepts/full-stack-strata/lib/island-data";
import { IslandExperience } from "@/features/concepts/full-stack-strata/components/island-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/full-stack-strata/components/island-canvas-loader",
  () => ({
    IslandCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("IslandExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline FULL-STACK STRATA", () => {
    render(<IslandExperience />);
    expect(screen.getByText(/FULL-STACK STRATA/i)).toBeInTheDocument();
  });

  it("terminal trace mặc định mời bắn request", () => {
    render(<IslandExperience />);
    expect(screen.getByTestId("trace-terminal").textContent).toMatch(
      /request|bắn/i,
    );
  });

  it("bấm nút bắn: terminal chuyển sang trạng thái đang bắn", () => {
    render(<IslandExperience />);
    fireEvent.click(screen.getByTestId("fire-button"));
    expect(screen.getByTestId("trace-terminal").textContent).toMatch(/▶/);
  });

  it("3 section tầng với label từ dữ liệu", () => {
    render(<IslandExperience />);
    for (const layer of LAYERS) {
      expect(screen.getAllByText(layer.label).length).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  it("core idea nhắc draw call, demand và instanced", () => {
    render(<IslandExperience />);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/instanced/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<IslandExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
