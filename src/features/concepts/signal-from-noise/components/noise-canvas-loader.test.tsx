import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createNoiseState } from "@/features/concepts/signal-from-noise/lib/noise-state";
import { NoiseCanvasLoader } from "@/features/concepts/signal-from-noise/components/noise-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <NoiseCanvasLoader
      noiseStateRef={{ current: createNoiseState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("NoiseCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
