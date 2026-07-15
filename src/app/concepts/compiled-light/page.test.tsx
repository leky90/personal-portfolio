import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompiledLightConceptPage, {
  metadata,
} from "@/app/concepts/compiled-light/page";

vi.mock("@/features/concepts/compiled-light", () => ({
  CompiledExperience: () => <div data-testid="compiled-experience" />,
}));

describe("trang /concepts/compiled-light", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Compiled Light — 3D Concept");
  });

  it("render ConceptShell với thông tin concept từ registry", () => {
    render(<CompiledLightConceptPage />);
    expect(screen.getByText(/04 · Compiled Light/)).toBeInTheDocument();
    expect(screen.getByText("7.3/10")).toBeInTheDocument();
  });

  it("mount CompiledExperience bên trong shell", () => {
    render(<CompiledLightConceptPage />);
    expect(screen.getByTestId("compiled-experience")).toBeInTheDocument();
  });
});
