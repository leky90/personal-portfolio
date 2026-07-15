import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createCompiledState } from "@/features/concepts/compiled-light/lib/compiled-state";
import { CompiledCanvasLoader } from "@/features/concepts/compiled-light/components/compiled-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <CompiledCanvasLoader
      compiledStateRef={{ current: createCompiledState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("CompiledCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
