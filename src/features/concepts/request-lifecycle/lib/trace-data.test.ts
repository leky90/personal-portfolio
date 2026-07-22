import { describe, expect, it } from "vitest";
import {
  SPANS,
  STATION_US,
  TOTAL_MS,
  activeSpanIndex,
  buildNodes,
  buildRoute,
  elapsedMs,
} from "@/features/concepts/request-lifecycle/lib/trace-data";

describe("trace-data — một request trong dApp Treehouse chia thành 6 span", () => {
  it("6 span nối tiếp nhau kín trục thời gian, tổng đúng TOTAL_MS", () => {
    expect(SPANS).toHaveLength(6);
    expect(SPANS[0].startMs).toBe(0);
    for (let i = 1; i < SPANS.length; i += 1) {
      expect(SPANS[i].startMs).toBe(
        SPANS[i - 1].startMs + SPANS[i - 1].durationMs,
      );
    }
    const last = SPANS[SPANS.length - 1];
    expect(last.startMs + last.durationMs).toBe(TOTAL_MS);
  });

  it("cửa sổ cuộn t0..t1 kín [0,1] và không chồng lấn", () => {
    expect(SPANS[0].t0).toBe(0);
    expect(SPANS[SPANS.length - 1].t1).toBe(1);
    for (const span of SPANS) {
      expect(span.t0).toBeLessThan(span.t1);
    }
    for (let i = 1; i < SPANS.length; i += 1) {
      expect(SPANS[i].t0).toBe(SPANS[i - 1].t1);
    }
  });

  it("đúng một span async: hàng đợi", () => {
    const asyncSpans = SPANS.filter((span) => span.kind === "async");
    expect(asyncSpans).toHaveLength(1);
    expect(asyncSpans[0].id).toBe("queue");
  });

  it("activeSpanIndex map progress vào đúng span, clamp hai biên", () => {
    expect(activeSpanIndex(0)).toBe(0);
    expect(activeSpanIndex(0.5)).toBe(2);
    expect(activeSpanIndex(1)).toBe(SPANS.length - 1);
    expect(activeSpanIndex(-0.3)).toBe(0);
    expect(activeSpanIndex(1.3)).toBe(SPANS.length - 1);
    for (const [index, span] of SPANS.entries()) {
      expect(activeSpanIndex((span.t0 + span.t1) / 2)).toBe(index);
    }
  });

  it("elapsedMs đơn điệu tăng, khớp mốc startMs tại biên span", () => {
    expect(elapsedMs(0)).toBe(0);
    expect(elapsedMs(1)).toBeCloseTo(TOTAL_MS, 5);
    let previous = -1;
    for (let i = 0; i <= 100; i += 1) {
      const value = elapsedMs(i / 100);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
    for (const span of SPANS) {
      expect(elapsedMs(span.t0)).toBeCloseTo(span.startMs, 5);
    }
  });

  it("route là hành lang tiến về -z: waypoint hữu hạn, z giảm dần", () => {
    const route = buildRoute();
    expect(route.length).toBeGreaterThanOrEqual(6);
    for (let i = 0; i < route.length; i += 1) {
      for (const value of route[i]) {
        expect(Number.isFinite(value)).toBe(true);
      }
      if (i > 0) {
        expect(route[i][2]).toBeLessThan(route[i - 1][2]);
      }
    }
  });

  it("STATION_US: 6 mốc tăng dần, mỗi mốc nằm trong cửa sổ span của nó", () => {
    expect(STATION_US).toHaveLength(SPANS.length);
    for (const [index, u] of STATION_US.entries()) {
      expect(u).toBeGreaterThanOrEqual(SPANS[index].t0);
      expect(u).toBeLessThanOrEqual(SPANS[index].t1);
      if (index > 0) {
        expect(u).toBeGreaterThan(STATION_US[index - 1]);
      }
    }
  });

  it("buildNodes: 29 hộp + 3 trụ, spanIndex hợp lệ, xám trong dải matcap", () => {
    const nodes = buildNodes();
    expect(nodes.boxes).toHaveLength(29);
    expect(nodes.cylinders).toHaveLength(3);
    for (const node of [...nodes.boxes, ...nodes.cylinders]) {
      expect(node.spanIndex).toBeGreaterThanOrEqual(0);
      expect(node.spanIndex).toBeLessThan(SPANS.length);
      expect(node.grey).toBeGreaterThanOrEqual(0.3);
      expect(node.grey).toBeLessThanOrEqual(0.9);
    }
  });
});
