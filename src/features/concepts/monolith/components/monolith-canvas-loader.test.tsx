import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMonolithState } from "@/features/concepts/monolith/lib/monolith-state";
import { MonolithCanvasLoader } from "@/features/concepts/monolith/components/monolith-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <MonolithCanvasLoader
      monolithStateRef={{ current: createMonolithState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("MonolithCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
