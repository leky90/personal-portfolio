import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { COVER_PROJECTS } from "@/features/concepts/resolution/lib/cover-data";
import { ResolutionExperience } from "@/features/concepts/resolution/components/resolution-experience";

// Không mount canvas thật trong jsdom — loader được smoke-test riêng.
vi.mock(
  "@/features/concepts/resolution/components/resolution-canvas-loader",
  () => ({
    ResolutionCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("ResolutionExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline placeholder monospace", () => {
    render(<ResolutionExperience />);
    expect(screen.getByText(/KY LE/)).toBeInTheDocument();
    expect(screen.getByText(/I BUILD SYSTEMS THAT SHIP\./)).toBeInTheDocument();
  });

  it("ghi chú rõ TorusKnot chỉ là placeholder cho chân dung video thật", () => {
    render(<ResolutionExperience />);
    expect(screen.getAllByText(/video/i).length).toBeGreaterThanOrEqual(1);
  });

  it("hàng SELECTED WORK có đủ 3 case study với title + role", () => {
    render(<ResolutionExperience />);
    expect(screen.getByText(/SELECTED WORK/i)).toBeInTheDocument();
    for (const project of COVER_PROJECTS) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.role)).toBeInTheDocument();
    }
  });

  it("skills strip là DOM thuần với bar glyph khối", () => {
    render(<ResolutionExperience />);
    const bars = screen.getAllByText(/▮/);
    expect(bars.length).toBeGreaterThanOrEqual(5);
  });

  it("panel core idea (tiếng Việt) nhắc fragment shader và DPR", () => {
    render(<ResolutionExperience />);
    expect(screen.getAllByText(/fragment shader/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DPR/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần (một context WebGL duy nhất)", () => {
    render(<ResolutionExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
