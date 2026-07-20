import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createChangeState } from "@/features/concepts/cost-of-change/lib/change-state";
import { TowerCanvasLoader } from "@/features/concepts/cost-of-change/components/tower-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <TowerCanvasLoader
      changeStateRef={{ current: createChangeState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("TowerCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
