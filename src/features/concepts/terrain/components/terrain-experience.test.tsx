import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ERAS } from "@/features/concepts/terrain/lib/career-data";
import { TerrainExperience } from "@/features/concepts/terrain/components/terrain-experience";

// Không mount canvas thật trong jsdom — loader được test riêng.
vi.mock(
  "@/features/concepts/terrain/components/terrain-canvas-loader",
  () => ({
    TerrainCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("TerrainExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline TEN YEARS OF TERRAIN", () => {
    render(<TerrainExperience />);
    expect(screen.getByText(/TEN YEARS OF TERRAIN/i)).toBeInTheDocument();
  });

  it("đủ 4 era card với năm + title + role", () => {
    render(<TerrainExperience />);
    for (const era of ERAS) {
      expect(screen.getByText(String(era.year))).toBeInTheDocument();
      expect(screen.getByText(era.title)).toBeInTheDocument();
      expect(screen.getByText(era.role)).toBeInTheDocument();
    }
  });

  it("timeline là danh sách có thứ tự (ol) cho screen reader", () => {
    render(<TerrainExperience />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("section contact chốt bằng lời mời hợp tác", () => {
    render(<TerrainExperience />);
    expect(screen.getByText(/Đỉnh tiếp theo/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
  });

  it("panel core idea nhắc 1 draw call và data texture", () => {
    render(<TerrainExperience />);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/data texture/i).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("mount canvas loader đúng một lần", () => {
    render(<TerrainExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
