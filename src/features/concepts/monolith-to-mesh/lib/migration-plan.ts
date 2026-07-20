/**
 * Lịch sử migration 10 năm — nguồn sự thật sinh ra thứ tự tách khối,
 * lý do (ADR whisper khi hover) và nhịp "gộp ngược" 2021.
 * ⚠️ PLACEHOLDER — thay bằng lịch sử thật.
 */
export interface ServicePlan {
  id: string;
  name: string;
  /** Năm tách khỏi monolith; null = ở lại core */
  splitYear: number | null;
  /** Một dòng lý do — hiện trên HUD khi hover mảnh */
  reason: string;
}

/** Ca tách non duy nhất: ra 2018, gộp ngược 2021, ở lại core từ đó. */
export const PREMATURE_SPLIT = {
  id: "search-svc",
  outYear: 2018,
  backYear: 2021,
};

const CORE_REASON = "stayed in the core: cohesion beat the org chart";

export const SERVICES: ServicePlan[] = [
  { id: "billing-core", name: "billing-core", splitYear: null, reason: CORE_REASON },
  { id: "admin-panel", name: "admin-panel", splitYear: null, reason: CORE_REASON },
  { id: "cms", name: "cms", splitYear: null, reason: CORE_REASON },
  { id: "reports", name: "reports", splitYear: null, reason: CORE_REASON },
  { id: "feature-flags", name: "feature-flags", splitYear: null, reason: CORE_REASON },
  { id: "search-svc", name: "search-svc", splitYear: 2018, reason: "2018: split too early, merged back 2021 when two teams owned one index" },
  { id: "auth-svc", name: "auth-svc", splitYear: 2018, reason: "2018: token issuance blocked every deploy train" },
  { id: "cache-proxy", name: "cache-proxy", splitYear: 2018, reason: "2018: read path needed its own release cadence" },
  { id: "payments-svc", name: "payments-svc", splitYear: 2019, reason: "2019: PCI blast radius demanded isolation" },
  { id: "ledger", name: "ledger", splitYear: 2019, reason: "2019: append-only writes fought the ORM" },
  { id: "notifications", name: "notifications", splitYear: 2019, reason: "2019: retry storms did not belong in request path" },
  { id: "email-render", name: "email-render", splitYear: 2019, reason: "2019: template CPU spikes starved the API" },
  { id: "webhooks", name: "webhooks", splitYear: 2020, reason: "2020: third-party latency needed a bulkhead" },
  { id: "media-ingest", name: "media-ingest", splitYear: 2020, reason: "2020: uploads deserved their own autoscaling" },
  { id: "thumbnailer", name: "thumbnailer", splitYear: 2020, reason: "2020: image CPU moved off the hot path" },
  { id: "rate-limiter", name: "rate-limiter", splitYear: 2020, reason: "2020: one shared limiter for every edge" },
  { id: "gateway", name: "gateway", splitYear: 2021, reason: "2021: the strangler front door for the rebuild" },
  { id: "orders-svc", name: "orders-svc", splitYear: 2021, reason: "2021: CQRS split after the gateway landed" },
  { id: "inventory", name: "inventory", splitYear: 2021, reason: "2021: stock counts left the monolith last" },
  { id: "pricing", name: "pricing", splitYear: 2021, reason: "2021: experiments needed isolated rollouts" },
  { id: "identity", name: "identity", splitYear: 2021, reason: "2021: one shared identity, one audit surface" },
  { id: "audit-log", name: "audit-log", splitYear: 2022, reason: "2022: compliance wanted immutable trails" },
  { id: "analytics-ingest", name: "analytics-ingest", splitYear: 2022, reason: "2022: event firehose to ClickHouse" },
  { id: "dashboards", name: "dashboards", splitYear: 2022, reason: "2022: read models for 200+ internal boards" },
  { id: "exports", name: "exports", splitYear: 2022, reason: "2022: long-running jobs left the request path" },
  { id: "recommender", name: "recommender", splitYear: 2023, reason: "2023: model rollouts decoupled from product" },
  { id: "fraud-scoring", name: "fraud-scoring", splitYear: 2023, reason: "2023: sub-50ms scoring beside payments" },
  { id: "geo-router", name: "geo-router", splitYear: 2023, reason: "2023: multi-region routing at the edge" },
  { id: "doc-store", name: "doc-store", splitYear: 2023, reason: "2023: attachments outgrew Postgres" },
  { id: "ml-serving", name: "ml-serving", splitYear: 2024, reason: "2024: managed inference behind the gateway" },
  { id: "feature-store", name: "feature-store", splitYear: 2024, reason: "2024: one feature pipeline for every model" },
  { id: "edge-workers", name: "edge-workers", splitYear: 2025, reason: "2025: personalization at 28 PoPs" },
  { id: "session-store", name: "session-store", splitYear: 2025, reason: "2025: sticky state moved to the edge" },
  { id: "billing-v2", name: "billing-v2", splitYear: 2024, reason: "2024: usage-based pricing engine" },
  { id: "notif-prefs", name: "notif-prefs", splitYear: 2022, reason: "2022: preference reads at notification scale" },
  { id: "search-index", name: "search-index", splitYear: 2023, reason: "2023: the RIGHT search split, owned by one team" },
];
