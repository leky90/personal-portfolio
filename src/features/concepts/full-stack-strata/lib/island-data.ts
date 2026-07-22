/**
 * Hòn đảo nổi mà lát cắt chính là stack: thành phố sản phẩm trên mặt,
 * seam dịch vụ phát sáng ở giữa, đá dữ liệu kết tinh dưới đáy. Lát cắt
 * lấy đúng stack của dApp DeFi tôi đang dựng ở Treehouse (sản phẩm
 * tETH). Mọi hình học + kịch bản trace đều là dữ liệu thuần test được;
 * runtime chỉ lắp ráp instanced mesh và trượt packet theo đường cong đã
 * bake.
 */

export interface IslandLayer {
  id: "surface" | "services" | "bedrock";
  label: string;
  yTop: number;
  yBottom: number;
  note: string;
}

export const LAYERS: IslandLayer[] = [
  {
    id: "surface",
    label: "tầng sản phẩm",
    yTop: 1.2,
    yBottom: 0.4,
    note: "Thành phố người dùng nhìn thấy: dApp frontend React + TypeScript + Next.js, dashboard giá / lợi suất / TVL, nút connect wallet. Đây là nơi mọi request bắt đầu rơi xuống.",
  },
  {
    id: "services",
    label: "seam dịch vụ",
    yTop: 0.4,
    yBottom: -0.2,
    note: "Vành đai mỏng phát sáng giữa đảo: 8 node nói chuyện với nhau bằng hợp đồng — ví, RPC qua Ethers.js, cache giá và lợi suất, indexer sự kiện, API nội bộ, bảng ops. Mỏng là cố ý — tầng giữa càng dày càng khó nợ.",
  },
  {
    id: "bedrock",
    label: "đá nền dữ liệu",
    yTop: -0.2,
    yBottom: -1.6,
    note: "Tinh thể dữ liệu kết tủa từ 2014 tới nay: schema MongoDB/Postgres/MySQL, index, backup, và dưới cùng là state on-chain không ai sửa được. Mọi thứ phía trên có thể đập đi xây lại; tầng này thì không được phép sai.",
  },
];

function hash01(seed: number): number {
  let a = (seed * 2654435761) >>> 0;
  a ^= a >>> 15;
  a = (a * 0x2c1b3c6d) >>> 0;
  a ^= a >>> 12;
  return (a >>> 0) / 4294967296;
}

export interface CityBuilding {
  x: number;
  z: number;
  height: number;
  seed: number;
}

/** 80 toà nhà graphite rải trong đĩa mặt đảo — deterministic theo seed. */
export function buildCity(seed: number): CityBuilding[] {
  const buildings: CityBuilding[] = [];
  for (let i = 0; i < 80; i += 1) {
    const radius = Math.sqrt(hash01(seed + i * 3)) * 3.1;
    const angle = hash01(seed + i * 7 + 1) * Math.PI * 2;
    buildings.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      height: 0.15 + hash01(seed + i * 11 + 2) * 0.75,
      seed: hash01(seed + i * 13 + 3),
    });
  }
  return buildings;
}

/** 8 service node quanh vành seam. */
export const SERVICE_NODES: [number, number, number][] = Array.from(
  { length: 8 },
  (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    return [Math.cos(angle) * 2.6, 0.1, Math.sin(angle) * 2.6];
  },
);

/** Link giữa các service: vòng ring + vài đường chéo. */
export const SERVICE_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [0, 3],
  [2, 6],
];

export interface Crystal {
  x: number;
  y: number;
  z: number;
  scale: number;
  seed: number;
}

/** 24 tinh thể dữ liệu trong tầng bedrock. */
export function buildCrystals(seed: number): Crystal[] {
  const bedrock = LAYERS[2];
  const crystals: Crystal[] = [];
  for (let i = 0; i < 24; i += 1) {
    const radius = Math.sqrt(hash01(seed + i * 5 + 40)) * 2.9;
    const angle = hash01(seed + i * 9 + 41) * Math.PI * 2;
    crystals.push({
      x: Math.cos(angle) * radius,
      y:
        bedrock.yBottom +
        0.15 +
        hash01(seed + i * 17 + 42) * (bedrock.yTop - bedrock.yBottom - 0.3),
      z: Math.sin(angle) * radius,
      scale: 0.14 + hash01(seed + i * 23 + 43) * 0.2,
      seed: hash01(seed + i * 29 + 44),
    });
  }
  return crystals;
}

export interface TraceStep {
  /** Mốc tiến độ chuyến bay [0,1] mà dòng log này xuất hiện */
  at: number;
  text: string;
}

export interface RequestTrace {
  id: string;
  label: string;
  steps: TraceStep[];
}

/**
 * 4 kịch bản có thật của dApp DeFi (tETH): mở dashboard khi cache lạnh,
 * mở lại khi cache còn ấm, stake ETH đổi tETH, và nhịp đọc gặp RPC lỗi.
 * Cố ý KHÔNG có con số ms — mỗi bước kể một việc thật đang xảy ra chứ
 * không phải một benchmark bịa.
 */
