/**
 * Hành trình thật của một request trong dApp DeFi/RWA mình dựng ở Treehouse:
 * trình duyệt → CDN edge → app shell đọc ví → API/BFF (giá · yield · TVL)
 * → job nền đồng bộ on-chain → RPC node đọc chuỗi bằng Ethers.js → dashboard.
 * Thứ tự các chặng và tính chất của chúng (chặng ra chuỗi luôn chậm nhất,
 * đúng một chặng chạy async) là có thật; trục ms chỉ là mô hình để vẽ
 * waterfall — không phải số đo APM, nên không có con số nào được nêu như
 * một phép đo. Trục cuộn (t0/t1) là cửa sổ scroll mà packet đi qua chặng đó.
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
    label: "Trình duyệt → CDN edge",
    service: "cdn-edge",
    kind: "sync",
    startMs: 0,
    durationMs: 24,
    t0: 0,
    t1: 0.14,
    log: "GET /dashboard · shell tĩnh trả từ edge · chưa biết ví nào",
    note: "Người dùng chạm CDN trước khi chạm bất kỳ logic nào. Shell phải ra sớm dù lúc này chưa biết ví nào sẽ kết nối — nên tôi luôn tách rõ phần render được từ trước và phần buộc phải chờ trình duyệt.",
  },
  {
    id: "shell",
    label: "Hydrate + đọc trạng thái ví",
    service: "dapp-shell",
    kind: "sync",
    startMs: 24,
    durationMs: 9,
    t0: 0.14,
    t1: 0.3,
    log: "hydrate · dò provider của ví · chưa connect → CTA Connect Wallet",
    note: "Một dApp luôn có hai thế giới sống song song: chưa kết nối ví và đã kết nối. Ở Treehouse tôi bắt mọi màn hình khai báo cả hai ngay từ bản thiết kế; quên một cái là người dùng nhìn khoảng trống mà không hiểu vì sao.",
  },
  {
    id: "api",
    label: "API/BFF gom giá · yield · TVL",
    service: "treehouse-api",
    kind: "sync",
    startMs: 33,
    durationMs: 58,
    t0: 0.3,
    t1: 0.52,
    log: "một lượt gọi song song: giá tAsset · yield · TVL (bản đã cache)",
    note: "Số liệu thị trường đi qua một lớp BFF thay vì để từng widget tự đi hỏi. Frontend chỉ nên chờ một lần, và các con số trên cùng màn hình phải cùng một mốc thời gian — nếu không, hai thẻ cạnh nhau sẽ kể hai câu chuyện khác nhau.",
  },
  {
    id: "queue",
    label: "Job nền theo dõi on-chain",
    service: "sync-worker",
    kind: "async",
    startMs: 91,
    durationMs: 31,
    t0: 0.52,
    t1: 0.7,
    log: "worker nền: nghe event on-chain · làm mới cache giá/yield",
    note: "Dữ liệu on-chain không tới đúng lúc mình cần nó: worker chạy nền nghe event rồi làm mới cache. Đặt đúng ranh giới sync/async là thứ giữ dashboard mượt trong khi chuỗi vẫn đang xác nhận phía sau.",
  },
  {
    id: "rpc",
    label: "RPC node · đọc chuỗi qua Ethers.js",
    service: "rpc-node",
    kind: "sync",
    startMs: 122,
    durationMs: 43,
    t0: 0.7,
    t1: 0.86,
    log: "eth_call qua Ethers.js: balance · allowance của đúng ví đang kết nối",
    note: "Chặng chậm nhất luôn là lần đi ra chuỗi: số dư và allowance gắn với từng ví nên không cache chung được. Đọc on-chain bằng Ethers.js dạy tôi thiết kế UI quanh độ trễ và lỗi RPC, thay vì giả vờ rằng mạng luôn trả lời.",
  },
  {
    id: "render",
    label: "Render dashboard",
    service: "dapp-shell",
    kind: "sync",
    startMs: 165,
    durationMs: 22,
    t0: 0.86,
    t1: 1,
    log: "dashboard có số · phần vừa ký giữ nguyên trạng thái pending",
    note: "Dashboard hiện số, nhưng thứ vừa được ký vẫn phải nằm ở trạng thái pending tới khi chuỗi xác nhận. Thành thật với người dùng về phần chưa chắc chắn là chỗ khó nhất của sản phẩm DeFi — và cũng là chỗ tôi soi kỹ nhất khi review code mỗi ngày.",
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
 * nhẹ (CDN edge → app shell → API/BFF → job nền hơi nâng cao → RPC node →
 * render).
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
 * Diorama hạ tầng flat-grey quanh mỗi station: vòng CDN edge 6 hộp, lưới
 * API/BFF 5×3, rail job nền 8 slot (đều là box → 1 InstancedMesh), RPC node
 * 3 trụ chồng (1 InstancedMesh trụ). Hex prism app shell là mesh riêng.
 */
export function buildNodes(): DioramaNodes {
  const boxes: DioramaNode[] = [];
  const cylinders: DioramaNode[] = [];

  // Vòng CDN edge: 6 hộp xếp vòng tròn quanh station 0
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    boxes.push({
      spanIndex: 0,
      offset: [Math.cos(angle) * 1.15, -0.25, Math.sin(angle) * 1.15],
      scale: [0.34, 0.5 + (i % 2) * 0.22, 0.34],
      grey: 0.42 + (i % 3) * 0.08,
    });
  }

  // Lưới API/BFF 5×3 quanh station 2
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

  // Rail job nền: 8 slot dẹt xếp hàng dọc trục x quanh station 3
  for (let i = 0; i < 8; i += 1) {
    boxes.push({
      spanIndex: 3,
      offset: [(i - 3.5) * 0.46, -0.18, 0.85],
      scale: [0.32, 0.16, 0.42],
      grey: 0.46 + (i % 2) * 0.12,
    });
  }

  // RPC node: 3 trụ chồng kiểu datastore tại station 4
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
