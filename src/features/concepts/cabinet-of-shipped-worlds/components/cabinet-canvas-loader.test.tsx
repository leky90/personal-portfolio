import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createCabinetState } from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-state";
import { CabinetCanvasLoader } from "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <CabinetCanvasLoader
      cabinetStateRef={{ current: createCabinetState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("CabinetCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
