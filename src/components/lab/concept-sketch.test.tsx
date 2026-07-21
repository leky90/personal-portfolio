import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptSketch } from "@/components/lab/concept-sketch";
import { CONCEPTS } from "@/features/concepts/registry";

describe("ConceptSketch — mini data-viz generative cho từng concept", () => {
  it("render SVG cho đủ 5 concept id", () => {
    for (const concept of CONCEPTS) {
      const { container, unmount } = render(<ConceptSketch id={concept.id} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute("aria-hidden")).toBe("true");
      expect(svg!.children.length).toBeGreaterThan(3);
      unmount();
    }
  });

  it("deterministic: hai lần render cùng id cho markup giống hệt", () => {
    const a = render(<ConceptSketch id="terrain" />);
    const first = a.container.innerHTML;
    a.unmount();
    const b = render(<ConceptSketch id="terrain" />);
    expect(b.container.innerHTML).toBe(first);
  });

  it("mỗi concept có sketch khác nhau (không dùng chung một hình)", () => {
    const a = render(<ConceptSketch id="terrain" />);
    const terrain = a.container.innerHTML;
    a.unmount();
    const b = render(<ConceptSketch id="living-topology" />);
    expect(b.container.innerHTML).not.toBe(terrain);
  });

  it("concept ready batch 6 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="leverage-engine" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["request-lifecycle", "cost-of-change"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 7 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="dependency-constellation" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["daily-driver", "constraint-prism"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 8 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="glyph-field" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["leverage-engine", "gravity-toybox"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 9 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="commit-skyline" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["dependency-constellation", "knowledge-relay"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 10 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="phosphor-lens" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["full-stack-strata", "glyph-field"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 11 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="ten-year-galaxy" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["desk-version-controlled", "commit-skyline"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 12 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="ten-year-galaxy" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["cabinet-of-shipped-worlds", "phosphor-lens"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept ready batch 13 có variant riêng, không dùng placeholder chờ", () => {
    const pending = render(<ConceptSketch id="ten-year-galaxy" />);
    const placeholder = pending.container.innerHTML;
    pending.unmount();
    for (const id of ["signal-from-noise", "lanyard-badge"] as const) {
      const { container, unmount } = render(<ConceptSketch id={id} />);
      expect(container.innerHTML).not.toBe(placeholder);
      unmount();
    }
  });

  it("concept cuối cùng ten-year-galaxy có variant riêng — 26/26 phủ kín", () => {
    const galaxy = render(<ConceptSketch id="ten-year-galaxy" />);
    const galaxyMarkup = galaxy.container.innerHTML;
    galaxy.unmount();
    expect(galaxyMarkup).toContain("circle");
    const other = render(<ConceptSketch id="lanyard-badge" />);
    expect(other.container.innerHTML).not.toBe(galaxyMarkup);
  });
});
