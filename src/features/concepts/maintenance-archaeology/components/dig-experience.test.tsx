import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { STRATA } from "@/features/concepts/maintenance-archaeology/lib/strata-data";
import { DigExperience } from "@/features/concepts/maintenance-archaeology/components/dig-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/maintenance-archaeology/components/dig-canvas-loader",
  () => ({
    DigCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("DigExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline MAINTENANCE ARCHAEOLOGY", () => {
    render(<DigExperience />);
    expect(screen.getByText(/MAINTENANCE ARCHAEOLOGY/i)).toBeInTheDocument();
  });

  it("đủ 5 stake tag stratum với label + khoảng năm", () => {
    render(<DigExperience />);
    for (const stratum of STRATA) {
      expect(screen.getByText(stratum.label)).toBeInTheDocument();
      expect(
        screen.getAllByText(new RegExp(`${stratum.fromYear}`)).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("thước độ sâu hiện 2026 ở mặt đất và 2014 ở đáy, không còn 2012", () => {
    const { container } = render(<DigExperience />);
    const ruler = container.querySelector('[data-testid="depth-ruler"]');
    expect(ruler).not.toBeNull();
    expect(ruler!.textContent).toContain("2026");
    expect(ruler!.textContent).toContain("2014");
    expect(ruler!.textContent).not.toContain("2012");
  });

  it("hero nêu đúng 12 năm nghề, 2014 tới 2026", () => {
    render(<DigExperience />);
    expect(
      screen.getByText(/12 năm nghề, 2014 tới 2026/),
    ).toBeInTheDocument();
  });

  it("HUD carbon-dating mặc định mời probe một mảnh", () => {
    render(<DigExperience />);
    expect(screen.getByTestId("find-hud").textContent).toMatch(/mảnh|probe/i);
  });

  it("core idea nhắc git log, instanced và draw call", () => {
    render(<DigExperience />);
    expect(screen.getAllByText(/git log/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/instanced/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<DigExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
