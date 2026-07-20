/**
 * Sổ cái 10 năm của một codebase: mỗi năm một tầng, feature cộng tải,
 * refactor nhân nợ xuống. Hai đường cong nợ (thật / giả định không bao
 * giờ refactor) precompute lúc load module — runtime KHÔNG mô phỏng gì,
 * không physics engine. Bản chính thức thay bằng ledger sự nghiệp thật.
 */

export interface LedgerEvent {
  /** 0..9 — cũng là chỉ số tầng của tháp */
  yearIndex: number;
  year: number;
  kind: "feature" | "refactor";
  title: string;
  /** Số liệu chiến tích, dùng → thay vì em-dash (quy tắc lab) */
  metric: string;
  /** Nợ cộng thêm trong năm (refactor vẫn cộng một ít overhead) */
  load: number;
  /** Chỉ refactor: hệ số nhân nợ tích luỹ xuống (< 1) */
  relief?: number;
  note: string;
}

export const FLOOR_COUNT = 10;
/** uYear chạy 0..10: 0 = đất trống 2016, 10 = hôm nay 2026 */
export const YEAR_SPAN = 10;

export const LEDGER: LedgerEvent[] = [
  {
    yearIndex: 0,
    year: 2016,
    kind: "feature",
    title: "Khởi tạo monolith",
    metric: "0 → 1: MVP ship trong 3 tháng",
    load: 1.0,
    note: "Tầng móng đổ vội để kịp thị trường. Mọi shortcut ở đây sẽ tính lãi kép suốt chín năm sau.",
  },
  {
    yearIndex: 1,
    year: 2017,
    kind: "feature",
    title: "Thanh toán + báo cáo",
    metric: "doanh thu đầu tiên · 2 module lớn",
    load: 1.3,
    note: "Code thanh toán viết chồng lên model cũ vì deadline. Tháp bắt đầu nghiêng nhẹ, chưa ai để ý.",
  },
  {
    yearIndex: 2,
    year: 2018,
    kind: "feature",
    title: "Mobile API v1",
    metric: "endpoints x3 · client thứ hai",
    load: 1.5,
    note: "Một backend phục vụ hai client với hai nhịp release. Ứng suất dồn xuống các tầng dưới thấy rõ.",
  },
  {
    yearIndex: 3,
    year: 2019,
    kind: "refactor",
    title: "Tách service + CI mới",
    metric: "deploy 45m → 6m",
    load: 0.2,
    relief: 0.55,
    note: "Lần đầu tiên tôi thuyết phục được business trả nợ: hai quý không feature mới. Kết cấu bật thẳng lại, deploy nhanh gấp bảy lần.",
  },
  {
    yearIndex: 4,
    year: 2020,
    kind: "feature",
    title: "Traffic x8",
    metric: "peak 42k rps · 99.95% uptime",
    load: 1.9,
    note: "Năm tải nặng nhất lịch sử hệ thống. Sống sót được là nhờ khoản nợ vừa trả năm trước.",
  },
  {
    yearIndex: 5,
    year: 2021,
    kind: "feature",
    title: "Multi-region",
    metric: "2 region · failover 40s",
    load: 1.6,
    note: "Mở region thứ hai kéo theo replication, split-brain, clock skew. Tầng nào cũng gánh thêm một ít.",
  },
  {
    yearIndex: 6,
    year: 2022,
    kind: "refactor",
    title: "Dọn dead code + design system",
    metric: "xoá 40% dead code · 1 UI kit",
    load: 0.2,
    relief: 0.6,
    note: "Refactor lần hai: đo trước bằng coverage + churn map, xoá gần nửa codebase mà không ai mất ngủ.",
  },
  {
    yearIndex: 7,
    year: 2023,
    kind: "feature",
    title: "Realtime pipeline",
    metric: "p99 ingest 230ms",
    load: 1.7,
    note: "Stream processing đặt cạnh batch cũ. Feature đẹp nhưng tải kiến trúc cộng thẳng vào các tầng móng.",
  },
  {
    yearIndex: 8,
    year: 2024,
    kind: "refactor",
    title: "TS strict + build lại deploy",
    metric: "deploy 6m → 90s · 0 any",
    load: 0.15,
    relief: 0.62,
    note: "Refactor lần ba nhắm vào vòng lặp dev: type-safe từ DB tới UI, deploy 90 giây. Tháp sáng màu thép mới.",
  },
  {
    yearIndex: 9,
    year: 2025,
    kind: "feature",
    title: "Lớp AI",
    metric: "3 model serving · eval hàng đêm",
    load: 1.8,
    note: "Tầng mới nhất, tải mới kiểu mới: GPU, eval, drift. Nhưng móng đã ba lần được gia cố nên vẫn đứng thẳng.",
  },
];

export const REFACTOR_YEARS = LEDGER.filter(
  (event) => event.kind === "refactor",
).map((event) => event.yearIndex);

// Hai đường cong nợ precompute: chỉ số k = trạng thái SAU năm thứ k-1.
const DEBT_TRUE: number[] = [0];
const DEBT_ALT: number[] = [0];
for (const event of LEDGER) {
  const prevTrue = DEBT_TRUE[DEBT_TRUE.length - 1];
  const prevAlt = DEBT_ALT[DEBT_ALT.length - 1];
  DEBT_TRUE.push(
    event.kind === "refactor" && event.relief !== undefined
      ? prevTrue * event.relief + event.load
      : prevTrue + event.load,
  );
  DEBT_ALT.push(prevAlt + event.load);
}

