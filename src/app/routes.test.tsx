import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { AppRoutes } from "@/app/routes";

describe("AppRoutes — bảng route SPA thay App Router", () => {
  it("/lab render Concept Lab", async () => {
    render(
      <MemoryRouter initialEntries={["/lab"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /concept lab/i }),
      ).toBeInTheDocument();
    });
  });

  it("route lạ render NotFoundPage", async () => {
    render(
      <MemoryRouter initialEntries={["/duong-dan-khong-ton-tai"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/404/)).toBeInTheDocument();
    });
  });

  it("concept id lạ dưới /concepts render NotFoundPage", async () => {
    render(
      <MemoryRouter initialEntries={["/concepts/khong-ton-tai"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/404/)).toBeInTheDocument();
    });
  });
});
