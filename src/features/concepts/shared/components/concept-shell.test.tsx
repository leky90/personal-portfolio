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

    expect(
      screen.getByRole("heading", { name: /01 · Ten Years of Terrain/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("8.7/10")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /concepts/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText("noi dung demo")).toBeInTheDocument();
  });
});
