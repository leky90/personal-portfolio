import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createLensState } from "@/features/concepts/phosphor-lens/lib/lens-state";
import { LensCanvasLoader } from "@/features/concepts/phosphor-lens/components/lens-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <LensCanvasLoader
      lensStateRef={{ current: createLensState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("LensCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
