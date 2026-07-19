import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConceptLabPage, { metadata } from "@/app/lab/page";

describe("Gallery concept lab tại /lab", () => {
  it("khai báo metadata riêng cho lab", () => {
    expect(String(metadata.title)).toMatch(/concept lab/i);
  });

  it("hiển thị đủ 5 concept từ registry (heading trong index)", () => {
    render(<ConceptLabPage />);
    for (const title of [
      "Ten Years of Terrain",
      "Resolution",
      "Monolith",
      "Compiled Light",
      "Living Topology",
    ]) {
      expect(
        screen.getByRole("heading", { name: title }),
      ).toBeInTheDocument();
    }
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

  it("mỗi concept có sketch SVG generative riêng", () => {
    const { container } = render(<ConceptLabPage />);
    expect(container.querySelectorAll("svg[aria-hidden]").length).toBe(5);
  });

  it("có ma trận điểm dạng bảng để đối chiếu 5 concept", () => {
    render(<ConceptLabPage />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    // 5 hàng concept + header
    expect(screen.getAllByRole("row").length).toBe(6);
  });

  it("không có em-dash trong bất kỳ chuỗi hiển thị nào", () => {
    const { container } = render(<ConceptLabPage />);
    expect(container.textContent).not.toContain("—");
  });
});
