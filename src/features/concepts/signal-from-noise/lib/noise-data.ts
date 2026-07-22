/**
 * Tín hiệu giữa nhiễu: MỘT trường hạt lần lượt kết tinh thành 3 form
 * (tên → globe → lattice kiến trúc dApp DeFi). Toạ độ đích của cả 3 form bake
 * vào một DataTexture; các builder là hàm thuần test được, form tên có
 * fallback khi headless. Demo 4096 hạt CPU-bake; bản chính thức nâng
 * GPGPU ping-pong 131k hạt cùng schema.
 */

export const FORMS = ["name", "globe", "lattice"] as const;

/** Số hạt — bội của 64 để xếp texture 64 cột */
export const PARTICLE_TOTAL = 4096;

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

type Point3 = [number, number, number];

/** Form 2: khung cầu lat/long — điểm rải sát mặt cầu bán kính 1. */
export function buildGlobePoints(n: number): Point3[] {
  const rand = mulberry32(41);
  const points: Point3[] = [];
  for (let i = 0; i < n; i += 1) {
    // Xen kẽ vĩ tuyến / kinh tuyến cho ra khung dây thay vì cầu đặc
    const onLatitude = i % 2 === 0;
    if (onLatitude) {
      const ring = Math.floor(rand() * 7) - 3;
      const phi = (ring / 7) * Math.PI;
      const theta = rand() * Math.PI * 2;
      points.push([
        Math.cos(theta) * Math.cos(phi),
        Math.sin(phi),
        Math.sin(theta) * Math.cos(phi),
      ]);
    } else {
      const meridian = Math.floor(rand() * 8);
      const theta = (meridian / 8) * Math.PI * 2;
      const phi = (rand() - 0.5) * Math.PI;
      points.push([
        Math.cos(theta) * Math.cos(phi),
        Math.sin(phi),
        Math.sin(theta) * Math.cos(phi),
      ]);
    }
  }
  return points;
}

/**
 * Đồ thị kiến trúc dApp DeFi đang chạy thật (nền tảng RWA ở Treehouse,
 * sản phẩm tETH): 8 node, 12 cạnh — form 3 rải hạt dọc cạnh.
 *
 * Node theo đúng thứ tự index:
 *   0 ví người dùng (wallet connect)
 *   1 dApp frontend (React + TypeScript + Next.js)
 *   2 lớp đọc on-chain qua RPC (Ethers.js provider)
 *   3 hợp đồng tETH / tAsset trên chain
 *   4 luồng ký & broadcast giao dịch
 *   5 cache giá và lợi suất
 *   6 indexer sự kiện on-chain + API nội bộ
 *   7 dashboard TVL / yield thời gian thực
 */
const LATTICE_NODES: Point3[] = [
  [-1.4, 0.7, 0],
  [-0.6, 1.1, 0.5],
  [0.4, 0.9, -0.4],
  [1.3, 0.6, 0.3],
  [-1.1, -0.4, -0.5],
  [-0.2, -0.8, 0.4],
  [0.8, -0.5, -0.3],
  [1.5, -0.9, 0.1],
];

/** Cạnh = đường dữ liệu thật giữa hai node ở trên (xem chú thích index). */
const LATTICE_EDGES: [number, number][] = [
  [0, 1], // ví ↔ frontend: connect wallet, đọc address
  [1, 2], // frontend → provider RPC
  [2, 3], // RPC → hợp đồng tETH: đọc totalAssets, exchangeRate
  [0, 4], // ví → luồng ký giao dịch
  [1, 5], // frontend ↔ cache giá & lợi suất
  [2, 6], // RPC → indexer bắt event
  [3, 7], // hợp đồng → dashboard TVL/yield
  [4, 5], // ký xong thì cache lợi suất bị invalidate
  [5, 6], // indexer nạp lại cache
  [6, 7], // API nội bộ → dashboard
  [1, 6], // frontend hỏi indexer lịch sử giao dịch
  [4, 2], // broadcast giao dịch đã ký qua RPC
];

/** Form 3: hạt rải đều dọc các cạnh của đồ thị kiến trúc dApp. */
export function buildLatticePoints(n: number): Point3[] {
  const rand = mulberry32(97);
  const points: Point3[] = [];
  for (let i = 0; i < n; i += 1) {
    const [a, b] = LATTICE_EDGES[i % LATTICE_EDGES.length];
    const t = rand();
    const jitter = () => (rand() - 0.5) * 0.05;
    points.push([
      LATTICE_NODES[a][0] + (LATTICE_NODES[b][0] - LATTICE_NODES[a][0]) * t + jitter(),
      LATTICE_NODES[a][1] + (LATTICE_NODES[b][1] - LATTICE_NODES[a][1]) * t + jitter(),
      LATTICE_NODES[a][2] + (LATTICE_NODES[b][2] - LATTICE_NODES[a][2]) * t + jitter(),
    ]);
  }
  return points;
}

/**
 * Form 1: họ tên đầy đủ "KY LE DINH" sample từ canvas 2D lúc runtime;
 * môi trường headless (jsdom/SSR) rơi về sóng sin đọc được — không bao
 * giờ rỗng.
 */
export function buildNamePoints(n: number): Point3[] {
  const sampled = sampleNameFromCanvas();
  const rand = mulberry32(7);
  const points: Point3[] = [];
  if (sampled.length > 0) {
    for (let i = 0; i < n; i += 1) {
      const [x, y] = sampled[i % sampled.length];
      points.push([
        x + (rand() - 0.5) * 0.015,
        y + (rand() - 0.5) * 0.015,
        (rand() - 0.5) * 0.08,
      ]);
    }
    return points;
  }
  for (let i = 0; i < n; i += 1) {
    const t = i / n;
    points.push([
      (t - 0.5) * 3.6,
      Math.sin(t * Math.PI * 6) * 0.5 + (rand() - 0.5) * 0.06,
      (rand() - 0.5) * 0.08,
    ]);
  }
  return points;
}

function sampleNameFromCanvas(): [number, number][] {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  // 48px chứ không phải 64px: "KY LE DINH" (10 ký tự) ở bold 64px cho
  // vệt mực ~377px, gần như chạm hai mép raster 384px; 48px cho ~283px,
  // còn dư lề an toàn cho mọi font monospace trong stack.
  ctx.font = "bold 48px ui-monospace, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText("KY LE DINH", 192, 48);
  const image = ctx.getImageData(0, 0, 384, 96);
  const points: [number, number][] = [];
  for (let y = 0; y < 96; y += 1) {
    for (let x = 0; x < 384; x += 1) {
      if (image.data[(y * 384 + x) * 4 + 3] > 120) {
        points.push([(x / 384 - 0.5) * 4.2, -(y / 96 - 0.5) * 1.05]);
      }
    }
  }
  return points;
}

export interface FormPhase {
  formA: number;
  formB: number;
  blend: number;
}

/** Phase [0,2] → cặp form + blend, clamp hai biên. */
export function formPhase(phase: number): FormPhase {
  const max = FORMS.length - 1;
  const p = Math.min(Math.max(phase, 0), max);
  const formA = Math.floor(p);
  const formB = Math.min(formA + 1, max);
  return { formA, formB, blend: p - formA };
}
