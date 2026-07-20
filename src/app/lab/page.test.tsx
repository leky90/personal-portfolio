import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConceptLabPage, { metadata } from "@/app/lab/page";
import { CONCEPTS } from "@/features/concepts/registry";

describe("Gallery concept lab tại /lab", () => {
  it("khai báo metadata riêng cho lab", () => {
    expect(String(metadata.title)).toMatch(/concept lab/i);
  });

  it("hiển thị toàn bộ concept trong registry (heading trong index)", () => {
    render(<ConceptLabPage />);
    for (const concept of CONCEPTS) {
      expect(
        screen.getByRole("heading", { name: concept.title }),
      ).toBeInTheDocument();
    }
  });

  it("concept ready có link demo; concept planned KHÔNG phải link", () => {
    render(<ConceptLabPage />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    for (const concept of CONCEPTS) {
      if (concept.status === "ready") {
        expect(hrefs).toContain(`/concepts/${concept.id}`);
      } else {
        expect(hrefs).not.toContain(`/concepts/${concept.id}`);
      }
    }
    expect(screen.getByText(/đã chốt/i)).toBeInTheDocument();
    if (CONCEPTS.some((c) => c.status === "planned")) {
      expect(screen.getAllByText(/chờ build/i).length).toBe(
        CONCEPTS.filter((c) => c.status === "planned").length,
      );
    }
  });

  it("masthead đếm demo chạy được từ registry, không hardcode", () => {
    render(<ConceptLabPage />);
    const ready = CONCEPTS.filter((c) => c.status === "ready").length;
    expect(screen.getByText(`${ready} demo chạy được`)).toBeInTheDocument();
  });

  it("có link quay về trang chủ portfolio", () => {
    render(<ConceptLabPage />);
    const home = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/");
    expect(home).toBeDefined();
  });

  it("mỗi concept có một sketch SVG (variant riêng hoặc placeholder)", () => {
    const { container } = render(<ConceptLabPage />);
    expect(container.querySelectorAll("svg[aria-hidden]").length).toBe(
      CONCEPTS.length,
    );
  });

  it("ma trận điểm có đủ một hàng cho mỗi concept + header", () => {
    render(<ConceptLabPage />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBe(CONCEPTS.length + 1);
  });

  it("không có em-dash trong bất kỳ chuỗi hiển thị nào", () => {
    const { container } = render(<ConceptLabPage />);
    expect(container.textContent).not.toContain("—");
  });
});
