import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";

describe("SiteFooter — colophon kỹ thuật", () => {
  it("nhắc chữ ký hiệu năng của terrain (1 draw call)", () => {
    render(<MemoryRouter><SiteFooter /></MemoryRouter>);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
  });

  it("có link về concept lab", () => {
    render(<MemoryRouter><SiteFooter /></MemoryRouter>);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/lab");
  });
});
