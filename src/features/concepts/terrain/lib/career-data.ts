/** Seed = 01/01/2014 — năm tốt nghiệp ĐH Khoa học Huế và bắt đầu đi làm.
 * Tài khoản Freelancer mở 11/07/2012 thời sinh viên chỉ là chi tiết nguồn. */
export const DEFAULT_SEED = 20140101;

/** 2014 → 2026 ≈ 12 năm ≈ 626 tuần — mỗi tuần một mẫu hoạt động. */
export const TOTAL_WEEKS = 626;

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

/**
 * Bốn chặng nghề THẬT, đối chiếu từ LinkedIn (le-dinh-ky), Freelancer.com
 * (@Leky90) và Upwork. Mỗi metric chỉ dùng con số có thể kiểm chứng trên
 * hồ sơ công khai — không có số liệu tự bịa.
 */
const ERA_SEEDS: EraSeed[] = [
  {
    year: 2014,
    title: "Freelance, One Client At A Time",
    role: "Freelance Web Developer",
    description:
      "Graduated in IT from Hue University of Sciences in 2014 and started freelancing full-time from Hue: PHP and WordPress builds, HTML/CSS/JS client sites, cross-browser and mobile responsiveness. Three years of shipping directly to whoever paid — the fastest feedback loop I have ever had.",
    metric: "Freelance from Hue since 2014 · PHP + WordPress",
    peak: 0.45,
    timeU: 0.05,
    side: "left",
  },
  {
    year: 2017,
    title: "Full Stack, End To End",
    role: "Full Stack Engineer · Synova Solutions",
    description:
      "Delivered web projects end to end in Ho Chi Minh City — turning designs into responsive interfaces, then building the dynamic, API-integrated back ends behind them. Business and eCommerce sites on jQuery, Laravel, CodeIgniter, WordPress and Magento.",
    metric: "Design → API · Laravel · Magento",
    peak: 0.6,
    timeU: 0.29,
    side: "right",
  },
  {
    year: 2019,
    title: "Remote Delivery And Legacy Rescue",
    role: "Software Engineer · TESO",
    description:
      "Owned end-to-end delivery of JavaScript/React applications across multiple client projects, remotely from Hue. Started leading: guiding teammates on workflow, modernising legacy codebases for performance and reliability, streamlining docs and releases with designers and management.",
    metric: "React · remote · multi-client delivery",
    peak: 0.72,
    timeU: 0.46,
    side: "left",
  },
  {
    year: 2021,
    title: "Leading The Frontend Of A DeFi Platform",
    role: "Senior Software Engineer · Lead Frontend Engineer · Treehouse",
    description:
      "Lead Frontend Engineer on a DeFi / real-world-asset platform for tokenised assets such as tETH, leading a team of 8. Architected the dApp frontend in React, TypeScript and Next.js: wallet integration, on-chain reads and writes through Ethers.js, real-time dashboards for prices, yields and TVL. I own the front-end stack, the coding standards and the onboarding docs, run daily code reviews, and mentor through workshops and pair programming.",
    metric: "Team of 8 · tETH / tAssets · React + Ethers.js",
    peak: 1,
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
