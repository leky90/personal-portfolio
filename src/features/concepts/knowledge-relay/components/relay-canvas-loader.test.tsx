import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRelayState } from "@/features/concepts/knowledge-relay/lib/relay-state";
import { RelayCanvasLoader } from "@/features/concepts/knowledge-relay/components/relay-canvas-loader";

vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

function renderLoader() {
  return render(
    <RelayCanvasLoader
      relayStateRef={{ current: createRelayState() }}
      eventSourceRef={createRef<HTMLDivElement>()}
    />,
  );
}

describe("RelayCanvasLoader — nhánh reduced-motion", () => {
  it("hiển thị ScenePoster thay vì canvas", () => {
    renderLoader();
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
  });

  it("không render canvas WebGL nào", () => {
    const { container } = renderLoader();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
