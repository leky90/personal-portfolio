/**
 * Dữ liệu một request 187ms trace từ edge tới database và quay về.
 * Trục thời gian (startMs/durationMs) là câu chuyện; trục cuộn (t0/t1)
 * là cửa sổ scroll mà packet đi qua chặng đó. Bản chính thức sẽ thay
 * bằng số đo thật từ APM; demo giữ nguyên schema.
 */

export interface TraceSpan {
  id: string;
  /** Tên chặng hiển thị trên section + rail */
  label: string;
  /** Service xử lý span (kiểu Jaeger) */
  service: string;
  kind: "sync" | "async";
  startMs: number;
  durationMs: number;
  /** Cửa sổ cuộn [t0, t1) mà packet nằm trong chặng này */
  t0: number;
  t1: number;
  /** Log line bắn ra HUD khi span active */
  log: string;
  /** Câu chuyện nghề gắn với chặng */
  note: string;
}

export const SPANS: TraceSpan[] = [
  {
    id: "edge",
    label: "Edge PoP + TLS",
    service: "edge-pop.fra1",
    kind: "sync",
    startMs: 0,
    durationMs: 24,
    t0: 0,
    t1: 0.14,
    log: "TLS handshake 14ms · cache MISS · route / → origin",
    note: "Request chạm PoP gần người dùng nhất. Tôi từng cắt 400ms TTFB chỉ bằng cách chuyển termination TLS ra edge và sửa một cache key sai.",
  },
  {
    id: "lb",
    label: "Load balancer",
    service: "gateway-lb",
    kind: "sync",
    startMs: 24,
    durationMs: 9,
    t0: 0.14,
    t1: 0.3,
    log: "pool 12/12 healthy · least_conn → svc-07 · retry budget 3",
    note: "Chín mili giây nhàm chán là chín mili giây đáng tự hào: health check, connection draining và retry budget để một node chết không ai nhận ra.",
  },
  {
    id: "svc",
    label: "Service mesh fan-out",
    service: "profile-svc",
    kind: "sync",
    startMs: 33,
    durationMs: 58,
    t0: 0.3,
    t1: 0.52,
    log: "fan-out 3: auth 11ms · profile 34ms · flags 6ms (parallel)",
    note: "Một request cha đẻ ra ba request con chạy song song. Biết chặng nào được phép fan-out, chặng nào phải tuần tự là thứ phân biệt kiến trúc tốt và spaghetti.",
  },
  {
    id: "queue",
    label: "Hàng đợi async",
    service: "job-queue",
    kind: "async",
    startMs: 91,
    durationMs: 31,
    t0: 0.52,
    t1: 0.7,
    log: "enqueue analytics.pageview · ack 3ms · depth 1204 · DLQ 0",
    note: "Việc gì không cần trả lời ngay thì đẩy sang hàng đợi. Ranh giới sync/async đặt đúng chỗ là quyết định kiến trúc rẻ nhất nhưng cứu nhiều đêm on-call nhất.",
  },
  {
    id: "db",
    label: "Database",
    service: "postgres-primary",
    kind: "sync",
    startMs: 122,
    durationMs: 43,
    t0: 0.7,
    t1: 0.86,
    log: "3 queries · index hit 99.2% · slowest 18ms · pool wait 0ms",
    note: "Điểm dừng lâu nhất của mọi trace. EXPLAIN ANALYZE, index đúng cột và connection pool được đo đạc là lý do 43ms không phải 4.3 giây.",
  },
  {
    id: "resp",
    label: "Response 200",
    service: "edge-pop.fra1",
    kind: "sync",
    startMs: 165,
    durationMs: 22,
    t0: 0.86,
    t1: 1,
    log: "render 12ms · gzip 8.1kB · 200 OK · total 187ms",
    note: "Gói tin quay về với 200 OK. Toàn bộ trang bạn vừa cuộn là một request duy nhất được kể lại chậm 60 tỷ lần.",
  },
];

