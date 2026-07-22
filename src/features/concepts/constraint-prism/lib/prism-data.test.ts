import { describe, expect, it } from "vitest";
import {
  CONSTRAINTS,
  DECISIONS,
  RAY_COLORS,
  activeDecisions,
  buildBeamPoints,
  rayTargets,
  spectrumSpread,
} from "@/features/concepts/constraint-prism/lib/prism-data";

const ALL_ON = CONSTRAINTS.map(() => true);
const ALL_OFF = CONSTRAINTS.map(() => false);

describe("prism-data — 5 ràng buộc gập một tia ý tưởng thành thiết kế", () => {
  it("5 ràng buộc id không trùng, deflection khác 0, có tradeoff", () => {
    expect(CONSTRAINTS).toHaveLength(5);
    expect(new Set(CONSTRAINTS.map((c) => c.id)).size).toBe(5);
    for (const constraint of CONSTRAINTS) {
      expect(constraint.deflection).not.toBe(0);
      expect(constraint.label.length).toBeGreaterThan(0);
      expect(constraint.tradeoff.length).toBeGreaterThan(0);
    }
  });

  it("buildBeamPoints: topology cố định 8 điểm, x tăng dần dọc tia", () => {
    for (const active of [ALL_OFF, ALL_ON]) {
      const points = buildBeamPoints(active);
      expect(points).toHaveLength(8);
      for (let i = 1; i < points.length; i += 1) {
        expect(points[i][0]).toBeGreaterThan(points[i - 1][0]);
      }
    }
  });

  it("không ràng buộc nào → tia thẳng; đủ 5 → y cuối = tổng deflection", () => {
    const straight = buildBeamPoints(ALL_OFF);
    for (const point of straight) {
      expect(point[1]).toBe(0);
    }
    const bent = buildBeamPoints(ALL_ON);
    const totalDeflection = CONSTRAINTS.reduce(
      (sum, c) => sum + c.deflection,
      0,
    );
    expect(bent[7][1]).toBeCloseTo(totalDeflection, 5);
  });

  it("spectrumSpread: nhiều ràng buộc → phổ toả rộng hơn", () => {
    expect(spectrumSpread(ALL_ON)).toBeGreaterThan(spectrumSpread(ALL_OFF));
  });

  it("rayTargets: đúng 6 tia, mỗi tia một màu trong ramp", () => {
    expect(rayTargets(ALL_ON)).toHaveLength(6);
    expect(RAY_COLORS).toHaveLength(6);
  });

  it("activeDecisions: quyết định chỉ bật khi ĐỦ ràng buộc nó cần", () => {
    expect(activeDecisions(ALL_ON)).toHaveLength(DECISIONS.length);
    expect(activeDecisions(ALL_OFF)).toHaveLength(0);

    const walletIndex = CONSTRAINTS.findIndex((c) => c.id === "wallet");
    const onlyWallet = CONSTRAINTS.map((_, i) => i === walletIndex);
    const ids = activeDecisions(onlyWallet).map((d) => d.id);
    expect(ids).toContain("wallet-session");
    expect(ids).not.toContain("pending-state");
  });

  it("mọi requires đều trỏ tới constraint id có thật", () => {
    const validIds = new Set(CONSTRAINTS.map((c) => c.id));
    for (const decision of DECISIONS) {
      expect(decision.requires.length).toBeGreaterThan(0);
      for (const id of decision.requires) {
        expect(validIds.has(id)).toBe(true);
      }
    }
  });
});
