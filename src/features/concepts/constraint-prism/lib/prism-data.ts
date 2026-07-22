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

/**
 * Năm ràng buộc CÓ THẬT đã đi qua: ba cái đến từ dApp DeFi ở Treehouse
 * (ví là danh tính, dữ liệu on-chain có độ trễ, đội 8 kỹ sư giữ cả stack
 * front-end), hai cái đến từ giai đoạn trước (codebase legacy thời TESO,
 * ngân sách khách thời freelance).
 */
export const CONSTRAINTS: Constraint[] = [
  {
    id: "wallet",
    label: "WALLET IS IDENTITY",
    deflection: -0.52,
    tradeoff:
      "Có session server thì cứ email với cookie như mọi app; ở dApp, danh tính là địa chỉ ví — không đăng ký, không quên mật khẩu, và cũng không có ai khôi phục tài khoản hộ người dùng.",
  },
  {
    id: "chain",
    label: "ON-CHAIN LATENCY",
    deflection: 0.44,
    tradeoff:
      "Dữ liệu nằm trong DB của mình thì đọc xong là xong; đọc qua Ethers.js thì mỗi giao dịch có quãng chờ block, và UI phải nói thật là đang chờ chứ không giả vờ đã xong.",
  },
  {
    id: "team",
    label: "TEAM OF 8",
    deflection: -0.38,
    tradeoff:
      "Đội đông hơn thì mỗi người ôm riêng một mảng cũng chạy; tám người giữ cả một dApp thì phải chọn thứ ai cũng đọc được, không phải thứ chỉ tác giả hiểu.",
  },
  {
    id: "legacy",
    label: "LEGACY CODEBASE",
    deflection: 0.5,
    tradeoff:
      "Code mới tinh thì kiến trúc nào vẽ cũng được; nhận một codebase đang chạy cho khách thì mọi thay đổi phải sống chung với phần chưa ai dám đụng.",
  },
  {
    id: "budget",
    label: "CLIENT BUDGET",
    deflection: -0.34,
    tradeoff:
      "Ngân sách mở thì cứ managed-everything; khách trả theo gói buộc mình phân biệt thứ đáng làm kỹ và thứ chỉ cần chạy đúng rồi bàn giao được.",
  },
];

export interface Decision {
  id: string;
  label: string;
  /** Quyết định chỉ bật khi TẤT CẢ ràng buộc nó cần đang active */
  requires: string[];
}

/** Năm quyết định kỹ thuật đã thật sự ra, mỗi cái do ràng buộc ở trên ép. */
export const DECISIONS: Decision[] = [
  { id: "wallet-session", label: "ví thay session", requires: ["wallet"] },
  { id: "read-cache", label: "cache lớp đọc chain", requires: ["chain"] },
  {
    id: "pending-state",
    label: "pending là một trạng thái",
    requires: ["wallet", "chain"],
  },
  {
    id: "written-standards",
    label: "chuẩn code thành tài liệu",
    requires: ["team", "legacy"],
  },
  {
    id: "patch-not-rewrite",
    label: "vá tại chỗ, không viết lại",
    requires: ["legacy", "budget"],
  },
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
