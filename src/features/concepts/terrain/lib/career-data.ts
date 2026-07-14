export const DEFAULT_SEED = 20160101;

/** 10 năm ≈ 522 tuần — mỗi tuần một mẫu hoạt động (giả lập GitHub contributions). */
export const TOTAL_WEEKS = 522;

export interface CareerEra {
  year: number;
  title: string;
  role: string;
  description: string;
  metric: string;
  /** Biên độ đỉnh núi của era, 0..1 — 2021 (platform rebuild) là cao nhất */
  peak: number;
  /** Vị trí trên trục thời gian chuẩn hóa [0, 1] */
  timeU: number;
  /** Tuần trung tâm của era trong mảng hoạt động */
  week: number;
  /** Card hiển thị bên trái hay phải viewport */
  side: "left" | "right";
}

interface EraSeed {
  year: number;
  title: string;
  role: string;
  description: string;
  metric: string;
  peak: number;
  timeU: number;
  side: "left" | "right";
}

const ERA_SEEDS: EraSeed[] = [
  {
    year: 2016,
    title: "First Production Systems",
    role: "Software Engineer",
    description:
      "Những service production đầu tiên — học cách vận hành thứ mình viết, on-call và postmortem đầu đời.",
    metric: "3 services · 99.5% uptime",
    peak: 0.5,
    timeU: 0.05,
    side: "left",
  },
  {
    year: 2018,
    title: "Scaling The Data Layer",
    role: "Senior Software Engineer",
    description:
      "Tách monolith, dựng data pipeline và caching layer chịu tải gấp 20 lần — lần đầu làm chủ một mảng kiến trúc.",
    metric: "20× traffic · p99 −64%",
    peak: 0.68,
    timeU: 0.25,
    side: "right",
  },
  {
    year: 2021,
    title: "The Platform Rebuild",
    role: "Staff Engineer · Tech Lead",
    description:
      "Dẫn 12 kỹ sư rebuild toàn bộ platform trong 14 tháng — khối núi cao nhất của thập kỷ, và bài học lớn nhất về trade-off.",
    metric: "12 engineers · 14 tháng · 40M req/day",
    peak: 1,
    timeU: 0.55,
    side: "left",
  },
  {
    year: 2024,
    title: "Principal Scope",
    role: "Principal Engineer",
    description:
      "Chuyển trọng tâm sang leverage: platform tooling, mentoring và các quyết định kiến trúc sống lâu hơn một team.",
    metric: "4 teams · 1 platform · 0 lần rewrite lại",
    peak: 0.8,
    timeU: 0.85,
    side: "right",
  },
];

export const ERAS: CareerEra[] = ERA_SEEDS.map((seed) => ({
  ...seed,
  week: Math.round(seed.timeU * (TOTAL_WEEKS - 1)),
}));

/** PRNG mulberry32 — deterministic, đủ tốt cho dữ liệu thị giác. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hoạt động theo tuần của 10 năm: nền nhiễu thấp + bump Gauss quanh mỗi era.
 * Demo dùng seed cố định; bản chính thức thay bằng ETL từ GitHub GraphQL API
 * bake ra đúng định dạng này lúc build.
 */
export function generateWeeklyActivity(
  seed: number = DEFAULT_SEED,
): Float32Array {
  const rand = mulberry32(seed);
  const data = new Float32Array(TOTAL_WEEKS);
  const sigma = 7;
  for (let week = 0; week < TOTAL_WEEKS; week += 1) {
    let value = 0.06 + rand() * 0.16;
    for (const era of ERAS) {
      const distance = week - era.week;
      value +=
        era.peak *
        (0.9 + rand() * 0.1) *
        Math.exp(-(distance * distance) / (2 * sigma * sigma));
    }
    data[week] = Math.min(1, value);
  }
  return data;
}

/**
 * Era đang active theo tiến độ cuộn [0,1]. Trang có 6 section màn hình:
 * hero, 4 era, contact — chỉ 4 section giữa map vào era.
 */
export function activeEraIndex(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const section = Math.min(Math.floor(clamped * 6), 5);
  return section >= 1 && section <= 4 ? section - 1 : -1;
}
