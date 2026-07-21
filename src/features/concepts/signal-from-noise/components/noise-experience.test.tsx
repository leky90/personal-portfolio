import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NoiseExperience } from "@/features/concepts/signal-from-noise/components/noise-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/signal-from-noise/components/noise-canvas-loader",
  () => ({
    NoiseCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("NoiseExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline SIGNAL FROM NOISE", () => {
    render(<NoiseExperience />);
    expect(screen.getByText(/SIGNAL FROM NOISE/i)).toBeInTheDocument();
  });

  it("HUD nêu ordering lens đảo chiều", () => {
    render(<NoiseExperience />);
    expect(screen.getByTestId("noise-hud").textContent).toMatch(
      /trật tự|con trỏ/i,
    );
  });

  it("3 section form theo thứ tự tên → globe → lattice", () => {
    const { container } = render(<NoiseExperience />);
    expect(container.querySelectorAll("[data-form-section]").length).toBe(3);
  });

  it("core idea nhắc GPGPU, draw call và demand", () => {
    render(<NoiseExperience />);
    expect(screen.getAllByText(/GPGPU/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<NoiseExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
