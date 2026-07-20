import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createToyboxState } from "@/features/concepts/gravity-toybox/lib/toybox-state";
import { ToyboxCanvasLoader } from "@/features/concepts/gravity-toybox/components/toybox-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <ToyboxCanvasLoader
      toyboxStateRef={{ current: createToyboxState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("ToyboxCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
