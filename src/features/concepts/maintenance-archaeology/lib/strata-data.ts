/**
 * Địa tầng 10 năm của một codebase: 5 stratum (mới trên, cũ dưới) + 48
 * mảnh module chôn trong vách. Demo dùng dataset seeded; bản chính thức
 * bake từ `git log --numstat` bằng script build (độ dày = churn thật).
 * ⚠️ PLACEHOLDER — thay bằng lịch sử thật.
 */

/** Chiều cao vách hố (đơn vị world): mặt đất y=0.5, đáy y=-19.5 */
export const TRENCH_TOP = 0.5;
export const TRENCH_HEIGHT = 20;

export interface Stratum {
  id: string;
  label: string;
  fromYear: number;
  toYear: number;
  /** Độ dày tương đối (tổng = 1) — bản thật lấy từ churn */
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
    label: "STRATUM I · Edge & ML",
    fromYear: 2024,
    toYear: 2026,
    thickness: 0.16,
    note: "Lớp trẻ nhất, hạt mịn: ml-serving mua thay vì build, edge-workers còn ấm tay người viết.",
  },
  {
    id: "stratum-ii",
    label: "STRATUM II · Mesh years",
    fromYear: 2022,
    toYear: 2023,
    thickness: 0.2,
    note: "Trầm tích analytics và audit: ClickHouse, immutable trails, những read model đầu tiên.",
  },
  {
    id: "stratum-iii",
    label: "STRATUM III · The Rebuild",
    fromYear: 2020,
    toYear: 2021,
    thickness: 0.24,
    note: "Lớp dày nhất, nén chặt nhất: gateway, identity, orders. Mọi thứ phía trên đứng trên vai lớp này.",
  },
  {
    id: "stratum-iv",
    label: "STRATUM IV · Service extraction",
    fromYear: 2018,
    toYear: 2019,
    thickness: 0.22,
    note: "Vết tách đầu tiên: auth, payments, Kafka. Có cả mạch than của lần tách sai đã gộp lại.",
  },
  {
    id: "stratum-v",
    label: "STRATUM V · Monolith bedrock",
    fromYear: 2016,
    toYear: 2017,
    thickness: 0.18,
    note: "Đá gốc terracotta: Rails monolith. Vẫn chịu lực. Đào đến đây thì dừng, có chủ đích.",
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
  commits: number;
  note: string;
  position: [number, number, number];
  scale: number;
  rotationSeed: number;
}

const MODULE_POOLS: string[][] = [
  ["edge-router.ts", "infer-client.go", "feature-flags.ts", "session-edge.ts", "wasm-shim.rs"],
  ["clickhouse-sink.go", "audit-writer.go", "board-query.sql", "export-job.ts", "event-schema.ts"],
  ["gateway-routes.go", "identity-core.go", "orders-cqrs.go", "strangler-table.go", "cutover-runbook.md"],
  ["auth-jwt.rb", "kafka-producer.rb", "payments-recon.go", "retry-budget.rb", "pool-config.rb"],
  ["monolith-api.rb", "orm-parser.rb", "cron-billing.rb", "pdf-render.rb", "legacy-mailer.rb"],
];

const NOTES = [
  "wrapped, not rewritten: ba team đang đứng trên parser này",
  "chôn tiếp có chủ đích: hàng rào Chesterton còn nguyên lý do",
  "mỗi năm chỉ chạm một lần để gia hạn cert, và thế là đủ",
  "cái TODO ghi năm 2018, và nó vẫn đúng",
  "đã thay ruột hai lần nhưng giữ nguyên interface, không ai phải biết",
  "module im lặng nhất repo: không lỗi nào trong bốn năm",
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
