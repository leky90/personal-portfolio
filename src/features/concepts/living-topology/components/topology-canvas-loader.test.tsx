import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createTopologyState } from "@/features/concepts/living-topology/lib/topology-state";
import { TopologyCanvasLoader } from "@/features/concepts/living-topology/components/topology-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <TopologyCanvasLoader
      topologyStateRef={{ current: createTopologyState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("TopologyCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
