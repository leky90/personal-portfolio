import { render, screen } from "@testing-library/react";
import { getConcept } from "@/features/concepts/registry";
import { describe, expect, it, vi } from "vitest";
import SignalFromNoiseConceptPage, {
  metadata,
} from "@/app/concepts/signal-from-noise/page";

vi.mock("@/features/concepts/signal-from-noise", () => ({
  NoiseExperience: () => <div data-testid="noise-experience" />,
}));

describe("trang /concepts/signal-from-noise", () => {
  it("khai báo metadata title đúng chuẩn concept", () => {
    expect(metadata.title).toBe("Signal From Noise — 3D Concept");
  });

  it("render ConceptShell với rank + điểm từ registry", () => {
    render(<SignalFromNoiseConceptPage />);
    const concept = getConcept("signal-from-noise");
    expect(
      screen.getByText(
        `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
  });

  it("mount NoiseExperience bên trong shell", () => {
    render(<SignalFromNoiseConceptPage />);
    expect(screen.getByTestId("noise-experience")).toBeInTheDocument();
  });
});
