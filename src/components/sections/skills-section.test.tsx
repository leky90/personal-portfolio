import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillsSection } from "@/components/sections/skills-section";
import { SKILL_GROUPS } from "@/lib/data/skills";

describe("SkillsSection", () => {
  it("section id=skills với đủ nhóm và badge", () => {
    render(<SkillsSection />);
    expect(document.getElementById("skills")).not.toBeNull();
    for (const group of SKILL_GROUPS) {
      expect(screen.getByText(group.label)).toBeInTheDocument();
      for (const item of group.items) {
        expect(screen.getByText(item)).toBeInTheDocument();
      }
    }
  });
});
