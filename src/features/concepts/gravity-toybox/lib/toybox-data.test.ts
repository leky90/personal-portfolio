import { describe, expect, it } from "vitest";
import {
  SKILLS,
  buildLetters,
  heightAt,
  letterMatrix,
  restitutionOf,
  settleTime,
} from "@/features/concepts/gravity-toybox/lib/toybox-data";

describe("toybox-data — khối lượng = số năm kinh nghiệm, không physics engine", () => {
  it("12 skill id không trùng, years 1..9, đĩa to dần theo năm", () => {
    expect(SKILLS).toHaveLength(12);
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(12);
    for (const skill of SKILLS) {
      expect(skill.years).toBeGreaterThanOrEqual(1);
      expect(skill.years).toBeLessThanOrEqual(9);
    }
    const sorted = [...SKILLS].sort((a, b) => a.years - b.years);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i].radius).toBeGreaterThanOrEqual(sorted[i - 1].radius);
    }
  });

  it("restitution giảm theo khối lượng: 1 năm nảy tưng, 9 năm thịch", () => {
    expect(restitutionOf(1)).toBeGreaterThan(restitutionOf(9));
    expect(restitutionOf(1)).toBeLessThanOrEqual(0.75);
    expect(restitutionOf(9)).toBeGreaterThanOrEqual(0.15);
  });

  it("heightAt: treo ở độ cao thả trước delay, nằm yên sau settleTime", () => {
    const token = SKILLS[0];
    const restY = token.rest[1];
    expect(heightAt(0, token)).toBeCloseTo(restY + token.drop.height, 5);
    const settled = settleTime(token);
    expect(heightAt(settled + 0.1, token)).toBeCloseTo(restY, 4);
    for (let step = 0; step <= 60; step += 1) {
      const t = (step / 60) * (settled + 1);
      expect(heightAt(t, token)).toBeGreaterThanOrEqual(restY - 1e-6);
    }
  });

  it("đỉnh nảy đầu tiên thấp hơn độ cao thả (năng lượng mất qua va chạm)", () => {
    const token = SKILLS[0];
    const restY = token.rest[1];
    let peakAfterFirstBounce = 0;
    const settled = settleTime(token);
    let falling = true;
    for (let step = 0; step <= 400; step += 1) {
      const t = token.drop.delay + (step / 400) * (settled - token.drop.delay);
      const h = heightAt(t, token) - restY;
      if (falling && h < 1e-3) falling = false;
      if (!falling) peakAfterFirstBounce = Math.max(peakAfterFirstBounce, h);
    }
    expect(peakAfterFirstBounce).toBeGreaterThan(0);
    expect(peakAfterFirstBounce).toBeLessThan(token.drop.height * 0.7);
  });

  it("settleTime hữu hạn và sau delay", () => {
    for (const skill of SKILLS) {
      const settled = settleTime(skill);
      expect(settled).toBeGreaterThan(skill.drop.delay);
      expect(settled).toBeLessThan(15);
    }
  });

  it("letterMatrix 5×7 cho K/Y/L/E; buildLetters trả 4 chữ trượt phải dần", () => {
    for (const char of ["K", "Y", "L", "E"] as const) {
      const matrix = letterMatrix(char);
      expect(matrix).toHaveLength(7);
      for (const row of matrix) {
        expect(row).toHaveLength(5);
      }
      expect(matrix.flat().filter(Boolean).length).toBeGreaterThan(6);
    }
    const letters = buildLetters();
    expect(letters).toHaveLength(4);
    for (const letter of letters) {
      expect(letter.cells.length).toBeGreaterThan(6);
    }
    for (let i = 1; i < letters.length; i += 1) {
      expect(letters[i].offsetX).toBeGreaterThan(letters[i - 1].offsetX);
    }
  });
});
