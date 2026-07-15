import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Gallery trang chủ concept lab", () => {
  it("hiển thị đủ 5 concept từ registry", () => {
    render(<Home />);
    expect(screen.getByText("Ten Years of Terrain")).toBeInTheDocument();
    expect(screen.getByText("Resolution")).toBeInTheDocument();
    expect(screen.getByText("Monolith")).toBeInTheDocument();
    expect(screen.getByText("Compiled Light")).toBeInTheDocument();
    expect(screen.getByText("Living Topology")).toBeInTheDocument();
  });

  it("concept ready có link tới trang demo riêng", () => {
    render(<Home />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/concepts/terrain");
    expect(hrefs).toContain("/concepts/resolution");
    expect(hrefs).toContain("/concepts/monolith");
    expect(hrefs).toContain("/concepts/compiled-light");
    expect(hrefs).toContain("/concepts/living-topology");
  });

  it("không còn concept nào ở trạng thái sắp có", () => {
    render(<Home />);
    expect(screen.queryByText(/sắp có/i)).not.toBeInTheDocument();
  });
});
