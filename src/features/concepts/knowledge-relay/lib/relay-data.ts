/**
 * Biểu đồ relay kiểu Marey: 6 lane team xếp kệ theo z, thời gian
 * 2016→2026 chạy dọc x. 5 practice là gậy phát sáng được trao qua các
 * lane; lane có thể chết (dự án đóng) nhưng gậy chạy tiếp — đó là toàn
 * bộ beat cảm xúc. Mọi hình học suy từ dữ liệu thuần, test được.
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
  { id: "l-billing", label: "billing team", startYear: 2016, endYear: 2019, y: 0, z: 0 },
  { id: "l-search", label: "search team", startYear: 2017, endYear: 2020, y: 0.5, z: -0.7 },
  { id: "l-checkout", label: "checkout platform", startYear: 2019, endYear: 2022, y: 1.0, z: -1.4 },
  { id: "l-platform", label: "platform guild", startYear: 2020, endYear: 2024, y: 1.5, z: -2.1 },
  { id: "l-data", label: "data pipeline", startYear: 2022, endYear: 2025, y: 2.0, z: -2.8 },
  { id: "l-ai", label: "ai serving", startYear: 2024, endYear: 2026, y: 2.5, z: -3.5 },
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
    id: "b-review",
    label: "REVIEW-CULTURE",
    dash: "solid",
    forgedYear: 2016,
    note: "Rèn ở billing team 2016: review là dạy nhau, không phải gác cổng. Đội nào nhận gậy này cũng giữ được sau khi tôi rời đi.",
    passes: [
      { laneId: "l-billing", fromYear: 2016, toYear: 2018 },
      { laneId: "l-search", fromYear: 2018, toYear: 2020 },
      { laneId: "l-checkout", fromYear: 2020, toYear: 2022 },
      { laneId: "l-platform", fromYear: 2022, toYear: 2024 },
      { laneId: "l-ai", fromYear: 2024, toYear: 2026 },
    ],
  },
  {
    id: "b-incident",
    label: "INCIDENT-PROCESS",
    dash: "dashed",
    forgedYear: 2017,
    note: "Blameless postmortem viết lần đầu cho search team. Lane đó tắt năm 2020; quy trình vẫn chạy ở bốn đội sau.",
    passes: [
      { laneId: "l-search", fromYear: 2017, toYear: 2019 },
      { laneId: "l-checkout", fromYear: 2019, toYear: 2021 },
      { laneId: "l-platform", fromYear: 2021, toYear: 2023 },
      { laneId: "l-data", fromYear: 2023, toYear: 2025 },
      { laneId: "l-ai", fromYear: 2025, toYear: 2026 },
    ],
  },
  {
    id: "b-contracts",
    label: "API-CONTRACTS",
    dash: "dotted",
    forgedYear: 2018,
    note: "Schema-first từ thời billing: hợp đồng đi trước code. Gậy này qua tay nhiều team nhất vì ai cũng cần nói chuyện với ai.",
    passes: [
      { laneId: "l-billing", fromYear: 2018, toYear: 2019 },
      { laneId: "l-checkout", fromYear: 2019, toYear: 2022 },
      { laneId: "l-platform", fromYear: 2022, toYear: 2024 },
      { laneId: "l-data", fromYear: 2024, toYear: 2025 },
      { laneId: "l-ai", fromYear: 2025, toYear: 2026 },
    ],
  },
  {
    id: "b-oncall",
    label: "ONCALL-ROTATION",
    dash: "solid",
    forgedYear: 2019,
    note: "Vòng trực công bằng + runbook sống, dựng cho checkout. Người mới vào đội học hệ thống nhanh nhất qua chính gậy này.",
    passes: [
      { laneId: "l-checkout", fromYear: 2019, toYear: 2021 },
      { laneId: "l-platform", fromYear: 2021, toYear: 2024 },
      { laneId: "l-data", fromYear: 2024, toYear: 2025 },
      { laneId: "l-ai", fromYear: 2025, toYear: 2026 },
    ],
  },
  {
    id: "b-adr",
    label: "ADR-WRITING",
    dash: "dashed",
    forgedYear: 2021,
    note: "Quyết định kiến trúc phải có ngày tháng và lý do. Gậy trẻ nhất nhưng lan nhanh nhất: đội mới nào cũng đói ngữ cảnh.",
    passes: [
      { laneId: "l-platform", fromYear: 2021, toYear: 2024 },
      { laneId: "l-data", fromYear: 2024, toYear: 2025 },
      { laneId: "l-ai", fromYear: 2025, toYear: 2026 },
    ],
  },
];

const YEAR_MIN = 2016;
const YEAR_MAX = 2026;
const X_SPAN = 1.5;

/** Trục thời gian: 2016 → -7.5, 2021 → 0, 2026 → +7.5. */
export function xForYear(year: number): number {
  return (year - (YEAR_MIN + YEAR_MAX) / 2) * X_SPAN;
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

/** Số kỹ sư đang mang practice: mỗi pass đã bắt đầu đóng góp một tổ 4 người. */
export function carriersAt(yearFloat: number): number {
  let count = 0;
  for (const baton of BATONS) {
    if (baton.forgedYear <= yearFloat) count += 1;
    for (const pass of baton.passes) {
      if (pass.fromYear <= yearFloat) count += 4;
    }
  }
  return count;
}
