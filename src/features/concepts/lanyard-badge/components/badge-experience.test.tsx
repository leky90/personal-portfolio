import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BADGE_SPECS } from "@/features/concepts/lanyard-badge/lib/badge-data";
import { BadgeExperience } from "@/features/concepts/lanyard-badge/components/badge-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/lanyard-badge/components/badge-canvas-loader",
  () => ({
    BadgeCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("BadgeExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline THE CREDENTIAL", () => {
    render(<BadgeExperience />);
    expect(screen.getByText(/THE CREDENTIAL/i)).toBeInTheDocument();
  });

  it("HUD nêu pull-to-enter", () => {
    render(<BadgeExperience />);
    expect(screen.getByTestId("badge-hud").textContent).toMatch(
      /kéo|thẻ/i,
    );
  });

  it("có section đích pull-to-enter và spec sheet đủ dòng", () => {
    const { container } = render(<BadgeExperience />);
    expect(container.querySelector("[data-enter-target]")).not.toBeNull();
    for (const line of BADGE_SPECS) {
      expect(screen.getAllByText(line).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("core idea nhắc con lắc, draw call và demand", () => {
    render(<BadgeExperience />);
    expect(screen.getAllByText(/con lắc/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<BadgeExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
