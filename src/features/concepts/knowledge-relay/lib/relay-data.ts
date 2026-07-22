/**
 * Biểu đồ relay kiểu Marey dựng trên hồ sơ nghề thật: 6 lane là bốn
 * chặng làm việc (freelance Huế 2014–2016 · Synova 2017–2018 · TESO
 * 2019–2021 · Treehouse 2021–nay) tách thành các nhóm cộng tác, xếp kệ
 * theo z; thời gian 2014→2026 chạy dọc x. 5 practice thật là gậy phát
 * sáng được trao qua các lane; lane tắt khi rời chỗ đó, gậy vẫn chạy
 * tiếp — đó là toàn bộ beat cảm xúc. Mọi hình học suy từ dữ liệu thuần.
 *
 * Quy ước: endYear của một lane là năm chuyển chặng, nên lane trước và
 * lane sau chạm nhau đúng ở năm trao gậy.
 */

export interface RelayLane {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  y: number;
  z: number;
}

export const LANES: RelayLane[] = [
  {
    id: "l-freelance",
    label: "khách freelance · Huế (Freelancer.com)",
    startYear: 2014,
    endYear: 2017,
    y: 0,
    z: 0,
  },
  {
    id: "l-synova",
    label: "Synova Solutions · TP.HCM",
    startYear: 2017,
    endYear: 2019,
    y: 0.5,
    z: -0.7,
  },
  {
    id: "l-teso",
    label: "TESO · dự án khách JavaScript/React",
    startYear: 2019,
    endYear: 2021,
    y: 1.0,
    z: -1.4,
  },
  {
    id: "l-teso-process",
    label: "TESO · designer & management",
    startYear: 2019,
    endYear: 2021,
    y: 1.5,
    z: -2.1,
  },
  {
    id: "l-treehouse",
    label: "Treehouse · frontend (đội 8 kỹ sư)",
    startYear: 2021,
    endYear: 2026,
    y: 2.0,
    z: -2.8,
  },
  {
    id: "l-treehouse-product",
    label: "Treehouse · designer & product manager",
    startYear: 2021,
    endYear: 2026,
    y: 2.5,
    z: -3.5,
  },
];

export type BatonDash = "solid" | "dashed" | "dotted";

export interface BatonPass {
  laneId: string;
  fromYear: number;
  toYear: number;
}

export interface Baton {
  id: string;
  label: string;
  dash: BatonDash;
  forgedYear: number;
  /** Chuỗi pass liên tục: toYear pass trước = fromYear pass sau */
  passes: BatonPass[];
  note: string;
}

export const BATONS: Baton[] = [
  {
    id: "b-legacy",
    label: "LEGACY-RESCUE",
    dash: "solid",
    forgedYear: 2014,
    note: "Gậy đầu tiên, rèn từ những site khách phải nhận lại và giữ cho chạy: WordPress và PHP thời freelance, rồi Drupal/Magento/OpenCart ở Synova, rồi chủ trì tối ưu và bảo trì codebase legacy ở TESO. Đọc code người khác trước khi viết code mình — thói quen đó theo tôi tới tận stack Treehouse.",
    passes: [
      { laneId: "l-freelance", fromYear: 2014, toYear: 2017 },
      { laneId: "l-synova", fromYear: 2017, toYear: 2019 },
      { laneId: "l-teso", fromYear: 2019, toYear: 2021 },
      { laneId: "l-treehouse", fromYear: 2021, toYear: 2026 },
    ],
  },
  {
    id: "b-standards",
    label: "CODING-STANDARDS",
    dash: "dashed",
    forgedYear: 2017,
    note: "Hai năm ở Synova nhảy qua Laravel, CakePHP, CodeIgniter, Zend, Yii dạy tôi một chuyện: quy ước không viết ra thì không tồn tại. Ở TESO nó thành tài liệu quy trình chốt cùng designer và management; ở Treehouse tôi sở hữu coding standards cho cả front-end stack.",
    passes: [
      { laneId: "l-synova", fromYear: 2017, toYear: 2019 },
      { laneId: "l-teso-process", fromYear: 2019, toYear: 2021 },
      { laneId: "l-treehouse", fromYear: 2021, toYear: 2026 },
    ],
  },
  {
    id: "b-review",
    label: "CODE-REVIEW",
    dash: "solid",
    forgedYear: 2019,
    note: "Ở TESO tôi bắt đầu review code đồng đội như cách hướng dẫn quy trình, không phải gác cổng. Sang Treehouse nó thành nhịp hằng ngày cho đội 8 kỹ sư, đi kèm một quy trình QA có cấu trúc.",
    passes: [
      { laneId: "l-teso", fromYear: 2019, toYear: 2021 },
      { laneId: "l-treehouse", fromYear: 2021, toYear: 2026 },
    ],
  },
  {
    id: "b-onboarding",
    label: "ONBOARDING-DOCS",
    dash: "dotted",
    forgedYear: 2019,
    note: "Bắt đầu từ việc chuẩn hoá quy trình, tài liệu và release ở TESO để người sau không phải dò lại từ đầu. Ở Treehouse gậy này là bộ tài liệu onboarding của front-end stack — thứ tôi đưa cho mỗi người mới thay vì kể lại bằng miệng.",
    passes: [
      { laneId: "l-teso-process", fromYear: 2019, toYear: 2021 },
      { laneId: "l-treehouse", fromYear: 2021, toYear: 2026 },
    ],
  },
  {
    id: "b-pairing",
    label: "PAIR-&-WORKSHOP",
    dash: "dashed",
    forgedYear: 2021,
    note: "Gậy trẻ nhất: mentor bằng pair programming và workshop chia sẻ kiến thức thay vì bằng tài liệu một chiều. Rèn trong đội frontend Treehouse rồi chuyển thành nhịp trao đổi hằng ngày với designer và product manager.",
    passes: [
      { laneId: "l-treehouse", fromYear: 2021, toYear: 2023 },
      { laneId: "l-treehouse-product", fromYear: 2023, toYear: 2026 },
    ],
  },
];

