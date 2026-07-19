/**
 * Selected work — card trên trang chủ; case study MDX chi tiết vào ở Phase 3.
 * ⚠️ PLACEHOLDER — thay bằng 3–5 dự án thật (giữ đúng shape).
 */
export interface ProjectMeta {
  slug: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
  metrics: string[];
  /** Năm kết thúc/đỉnh của dự án — dùng để sắp xếp */
  year: number;
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "atlas-platform",
    title: "Atlas Platform",
    role: "Lead Engineer",
    period: "2021 — 2024",
    summary:
      "Led 12 engineers through a 14-month platform rebuild — one gateway, four teams, zero rewrites since.",
    stack: ["Go", "gRPC", "Envoy", "PostgreSQL", "Kubernetes"],
    metrics: ["40M req/day", "p99 38ms", "12 engineers"],
    year: 2024,
  },
  {
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    role: "Staff Engineer",
    period: "2019 — 2021",
    summary:
      "Near-real-time data pipeline feeding 200+ internal dashboards at half the previous infra cost.",
    stack: ["Kafka", "Spark", "ClickHouse", "TypeScript"],
    metrics: ["80M events/day", "-50% infra cost"],
    year: 2021,
  },
  {
    slug: "relay-payments",
    title: "Relay Payments",
    role: "Senior Engineer",
    period: "2017 — 2019",
    summary:
      "The company's first multi-region payment system — idempotency, reconciliation, and quiet on-call nights.",
    stack: ["Go", "PostgreSQL", "Redis"],
    metrics: ["1.2M txn/month", "99.99% uptime"],
    year: 2019,
  },
];
