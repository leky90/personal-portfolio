import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DECISIONS } from "@/features/concepts/decision-diff/lib/decisions-data";
import { DecisionExperience } from "@/features/concepts/decision-diff/components/decision-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/decision-diff/components/decision-canvas-loader",
  () => ({
    DecisionCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("DecisionExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline DECISION DIFF", () => {
    render(<DecisionExperience />);
    expect(screen.getByText(/DECISION DIFF/i)).toBeInTheDocument();
  });

  it("6 ADR card dạng diff với dòng +/- và data-decision-index", () => {
    const { container } = render(<DecisionExperience />);
    expect(container.querySelectorAll("[data-decision-index]")).toHaveLength(
      DECISIONS.length,
    );
    for (const d of DECISIONS) {
      expect(screen.getByText(`+ ${d.chosen}`)).toBeInTheDocument();
      expect(screen.getByText(`- ${d.rejected}`)).toBeInTheDocument();
      expect(screen.getByText(`# ${d.consequence}`)).toBeInTheDocument();
    }
  });

  it("HUD chi phí nhánh ma mặc định mời hover", () => {
    render(<DecisionExperience />);
    expect(screen.getByTestId("ghost-hud").textContent).toMatch(/nhánh/i);
  });

  it("kết bằng fork CTA: '+ hire me' mailto và '- keep scrolling'", () => {
    render(<DecisionExperience />);
    const hire = screen.getByRole("link", { name: /\+ hire me/i });
    expect(hire.getAttribute("href")).toMatch(/^mailto:/);
    expect(screen.getByText(/- keep scrolling/i)).toBeInTheDocument();
  });

  it("core idea nhắc ADR và draw call", () => {
    render(<DecisionExperience />);
    expect(screen.getAllByText(/ADR/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<DecisionExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