/** Tổng thời gian request end-to-end (ms). */
export const TOTAL_MS =
  SPANS[SPANS.length - 1].startMs + SPANS[SPANS.length - 1].durationMs;

/** Mốc tham số u trên route cho diorama từng chặng (giữa cửa sổ span). */
export const STATION_US = SPANS.map((span) => (span.t0 + span.t1) / 2);

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

/** Span đang active tại progress p (clamp hai biên). */
export function activeSpanIndex(progress: number): number {
  const p = clamp01(progress);
  for (let i = SPANS.length - 1; i >= 0; i -= 1) {
    if (p >= SPANS[i].t0) return i;
  }
  return 0;
}

/** Map progress cuộn → thời gian trôi của request (ms), đơn điệu tăng. */
export function elapsedMs(progress: number): number {
  const p = clamp01(progress);
  const index = activeSpanIndex(p);
  const span = SPANS[index];
  const frac = (p - span.t0) / (span.t1 - span.t0);
  return span.startMs + clamp01(frac) * span.durationMs;
}

/**
 * Hành lang route cho CatmullRomCurve3: tiến đều về -z với vài khúc cua
 * nhẹ (edge → LB → mesh → hàng đợi hơi nâng cao → DB → response).
 */
export function buildRoute(): [number, number, number][] {
  return [
    [0, 0.6, 14],
    [0.6, 0.5, 8],
    [-1.4, 0.4, 2],
    [1.6, 0.5, -5],
    [2.2, 0.95, -12],
    [-0.9, 0.35, -19],
    [0, 0.55, -26],
    [0, 0.6, -31],
  ];
}

export interface DioramaNode {
  /** Chặng mà node thuộc về — đặt quanh station của span đó */
  spanIndex: number;
  /** Offset cục bộ so với station trên route */
  offset: [number, number, number];
  scale: [number, number, number];
  /** Mức xám matcap [0.3, 0.9] — chỉ packet mới có màu */
  grey: number;
}

export interface DioramaNodes {
  boxes: DioramaNode[];
  cylinders: DioramaNode[];
}

/**
 * Diorama hạ tầng flat-grey quanh mỗi station: vòng edge 6 hộp, lưới
 * service mesh 5×3, rail hàng đợi 8 slot (đều là box → 1 InstancedMesh),
 * database 3 trụ chồng (1 InstancedMesh trụ). LB hex prism là mesh riêng.
 */
export function buildNodes(): DioramaNodes {
  const boxes: DioramaNode[] = [];
  const cylinders: DioramaNode[] = [];

  // Vòng edge PoP: 6 hộp xếp vòng tròn quanh station 0
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    boxes.push({
      spanIndex: 0,
      offset: [Math.cos(angle) * 1.15, -0.25, Math.sin(angle) * 1.15],
      scale: [0.34, 0.5 + (i % 2) * 0.22, 0.34],
      grey: 0.42 + (i % 3) * 0.08,
    });
  }

  // Lưới service mesh 5×3 quanh station 2
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      boxes.push({
        spanIndex: 2,
        offset: [(col - 2) * 0.62, -0.32, (row - 1) * 0.62],
        scale: [0.3, 0.3 + ((row + col) % 3) * 0.14, 0.3],
        grey: 0.38 + ((row * 5 + col) % 4) * 0.09,
      });
    }
  }

  // Rail hàng đợi: 8 slot dẹt xếp hàng dọc trục x quanh station 3
  for (let i = 0; i < 8; i += 1) {
    boxes.push({
      spanIndex: 3,
      offset: [(i - 3.5) * 0.46, -0.18, 0.85],
      scale: [0.32, 0.16, 0.42],
      grey: 0.46 + (i % 2) * 0.12,
    });
  }

  // Database: 3 trụ chồng cổ điển tại station 4
  for (let i = 0; i < 3; i += 1) {
    cylinders.push({
      spanIndex: 4,
      offset: [0, -0.42 + i * 0.42, 0],
      scale: [0.58, 0.36, 0.58],
      grey: 0.5 + i * 0.08,
    });
  }

  return { boxes, cylinders };
}
