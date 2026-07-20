import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createConstellationState } from "@/features/concepts/dependency-constellation/lib/constellation-state";
import { ConstellationCanvasLoader } from "@/features/concepts/dependency-constellation/components/constellation-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <ConstellationCanvasLoader
      constellationStateRef={{ current: createConstellationState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("ConstellationCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
