/**
 * Mô hình JSON của 10 năm kiến trúc — nguồn sự thật duy nhất cho graph.
 * Demo dùng dữ liệu giả lập hợp lý; bản chính thức thay bằng hệ thống thật
 * của bạn, cấu trúc giữ nguyên.
 */
export interface SystemNode {
  id: string;
  name: string;
  stack: string;
  /** Telemetry thật hiển thị trên HUD khi hover */
  metric: string;
  /** Năm hệ thống ra đời — trục x của graph là trục thời gian */
  year: number;
}

export const SYSTEMS: SystemNode[] = [
  { id: "monolith-api", name: "Monolith API", stack: "Rails · Sidekiq", metric: "12 req/s · p95 480ms", year: 2016 },
  { id: "postgres-core", name: "Postgres Core", stack: "PostgreSQL", metric: "40 GB · 300 conn", year: 2016 },
  { id: "web-app", name: "Web App", stack: "React · Webpack", metric: "9k MAU", year: 2017 },
  { id: "auth-svc", name: "Auth Service", stack: "Node · JWT", metric: "50k tokens/day", year: 2018 },
  { id: "cache-layer", name: "Cache Layer", stack: "Redis", metric: "hit-rate 94%", year: 2018 },
  { id: "payments-svc", name: "Payments Service", stack: "Go · Postgres", metric: "1.2M txn/tháng", year: 2019 },
  { id: "data-pipeline", name: "Data Pipeline", stack: "Kafka · Spark", metric: "80M events/day", year: 2019 },
  { id: "platform-gateway", name: "Platform Gateway", stack: "Envoy · gRPC", metric: "40M req/day", year: 2021 },
  { id: "orders-svc", name: "Orders Service", stack: "Go · CQRS", metric: "p99 38ms", year: 2021 },
  { id: "analytics", name: "Analytics", stack: "ClickHouse", metric: "2B rows", year: 2022 },
  { id: "ml-scoring", name: "ML Scoring", stack: "Python · Triton", metric: "9k infer/s", year: 2024 },
  { id: "edge-workers", name: "Edge Workers", stack: "WASM · CDN", metric: "28 PoP", year: 2025 },
];

/** Các đường gọi thật giữa hệ thống — cạnh liên-cụm của graph. */
export const ARCH_LINKS: [string, string][] = [
  ["web-app", "monolith-api"],
  ["monolith-api", "postgres-core"],
  ["web-app", "auth-svc"],
  ["auth-svc", "postgres-core"],
  ["monolith-api", "cache-layer"],
  ["payments-svc", "monolith-api"],
  ["payments-svc", "postgres-core"],
  ["data-pipeline", "postgres-core"],
  ["data-pipeline", "analytics"],
  ["platform-gateway", "monolith-api"],
  ["platform-gateway", "auth-svc"],
  ["platform-gateway", "payments-svc"],
  ["platform-gateway", "orders-svc"],
  ["orders-svc", "postgres-core"],
  ["orders-svc", "cache-layer"],
  ["analytics", "ml-scoring"],
  ["ml-scoring", "platform-gateway"],
  ["edge-workers", "platform-gateway"],
];

export function systemIndexById(id: string): number {
  const index = SYSTEMS.findIndex((system) => system.id === id);
  if (index < 0) {
    throw new Error(`Hệ thống "${id}" không tồn tại trong SYSTEMS`);
  }
  return index;
}
