import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SPANS } from "@/features/concepts/request-lifecycle/lib/trace-data";
import { TraceExperience } from "@/features/concepts/request-lifecycle/components/trace-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/request-lifecycle/components/trace-canvas-loader",
  () => ({
    TraceCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("TraceExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline REQUEST LIFECYCLE + dòng curl giả lập", () => {
    render(<TraceExperience />);
    expect(screen.getByText(/REQUEST LIFECYCLE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/curl -i/i).length).toBeGreaterThanOrEqual(1);
  });

  it("rail waterfall có đúng một hàng cho mỗi span", () => {
    const { container } = render(<TraceExperience />);
    const rail = container.querySelector('[data-testid="trace-rail"]');
    expect(rail).not.toBeNull();
    expect(rail!.querySelectorAll("[data-span-index]").length).toBe(
      SPANS.length,
    );
  });

  it("mỗi span có một section kể chuyện với label + service", () => {
    render(<TraceExperience />);
    for (const span of SPANS) {
      expect(
        screen.getAllByText(span.label).length,
      ).toBeGreaterThanOrEqual(1);
      expect(
        screen.getAllByText(new RegExp(span.service)).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("HUD trace mặc định mời cuộn để bắn request", () => {
    render(<TraceExperience />);
    expect(screen.getByTestId("trace-hud").textContent).toMatch(
      /cuộn|request/i,
    );
  });

  it("core idea nhắc distributed trace, draw call và demand", () => {
    render(<TraceExperience />);
    expect(
      screen.getAllByText(/distributed trace/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<TraceExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
