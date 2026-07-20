import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createPrismState } from "@/features/concepts/constraint-prism/lib/prism-state";
import { PrismCanvasLoader } from "@/features/concepts/constraint-prism/components/prism-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <PrismCanvasLoader
      prismStateRef={{ current: createPrismState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("PrismCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
