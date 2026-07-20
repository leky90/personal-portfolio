/**
 * Mô hình quang học của ràng buộc kỹ thuật: tia ý tưởng đi qua 5 wedge,
 * mỗi ràng buộc ACTIVE gập tia một góc; qua hết stack tia toả thành phổ
 * 6 tia đáp xuống các decision plate. Toàn bộ hình học suy ra từ data
 * model này — bản chính thức dùng đúng JSON đó để vẽ diagram 2D trong
 * case study (một nguồn sự thật, hai cách render).
 */

export interface Constraint {
  id: string;
  /** Nhãn khắc trên wedge, mono uppercase */
  label: string;
  /** Độ gập tia (world y) khi ràng buộc active — đan dấu cho zigzag */
  deflection: number;
  /** Con đường không đi: bỏ ràng buộc này thì mất gì */
  tradeoff: string;
}

export const CONSTRAINTS: Constraint[] = [
  {
    id: "latency",
    label: "LATENCY 120MS",
    deflection: -0.52,
    tradeoff:
      "Bỏ ngân sách độ trễ thì khỏi cần edge cache, nhưng người dùng xa server sẽ trả giá bằng mỗi cú click.",
  },
  {
    id: "team",
    label: "TEAM OF 3",
    deflection: 0.44,
    tradeoff:
      "Đông người hơn thì chia service thoải mái, nhưng team 3 người mà chia 12 service là tự đeo gông vận hành.",
  },
  {
    id: "deadline",
    label: "SHIP IN 6 WEEKS",
    deflection: -0.38,
    tradeoff:
      "Không deadline thì kiến trúc nào cũng đẹp trên giấy; 6 tuần buộc mọi lựa chọn phải trả lời 'cắt được gì'.",
  },
  {
    id: "pci",
    label: "PCI SCOPE",
    deflection: 0.5,
    tradeoff:
      "Không đụng dữ liệu thẻ thì khỏi audit log bất biến, nhưng đã cầm tiền của người khác thì không có lựa chọn.",
  },
  {
    id: "budget",
    label: "INFRA BUDGET",
    deflection: -0.34,
    tradeoff:
      "Ngân sách mở thì cứ managed-everything; ngân sách thật buộc phân biệt thứ đáng trả tiền và thứ tự vận hành.",
  },
];

export interface Decision {
  id: string;
  label: string;
  /** Quyết định chỉ bật khi TẤT CẢ ràng buộc nó cần đang active */
  requires: string[];
}

export const DECISIONS: Decision[] = [
  { id: "edge-cache", label: "edge cache", requires: ["latency"] },
  {
    id: "boring-postgres",
    label: "postgres nhàm chán",
    requires: ["team", "budget"],
  },
  {
    id: "monolith-first",
    label: "monolith trước",
    requires: ["team", "deadline"],
  },
  { id: "audit-log", label: "audit log bất biến", requires: ["pci"] },
  { id: "one-queue", label: "đúng một hàng đợi", requires: ["deadline", "budget"] },
];

/** Ramp phổ amber → teal → violet (khớp token màu site, cố ý không cầu vồng). */
export const RAY_COLORS = [
  "#ffb454",
  "#e8c547",
  "#9ed36a",
  "#2dd4bf",
  "#38bdf8",
  "#a78bfa",
];

/** X cố định của 8 control point: vào → tiền stack → 5 wedge → ra. */
const POINT_XS = [-8, -4.2, -2.4, -1.2, 0, 1.2, 2.4, 7.2];

/**
 * 8 control point của tia (topology CỐ ĐỊNH — re-refract chỉ ghi lại y,
 * không realloc geometry). y cộng dồn deflection của các wedge active.
 */
export function buildBeamPoints(
  active: readonly boolean[],
): [number, number, number][] {
  let y = 0;
  return POINT_XS.map((x, index) => {
    // Điểm 2..6 nằm ngay sau wedge 0..4: gập nếu wedge đó active
    if (index >= 2 && index <= 6 && active[index - 2]) {
      y += CONSTRAINTS[index - 2].deflection;
    }
    return [x, y, 0];
  });
}

/** Càng nhiều ràng buộc active phổ càng toả rộng (ý tưởng được tinh luyện). */
export function spectrumSpread(active: readonly boolean[]): number {
  const total = CONSTRAINTS.reduce(
    (sum, constraint, index) =>
      sum + (active[index] ? Math.abs(constraint.deflection) : 0),
    0,
  );
  return 0.12 + total * 0.55;
}

/** 6 điểm đáp của phổ, quạt quanh y cuối của tia. */
export function rayTargets(
  active: readonly boolean[],
): [number, number, number][] {
  const exit = buildBeamPoints(active)[7];
  const spread = spectrumSpread(active);
  return RAY_COLORS.map((_, index) => {
    const t = (index - 2.5) / 2.5;
    return [7.4, exit[1] + t * spread, 0];
  });
}

/** Các quyết định đang đứng vững với tập ràng buộc hiện tại. */
export function activeDecisions(active: readonly boolean[]): Decision[] {
  const activeIds = new Set(
    CONSTRAINTS.filter((_, index) => active[index]).map((c) => c.id),
  );
  return DECISIONS.filter((decision) =>
    decision.requires.every((id) => activeIds.has(id)),
  );
}
