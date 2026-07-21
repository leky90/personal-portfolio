/**
 * Thiên hà mười năm: ~520 tuần làm việc nở thành 6000 sao trên 4 cánh
 * tay xoắn (4 era nghề). Scope trung thực ghi ngay trong ADR note của
 * trang: dữ liệu per-commit 10 năm repo công ty không tồn tại, nên sao
 * tổng hợp deterministic từ seed tuần — và mapping được GIẢI THÍCH,
 * không giả vờ là số đo tuyệt đối. Đó là điểm khác một particle field
 * trang trí.
 */

export const STAR_COUNT = 6000;
const ARMS = 4;
const TURNS = 2.1;
const RADIUS_MAX = 8;

export interface GalaxyEra {
  label: string;
  from: number;
  to: number;
  color: string;
  note: string;
}

export const GALAXY_ERAS: GalaxyEra[] = [
  {
    label: "lõi ấm 2016-2018",
    from: 0,
    to: 0.28,
    color: "#ffb454",
    note: "Những tuần đầu nghề nằm ở lõi, ấm và dày đặc: mọi thứ đều mới, mọi tuần đều học.",
  },
  {
    label: "cánh tay sản phẩm 2018-2021",
    from: 0.28,
    to: 0.55,
    color: "#e8c547",
    note: "Cánh tay thứ hai kéo dài theo những mùa ship lớn: checkout, mobile, những đêm go-live.",
  },
  {
    label: "cánh tay hệ thống 2021-2024",
    from: 0.55,
    to: 0.8,
    color: "#2dd4bf",
    note: "Nguội dần sang teal: ít commit hơn nhưng mỗi ngôi sao nặng hơn — kiến trúc, đòn bẩy, đội ngũ.",
  },
  {
    label: "vành hiện tại 2024-2026",
    from: 0.8,
    to: 1,
    color: "#a78bfa",
    note: "Rìa thiên hà trắng xanh: hiện tại. Chỉ khi đứng ở đây nhìn lại, cả hình xoắn ốc mới đọc được.",
  },
];

function hash01(seed: number): number {
  let a = (seed * 2654435761) >>> 0;
  a ^= a >>> 15;
  a = (a * 0x2c1b3c6d) >>> 0;
  a ^= a >>> 12;
  return (a >>> 0) / 4294967296;
}

function gaussian(seed: number): number {
  return (
    hash01(seed) + hash01(seed * 7 + 1) + hash01(seed * 13 + 2) - 1.5
  );
}

export interface GalaxyStars {
  /** Vị trí xoắn ốc đích (x,y,z) × STAR_COUNT */
  spiral: Float32Array;
  /** Vị trí bụi trôi dạt trước khi ngưng tụ */
  dust: Float32Array;
  birth: Float32Array;
  era: Float32Array;
  seed: Float32Array;
}

/** Sinh toàn bộ sao MỘT lần ở module scope — zero mô phỏng runtime. */
export function buildStars(): GalaxyStars {
  const spiral = new Float32Array(STAR_COUNT * 3);
  const dust = new Float32Array(STAR_COUNT * 3);
  const birth = new Float32Array(STAR_COUNT);
  const era = new Float32Array(STAR_COUNT);
  const seed = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i += 1) {
    const b = hash01(i * 3 + 5);
    const arm = i % ARMS;
    const radius = Math.pow(b, 0.72) * RADIUS_MAX + 0.25;
    const angle =
      b * TURNS * Math.PI * 2 +
      arm * ((Math.PI * 2) / ARMS) +
      gaussian(i * 11 + 3) * 0.22;
    const discY = gaussian(i * 17 + 7) * 0.32 * (1 - radius / RADIUS_MAX);

    spiral[i * 3] = Math.cos(angle) * radius;
    spiral[i * 3 + 1] = discY;
    spiral[i * 3 + 2] = Math.sin(angle) * radius;

    // Bụi: đám mây rộng hơn, cao hơn, lệch tâm
    dust[i * 3] = gaussian(i * 23 + 1) * 7;
    dust[i * 3 + 1] = gaussian(i * 29 + 2) * 3.2;
    dust[i * 3 + 2] = gaussian(i * 31 + 4) * 7;

    birth[i] = b;
    era[i] = GALAXY_ERAS.findIndex(
      (candidate) => b >= candidate.from && b <= candidate.to,
    );
    if (era[i] < 0) era[i] = GALAXY_ERAS.length - 1;
    seed[i] = hash01(i * 37 + 9);
  }

  return { spiral, dust, birth, era, seed };
}

export interface Supernova {
  birth: number;
  label: string;
  story: string;
}

export const SUPERNOVAE: Supernova[] = [
  { birth: 0.05, label: "dòng code production đầu tiên", story: "Tuần thứ ba của nghề: bug fix một dòng, deploy tay, tim đập tới hôm sau." },
  { birth: 0.14, label: "billing-core ship", story: "Hệ thống đầu tiên tự vác từ đầu tới cuối." },
  { birth: 0.24, label: "chuyển sang product", story: "Rời outsourcing — sao bắt đầu tụ thành cánh tay thứ hai." },
  { birth: 0.34, label: "checkout go-live", story: "Mùa sale đầu tiên hệ thống mình chịu tải thật." },
  { birth: 0.46, label: "sự cố SEV-1 lớn nhất", story: "43 phút dài nhất sự nghiệp — và postmortem đáng giá nhất." },
  { birth: 0.58, label: "lên senior", story: "Từ tuần này, giá trị đo bằng thứ người khác ship được." },
  { birth: 0.68, label: "OSS 1k sao", story: "Ngôi sao duy nhất do người lạ thắp hộ." },
  { birth: 0.78, label: "lên tech lead", story: "Cánh tay thứ ba mỏng đi thấy rõ — đó là chủ đích." },
  { birth: 0.88, label: "multi-region cutover", story: "Đêm hai region hoà làm một, không ai mất ngủ ngoài đội cutover." },
  { birth: 0.97, label: "portfolio này", story: "Ngôi sao gần rìa nhất: chính trang bạn đang xem." },
];

/** Ticker năm theo frontier: 0 → 2016, 1 → 2026. */
export function galaxyYearAt(progress: number): number {
  return 2016 + Math.round(Math.min(Math.max(progress, 0), 1) * 10);
}
