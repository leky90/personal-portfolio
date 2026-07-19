import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/lib/data/site";

describe("SiteHeader", () => {
  it("hiện tên + nav anchor tới các section chính", () => {
    render(<SiteHeader />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const anchor of ["#experience", "#work", "#skills", "#contact"]) {
      expect(hrefs).toContain(anchor);
    }
  });

  it("có skip-link tới nội dung chính cho keyboard", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("link", { name: /skip to content/i }),
    ).toHaveAttribute("href", "#content");
  });
});
