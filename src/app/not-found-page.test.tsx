import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { NotFoundPage } from "@/app/not-found-page";

describe("NotFoundPage — 404 của SPA", () => {
  it("hiện mã 404 và link quay về trang chủ", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/404/)).toBeInTheDocument();
    const home = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/");
    expect(home).toBeDefined();
  });
});
