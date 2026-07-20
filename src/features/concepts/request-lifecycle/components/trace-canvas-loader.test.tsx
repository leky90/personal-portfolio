import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createTraceState } from "@/features/concepts/request-lifecycle/lib/trace-state";
import { TraceCanvasLoader } from "@/features/concepts/request-lifecycle/components/trace-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <TraceCanvasLoader
      traceStateRef={{ current: createTraceState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("TraceCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
