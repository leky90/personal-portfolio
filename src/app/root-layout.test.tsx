import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { RootLayout } from "@/app/root-layout";

describe("RootLayout — khung app sau khi bỏ Next", () => {
  it("render children của route qua Outlet", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<p>nội dung trang</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("nội dung trang")).toBeInTheDocument();
  });

  it("cuộn về đầu trang khi đổi pathname (SPA không tự làm)", () => {
    window.scrollTo = () => {};
    const spy = vi.spyOn(window, "scrollTo");
    render(
      <MemoryRouter initialEntries={["/lab"]}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/lab" element={<p>lab</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(spy).toHaveBeenCalledWith(0, 0);
  });
});
