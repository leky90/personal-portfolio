import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LensExperience } from "@/features/concepts/phosphor-lens/components/lens-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/phosphor-lens/components/lens-canvas-loader",
  () => ({
    LensCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("LensExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline PHOSPHOR LENS", () => {
    render(<LensExperience />);
    expect(screen.getByText(/PHOSPHOR LENS/i)).toBeInTheDocument();
  });

  it("HUD mời dùng con trỏ làm thấu kính", () => {
    render(<LensExperience />);
    expect(screen.getByTestId("lens-hud").textContent).toMatch(
      /thấu kính|con trỏ/i,
    );
  });

  it("có 3 section kể chuyện nén/attention/band chuyển tiếp", () => {
    const { container } = render(<LensExperience />);
    expect(
      container.querySelectorAll("[data-lens-section]").length,
    ).toBe(3);
  });

  it("core idea nhắc stateless, draw call và demand", () => {
    render(<LensExperience />);
    expect(screen.getAllByText(/stateless/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<LensExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
