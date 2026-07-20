import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { getConcept } from "@/features/concepts/registry";

describe("ConceptShell", () => {
  it("hiển thị rank + tên concept, điểm overall và link về gallery", () => {
    render(
      <ConceptShell concept={getConcept("terrain")}>
        <p>noi dung demo</p>
      </ConceptShell>,
    );

    const concept = getConcept("terrain");
    expect(
      screen.getByRole("heading", {
        name: `${String(concept.rank).padStart(2, "0")} · ${concept.title}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${concept.scores.overall.toFixed(1)}/10`),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /concepts/i })).toHaveAttribute(
      "href",
      "/lab",
    );
    expect(screen.getByText("noi dung demo")).toBeInTheDocument();
  });
});
