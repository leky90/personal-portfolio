import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEngineState } from "@/features/concepts/leverage-engine/lib/engine-state";
import { EngineCanvasLoader } from "@/features/concepts/leverage-engine/components/engine-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <EngineCanvasLoader
      engineStateRef={{ current: createEngineState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("EngineCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