export const RELAY_YEAR_MIN = 2014;
export const RELAY_YEAR_MAX = 2026;
export const RELAY_YEAR_SPAN = RELAY_YEAR_MAX - RELAY_YEAR_MIN;

const X_SPAN = 1.05;

/** Trục thời gian: 2014 → -6.3, 2020 → 0, 2026 → +6.3. */
export function xForYear(year: number): number {
  return (year - (RELAY_YEAR_MIN + RELAY_YEAR_MAX) / 2) * X_SPAN;
}

const LANE_BY_ID = new Map(LANES.map((lane) => [lane.id, lane]));
const ARC_SAMPLES = 6;

export interface BatonPath {
  points: [number, number, number][];
  /** Năm tương ứng từng điểm — shader lộ vệt bằng step(aYear, uYear) */
  years: number[];
}

/**
 * Polyline của một gậy: đoạn thẳng dọc mỗi lane + cung bezier bật lên
 * giữa hai lane tại năm trao. x và năm đơn điệu không giảm.
 */
export function buildBatonPath(baton: Baton): BatonPath {
  const points: [number, number, number][] = [];
  const years: number[] = [];

  baton.passes.forEach((pass, index) => {
    const lane = LANE_BY_ID.get(pass.laneId)!;

    // Cung trao gậy từ lane trước sang lane này
    if (index > 0) {
      const prev = LANE_BY_ID.get(baton.passes[index - 1].laneId)!;
      const x = xForYear(pass.fromYear);
      const apexY = Math.max(prev.y, lane.y) + 0.6;
      for (let s = 1; s < ARC_SAMPLES; s += 1) {
        const t = s / ARC_SAMPLES;
        const oneMinus = 1 - t;
        // Bezier bậc 2 trong mặt phẳng (y,z), x giữ nguyên năm trao
        const y =
          oneMinus * oneMinus * prev.y +
          2 * oneMinus * t * apexY +
          t * t * lane.y;
        const z = oneMinus * prev.z + t * lane.z;
        points.push([x, y, z]);
        years.push(pass.fromYear);
      }
    }

    points.push([xForYear(pass.fromYear), lane.y, lane.z]);
    years.push(pass.fromYear);
    points.push([xForYear(pass.toYear), lane.y, lane.z]);
    years.push(pass.toYear);
  });

  return { points, years };
}

/** Vị trí đầu gậy tại một năm bất kỳ (clamp hai đầu hành trình). */
export function batonPositionAt(
  baton: Baton,
  yearFloat: number,
): [number, number, number] {
  const { points, years } = buildBatonPath(baton);
  if (yearFloat <= years[0]) return points[0];
  const last = points.length - 1;
  if (yearFloat >= years[last]) return points[last];

  for (let i = 1; i < points.length; i += 1) {
    if (yearFloat <= years[i]) {
      const span = years[i] - years[i - 1];
      const t = span > 0 ? (yearFloat - years[i - 1]) / span : 1;
      return [
        points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
        points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
        points[i - 1][2] + (points[i][2] - points[i - 1][2]) * t,
      ];
    }
  }
  return points[last];
}

/** Số lần trao gậy đã xảy ra tính tới một năm. */
export function handedOffCount(yearFloat: number): number {
  let count = 0;
  for (const baton of BATONS) {
    for (let i = 1; i < baton.passes.length; i += 1) {
      if (baton.passes[i].fromYear <= yearFloat) count += 1;
    }
  }
  return count;
}

/**
 * Số chặng đã mang practice tính tới một năm: mỗi pass đã bắt đầu là
 * một chặng có thật trong hồ sơ (không suy ra số người — chỉ đội
 * frontend Treehouse là con số biết chắc: 8 kỹ sư).
 */
export function carriersAt(yearFloat: number): number {
  let count = 0;
  for (const baton of BATONS) {
    for (const pass of baton.passes) {
      if (pass.fromYear <= yearFloat) count += 1;
    }
  }
  return count;
}
