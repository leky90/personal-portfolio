import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompiledExperience } from "@/features/concepts/compiled-light/components/compiled-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/compiled-light/components/compiled-canvas-loader",
  () => ({
    CompiledCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("CompiledExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline COMPILED LIGHT", () => {
    render(<CompiledExperience />);
    expect(screen.getByText(/COMPILED LIGHT/i)).toBeInTheDocument();
  });

  it("có HUD hiển thị cell size hiện tại", () => {
    render(<CompiledExperience />);
    expect(screen.getByTestId("cell-hud")).toBeInTheDocument();
    expect(screen.getByTestId("cell-hud").textContent).toMatch(/px/);
  });

  it("mô tả đủ 3 pass của pipeline", () => {
    render(<CompiledExperience />);
    expect(screen.getByText(/PASS 01/i)).toBeInTheDocument();
    expect(screen.getByText(/PASS 02/i)).toBeInTheDocument();
    expect(screen.getByText(/PASS 03/i)).toBeInTheDocument();
  });

  it("có hint điều khiển lens bằng bàn phím (mũi tên)", () => {
    render(<CompiledExperience />);
    expect(screen.getAllByText(/mũi tên/i).length).toBeGreaterThanOrEqual(1);
  });

  it("panel core idea nhắc DPR 1 và scroll compile độ phân giải", () => {
    render(<CompiledExperience />);
    expect(screen.getAllByText(/DPR 1/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/compile/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<CompiledExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
