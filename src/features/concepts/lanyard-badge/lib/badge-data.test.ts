import { describe, expect, it } from "vitest";
import {
  BADGE_FRONT,
  BADGE_SPECS,
  PENDULUM,
  pendulumStep,
} from "@/features/concepts/lanyard-badge/lib/badge-data";

describe("badge-data — thẻ đeo với con lắc thuần, không physics engine", () => {
  it("mặt trước có tên + chức danh, mặt sau ≥5 dòng spec build-time", () => {
    expect(BADGE_FRONT.name.length).toBeGreaterThan(0);
    expect(BADGE_FRONT.title.length).toBeGreaterThan(0);
    expect(BADGE_FRONT.est).toMatch(/2016/);
    expect(BADGE_SPECS.length).toBeGreaterThanOrEqual(5);
    for (const line of BADGE_SPECS) {
      expect(line.length).toBeGreaterThan(0);
    }
  });

  it("pendulumStep: điểm cân bằng đứng yên tuyệt đối", () => {
    const [theta, omega] = pendulumStep(0, 0, 0.016);
    expect(theta).toBe(0);
    expect(omega).toBe(0);
  });

  it("pendulumStep: damping rút năng lượng — biên độ giảm dần về 0", () => {
    let theta = 0.8;
    let omega = 0;
    let maxAfter = 0;
    for (let i = 0; i < 2000; i += 1) {
      [theta, omega] = pendulumStep(theta, omega, 0.016);
      if (i > 1500) maxAfter = Math.max(maxAfter, Math.abs(theta));
    }
    expect(maxAfter).toBeLessThan(0.05);
  });

  it("pendulumStep deterministic và kéo về cân bằng đúng chiều", () => {
    const a = pendulumStep(0.5, 0, 0.016);
    const b = pendulumStep(0.5, 0, 0.016);
    expect(a).toEqual(b);
    // Lệch dương → gia tốc âm kéo về giữa
    expect(a[1]).toBeLessThan(0);
    expect(PENDULUM.damping).toBeGreaterThan(0);
  });
});
