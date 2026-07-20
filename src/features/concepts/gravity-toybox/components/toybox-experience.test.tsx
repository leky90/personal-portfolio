import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SKILLS } from "@/features/concepts/gravity-toybox/lib/toybox-data";
import { ToyboxExperience } from "@/features/concepts/gravity-toybox/components/toybox-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/gravity-toybox/components/toybox-canvas-loader",
  () => ({
    ToyboxCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("ToyboxExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline WEIGHT OF EXPERIENCE", () => {
    render(<ToyboxExperience />);
    expect(screen.getByText(/WEIGHT OF EXPERIENCE/i)).toBeInTheDocument();
  });

  it("HUD khối lượng mặc định mời rê lên đĩa tạ", () => {
    render(<ToyboxExperience />);
    expect(screen.getByTestId("mass-hud").textContent).toMatch(/đĩa|rê/i);
  });

  it("nút thả lại: bấm là HUD báo đang thả lại", () => {
    render(<ToyboxExperience />);
    fireEvent.click(screen.getByTestId("redrop-button"));
    expect(screen.getByTestId("mass-hud").textContent).toMatch(/thả lại/i);
  });

  it("bảng cân liệt kê đủ 12 công nghệ với số năm", () => {
    render(<ToyboxExperience />);
    for (const skill of SKILLS) {
      expect(screen.getAllByText(new RegExp(skill.name)).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("core idea nhắc instanced, draw call và demand", () => {
    render(<ToyboxExperience />);
    expect(screen.getAllByText(/instanced/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<ToyboxExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
