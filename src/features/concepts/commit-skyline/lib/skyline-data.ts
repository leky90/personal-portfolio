/**
 * Thành phố commit: 15 block năm (2012 → 2026) × 365 ngày, mỗi toà một
 * ngày, cao theo số commit. Mốc thời gian và 6 landmark là sự nghiệp
 * thật: freelance từ 2012 ở Huế, Synova 2017, TESO 2019, Treehouse từ
 * 08/2021. Số commit mỗi ngày thì KHÔNG thật — demo dùng model
 * deterministic có nhịp tuần (cuối tuần thưa) + sóng cường độ theo năm;
 * bản chính thức thay bằng ETL GitHub GraphQL bake JSON ~8KB lúc build,
 * cùng schema — zero API call runtime.
 */

/** Năm bắt đầu viết code lấy tiền: 11/07/2012, tài khoản Freelancer đầu tiên. */
export const START_YEAR = 2012;
/** 2012 → 2026 (block cuối là năm hiện tại). */
export const YEAR_COUNT = 15;
export const DAY_COUNT = YEAR_COUNT * 365;

const COLUMN_STEP = 0.28;
const ROW_STEP = 0.36;
const AVENUE = 3.2;
const YEAR_WIDTH = 53 * COLUMN_STEP + AVENUE;

function hash01(seed: number): number {
  let a = (seed * 2654435761) >>> 0;
  a ^= a >>> 15;
  a = (a * 0x2c1b3c6d) >>> 0;
  a ^= a >>> 12;
  return (a >>> 0) / 4294967296;
}

/** Số commit của một ngày — deterministic, nhịp tuần + sóng sự nghiệp. */
export function dayCommits(dayIndex: number): number {
  const weekday = dayIndex % 7;
  const base = weekday >= 5 ? 0.9 : 3.4;
  const year = Math.floor(dayIndex / 365);
  const careerWave = 0.55 + year * 0.055;
  const noise = hash01(dayIndex + 13) * 5.5 - 1.2;
  const burst = hash01(dayIndex * 31 + 7) > 0.94 ? 4 : 0;
  const commits = Math.round(base * careerWave + noise + burst);
  return Math.min(Math.max(commits, 0), 12);
}

export interface SkylineBuilding {
  x: number;
  z: number;
  height: number;
  /** Cường độ [0,1] — lái màu cửa sổ ấm dần theo commit */
  intensity: number;
}

/** 15 block năm × (53 tuần × 7 thứ), đại lộ giữa các năm. */
export function buildSkyline(): SkylineBuilding[] {
  const buildings: SkylineBuilding[] = [];
  for (let day = 0; day < DAY_COUNT; day += 1) {
    const year = Math.floor(day / 365);
    const dayOfYear = day % 365;
    const week = Math.floor(dayOfYear / 7);
    const weekday = day % 7;
    const commits = dayCommits(day);
    buildings.push({
      x: year * YEAR_WIDTH + week * COLUMN_STEP,
      z: weekday * ROW_STEP,
      height: 0.1 + commits * 0.17,
      intensity: commits / 12,
    });
  }
  return buildings;
}

export interface SkylineLandmark {
  dayIndex: number;
  label: string;
  story: string;
}

/**
 * Ngày thứ n của một năm → dayIndex trong model 365 ngày/năm. Năm là thứ
 * được khẳng định; ngày trong năm chỉ để toà landmark đứng đúng chỗ.
 */
function dayOf(year: number, dayOfYear: number): number {
  return (year - START_YEAR) * 365 + dayOfYear;
}

export const LANDMARKS: SkylineLandmark[] = [
  {
    dayIndex: dayOf(2012, 192),
    label: "bắt đầu freelance",
    story:
      "11/07/2012, mở tài khoản Freelancer ở Huế. Block đầu tiên là PHP, WordPress và những đêm gò cross-browser cho site khách.",
  },
  {
    dayIndex: dayOf(2017, 14),
    label: "on-site tại Synova",
    story:
      "Vào TP.HCM làm full stack: nhận dự án từ design tĩnh tới web động ghép API — Laravel, CakePHP, Magento, site doanh nghiệp và eCommerce.",
  },
  {
    dayIndex: dayOf(2019, 20),
    label: "về Huế cùng TESO",
    story:
      "Remote từ Huế, sở hữu end-to-end nhiều dự án khách bằng JavaScript và React. Bắt đầu dẫn dắt: hướng dẫn đồng đội, dọn codebase legacy.",
  },
  {
    dayIndex: dayOf(2021, 212),
    label: "vào Treehouse",
    story:
      "08/2021, bước hẳn sang DeFi và tài sản token hoá: kiến trúc dApp bằng React, TypeScript, Next.js, đọc ghi on-chain qua Ethers.js.",
  },
  {
    dayIndex: dayOf(2024, 244),
    label: "tETH lên sóng",
    story:
      "tAsset đầu tiên của Treehouse, gom các mức lãi suất ETH phân mảnh về một chỗ. Cũng là quãng dẫn đội 8 kỹ sư: code review hằng ngày, workshop, pair programming.",
  },
  {
    dayIndex: dayOf(2026, 202),
    label: "ship portfolio này",
    story:
      "Toà gần cuối đại lộ: chính trang web bạn đang xem, commit bằng đúng bàn phím ở demo #8.",
  },
];

export interface DayInfo {
  year: number;
  week: number;
  weekday: number;
}

/** Ngày thứ i (model 365 ngày/năm, gốc 2012) → năm · tuần · thứ. */
export function dayInfo(dayIndex: number): DayInfo {
  return {
    year: START_YEAR + Math.floor(dayIndex / 365),
    week: Math.floor((dayIndex % 365) / 7),
    weekday: dayIndex % 7,
  };
}

const LAST_X = (YEAR_COUNT - 1) * YEAR_WIDTH + 52 * COLUMN_STEP;
/** Z của đại lộ camera chạy dọc (bên cạnh hàng thứ 7) */
const BOULEVARD_Z = 7 * ROW_STEP + 1.7;

export interface SkylinePose {
  position: [number, number, number];
  target: [number, number, number];
}

/** Bay dọc đại lộ sự nghiệp: thấp, sát phố, dutch drift nhẹ. */
export function cameraAlong(progress: number): SkylinePose {
  const p = Math.min(Math.max(progress, 0), 1);
  const x = -3 + p * (LAST_X + 8);
  return {
    position: [x, 1.7 + Math.sin(p * 5) * 0.18, BOULEVARD_Z],
    target: [x + 7.5, 0.75, 1.1],
  };
}
