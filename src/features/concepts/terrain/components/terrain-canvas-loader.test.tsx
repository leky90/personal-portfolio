import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createTerrainState } from "@/features/concepts/terrain/lib/terrain-state";
import { TerrainCanvasLoader } from "@/features/concepts/terrain/components/terrain-canvas-loader";

// Reduced-motion bật → loader rẽ nhánh poster TRƯỚC khi chạm chunk three.js.
vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <TerrainCanvasLoader
      terrainStateRef={{ current: createTerrainState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("TerrainCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
