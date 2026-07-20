import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  EVENTS,
  INCIDENT,
} from "@/features/concepts/incident-black-box/lib/incident-data";
import { BlackBoxExperience } from "@/features/concepts/incident-black-box/components/black-box-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/incident-black-box/components/black-box-canvas-loader",
  () => ({
    BlackBoxCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("BlackBoxExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline INCIDENT BLACK BOX + metadata SEV-1", () => {
    render(<BlackBoxExperience />);
    expect(screen.getByText(/INCIDENT BLACK BOX/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SEV-1/).length).toBeGreaterThanOrEqual(1);
  });

  it("panel annotation liệt kê đủ mọi event của băng", () => {
    const { container } = render(<BlackBoxExperience />);
    expect(container.querySelectorAll("[data-event-t]")).toHaveLength(
      EVENTS.length,
    );
    expect(screen.getByText(EVENTS[0].label)).toBeInTheDocument();
  });

  it("có hint điều khiển bằng phím mũi tên (a11y kỹ sư)", () => {
    render(<BlackBoxExperience />);
    expect(screen.getAllByText(/mũi tên/i).length).toBeGreaterThanOrEqual(1);
  });

  it("postmortem chốt bằng 3 tấm bài học không đổ lỗi", () => {
    const { container } = render(<BlackBoxExperience />);
    expect(container.querySelectorAll("[data-lesson]")).toHaveLength(3);
    expect(screen.getAllByText(/blameless|không đổ lỗi/i).length).toBeGreaterThanOrEqual(1);
  });

  it("core idea nhắc một JSON nguồn + DataTexture + draw call", () => {
    render(<BlackBoxExperience />);
    expect(screen.getAllByText(/JSON/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/DataTexture/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<BlackBoxExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
    expect(INCIDENT.durationMin).toBeGreaterThan(0);
  });
});
