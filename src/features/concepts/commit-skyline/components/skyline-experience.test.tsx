import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LANDMARKS } from "@/features/concepts/commit-skyline/lib/skyline-data";
import { SkylineExperience } from "@/features/concepts/commit-skyline/components/skyline-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/commit-skyline/components/skyline-canvas-loader",
  () => ({
    SkylineCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("SkylineExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline COMMIT SKYLINE", () => {
    render(<SkylineExperience />);
    expect(screen.getByText(/COMMIT SKYLINE/i)).toBeInTheDocument();
  });

  it("copy neo mốc thật: 4745 ngày, mười hai năm, block 2014", () => {
    render(<SkylineExperience />);
    expect(screen.getByText(/4745 ngày/)).toBeInTheDocument();
    expect(screen.getAllByText(/Mười hai năm/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/block 2014/)).toBeInTheDocument();
    expect(screen.queryByText(/Mười bốn năm/i)).not.toBeInTheDocument();
  });

  it("HUD tooltip mặc định mời rê lên một toà nhà", () => {
    render(<SkylineExperience />);
    expect(screen.getByTestId("skyline-hud").textContent).toMatch(
      /toà|rê/i,
    );
  });

  it("đủ 6 landmark với label từ dữ liệu", () => {
    render(<SkylineExperience />);
    for (const landmark of LANDMARKS) {
      expect(
        screen.getAllByText(new RegExp(landmark.label)).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("core idea nhắc InstancedMesh, draw call và demand", () => {
    render(<SkylineExperience />);
    expect(
      screen.getAllByText(/InstancedMesh/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<SkylineExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
