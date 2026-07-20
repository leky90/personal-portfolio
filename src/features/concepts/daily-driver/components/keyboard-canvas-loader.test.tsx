import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createKeyboardState } from "@/features/concepts/daily-driver/lib/keyboard-state";
import { KeyboardCanvasLoader } from "@/features/concepts/daily-driver/components/keyboard-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <KeyboardCanvasLoader
      keyboardStateRef={{ current: createKeyboardState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("KeyboardCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
