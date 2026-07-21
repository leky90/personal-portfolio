import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createDeskState } from "@/features/concepts/desk-version-controlled/lib/desk-state";
import { DeskCanvasLoader } from "@/features/concepts/desk-version-controlled/components/desk-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <DeskCanvasLoader
      deskStateRef={{ current: createDeskState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("DeskCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
