import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import RequestLifecycleConceptPage, {
  metadata,
} from "@/app/concepts/request-lifecycle/page";

vi.mock("@/features/concepts/request-lifecycle", () => ({
  TraceExperience: () => <div data-testid="trace-experience" />,
}));

describe("trang /concepts/request-lifecycle", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Request Lifecycle — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<RequestLifecycleConceptPage />);
    const concept = getConcept("request-lifecycle");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount TraceExperience bên trong shell", () => {
    render(<RequestLifecycleConceptPage />);
    expect(screen.getByTestId("trace-experience")).toBeInTheDocument();
  });
});
