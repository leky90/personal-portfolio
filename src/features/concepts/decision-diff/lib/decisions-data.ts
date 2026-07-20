/**
 * 6 ADR của một thập kỷ — nguồn sự thật DUY NHẤT sinh ra: hình học rail 3D,
 * card diff DOM, và HUD chi phí. ⚠️ PLACEHOLDER — thay bằng quyết định thật.
 */
export interface ArchDecision {
  id: string;
  year: number;
  title: string;
  /** Dòng + trong diff: lựa chọn đã đi */
  chosen: string;
  /** Dòng - trong diff: con đường không đi */
  rejected: string;
  /** Giá ước tính của nhánh bỏ — hiện khi materialize bóng ma */
  rejectedCost: string;
  /** Dòng # trong diff: hệ quả đo được */
  consequence: string;
  /** Nhánh ma rẽ trái hay phải trên rail */
  side: "left" | "right";
}

export const DECISIONS: ArchDecision[] = [
  {
    id: "monolith-first",
    year: 2016,
    title: "Start on a monolith",
    chosen: "Rails monolith, one Postgres, boring deploys",
    rejected: "Microservices from day one",
    rejectedCost: "+6 months of infra for a 3-person team",
    consequence: "shipped weekly from week two",
    side: "left",
  },
  {
    id: "cache-layer",
    year: 2018,
    title: "Absorb read load",
    chosen: "One Redis cache layer with explicit TTLs",
    rejected: "Read replicas for every service",
    rejectedCost: "+2x database cost, stale-read bugs",
    consequence: "p95 dropped 64% in one quarter",
    side: "right",
  },
  {
    id: "event-backbone",
    year: 2019,
    title: "Decouple the writers",
    chosen: "Kafka event backbone, consumers own retries",
    rejected: "Direct synchronous writes everywhere",
    rejectedCost: "+retry storms, coupled deploy trains",
    consequence: "80M events/day without incident pages",
    side: "left",
  },
  {
    id: "strangler-gateway",
    year: 2021,
    title: "Rebuild the platform",
    chosen: "Strangler gateway, one route at a time",
    rejected: "Big-bang rewrite behind a feature freeze",
    rejectedCost: "+14 months of freeze, morale debt",
    consequence: "30+ deploys/day, zero-downtime cutover",
    side: "right",
  },
  {
    id: "shared-identity",
    year: 2021,
    title: "Keep identity together",
    chosen: "One shared identity service for every team",
    rejected: "Per-service auth implementations",
    rejectedCost: "+4 months duplicated security risk",
    consequence: "one audit surface, four months saved",
    side: "left",
  },
  {
    id: "buy-ml-serving",
    year: 2024,
    title: "Buy the ML serving",
    chosen: "Managed inference behind our gateway",
    rejected: "Build a custom Triton serving stack",
    rejectedCost: "+2 engineers, forever",
    consequence: "scoring shipped in six weeks",
    side: "right",
  },
];
