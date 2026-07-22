/**
 * Sổ cái nghề thật của Ky Le Dinh: 14 năm (2012 → 2025) nén vào đúng 10
 * tầng, mỗi tầng một chặng. Chặng ship sản phẩm cộng tải, chặng dọn nợ
 * (refactor) nhân nợ tích luỹ xuống. Hai đường cong nợ (thật / giả định
 * không bao giờ dọn) precompute lúc load module — runtime KHÔNG mô phỏng
 * gì, không physics engine. Không có số liệu bịa: tải và relief là thang
 * tương đối của demo, còn mọi con số trong `metric` đều lấy từ hồ sơ thật.
 */

export interface LedgerEvent {
  /** 0..9 — cũng là chỉ số tầng của tháp */
  yearIndex: number;
  /** Năm bắt đầu của chặng */
  year: number;
  /** Chỉ chặng kéo dài nhiều năm (2013–2016, 2023–2024) */
  yearEnd?: number;
  kind: "feature" | "refactor";
  title: string;
  /** Mô tả chặng, dùng → thay vì em-dash (quy tắc lab) */
  metric: string;
  /** Nợ cộng thêm trong chặng (refactor vẫn cộng một ít overhead) */
  load: number;
  /** Chỉ refactor: hệ số nhân nợ tích luỹ xuống (< 1) */
  relief?: number;
  note: string;
}

export const FLOOR_COUNT = 10;
/** uYear chạy 0..10: 0 = đất trống trước 2012, 10 = hôm nay 2026 */
export const YEAR_SPAN = 10;

export const LEDGER: LedgerEvent[] = [
  {
    yearIndex: 0,
    year: 2012,
    kind: "feature",
    title: "Dòng PHP đầu tiên",
    metric: "mở hồ sơ Freelancer 11/07/2012 → làm việc từ Huế",
    load: 1.0,
    note: "Móng đổ bằng PHP và một tài khoản freelance trống trơn. Mọi thói quen hình thành ở tầng này sẽ tính lãi suốt mười ba năm sau.",
  },
  {
    yearIndex: 1,
    year: 2013,
    yearEnd: 2016,
    kind: "feature",
    title: "Bốn năm site khách",
    metric: "HTML · CSS · JS · WordPress → cross-browser và responsive",
    load: 1.2,
    note: "Dựng rồi bảo trì hết site này tới site khác cho khách. Học chịu trách nhiệm dài hạn với code người khác vẫn đang dùng, chứ không chỉ bàn giao rồi thôi.",
  },
  {
    yearIndex: 2,
    year: 2017,
    kind: "feature",
    title: "Vào Synova, làm full-stack",
    metric: "TP.HCM · on-site → design tĩnh tới web động tích hợp API",
    load: 1.5,
    note: "Lần đầu sở hữu dự án từ đầu tới cuối trong một đội thật: jQuery, Laravel, CakePHP, CodeIgniter, Zend, Yii. Tầng này rộng nhưng chưa gọn.",
  },
  {
    yearIndex: 3,
    year: 2018,
    kind: "feature",
    title: "Năm eCommerce",
    metric: "Magento · OpenCart · Drupal → site doanh nghiệp + tích hợp bên thứ ba",
    load: 1.6,
    note: "Nền tảng thương mại điện tử nào cũng mang theo cách làm riêng của nó. Chồng chúng lên nhau trong một năm là chồng thêm ứng suất xuống móng.",
  },
  {
    yearIndex: 4,
    year: 2019,
    kind: "feature",
    title: "TESO remote, đổi sang React",
    metric: "Huế · remote → sở hữu end-to-end nhiều dự án khách bằng JavaScript/React",
    load: 1.4,
    note: "Đổi hệ sinh thái giữa nghề: từ PHP render server sang JavaScript và React. Tầng mới xây nhanh, nhưng bốn tầng dưới vẫn nguyên nợ cũ.",
  },
  {
    yearIndex: 5,
    year: 2020,
    kind: "refactor",
    title: "Cứu các codebase legacy",
    metric: "chủ trì tối ưu + bảo trì legacy → hiệu năng và độ tin cậy",
    load: 0.2,
    relief: 0.55,
    note: "Lần đầu tôi được giao đúng việc trả nợ chứ không phải thêm feature. Đọc lại code cũ, đo, sửa cho nó chạy nhanh và ít vỡ hơn. Kết cấu bật thẳng lại lần thứ nhất.",
  },
  {
    yearIndex: 6,
    year: 2021,
    kind: "feature",
    title: "Vào Treehouse, dựng dApp",
    metric: "DeFi/RWA · tETH → React + TypeScript + Next.js, ví Web3 qua Ethers.js",
    load: 1.7,
    note: "Tầng nặng nhất: sản phẩm on-chain không cho phép sai lặng lẽ. Kiến trúc frontend dựng từ đầu, và tôi ký tên vào nó.",
  },
  {
    yearIndex: 7,
    year: 2022,
    kind: "refactor",
    title: "Chuẩn hoá stack và tài liệu",
    metric: "coding standards + tài liệu onboarding → một cách làm chung",
    load: 0.2,
    relief: 0.6,
    note: "Refactor lần hai không nằm trong code mà nằm quanh code: chuẩn frontend, quy ước, tài liệu onboarding. Nợ giảm vì người sau không phải đoán nữa.",
  },
  {
    yearIndex: 8,
    year: 2023,
    yearEnd: 2024,
    kind: "refactor",
    title: "Đội lên 8 người, review hằng ngày",
    metric: "dẫn 8 kỹ sư → code review hằng ngày, QA có cấu trúc, workshop + pair programming",
    load: 0.25,
    relief: 0.65,
    note: "Refactor lần ba là refactor con người: review mỗi ngày, QA thành quy trình, kiến thức truyền qua workshop và pair chứ không nằm trong đầu một người. Đây là lần trả nợ bền nhất.",
  },
  {
    yearIndex: 9,
    year: 2025,
    kind: "feature",
    title: "Dashboard realtime on-chain",
    metric: "giá · yields · TVL → đọc/ghi on-chain qua Ethers.js",
    load: 1.8,
    note: "Tầng mới nhất gánh dữ liệu chạy liên tục từ chain về. Nó đứng được là vì móng đã ba lần được gia cố, chứ không phải vì nó nhẹ.",
  },
];

/**
 * Nhãn năm cho 11 mốc scrub 0..10: mốc i là năm bắt đầu của tầng i,
 * mốc cuối là hôm nay. Không nội suy — nghề không chia đều theo năm.
 */
export const YEAR_LABELS: number[] = [
  ...LEDGER.map((event) => event.year),
  2026,
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
