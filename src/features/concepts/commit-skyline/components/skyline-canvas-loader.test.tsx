import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createSkylineState } from "@/features/concepts/commit-skyline/lib/skyline-state";
import { SkylineCanvasLoader } from "@/features/concepts/commit-skyline/components/skyline-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <SkylineCanvasLoader
      skylineStateRef={{ current: createSkylineState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("SkylineCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
