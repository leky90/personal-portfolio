import { describe, expect, it } from "vitest";
import {
  PREMATURE_SPLIT,
  SERVICES,
} from "@/features/concepts/monolith-to-mesh/lib/migration-plan";

describe("migration plan — lịch sử tách service 14 năm nghề", () => {
  it("có ≥ 30 service, id không trùng", () => {
    expect(SERVICES.length).toBeGreaterThanOrEqual(30);
    expect(new Set(SERVICES.map((s) => s.id)).size).toBe(SERVICES.length);
  });

  it("core (không tách) ≥ 4 service; năm tách trong 2013..2025", () => {
    const core = SERVICES.filter((s) => s.splitYear === null);
    expect(core.length).toBeGreaterThanOrEqual(4);
    for (const s of SERVICES) {
      if (s.splitYear !== null) {
        expect(s.splitYear).toBeGreaterThanOrEqual(2013);
        expect(s.splitYear).toBeLessThanOrEqual(2025);
      }
      expect(s.reason.length).toBeGreaterThan(0);
      expect(s.reason).not.toContain("—");
    }
  });

  it("đúng một ca tách non (premature): ra rồi gộp ngược lại", () => {
    expect(SERVICES.some((s) => s.id === PREMATURE_SPLIT.id)).toBe(true);
    expect(PREMATURE_SPLIT.outYear).toBeLessThan(PREMATURE_SPLIT.backYear);
  });
});
