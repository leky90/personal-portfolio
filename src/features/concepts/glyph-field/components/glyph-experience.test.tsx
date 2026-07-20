import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HEADINGS } from "@/features/concepts/glyph-field/lib/glyph-data";
import { GlyphExperience } from "@/features/concepts/glyph-field/components/glyph-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/glyph-field/components/glyph-canvas-loader",
  () => ({
    GlyphCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("GlyphExperience — layout DOM của trang concept", () => {
  it("hero hiển thị headline GLYPH FIELD", () => {
    render(<GlyphExperience />);
    expect(screen.getByText(/GLYPH FIELD/i)).toBeInTheDocument();
  });

  it("mỗi heading của field có một section (chữ do canvas vẽ)", () => {
    render(<GlyphExperience />);
    for (const heading of HEADINGS) {
      expect(screen.getAllByText(heading).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("HUD nêu số hạt và đúng 1 draw call", () => {
    render(<GlyphExperience />);
    expect(screen.getByTestId("glyph-hud").textContent).toMatch(
      /1 draw call/i,
    );
  });

  it("core idea nhắc texelFetch và demand", () => {
    render(<GlyphExperience />);
    expect(screen.getAllByText(/texelFetch/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText(/demand/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mount canvas loader đúng một lần", () => {
    render(<GlyphExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