export const TRACES: RequestTrace[] = [
  {
    id: "cold-read",
    label: "Mở dashboard tETH · cache lạnh",
    steps: [
      { at: 0.05, text: "mở /dashboard · frontend dựng khung, chưa có số" },
      { at: 0.3, text: "cache giá & lợi suất trống → phải xuống tận nguồn" },
      { at: 0.55, text: "đọc on-chain qua RPC: totalAssets, exchangeRate" },
      { at: 0.8, text: "quy ra APY và TVL, ghi kết quả lại vào cache" },
      { at: 0.97, text: "dashboard thay skeleton bằng số thật" },
    ],
  },
  {
    id: "warm-read",
    label: "Mở lại dashboard · cache còn ấm",
    steps: [
      { at: 0.08, text: "mở lại /dashboard · frontend hỏi cache trước" },
      { at: 0.45, text: "cache giá & lợi suất còn hạn → trả thẳng ở seam" },
      { at: 0.75, text: "không đánh thức RPC, không chạm tầng dữ liệu" },
      { at: 0.97, text: "số hiện ngay, nền vẫn lặng lẽ refetch cho vòng sau" },
    ],
  },
  {
    id: "stake-tx",
    label: "Stake ETH → tETH · ghi on-chain",
    steps: [
      { at: 0.05, text: "bấm Stake · frontend dựng calldata cho hợp đồng" },
      { at: 0.3, text: "ký giao dịch qua ví · dApp chỉ cầm được cái hash" },
      { at: 0.6, text: "broadcast qua RPC rồi chờ block xác nhận" },
      { at: 0.85, text: "indexer bắt event, cache lợi suất bị invalidate" },
      { at: 0.97, text: "số dư tETH và TVL cập nhật, UI thoát pending" },
    ],
  },
  {
    id: "rpc-fallback",
    label: "Đọc số dư · RPC hỏng, rơi sang dự phòng",
    steps: [
      { at: 0.05, text: "nhịp poll số dư · đọc on-chain qua RPC chính" },
      { at: 0.35, text: "⚠ RPC trả lỗi giữa nhịp — chưa có số mới" },
      { at: 0.65, text: "đổi sang RPC dự phòng, backoff, giữ số cũ dán nhãn stale" },
      { at: 0.97, text: "số về lại · không màn hình trắng, không NaN trên dashboard" },
    ],
  },
];

/** Bước log cuối cùng đã xảy ra tại tiến độ t (-1 nếu chưa tới bước nào). */
export function traceStepAt(trace: RequestTrace, t: number): number {
  let index = -1;
  for (const [stepIndex, step] of trace.steps.entries()) {
    if (step.at <= t) index = stepIndex;
  }
  return index;
}

/** Thời lượng một chuyến bay request (giây). */
export const TRACE_SECONDS = 2.8;

/**
 * Đường bay packet: rời một nóc nhà, xuyên seam tại một service node,
 * chạm một tinh thể bedrock rồi vòng lên trả response. Chọn điểm theo
 * index trace để mỗi kịch bản bay một tuyến khác nhau.
 */
export function requestPathPoints(
  traceIndex: number,
): [number, number, number][] {
  const city = buildCity(7);
  const crystals = buildCrystals(7);
  const building = city[(traceIndex * 19 + 5) % city.length];
  const node = SERVICE_NODES[(traceIndex * 3 + 1) % SERVICE_NODES.length];
  const crystal = crystals[(traceIndex * 7 + 3) % crystals.length];

  return [
    [building.x, LAYERS[0].yTop + building.height + 0.15, building.z],
    [building.x * 0.7 + node[0] * 0.3, 0.75, building.z * 0.7 + node[2] * 0.3],
    [node[0], node[1], node[2]],
    [crystal.x, crystal.y, crystal.z],
    [node[0] * 0.6, 0.05, node[2] * 0.6],
    [building.x * 0.5, LAYERS[0].yTop + 0.5, building.z * 0.5],
  ];
}

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_POSES: CameraPose[] = [
  { position: [4.6, 4.4, 9.6], target: [0, 0.4, 0] },
  { position: [5.2, 2.2, 8.2], target: [0, 0.9, 0] },
  { position: [5.6, 0.5, 7.0], target: [0, 0.1, 0] },
  { position: [5.0, -1.1, 6.4], target: [0, -0.9, 0] },
];

/** Camera tụt dọc lát cắt theo tiến độ cuộn — lerp giữa 4 pose. */
export function cameraPoseAt(progress: number): CameraPose {
  const p = Math.min(Math.max(progress, 0), 1) * (CAMERA_POSES.length - 1);
  const lower = Math.min(Math.floor(p), CAMERA_POSES.length - 2);
  const t = p - lower;
  const a = CAMERA_POSES[lower];
  const b = CAMERA_POSES[lower + 1];
  const lerp3 = (
    from: [number, number, number],
    to: [number, number, number],
  ): [number, number, number] => [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
  return {
    position: lerp3(a.position, b.position),
    target: lerp3(a.target, b.target),
  };
}
