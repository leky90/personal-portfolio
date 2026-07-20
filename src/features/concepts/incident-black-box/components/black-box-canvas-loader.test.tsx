import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createBlackBoxState } from "@/features/concepts/incident-black-box/lib/black-box-state";
import { BlackBoxCanvasLoader } from "@/features/concepts/incident-black-box/components/black-box-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <BlackBoxCanvasLoader
      blackBoxStateRef={{ current: createBlackBoxState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("BlackBoxCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
