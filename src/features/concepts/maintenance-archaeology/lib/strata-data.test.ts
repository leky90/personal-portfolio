import { describe, expect, it } from "vitest";
import {
  ARTIFACT_COUNT,
  STRATA,
  buildDig,
} from "@/features/concepts/maintenance-archaeology/lib/strata-data";

describe("strata + artifacts — địa tầng codebase 12 năm (2014 → 2026)", () => {
  it("5 stratum từ mới (trên) đến cũ (dưới), độ dày dương và tổng = 1", () => {
    expect(STRATA).toHaveLength(5);
    for (let i = 1; i < STRATA.length; i += 1) {
      expect(STRATA[i].fromYear).toBeLessThan(STRATA[i - 1].fromYear);
    }
    const total = STRATA.reduce((sum, s) => sum + s.thickness, 0);
    expect(total).toBeCloseTo(1, 5);
    for (const s of STRATA) {
      expect(s.thickness).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.note).not.toContain("—");
    }
  });

  it("mốc thời gian thật: mặt đất 2026, đá gốc freelance 2014-2016 và nhắc tốt nghiệp 2014", () => {
    expect(STRATA[0].toYear).toBe(2026);
    const bedrock = STRATA[STRATA.length - 1];
    expect(bedrock.fromYear).toBe(2014);
    expect(bedrock.toYear).toBe(2016);
    expect(bedrock.note).toContain("2014");
    for (const s of STRATA) {
      expect(s.note).not.toContain("2012");
    }
  });

  it("buildDig deterministic: đủ artifact, stratum hợp lệ, nằm trong hố", () => {
    const a = buildDig(7);
    const b = buildDig(7);
    expect(a).toHaveLength(ARTIFACT_COUNT);
    expect(a.map((x) => x.position)).toEqual(b.map((x) => x.position));
    for (const artifact of a) {
      expect(artifact.stratum).toBeGreaterThanOrEqual(0);
      expect(artifact.stratum).toBeLessThan(STRATA.length);
      expect(Math.abs(artifact.position[0])).toBeLessThanOrEqual(14);
      expect(artifact.position[1]).toBeLessThanOrEqual(0.5);
      expect(artifact.position[1]).toBeGreaterThanOrEqual(-20);
      expect(artifact.name.length).toBeGreaterThan(0);
      expect(artifact.note).not.toContain("—");
    }
  });

  it("artifact nằm đúng dải y của stratum nó thuộc về", () => {
    const dig = buildDig(7);
    for (const artifact of dig) {
      const s = STRATA[artifact.stratum];
      expect(artifact.position[1]).toBeLessThanOrEqual(s.yTop + 0.01);
      expect(artifact.position[1]).toBeGreaterThanOrEqual(s.yBottom - 0.01);
    }
  });

  it("bornYear nằm trong khoảng năm của stratum", () => {
    for (const artifact of buildDig(7)) {
      const s = STRATA[artifact.stratum];
      expect(artifact.bornYear).toBeGreaterThanOrEqual(s.fromYear);
      expect(artifact.bornYear).toBeLessThanOrEqual(s.toYear);
    }
  });
});
