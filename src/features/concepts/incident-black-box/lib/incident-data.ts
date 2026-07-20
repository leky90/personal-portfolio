/**
 * Một SEV-1 ẩn danh làm nguồn sự thật duy nhất: băng WebGL, panel annotation
 * DOM và postmortem đều đọc từ đây. ⚠️ PLACEHOLDER — thay bằng sự cố thật
 * (đã khử danh) khi có; cấu trúc giữ nguyên.
 */

export interface IncidentMeta {
  title: string;
  sev: string;
  date: string;
  durationMin: number;
  mttrMin: number;
}

export const INCIDENT: IncidentMeta = {
  title: "Checkout p99 melts during flash sale",
  sev: "SEV-1",
  date: "2023-11 (anonymized)",
  durationMin: 43,
  mttrMin: 19,
};

export type EventKind = "signal" | "alert" | "decision" | "deploy" | "resolve";

export interface TapeEvent {
  id: string;
  /** Vị trí trên băng [0,1] — trục thời gian của sự cố */
  t: number;
  kind: EventKind;
  label: string;
  note: string;
}

export const EVENTS: TapeEvent[] = [
  { id: "baseline", t: 0.05, kind: "signal", label: "14:02 baseline steady", note: "p99 180ms, err 0.02%: the shape of a normal Tuesday" },
  { id: "early-drift", t: 0.16, kind: "signal", label: "14:11 connection pool drift", note: "checkouts per pod creeping up before any alert fired: the signal was already on tape" },
  { id: "cache-miss", t: 0.24, kind: "signal", label: "14:19 cache hit-rate dips", note: "flash-sale SKUs bypassing the warm set" },
  { id: "first-alert", t: 0.33, kind: "alert", label: "14:27 PAGE p99 > 800ms", note: "the pager fires 16 minutes after the first drift" },
  { id: "sev-declared", t: 0.38, kind: "decision", label: "14:31 declare SEV-1", note: "declare early, shrink the blast radius of confusion" },
  { id: "hypothesis-1", t: 0.44, kind: "decision", label: "14:36 hypothesis: pool exhaustion", note: "two graphs agree, one disagrees: hold the disagreement" },
  { id: "mitigate-first", t: 0.5, kind: "decision", label: "14:41 mitigate before root cause", note: "shed 20% of read traffic to replicas: stop the bleeding first" },
  { id: "shed-deploy", t: 0.55, kind: "deploy", label: "14:45 traffic shed live", note: "error rate bends within 90 seconds" },
  { id: "root-cause", t: 0.64, kind: "decision", label: "14:52 root cause: retry storm", note: "a client library retried 5x on pool timeouts, amplifying itself" },
  { id: "fix-deploy", t: 0.72, kind: "deploy", label: "14:58 cap retries + jitter", note: "one config line, reviewed by two people mid-incident" },
  { id: "recovery", t: 0.81, kind: "signal", label: "15:06 p99 recovering", note: "tape cools: 240ms and falling" },
  { id: "steady", t: 0.88, kind: "signal", label: "15:12 steady state", note: "pool utilization back under 60%" },
  { id: "all-clear", t: 0.95, kind: "resolve", label: "15:19 all clear", note: "43 minutes end to end, 19 from page to mitigation" },
];

export const METRIC_SAMPLES = 128;

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

/** Độ nghiêm trọng tại t [0,1] — đỉnh trong cửa sổ sự cố, nguội hai đầu. */
export function severityAt(t: number): number {
  const rise = smooth(0.28, 0.42, t);
  const fall = 1 - smooth(0.55, 0.85, t);
  return Math.min(rise, fall);
}

function smooth(edge0: number, edge1: number, x: number): number {
  const u = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return u * u * (3 - 2 * u);
}

/**
 * 3 metric × METRIC_SAMPLES mẫu [0,1], row-major theo metric:
 * hàng 0 = p99 latency, hàng 1 = error rate, hàng 2 = throughput.
 */
export function buildMetrics(): Float32Array {
  const rand = mulberry32(43);
  const data = new Float32Array(3 * METRIC_SAMPLES);
  for (let i = 0; i < METRIC_SAMPLES; i += 1) {
    const t = i / (METRIC_SAMPLES - 1);
    const sev = severityAt(t);
    const noise = () => (rand() - 0.5) * 0.05;
    // p99: nền thấp, phi lên trong sự cố
    data[i] = Math.min(1, 0.18 + sev * 0.72 + noise());
    // error rate: gần 0, bùng giữa cửa sổ, gãy xuống sau mitigation (t>0.55)
    const bend = t > 0.55 ? 0.35 : 1;
    data[METRIC_SAMPLES + i] = Math.min(1, Math.max(0, 0.04 + sev * 0.85 * bend + noise()));
    // throughput: nền cao, sụt trong sự cố
    data[2 * METRIC_SAMPLES + i] = Math.min(1, Math.max(0, 0.78 - sev * 0.5 + noise()));
  }
  return data;
}
