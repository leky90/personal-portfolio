import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMeshState } from "@/features/concepts/monolith-to-mesh/lib/mesh-state";
import { MeshCanvasLoader } from "@/features/concepts/monolith-to-mesh/components/mesh-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <MeshCanvasLoader
      meshStateRef={{ current: createMeshState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("MeshCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
