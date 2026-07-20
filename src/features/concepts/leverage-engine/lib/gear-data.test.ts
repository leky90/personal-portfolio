import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  MODULE_M,
  OUTPUTS,
  TOTAL_LEVERAGE,
  buildGearShape,
  buildTrain,
} from "@/features/concepts/leverage-engine/lib/gear-data";

describe("gear-data — bánh răng ăn khớp đúng động học, không physics engine", () => {
  it("13 gear id không trùng, tối thiểu 10 răng", () => {
    const train = buildTrain();
    expect(train).toHaveLength(13);
    expect(new Set(train.map((g) => g.id)).size).toBe(13);
    for (const gear of train) {
      expect(gear.teeth).toBeGreaterThanOrEqual(10);
      expect(gear.pitchRadius).toBeCloseTo((gear.teeth * MODULE_M) / 2, 6);
    }
  });

  it("mọi cặp ăn khớp: khoảng cách tâm = tổng bán kính pitch (assertion thành test)", () => {
    const train = buildTrain();
    const byId = new Map(train.map((g) => [g.id, g]));
    for (const gear of train) {
      if (!gear.drivenBy) continue;
      const parent = byId.get(gear.drivenBy)!;
      const distance = Math.hypot(
        gear.position[0] - parent.position[0],
        gear.position[1] - parent.position[1],
      );
      expect(distance).toBeCloseTo(gear.pitchRadius + parent.pitchRadius, 6);
    }
  });

  it("gear đồng trục: cùng tâm, cùng tốc độ", () => {
    const train = buildTrain();
    const byId = new Map(train.map((g) => [g.id, g]));
    const coaxial = train.filter((g) => g.coaxialWith);
    expect(coaxial.length).toBe(4);
    for (const gear of coaxial) {
      const partner = byId.get(gear.coaxialWith!)!;
      expect(gear.position).toEqual(partner.position);
      expect(gear.speed).toBeCloseTo(partner.speed, 6);
    }
  });

  it("tốc độ truyền qua mesh đảo dấu: crank 1, gear cấp một quay ngược", () => {
    const train = buildTrain();
    const byId = new Map(train.map((g) => [g.id, g]));
    expect(byId.get("crank")!.speed).toBe(1);
    expect(byId.get("mid-mentor")!.speed).toBeCloseTo(-2, 6);
  });

  it("4 đầu ra với đòn bẩy ×8 / ×12 / ×16 / ×24, tổng ×60", () => {
    const train = buildTrain();
    const byId = new Map(train.map((g) => [g.id, g]));
    expect(OUTPUTS).toHaveLength(4);
    const leverages = OUTPUTS.map((output) =>
      Math.abs(byId.get(output.gearId)!.speed),
    );
    expect(leverages.map(Math.round)).toEqual([8, 12, 16, 24]);
    // Đầu ra quay CÙNG chiều crank (hai lần đảo dấu qua compound)
    for (const output of OUTPUTS) {
      expect(byId.get(output.gearId)!.speed).toBeGreaterThan(0);
    }
    expect(TOTAL_LEVERAGE).toBe(60);
  });

  it("buildGearShape: profile răng đủ điểm, từ chối gear dưới 8 răng", () => {
    const shape = buildGearShape(12, MODULE_M);
    expect(shape).toBeInstanceOf(THREE.Shape);
    expect(shape.getPoints(1).length).toBeGreaterThan(12 * 3);
    expect(() => buildGearShape(6, MODULE_M)).toThrow();
  });
});
