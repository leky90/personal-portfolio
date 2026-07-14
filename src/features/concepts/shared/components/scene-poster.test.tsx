import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";

describe("ScenePoster", () => {
  it("hiển thị ghi chú mặc định về reduced motion", () => {
    render(<ScenePoster />);
    expect(screen.getByText(/giảm chuyển động/i)).toBeInTheDocument();
  });

  it("cho phép truyền ghi chú tuỳ biến", () => {
    render(<ScenePoster note="Đang tải scene..." />);
    expect(screen.getByText("Đang tải scene...")).toBeInTheDocument();
  });
});
