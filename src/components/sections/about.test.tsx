import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/components/sections/about";

describe("About", () => {
  it("section có id=about và heading", () => {
    render(<About />);
    expect(document.getElementById("about")).not.toBeNull();
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("có hàng stat mono (years/systems/teams)", () => {
    render(<About />);
    expect(screen.getAllByText(/\d+\+?/).length).toBeGreaterThanOrEqual(3);
  });
});
