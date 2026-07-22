/**
 * Địa tầng 12 năm nghề (2014 → 2026): 5 stratum, mới ở trên, cũ ở dưới.
 * Mốc năm, stack và ghi chú của từng tầng lấy đúng từ lịch sử làm việc thật:
 * freelance PHP/WordPress, Synova, TESO, rồi Treehouse.
 *
 * 48 mảnh module chôn trong vách vẫn là dataset seeded để render (tên file,
 * số commit và ghi chú là placeholder minh hoạ, không phải trích xuất git);
 * bản chính thức sẽ bake từ `git log --numstat` lúc build. Chỉ phần STRATA
 * dưới đây là dữ liệu thật.
 */

/** Chiều cao vách hố (đơn vị world): mặt đất y=0.5, đáy y=-19.5 */
export const TRENCH_TOP = 0.5;
export const TRENCH_HEIGHT = 20;

export interface Stratum {
  id: string;
  label: string;
  fromYear: number;
  toYear: number;
  /** Độ dày tương đối (tổng = 1), tỉ lệ thô theo số năm của chặng */
  thickness: number;
  note: string;
  yTop: number;
  yBottom: number;
}

interface StratumSeed {
  id: string;
  label: string;
  fromYear: number;
  toYear: number;
  thickness: number;
  note: string;
}

const STRATA_SEEDS: StratumSeed[] = [
  {
    id: "stratum-i",
    label: "STRATUM I · Chuẩn hoá & dẫn đội",
    fromYear: 2024,
    toYear: 2026,
    thickness: 0.18,
    note: "Lớp trẻ nhất và mịn nhất: coding standards, tài liệu onboarding, code review hằng ngày, workshop chia sẻ và pair programming cho đội tám kỹ sư.",
  },
  {
    id: "stratum-ii",
    label: "STRATUM II · dApp React + TypeScript",
    fromYear: 2021,
    toYear: 2023,
    thickness: 0.24,
    note: "Trầm tích DeFi tại Treehouse: Next.js và TypeScript, tích hợp ví Web3, đọc ghi on-chain qua Ethers.js, dashboard giá, yield và TVL chạy thời gian thực.",
  },
  {
    id: "stratum-iii",
    label: "STRATUM III · Cứu hộ legacy",
    fromYear: 2019,
    toYear: 2021,
    thickness: 0.2,
    note: "Lớp học nghề đắt nhất, ở TESO: nhận codebase JavaScript người khác để lại, tối ưu hiệu năng, siết độ tin cậy, và bắt đầu dẫn dắt thay vì chỉ nhận việc.",
  },
  {
    id: "stratum-iv",
    label: "STRATUM IV · PHP framework & eCommerce",
    fromYear: 2017,
    toYear: 2018,
    thickness: 0.14,
    note: "Vỉa Laravel, CakePHP, Magento thời Synova: từ design tĩnh tới web động, site doanh nghiệp và eCommerce, ghép API bên thứ ba là chuyện hằng tuần.",
  },
  {
    id: "stratum-v",
    label: "STRATUM V · Đá gốc freelance",
    fromYear: 2014,
    toYear: 2016,
    thickness: 0.24,
    note: "Đá gốc terracotta: tốt nghiệp CNTT Đại học Khoa học Huế 2014 rồi vào nghề freelance tại Huế. HTML, CSS, jQuery, PHP và WordPress làm cho khách trên Freelancer; cross-browser và responsive là cơm bữa. Đào tới đây thì dừng, có chủ đích.",
  },
];

export const STRATA: Stratum[] = (() => {
  let y = TRENCH_TOP;
  return STRATA_SEEDS.map((seed) => {
    const yTop = y;
    const yBottom = y - seed.thickness * TRENCH_HEIGHT;
    y = yBottom;
    return { ...seed, yTop, yBottom };
  });
})();

export const ARTIFACT_COUNT = 48;

export interface Artifact {
  id: string;
  name: string;
  stratum: number;
  bornYear: number;
  lastTouched: number;
  /** Số commit của dataset demo (seeded), KHÔNG phải trích từ git thật. */
  commits: number;
  note: string;
  position: [number, number, number];
  scale: number;
  rotationSeed: number;
}

/** Tên file minh hoạ, chọn đúng stack của từng chặng nghề. */
const MODULE_POOLS: string[][] = [
  ["coding-standards.md", "onboarding.md", "review-checklist.md", "release-runbook.md", "design-tokens.ts"],
  ["wallet-connect.ts", "ethers-provider.ts", "tvl-dashboard.tsx", "yield-chart.tsx", "staking-form.tsx"],
  ["legacy-refactor.js", "api-client.js", "hooks-migration.jsx", "perf-audit.md", "release-notes.md"],
  ["routes.php", "cart-checkout.php", "magento-theme.phtml", "api-bridge.php", "schema-migrate.sql"],
  ["functions.php", "wp-theme.php", "jquery-slider.js", "responsive-fix.css", "cross-browser.css"],
];

const NOTES = [
  "bọc lại chứ không viết lại: vẫn còn thứ khác đứng trên nó",
  "chôn tiếp có chủ đích: hàng rào Chesterton còn nguyên lý do",
  "mỗi năm chỉ chạm một lần để gia hạn, và thế là đủ",
  "cái TODO viết từ đời trước, và nó vẫn còn đúng",
  "đã thay ruột nhưng giữ nguyên interface, không ai phía trên phải biết",
  "module im lặng nhất repo: im lặng cũng là một loại chất lượng",
];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rải 48 mảnh module vào đúng dải stratum của chúng — deterministic. */
export function buildDig(seed: number): Artifact[] {
  const rand = mulberry32(seed);
  const artifacts: Artifact[] = [];
  for (let i = 0; i < ARTIFACT_COUNT; i += 1) {
    const stratum = i % STRATA.length;
    const s = STRATA[stratum];
    const pool = MODULE_POOLS[stratum];
    const name = pool[i % pool.length];
    const margin = 0.4;
    const y =
      s.yBottom + margin + rand() * (s.yTop - s.yBottom - margin * 2);
    const bornYear =
      s.fromYear + Math.floor(rand() * (s.toYear - s.fromYear + 1));
    artifacts.push({
      id: `${s.id}-${name}-${i}`,
      name,
      stratum,
      bornYear,
      lastTouched: Math.min(2026, bornYear + Math.floor(rand() * 5)),
      commits: 40 + Math.floor(rand() * 1160),
      note: NOTES[i % NOTES.length],
      position: [-14 + rand() * 28, y, 0.28],
      scale: 0.75 + rand() * 0.55,
      rotationSeed: rand() * Math.PI * 2,
    });
  }
  return artifacts;
}
