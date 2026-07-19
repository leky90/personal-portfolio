import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EXPERIENCE } from "@/lib/data/experience";

describe("ExperienceSection — timeline là ol thật, card gắn data-era-index", () => {
  it("section id=experience, timeline là danh sách có thứ tự", () => {
    render(<ExperienceSection />);
    expect(document.getElementById("experience")).not.toBeNull();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("đủ 4 era card với năm + title + role, đánh dấu data-era-index", () => {
    const { container } = render(<ExperienceSection />);
    for (const era of EXPERIENCE) {
      expect(screen.getByText(String(era.year))).toBeInTheDocument();
      expect(screen.getByText(era.title)).toBeInTheDocument();
    }
    const marked = container.querySelectorAll("[data-era-index]");
    expect(marked).toHaveLength(EXPERIENCE.length);
    expect(marked[0].getAttribute("data-era-index")).toBe("0");
  });
});
