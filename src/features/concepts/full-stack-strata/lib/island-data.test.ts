import { describe, expect, it } from "vitest";
import {
  LAYERS,
  SERVICE_LINKS,
  SERVICE_NODES,
  TRACES,
  buildCity,
  buildCrystals,
  cameraPoseAt,
  requestPathPoints,
  traceStepAt,
} from "@/features/concepts/full-stack-strata/lib/island-data";

describe("island-data — lát cắt hòn đảo chính là stack", () => {
  it("3 tầng xếp chồng kín, không hở không chồng lấn", () => {
    expect(LAYERS).toHaveLength(3);
    expect(LAYERS.map((layer) => layer.id)).toEqual([
      "surface",
      "services",
      "bedrock",
    ]);
    for (let i = 1; i < LAYERS.length; i += 1) {
      expect(LAYERS[i].yTop).toBeCloseTo(LAYERS[i - 1].yBottom, 5);
    }
  });

  it("thành phố 80 toà trong bán kính đảo, chiều cao hợp lệ", () => {
    const city = buildCity(7);
    expect(city).toHaveLength(80);
    for (const building of city) {
      expect(Math.hypot(building.x, building.z)).toBeLessThanOrEqual(3.4);
      expect(building.height).toBeGreaterThanOrEqual(0.15);
      expect(building.height).toBeLessThanOrEqual(0.95);
    }
    expect(buildCity(7)).toEqual(city);
  });

  it("8 service node quanh vành seam + link trỏ index hợp lệ", () => {
    expect(SERVICE_NODES).toHaveLength(8);
    for (const [a, b] of SERVICE_LINKS) {
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThan(SERVICE_NODES.length);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(SERVICE_NODES.length);
      expect(a).not.toBe(b);
    }
  });

  it("24 tinh thể nằm gọn trong tầng bedrock", () => {
    const crystals = buildCrystals(7);
    expect(crystals).toHaveLength(24);
    const bedrock = LAYERS[2];
    for (const crystal of crystals) {
      expect(crystal.y).toBeLessThanOrEqual(bedrock.yTop);
      expect(crystal.y).toBeGreaterThanOrEqual(bedrock.yBottom);
      expect(Math.hypot(crystal.x, crystal.z)).toBeLessThanOrEqual(3.2);
    }
  });

  it("trace: mốc at tăng dần trong [0,1], traceStepAt trả đúng bước", () => {
    expect(TRACES.length).toBeGreaterThanOrEqual(3);
    for (const trace of TRACES) {
      for (const [index, step] of trace.steps.entries()) {
        expect(step.at).toBeGreaterThanOrEqual(0);
        expect(step.at).toBeLessThanOrEqual(1);
        if (index > 0) {
          expect(step.at).toBeGreaterThan(trace.steps[index - 1].at);
        }
      }
    }
    const trace = TRACES[0];
    expect(traceStepAt(trace, -0.1)).toBe(-1);
    expect(traceStepAt(trace, trace.steps[0].at)).toBe(0);
    expect(traceStepAt(trace, 1)).toBe(trace.steps.length - 1);
  });

  it("đường packet: xuống qua seam tới bedrock rồi quay lên", () => {
    for (let i = 0; i < TRACES.length; i += 1) {
      const points = requestPathPoints(i);
      expect(points.length).toBeGreaterThanOrEqual(5);
      const ys = points.map((p) => p[1]);
      const minY = Math.min(...ys);
      expect(minY).toBeLessThan(LAYERS[2].yTop);
      expect(ys[0]).toBeGreaterThan(LAYERS[0].yBottom);
      expect(ys[ys.length - 1]).toBeGreaterThan(LAYERS[0].yBottom);
    }
  });

  it("camera descent: p=0 nhìn tổng quan trên cao, p=1 xuống đáy", () => {
    const top = cameraPoseAt(0);
    const bottom = cameraPoseAt(1);
    expect(top.position[1]).toBeGreaterThan(bottom.position[1]);
    for (const pose of [top, cameraPoseAt(0.4), bottom]) {
      for (const value of [...pose.position, ...pose.target]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });
});
