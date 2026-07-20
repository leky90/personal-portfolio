import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LEDGER } from "@/features/concepts/cost-of-change/lib/ledger-data";
import { ChangeExperience } from "@/features/concepts/cost-of-change/components/change-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/cost-of-change/components/tower-canvas-loader",
  () => ({
    TowerCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("ChangeExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline COST OF CHANGE", () => {
    render(<ChangeExperience />);
    expect(screen.getByText(/COST OF CHANGE/i)).toBeInTheDocument();
  });

  it("đủ 10 thẻ sự kiện theo sổ cái, 3 thẻ đóng dấu REFACTOR", () => {
    render(<ChangeExperience />);
    for (const event of LEDGER) {
      expect(screen.getAllByText(event.title).length).toBeGreaterThanOrEqual(
        1,
      );
    }
    expect(screen.getAllByText(/^refactor$/i)).toHaveLength(
      LEDGER.filter((e) => e.kind === "refactor").length,
    );
  });

  it("toggle counterfactual: bấm bật aria-pressed và hiện chi phí ước tính", () => {
    render(<ChangeExperience />);
    const toggle = screen.getByRole("button", {
      name: /không bao giờ refactor/i,
    });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("change-hud").textContent).toMatch(
      /engineer-months/i,
    );
  });

  it("HUD mặc định hiện năm 2016 và mời cuộn", () => {
    render(<ChangeExperience />);
    expect(screen.getByTestId("change-hud").textContent).toMatch(/2016/);
  });

  it("core idea nhắc nợ kỹ thuật, instanced và draw call", () => {
    render(<ChangeExperience />);
    expect(screen.getAllByText(/nợ kỹ thuật/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText(/instanced/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<ChangeExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
