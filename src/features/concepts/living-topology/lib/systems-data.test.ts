import { describe, expect, it } from "vitest";
import {
  ARCH_LINKS,
  SYSTEMS,
  systemIndexById,
} from "@/features/concepts/living-topology/lib/systems-data";

describe("dữ liệu hệ thống — 12+ năm nghề, từ WordPress tới dApp DeFi", () => {
  it("có ≥ 10 hệ thống, id không trùng", () => {
    expect(SYSTEMS.length).toBeGreaterThanOrEqual(10);
    expect(new Set(SYSTEMS.map((s) => s.id)).size).toBe(SYSTEMS.length);
  });

  it("mỗi hệ thống đủ name / stack / metric, năm trong 2012..2026", () => {
    for (const system of SYSTEMS) {
      expect(system.name.length).toBeGreaterThan(0);
      expect(system.stack.length).toBeGreaterThan(0);
      expect(system.metric.length).toBeGreaterThan(0);
      expect(system.year).toBeGreaterThanOrEqual(2012);
      expect(system.year).toBeLessThanOrEqual(2026);
    }
  });

  it("ARCH_LINKS chỉ tham chiếu id hợp lệ, không tự nối chính mình", () => {
    const ids = new Set(SYSTEMS.map((s) => s.id));
    for (const [a, b] of ARCH_LINKS) {
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
      expect(a).not.toBe(b);
    }
  });

  it("systemIndexById tra đúng index, ném lỗi với id lạ", () => {
    expect(systemIndexById(SYSTEMS[0].id)).toBe(0);
    expect(() => systemIndexById("khong-ton-tai")).toThrow(/khong-ton-tai/);
  });
});
