import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ERAS } from "@/features/concepts/desk-version-controlled/lib/desk-data";
import { DeskExperience } from "@/features/concepts/desk-version-controlled/components/desk-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/desk-version-controlled/components/desk-canvas-loader",
  () => ({
    DeskCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("DeskExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline DESK, VERSION-CONTROLLED", () => {
    render(<DeskExperience />);
    expect(
      screen.getByText(/DESK, VERSION-CONTROLLED/i),
    ).toBeInTheDocument();
  });

  it("year ticker mặc định đứng ở 2016", () => {
    render(<DeskExperience />);
    expect(screen.getByTestId("desk-year").textContent).toBe("2016");
  });

  it("commit line HUD mặc định là một conventional commit", () => {
    render(<DeskExperience />);
    expect(screen.getByTestId("desk-commit").textContent).toMatch(
      /feat|chore/,
    );
  });

  it("tooltip HUD mặc định mời rê lên đồ vật", () => {
    render(<DeskExperience />);
    expect(screen.getByTestId("desk-tooltip").textContent).toMatch(
      /rê|đồ vật/i,
    );
  });

  it("đủ 4 era section với năm từ dữ liệu", () => {
    render(<DeskExperience />);
    for (const era of ERAS) {
      expect(
        screen.getAllByText(new RegExp(`${era.year}`)).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("core idea nhắc draw call, demand và refactor", () => {
    render(<DeskExperience />);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/refactor/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<DeskExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