/** Đỉnh nợ giả định năm 10 — mốc chuẩn hoá strain về [0,1]. */
export const DEBT_MAX = DEBT_ALT[YEAR_SPAN];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Nợ tích luỹ tại thời điểm yearFloat (lerp giữa hai mốc năm). */
export function debtAt(yearFloat: number, counterfactual: boolean): number {
  const year = clamp(yearFloat, 0, YEAR_SPAN);
  const table = counterfactual ? DEBT_ALT : DEBT_TRUE;
  const lower = Math.floor(year);
  const upper = Math.min(lower + 1, YEAR_SPAN);
  const frac = year - lower;
  return table[lower] + (table[upper] - table[lower]) * frac;
}

/**
 * Ghi strain 10 tầng vào mảng preallocated (12 phần tử khớp uStrain[12],
 * 2 phần tử cuối luôn 0). Tầng thấp gánh nhiều hơn (shear tích luỹ),
 * tầng chưa xây = 0. Không allocation trong frame loop.
 */
export function fillStrain(
  out: Float32Array,
  yearFloat: number,
  counterfactual: boolean,
): void {
  const year = clamp(yearFloat, 0, YEAR_SPAN);
  const builtFloors = Math.min(Math.ceil(year), FLOOR_COUNT);
  const debtNorm = debtAt(year, counterfactual) / DEBT_MAX;
  for (let floor = 0; floor < out.length; floor += 1) {
    out[floor] =
      floor < builtFloors ? debtNorm * (1 - floor / FLOOR_COUNT) : 0;
  }
}

/** Chi phí ước tính của việc không bao giờ refactor (engineer-months). */
export function estimatedCostMonths(yearFloat: number): number {
  return Math.round((debtAt(yearFloat, true) - debtAt(yearFloat, false)) * 6);
}

export interface TrussMember {
  floor: number;
  kind: "column" | "beam" | "diagonal";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface TrussJoint {
  /** Mức sàn 0..10 (11 mức cho 10 tầng) */
  level: number;
  position: [number, number, number];
}

export interface Truss {
  beams: TrussMember[];
  joints: TrussJoint[];
}

export const HALF_W = 1.05;
export const FLOOR_H = 0.82;
export const TOWER_HEIGHT = FLOOR_COUNT * FLOOR_H;
const BEAM_T = 0.07;

/**
 * Tháp truss procedural: mỗi tầng 4 cột + 4 dầm vành + 4 chéo (12 thanh
 * × 10 tầng = 120), khớp 4 góc × 11 mức = 44. Toàn bộ là dữ liệu thuần
 * cho 2 InstancedMesh — không physics, không allocation runtime.
 */
export function buildTruss(): Truss {
  const beams: TrussMember[] = [];
  const joints: TrussJoint[] = [];
  const diagonalAngle = Math.atan2(HALF_W * 2, FLOOR_H);
  const diagonalLength = Math.hypot(HALF_W * 2, FLOOR_H);

  for (let floor = 0; floor < FLOOR_COUNT; floor += 1) {
    const y0 = floor * FLOOR_H;
    const yMid = y0 + FLOOR_H / 2;
    const yTop = y0 + FLOOR_H;
    const zigzag = floor % 2 === 0 ? 1 : -1;

    // 4 cột góc
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        beams.push({
          floor,
          kind: "column",
          position: [sx * HALF_W, yMid, sz * HALF_W],
          rotation: [0, 0, 0],
          scale: [BEAM_T, FLOOR_H, BEAM_T],
        });
      }
    }

    // 4 dầm vành trên đỉnh tầng
    for (const side of [-1, 1]) {
      beams.push({
        floor,
        kind: "beam",
        position: [0, yTop, side * HALF_W],
        rotation: [0, 0, 0],
        scale: [HALF_W * 2 + BEAM_T, BEAM_T, BEAM_T],
      });
      beams.push({
        floor,
        kind: "beam",
        position: [side * HALF_W, yTop, 0],
        rotation: [0, 0, 0],
        scale: [BEAM_T, BEAM_T, HALF_W * 2 + BEAM_T],
      });
    }

    // 4 chéo, mỗi mặt một thanh, zigzag đảo chiều theo tầng
    for (const side of [-1, 1]) {
      beams.push({
        floor,
        kind: "diagonal",
        position: [0, yMid, side * HALF_W],
        rotation: [0, 0, zigzag * side * diagonalAngle],
        scale: [BEAM_T * 0.8, diagonalLength, BEAM_T * 0.8],
      });
      beams.push({
        floor,
        kind: "diagonal",
        position: [side * HALF_W, yMid, 0],
        rotation: [zigzag * side * diagonalAngle, 0, 0],
        scale: [BEAM_T * 0.8, diagonalLength, BEAM_T * 0.8],
      });
    }
  }

  for (let level = 0; level <= FLOOR_COUNT; level += 1) {
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        joints.push({
          level,
          position: [sx * HALF_W, level * FLOOR_H, sz * HALF_W],
        });
      }
    }
  }

  return { beams, joints };
}
