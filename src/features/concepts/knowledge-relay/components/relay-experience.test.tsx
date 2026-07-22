import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BATONS } from "@/features/concepts/knowledge-relay/lib/relay-data";
import { RelayExperience } from "@/features/concepts/knowledge-relay/components/relay-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/knowledge-relay/components/relay-canvas-loader",
  () => ({
    RelayCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("RelayExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline KNOWLEDGE RELAY", () => {
    render(<RelayExperience />);
    expect(screen.getByText(/KNOWLEDGE RELAY/i)).toBeInTheDocument();
  });

  it("bộ đếm HUD mặc định đứng ở năm 2014", () => {
    render(<RelayExperience />);
    expect(screen.getByTestId("relay-counter").textContent).toMatch(/2014/);
  });

  it("đủ 5 section baton với tên practice", () => {
    render(<RelayExperience />);
    for (const baton of BATONS) {
      expect(screen.getAllByText(baton.label).length).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  it("core idea nhắc Marey, draw call và demand", () => {
    render(<RelayExperience />);
    expect(screen.getAllByText(/Marey/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<RelayExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
