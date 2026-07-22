/**
 * Thiên hà 14 năm nghề (2012 → 2026): ~730 tuần làm việc nở thành 6000
 * sao trên 4 cánh tay xoắn — 4 chặng CÓ THẬT: freelance ở Huế
 * (2012–2016), full-stack tại Synova (2017–2018), JavaScript/React tại
 * TESO (2019–2021), và Treehouse từ 08/2021 tới nay. 10 supernova là
 * milestone thật trong CV, không phải số bịa.
 *
 * Scope trung thực ghi ngay trong ADR note của trang: dữ liệu per-commit
 * 14 năm repo công ty không tồn tại để công khai, nên sao tổng hợp
 * deterministic từ seed tuần — và mapping được GIẢI THÍCH, không giả vờ
 * là số đo tuyệt đối. Đó là điểm khác một particle field trang trí.
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
    label: "lõi freelance 2012-2016",
    from: 0,
    to: 0.357,
    color: "#ffb454",
    note: "Lõi ấm và dày đặc: ngồi ở Huế nhận job trên Freelancer từ 2012, khởi nghiệp bằng PHP rồi dựng và bảo trì site khách bằng HTML, CSS, JS, WordPress. Cross-browser và responsive mobile học bằng tay, từng trình duyệt một.",
  },
  {
    label: "cánh tay full-stack 2017-2018",
    from: 0.357,
    to: 0.5,
    color: "#e8c547",
    note: "Vào TP.HCM làm on-site ở Synova Solutions: ôm dự án end-to-end, từ chuyển design thành giao diện tĩnh tới web động tích hợp API. jQuery, Laravel, CakePHP, CodeIgniter, Zend, Yii, WordPress, Drupal, Magento, OpenCart — site doanh nghiệp và eCommerce.",
  },
  {
    label: "cánh tay JavaScript 2019-2021",
    from: 0.5,
    to: 0.68,
    color: "#2dd4bf",
    note: "Về Huế làm remote cho TESO: sở hữu end-to-end nhiều dự án khách bằng JavaScript/React, chủ trì tối ưu và bảo trì codebase legacy. Bắt đầu dẫn dắt — hướng dẫn đồng đội, chuẩn hoá quy trình và release cùng designer, management.",
  },
  {
    label: "vành Treehouse 2021-2026",
    from: 0.68,
    to: 1,
    color: "#a78bfa",
    note: "Rìa thiên hà: từ 08/2021 kiến trúc và xây dApp DeFi/RWA bằng React, TypeScript, Next.js — wallet integration, đọc/ghi on-chain qua Ethers.js, dashboard giá/yield/TVL thời gian thực. Lead 8 kỹ sư; ít commit tay hơn, mỗi ngôi sao nặng hơn.",
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
  { birth: 0.03, label: "job đầu tiên trên Freelancer", story: "11/07/2012, mở tài khoản Freelancer ở Huế: site khách đầu tiên viết bằng PHP, deploy tay qua FTP." },
  { birth: 0.15, label: "tốt nghiệp CNTT Đại học Khoa học Huế", story: "2014 nhận bằng BS Information Technology sau 4 năm vừa học vừa nhận job thật." },
  { birth: 0.3, label: "site khách chạy đúng trên mọi trình duyệt", story: "Cross-browser và responsive mobile thành phản xạ, không còn là việc phải nhớ." },
  { birth: 0.38, label: "vào Synova, chuyển sang full-stack", story: "2017 vào TP.HCM làm on-site: hết đứng ở phần giao diện, bắt đầu ôm cả backend PHP." },
  { birth: 0.47, label: "eCommerce và tích hợp API bên thứ ba", story: "Magento, OpenCart, Drupal cho site doanh nghiệp — dữ liệu bắt đầu đến từ hệ thống của người khác." },
  { birth: 0.54, label: "remote với TESO từ Huế", story: "2019 về Huế: sở hữu end-to-end dự án khách bằng JavaScript/React, và tự chịu trách nhiệm cả vòng đời." },
  { birth: 0.65, label: "lần đầu dẫn dắt đồng đội", story: "Thôi chỉ ship code: hướng dẫn quy trình, đưa giải pháp kỹ thuật, chủ trì tối ưu codebase legacy." },
  { birth: 0.7, label: "gia nhập Treehouse, 08/2021", story: "Nền tảng DeFi/RWA cho tài sản token hoá — lần đầu đọc/ghi on-chain qua Ethers.js." },
  { birth: 0.83, label: "lead 8 kỹ sư, sở hữu front-end stack", story: "Kiến trúc, coding standards, tài liệu onboarding; review code hằng ngày, workshop và pair programming." },
  { birth: 0.94, label: "tETH — tAsset đầu tiên", story: "Gom các mức lãi suất ETH phân mảnh về một chỗ, kèm dashboard giá, yield, TVL chạy thời gian thực." },
];

/** Ticker năm theo frontier: 0 → 2012 (job đầu tiên), 1 → 2026. */
export function galaxyYearAt(progress: number): number {
  return 2012 + Math.round(Math.min(Math.max(progress, 0), 1) * 14);
}
