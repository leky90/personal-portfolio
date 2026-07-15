import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MonolithExperience } from "@/features/concepts/monolith/components/monolith-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/monolith/components/monolith-canvas-loader",
  () => ({
    MonolithCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("MonolithExperience — layout DOM của trang concept", () => {
  it("hero hiển thị tên KY LE", () => {
    render(<MonolithExperience />);
    expect(screen.getByText(/KY LE/)).toBeInTheDocument();
  });

  it("nav section có anchor tới work / years / contact", () => {
    render(<MonolithExperience />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("#work");
    expect(hrefs).toContain("#years");
    expect(hrefs).toContain("#contact");
  });

  it("selected work có 3 mục đánh số 01-03", () => {
    render(<MonolithExperience />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("timeline năm hiển thị 2016 → 2026", () => {
    render(<MonolithExperience />);
    expect(screen.getByText("2016")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("contact chốt bằng SAY HI + mailto", () => {
    render(<MonolithExperience />);
    expect(screen.getByText(/SAY HI/)).toBeInTheDocument();
    expect(
      screen.getAllByRole("link").some((link) =>
        (link.getAttribute("href") ?? "").startsWith("mailto:"),
      ),
    ).toBe(true);
  });

  it("panel core idea nhắc 0% GPU và draw call", () => {
    render(<MonolithExperience />);
    expect(screen.getAllByText(/0% GPU/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<MonolithExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
