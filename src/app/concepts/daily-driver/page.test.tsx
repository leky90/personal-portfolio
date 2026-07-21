import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import DailyDriverConceptPage, {
  metadata,
} from "@/app/concepts/daily-driver/page";

vi.mock("@/features/concepts/daily-driver", () => ({
  DriverExperience: () => <div data-testid="driver-experience" />,
}));

describe("trang /concepts/daily-driver", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("The Daily Driver — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<MemoryRouter><DailyDriverConceptPage /></MemoryRouter>);
    const concept = getConcept("daily-driver");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount DriverExperience bên trong shell", () => {
    render(<MemoryRouter><DailyDriverConceptPage /></MemoryRouter>);
    expect(screen.getByTestId("driver-experience")).toBeInTheDocument();
  });
});
