import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConceptLabPage, { metadata } from "@/app/lab/page";

describe("Gallery concept lab tại /lab", () => {
  it("khai báo metadata riêng cho lab", () => {
    expect(String(metadata.title)).toMatch(/concept lab/i);
  });

  it("hiển thị đủ 5 concept từ registry", () => {
    render(<ConceptLabPage />);
    expect(screen.getByText("Ten Years of Terrain")).toBeInTheDocument();
    expect(screen.getByText("Resolution")).toBeInTheDocument();
    expect(screen.getByText("Monolith")).toBeInTheDocument();
    expect(screen.getByText("Compiled Light")).toBeInTheDocument();
    expect(screen.getByText("Living Topology")).toBeInTheDocument();
  });

  it("mọi concept đều có link demo, terrain đánh dấu ĐÃ CHỐT", () => {
    render(<ConceptLabPage />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const id of [
      "terrain",
      "resolution",
      "monolith",
      "compiled-light",
      "living-topology",
    ]) {
      expect(hrefs).toContain(`/concepts/${id}`);
    }
    expect(screen.getByText(/đã chốt/i)).toBeInTheDocument();
  });

  it("có link quay về trang chủ portfolio", () => {
    render(<ConceptLabPage />);
    const home = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/");
    expect(home).toBeDefined();
  });
});
