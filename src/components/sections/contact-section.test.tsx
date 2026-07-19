import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactSection } from "@/components/sections/contact-section";
import { SITE } from "@/lib/data/site";

describe("ContactSection — đường chân trời cuối hành trình", () => {
  it("section id=contact với CTA mailto và socials", () => {
    render(<ContactSection />);
    expect(document.getElementById("contact")).not.toBeNull();
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain(`mailto:${SITE.email}`);
    for (const social of SITE.socials) {
      expect(hrefs).toContain(social.href);
    }
  });

  it("lời chốt nhắc 'next peak' đúng art direction terrain", () => {
    render(<ContactSection />);
    expect(screen.getByText(/next peak/i)).toBeInTheDocument();
  });
});
