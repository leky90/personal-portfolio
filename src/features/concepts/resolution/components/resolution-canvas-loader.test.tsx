import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createSceneState } from "@/features/concepts/resolution/lib/scene-state";
import { ResolutionCanvasLoader } from "@/features/concepts/resolution/components/resolution-canvas-loader";

// Reduced-motion bật → loader phải rẽ nhánh poster TRƯỚC khi dynamic import
// chạm tới chunk three.js.
vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  const sceneStateRef = { current: createSceneState(3) };
  return render(
    <ResolutionCanvasLoader
      sceneStateRef={sceneStateRef}
      eventSourceRef={createRef<HTMLDivElement>()}
      heroTrackRef={createRef<HTMLDivElement>()}
      coverTrackRefs={[
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
      ]}
    />,
  );
}

describe("ResolutionCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
