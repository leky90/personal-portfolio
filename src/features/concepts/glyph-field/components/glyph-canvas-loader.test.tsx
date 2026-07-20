import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createGlyphState } from "@/features/concepts/glyph-field/lib/glyph-state";
import { GlyphCanvasLoader } from "@/features/concepts/glyph-field/components/glyph-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <GlyphCanvasLoader
      glyphStateRef={{ current: createGlyphState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("GlyphCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
