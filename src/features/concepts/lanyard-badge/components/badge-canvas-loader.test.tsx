import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createBadgeState } from "@/features/concepts/lanyard-badge/lib/badge-state";
import { BadgeCanvasLoader } from "@/features/concepts/lanyard-badge/components/badge-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <BadgeCanvasLoader
      badgeStateRef={{ current: createBadgeState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("BadgeCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
