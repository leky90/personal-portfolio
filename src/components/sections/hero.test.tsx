import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/hero";
import { SITE } from "@/lib/data/site";

describe("Hero — LCP là text DOM, không phụ thuộc canvas", () => {
  it("h1 là tên, kèm title và tagline", () => {
    render(<MemoryRouter><Hero /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      SITE.name,
    );
    expect(screen.getByText(SITE.title)).toBeInTheDocument();
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("có CTA cuộn xuống experience và liên hệ email", () => {
    render(<MemoryRouter><Hero /></MemoryRouter>);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("#experience");
    expect(hrefs.some((href) => href?.startsWith("mailto:"))).toBe(true);
  });

  it("hiện chip trạng thái available khi bật trong site config", () => {
    render(<MemoryRouter><Hero /></MemoryRouter>);
    if (SITE.available) {
      expect(screen.getByText(/open to/i)).toBeInTheDocument();
    }
  });
});
