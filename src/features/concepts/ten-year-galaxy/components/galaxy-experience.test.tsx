import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GALAXY_ERAS } from "@/features/concepts/ten-year-galaxy/lib/galaxy-data";
import { GalaxyExperience } from "@/features/concepts/ten-year-galaxy/components/galaxy-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/ten-year-galaxy/components/galaxy-canvas-loader",
  () => ({
    GalaxyCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("GalaxyExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline TEN-YEAR GALAXY", () => {
    render(<GalaxyExperience />);
    expect(screen.getByText(/TEN-YEAR GALAXY/i)).toBeInTheDocument();
  });

  it("ticker năm mặc định đứng ở 2016, aria-live", () => {
    render(<GalaxyExperience />);
    const ticker = screen.getByTestId("galaxy-year");
    expect(ticker.textContent).toMatch(/2016/);
    expect(ticker.getAttribute("aria-live")).toBe("polite");
  });

  it("4 section cánh tay era với label từ dữ liệu", () => {
    render(<GalaxyExperience />);
    for (const era of GALAXY_ERAS) {
      expect(screen.getAllByText(era.label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("ADR note giải thích mapping tuần → sao (chống decorative-particle)", () => {
    render(<GalaxyExperience />);
    expect(screen.getByTestId("galaxy-adr").textContent).toMatch(
      /tuần|sao/i,
    );
  });

  it("core idea nhắc draw call và demand", () => {
    render(<GalaxyExperience />);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<GalaxyExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
