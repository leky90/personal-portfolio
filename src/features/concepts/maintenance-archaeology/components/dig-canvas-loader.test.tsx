import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createDigState } from "@/features/concepts/maintenance-archaeology/lib/dig-state";
import { DigCanvasLoader } from "@/features/concepts/maintenance-archaeology/components/dig-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <DigCanvasLoader
      digStateRef={{ current: createDigState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("DigCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
