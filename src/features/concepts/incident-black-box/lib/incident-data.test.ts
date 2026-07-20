import { describe, expect, it } from "vitest";
import {
  EVENTS,
  INCIDENT,
  METRIC_SAMPLES,
  buildMetrics,
  severityAt,
} from "@/features/concepts/incident-black-box/lib/incident-data";

describe("incident.json — một SEV-1 ẩn danh làm nguồn sự thật", () => {
  it("metadata đủ: sev, thời lượng, mttr", () => {
    expect(INCIDENT.sev).toMatch(/SEV-1/);
    expect(INCIDENT.durationMin).toBeGreaterThan(0);
    expect(INCIDENT.mttrMin).toBeGreaterThan(0);
    expect(INCIDENT.mttrMin).toBeLessThanOrEqual(INCIDENT.durationMin);
  });

  it("≥ 12 event trên băng, t tăng dần trong [0,1], kind hợp lệ", () => {
    expect(EVENTS.length).toBeGreaterThanOrEqual(12);
    const kinds = new Set(["signal", "alert", "decision", "deploy", "resolve"]);
    for (let i = 0; i < EVENTS.length; i += 1) {
      expect(EVENTS[i].t).toBeGreaterThanOrEqual(0);
      expect(EVENTS[i].t).toBeLessThanOrEqual(1);
      expect(kinds.has(EVENTS[i].kind)).toBe(true);
      expect(EVENTS[i].label.length).toBeGreaterThan(0);
      if (i > 0) expect(EVENTS[i].t).toBeGreaterThan(EVENTS[i - 1].t);
    }
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
  });

  it("có đúng một resolve và nó nằm cuối chuỗi sự kiện", () => {
    const resolves = EVENTS.filter((e) => e.kind === "resolve");
    expect(resolves).toHaveLength(1);
    expect(EVENTS[EVENTS.length - 1].kind).toBe("resolve");
  });

  it("metrics deterministic, đúng số mẫu, giá trị [0,1]", () => {
    const a = buildMetrics();
    const b = buildMetrics();
    expect(a).toHaveLength(3 * METRIC_SAMPLES);
    expect(Array.from(a)).toEqual(Array.from(b));
    for (const v of a) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("severity đạt đỉnh trong cửa sổ sự cố, nguội về hai đầu", () => {
    expect(severityAt(0.02)).toBeLessThan(0.25);
    expect(severityAt(0.5)).toBeGreaterThan(0.7);
    expect(severityAt(0.98)).toBeLessThan(0.3);
  });

  it("không chuỗi nào chứa em-dash", () => {
    for (const e of EVENTS) {
      expect(`${e.label} ${e.note}`).not.toContain("—");
    }
  });
});
