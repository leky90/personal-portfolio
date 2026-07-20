import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createDecisionState } from "@/features/concepts/decision-diff/lib/decision-state";
import { DecisionCanvasLoader } from "@/features/concepts/decision-diff/components/decision-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <DecisionCanvasLoader
      decisionStateRef={{ current: createDecisionState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("DecisionCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
