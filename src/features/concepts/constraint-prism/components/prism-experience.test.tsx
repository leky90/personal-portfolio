import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  CONSTRAINTS,
  DECISIONS,
} from "@/features/concepts/constraint-prism/lib/prism-data";
import { PrismExperience } from "@/features/concepts/constraint-prism/components/prism-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/constraint-prism/components/prism-canvas-loader",
  () => ({
    PrismCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("PrismExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline CONSTRAINT PRISM", () => {
    render(<PrismExperience />);
    expect(screen.getByText(/CONSTRAINT PRISM/i)).toBeInTheDocument();
  });

  it("đủ 5 section ràng buộc với label + tradeoff", () => {
    render(<PrismExperience />);
    for (const constraint of CONSTRAINTS) {
      expect(
        screen.getAllByText(constraint.label).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("5 toggle ràng buộc dạng button, mặc định đều tham gia", () => {
    render(<PrismExperience />);
    const toggles = screen.getAllByRole("button", {
      name: /ràng buộc/i,
    });
    expect(toggles).toHaveLength(5);
    for (const toggle of toggles) {
      expect(toggle.getAttribute("aria-pressed")).toBe("true");
    }
  });

  it("bấm toggle: aria-pressed lật false rồi lật lại true", () => {
    render(<PrismExperience />);
    const [first] = screen.getAllByRole("button", { name: /ràng buộc/i });
    fireEvent.click(first);
    expect(first.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(first);
    expect(first.getAttribute("aria-pressed")).toBe("true");
  });

  it("HUD quyết định liệt kê đủ decision plates + caption aria-live", () => {
    render(<PrismExperience />);
    const hud = screen.getByTestId("decision-hud");
    for (const decision of DECISIONS) {
      expect(hud.textContent).toContain(decision.label);
    }
    expect(screen.getByTestId("prism-caption").textContent).toMatch(
      /ràng buộc/i,
    );
  });

  it("core idea nhắc draw call và uPoints", () => {
    render(<PrismExperience />);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/uPoints/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<PrismExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
