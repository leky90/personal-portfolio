import { describe, expect, it } from "vitest";
import {
  BATONS,
  LANES,
  batonPositionAt,
  buildBatonPath,
  carriersAt,
  handedOffCount,
  xForYear,
} from "@/features/concepts/knowledge-relay/lib/relay-data";

describe("relay-data — biểu đồ Marey: lane có thể chết, gậy vẫn chạy", () => {
  it("6 lane với lifespan hợp lệ, 5 baton với dash pattern", () => {
    expect(LANES).toHaveLength(6);
    for (const lane of LANES) {
      expect(lane.endYear).toBeGreaterThan(lane.startYear);
    }
    expect(BATONS).toHaveLength(5);
    expect(new Set(BATONS.map((b) => b.dash)).size).toBeGreaterThanOrEqual(2);
  });

  it("mỗi pass nằm gọn trong lifespan lane của nó và nối nhau liên tục", () => {
    const laneById = new Map(LANES.map((lane) => [lane.id, lane]));
    for (const baton of BATONS) {
      for (const [index, pass] of baton.passes.entries()) {
        const lane = laneById.get(pass.laneId)!;
        expect(lane).toBeDefined();
        expect(pass.fromYear).toBeGreaterThanOrEqual(lane.startYear);
        expect(pass.toYear).toBeLessThanOrEqual(lane.endYear);
        expect(pass.toYear).toBeGreaterThan(pass.fromYear);
        if (index > 0) {
          expect(pass.fromYear).toBe(baton.passes[index - 1].toYear);
        }
      }
    }
  });

  it("xForYear tuyến tính: 2016 trái, 2026 phải, 2021 giữa", () => {
    expect(xForYear(2016)).toBeLessThan(0);
    expect(xForYear(2026)).toBeGreaterThan(0);
    expect(xForYear(2021)).toBeCloseTo(0, 5);
    expect(xForYear(2026)).toBeCloseTo(-xForYear(2016), 5);
  });

  it("buildBatonPath: x không giảm, năm không giảm, bắt đầu đúng lane rèn", () => {
    for (const baton of BATONS) {
      const { points, years } = buildBatonPath(baton);
      expect(points.length).toBe(years.length);
      expect(points.length).toBeGreaterThan(baton.passes.length * 2);
      for (let i = 1; i < points.length; i += 1) {
        expect(points[i][0]).toBeGreaterThanOrEqual(points[i - 1][0] - 1e-6);
        expect(years[i]).toBeGreaterThanOrEqual(years[i - 1] - 1e-6);
      }
      const firstLane = LANES.find(
        (lane) => lane.id === baton.passes[0].laneId,
      )!;
      expect(points[0][1]).toBeCloseTo(firstLane.y, 5);
      expect(years[0]).toBe(baton.passes[0].fromYear);
    }
  });

  it("batonPositionAt: đầu pass đứng trên lane, x tăng theo năm", () => {
    const baton = BATONS[0];
    const firstPass = baton.passes[0];
    const lane = LANES.find((l) => l.id === firstPass.laneId)!;
    const start = batonPositionAt(baton, firstPass.fromYear);
    expect(start[0]).toBeCloseTo(xForYear(firstPass.fromYear), 5);
    expect(start[1]).toBeCloseTo(lane.y, 5);

    const early = batonPositionAt(baton, firstPass.fromYear + 0.5);
    const later = batonPositionAt(baton, firstPass.toYear - 0.1);
    expect(later[0]).toBeGreaterThan(early[0]);
  });

  it("bộ đếm: handedOff 2026 = tổng arc, carriers tăng đơn điệu", () => {
    const totalArcs = BATONS.reduce(
      (sum, baton) => sum + baton.passes.length - 1,
      0,
    );
    expect(handedOffCount(2026)).toBe(totalArcs);
    expect(handedOffCount(2016)).toBe(0);
    let previous = -1;
    for (let year = 2016; year <= 2026; year += 1) {
      const carriers = carriersAt(year);
      expect(carriers).toBeGreaterThanOrEqual(previous);
      previous = carriers;
    }
    expect(carriersAt(2026)).toBeGreaterThan(carriersAt(2016));
  });
});
