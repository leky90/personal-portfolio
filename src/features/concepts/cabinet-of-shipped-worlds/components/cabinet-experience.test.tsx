import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CELLS } from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-data";
import { CabinetExperience } from "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas-loader",
  () => ({
    CabinetCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("CabinetExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline CABINET OF SHIPPED WORLDS", () => {
    render(<CabinetExperience />);
    expect(
      screen.getByText(/CABINET OF SHIPPED WORLDS/i),
    ).toBeInTheDocument();
  });

  it("plaque HUD mặc định mời rê lên một ô kính", () => {
    render(<CabinetExperience />);
    expect(screen.getByTestId("cabinet-plaque").textContent).toMatch(
      /ô kính|rê/i,
    );
  });

  it("4 thế giới live có card với title + metric", () => {
    render(<CabinetExperience />);
    for (const cell of CELLS.filter((c) => c.world !== null)) {
      expect(screen.getAllByText(cell.title).length).toBeGreaterThanOrEqual(
        1,
      );
      expect(screen.getAllByText(cell.metric).length).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  it("core idea nhắc portal, draw call và demand", () => {
    render(<CabinetExperience />);
    expect(screen.getAllByText(/portal/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<CabinetExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
