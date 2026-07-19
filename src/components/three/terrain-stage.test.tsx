import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TerrainStage } from "@/components/three/terrain-stage";

// Reduced-motion → stage hiển thị poster, không tải chunk three.js
vi.mock("@/features/concepts/shared/hooks/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

describe("TerrainStage — sân khấu 3D của trang chủ", () => {
  it("render children (nội dung DOM của site) bên trên canvas", () => {
    render(
      <TerrainStage>
        <p>noi dung portfolio</p>
      </TerrainStage>,
    );
    expect(screen.getByText("noi dung portfolio")).toBeInTheDocument();
  });

  it("reduced-motion: poster thay canvas, không có WebGL", () => {
    const { container } = render(
      <TerrainStage>
        <p>x</p>
      </TerrainStage>,
    );
    expect(screen.getByText(/Bản tĩnh/i)).toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
