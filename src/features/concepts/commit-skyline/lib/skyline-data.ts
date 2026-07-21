/**
 * Thành phố commit: 3650 ngày (10 năm × 365) dựng thành phố đêm, mỗi
 * toà một ngày, cao theo số commit. Demo dùng model deterministic có
 * nhịp tuần thật (cuối tuần thưa) + sóng cường độ sự nghiệp; bản chính
 * thức thay bằng ETL GitHub GraphQL bake JSON ~8KB lúc build, cùng
 * schema — zero API call runtime.
 */

export const DAY_COUNT = 3650;

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
  const careerWave = 0.55 + year * 0.08;
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

/** 10 block năm × (53 tuần × 7 thứ), đại lộ giữa các năm. */
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

export const LANDMARKS: SkylineLandmark[] = [
  {
    dayIndex: 385,
    label: "gia nhập fintech",
    story: "Đổi việc đầu tiên: từ outsourcing sang product. Block 2017 sáng hẳn lên từ đây.",
  },
  {
    dayIndex: 1128,
    label: "launch checkout",
    story: "Tuần go-live checkout-platform: toà cao nhất của 2019, và tuần ngủ ít nhất thập kỷ.",
  },
  {
    dayIndex: 1770,
    label: "OSS release đầu tiên",
    story: "Thư viện observability nhỏ được 1k sao. Commit công khai bắt đầu chen vào skyline.",
  },
  {
    dayIndex: 2245,
    label: "lên tech lead",
    story: "Nghịch lý dễ thấy: từ mốc này chiều cao trung bình GIẢM — code ít đi, ảnh hưởng nhiều lên.",
  },
  {
    dayIndex: 2930,
    label: "multi-region go-live",
    story: "Đêm cutover hai region: một toà đơn độc cao vọt giữa quãng bằng phẳng của người làm lead.",
  },
  {
    dayIndex: 3510,
    label: "ship portfolio này",
    story: "Toà gần cuối đại lộ: chính trang web bạn đang xem, commit bằng đúng bàn phím ở demo #8.",
  },
];

export interface DayInfo {
  year: number;
  week: number;
  weekday: number;
}

/** Ngày thứ i (model 365 ngày/năm) → năm · tuần · thứ. */
export function dayInfo(dayIndex: number): DayInfo {
  return {
    year: 2016 + Math.floor(dayIndex / 365),
    week: Math.floor((dayIndex % 365) / 7),
    weekday: dayIndex % 7,
  };
}

const LAST_X = 9 * YEAR_WIDTH + 52 * COLUMN_STEP;
/** Z của đại lộ camera chạy dọc (bên cạnh hàng thứ 7) */
const BOULEVARD_Z = 7 * ROW_STEP + 1.7;

export interface SkylinePose {
  position: [number, number, number];
  target: [number, number, number];
}

/** Bay dọc đại lộ thập kỷ: thấp, sát phố, dutch drift nhẹ. */
export function cameraAlong(progress: number): SkylinePose {
  const p = Math.min(Math.max(progress, 0), 1);
  const x = -3 + p * (LAST_X + 8);
  return {
    position: [x, 1.7 + Math.sin(p * 5) * 0.18, BOULEVARD_Z],
    target: [x + 7.5, 0.75, 1.1],
  };
}
