import { describe, expect, it } from "vitest";
import {
  DESK_OBJECTS,
  ERAS,
  latestCommit,
  popScale,
  yearAt,
} from "@/features/concepts/desk-version-controlled/lib/desk-data";

describe("desk-data — mười hai năm sự nghiệp là lịch sử commit của một chiếc bàn", () => {
  it("mọi object có id riêng, birth/death hợp lệ trong [0,1]", () => {
    expect(DESK_OBJECTS.length).toBeGreaterThanOrEqual(14);
    expect(new Set(DESK_OBJECTS.map((o) => o.id)).size).toBe(
      DESK_OBJECTS.length,
    );
    for (const object of DESK_OBJECTS) {
      expect(object.birth).toBeGreaterThanOrEqual(0);
      expect(object.birth).toBeLessThan(1);
      expect(object.death).toBeGreaterThan(object.birth);
      expect(object.death).toBeLessThanOrEqual(1);
      expect(object.commit.length).toBeGreaterThan(0);
      expect(object.story.length).toBeGreaterThan(0);
    }
  });

  it("trưởng thành = bớt đi: 2026 ít đồ trên bàn hơn 2019", () => {
    const aliveCount = (t: number) =>
      DESK_OBJECTS.filter((o) => o.birth <= t && t < o.death).length;
    expect(aliveCount(0.99)).toBeLessThan(aliveCount(0.5));
  });

  it("4 era với mốc t tăng dần: 2014 freelance → 2021 lead Treehouse", () => {
    expect(ERAS).toHaveLength(4);
    expect(ERAS.map((era) => era.year)).toEqual([2014, 2017, 2019, 2021]);
    for (let i = 1; i < ERAS.length; i += 1) {
      expect(ERAS[i].t).toBeGreaterThan(ERAS[i - 1].t);
    }
  });

  it("popScale: 0 trước birth, đạt ~1 sau cửa sổ pop, về 0 sau death", () => {
    const object = DESK_OBJECTS.find((o) => o.death < 1)!;
    expect(popScale(object, object.birth - 0.01)).toBe(0);
    expect(popScale(object, object.birth + 0.1)).toBeGreaterThanOrEqual(0.95);
    expect(popScale(object, object.death - 0.001)).toBeLessThanOrEqual(1.05);
    expect(popScale(object, object.death + 0.01)).toBe(0);
  });

  it("latestCommit: trả message của thay đổi gần nhất theo tiến độ", () => {
    expect(latestCommit(0)).toMatch(/feat|chore/);
    const late = latestCommit(0.99);
    expect(late.length).toBeGreaterThan(0);
    // Thay đổi cuối timeline phải khác thay đổi đầu
    expect(late).not.toBe(latestCommit(0.05));
  });

  it("yearAt: 0 → 2014, 1 → 2026, giữa chừng nằm trong khoảng", () => {
    expect(yearAt(0)).toBe(2014);
    expect(yearAt(1)).toBe(2026);
    const mid = yearAt(0.5);
    expect(mid).toBeGreaterThanOrEqual(2019);
    expect(mid).toBeLessThanOrEqual(2021);
  });

  it("mốc t của mỗi era khớp đúng năm nó đại diện", () => {
    for (const era of ERAS) {
      expect(yearAt(era.t)).toBe(era.year);
    }
  });
});
