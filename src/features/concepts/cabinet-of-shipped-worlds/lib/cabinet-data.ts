/**
 * Tủ kính bảo tàng 4×2: bốn ô là thế giới thu nhỏ của sản phẩm đã ship
 * (diorama primitive thuần, mỗi ô một bảng màu riêng), bốn ô phủ sương
 * "trong kho". Demo dùng frost plane + camera dolly thay cho
 * MeshPortalMaterial của bản chính thức — cùng choreography, rẻ hơn.
 *
 * Bốn ô live là dự án thật trong portfolio công khai (Treehouse trên
 * treehouse.finance, phần còn lại từ portfolio Freelancer/Upwork).
 * metric chỉ nêu phạm vi và vai trò đối chiếu được — không có số tự bịa.
 */

export type CellWorld = "vault" | "port" | "terminal" | "observatory";

export interface CabinetCell {
  id: string;
  col: number;
  row: number;
  /** null = ô lưu kho, chỉ có sương */
  world: CellWorld | null;
  title: string;
  years: string;
  metric: string;
}

export const CELLS: CabinetCell[] = [
  {
    // Két tài sản token hoá — hợp với vault (vàng, khối lưu trữ)
    id: "cell-vault",
    col: 0,
    row: 0,
    world: "vault",
    title: "treehouse",
    years: "2021 · nay",
    metric: "DeFi/RWA · tETH · dẫn đội 8 kỹ sư",
  },
  {
    // Marketplace nông sản — luồng hàng qua cảng
    id: "cell-port",
    col: 1,
    row: 0,
    world: "port",
    title: "foodmap",
    years: "Freelance",
    metric: "marketplace nông sản · nối nhà vườn và người mua",
  },
  {
    // eCommerce cấu hình tay cầm — bàn máy, màn hình, đồ chơi game
    id: "cell-terminal",
    col: 2,
    row: 0,
    world: "terminal",
    title: "controllermodz",
    years: "Freelance",
    metric: "eCommerce tay cầm · đặt hàng theo cấu hình",
  },
  {
    // Đài quan sát = khu admin nhìn toàn danh mục cho thuê
    id: "cell-observatory",
    col: 3,
    row: 0,
    world: "observatory",
    title: "build-to-rent",
    years: "Freelance",
    metric: "bất động sản cho thuê · web app + admin",
  },
  { id: "storage-1", col: 0, row: 1, world: null, title: "", years: "", metric: "" },
  { id: "storage-2", col: 1, row: 1, world: null, title: "", years: "", metric: "" },
  { id: "storage-3", col: 2, row: 1, world: null, title: "", years: "", metric: "" },
  { id: "storage-4", col: 3, row: 1, world: null, title: "", years: "", metric: "" },
];

export const CELL_WIDTH = 1.7;
export const CELL_HEIGHT = 1.3;

/** Tâm một ô trong không gian tủ (tủ đặt giữa gốc toạ độ). */
export function cellCenter(
  col: number,
  row: number,
): [number, number, number] {
  return [
    (col - 1.5) * CELL_WIDTH,
    (0.5 - row) * CELL_HEIGHT + 0.65,
    0,
  ];
}

export interface DioramaPart {
  kind: "box" | "cyl";
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  /** Chi tiết quay chậm khi ô được đánh thức (hover/enter) */
  animated?: boolean;
}

/** Diorama primitive cho từng thế giới — nằm gọn trong lòng ô kính. */
export function buildDiorama(world: CellWorld): DioramaPart[] {
  switch (world) {
    case "vault":
      return [
        { kind: "box", position: [0, -0.42, 0], scale: [1.3, 0.08, 0.8], color: "#123324" },
        { kind: "cyl", position: [-0.35, -0.1, 0], scale: [0.3, 0.55, 0.3], color: "#1d4d36" },
        { kind: "cyl", position: [-0.35, 0.24, 0], scale: [0.34, 0.1, 0.34], color: "#d4af37" },
        { kind: "box", position: [0.3, -0.28, 0.1], scale: [0.7, 0.06, 0.3], color: "#2a5c44" },
        { kind: "cyl", position: [0.14, -0.2, 0.1], scale: [0.07, 0.05, 0.07], color: "#d4af37", animated: true },
        { kind: "cyl", position: [0.36, -0.2, 0.1], scale: [0.07, 0.05, 0.07], color: "#d4af37" },
        { kind: "cyl", position: [0.56, -0.2, 0.1], scale: [0.07, 0.05, 0.07], color: "#d4af37" },
      ];
    case "port":
      return [
        { kind: "box", position: [0, -0.44, 0], scale: [1.35, 0.06, 0.85], color: "#0e1c30" },
        { kind: "box", position: [-0.4, -0.3, 0.05], scale: [0.32, 0.16, 0.18], color: "#b3541e" },
        { kind: "box", position: [-0.4, -0.14, 0.05], scale: [0.32, 0.16, 0.18], color: "#3a6ea5" },
        { kind: "box", position: [0.02, -0.3, -0.12], scale: [0.32, 0.16, 0.18], color: "#5a6b7a" },
        { kind: "box", position: [0.42, 0.05, 0], scale: [0.06, 0.75, 0.06], color: "#8d99a6" },
        { kind: "box", position: [0.27, 0.38, 0], scale: [0.5, 0.05, 0.06], color: "#8d99a6", animated: true },
        { kind: "box", position: [0.05, 0.28, 0], scale: [0.05, 0.16, 0.05], color: "#ffb454" },
      ];
    case "terminal":
      return [
        { kind: "box", position: [0, -0.42, 0], scale: [1.3, 0.08, 0.8], color: "#0d1512" },
        { kind: "box", position: [-0.25, -0.1, -0.1], scale: [0.7, 0.5, 0.06], color: "#0f2418" },
        { kind: "box", position: [-0.25, -0.1, -0.06], scale: [0.6, 0.4, 0.02], color: "#39ff6e" },
        { kind: "box", position: [0.45, -0.28, 0.15], scale: [0.35, 0.2, 0.25], color: "#18261e" },
        { kind: "cyl", position: [0.45, -0.05, 0.15], scale: [0.09, 0.2, 0.09], color: "#39ff6e", animated: true },
        { kind: "box", position: [-0.2, -0.36, 0.28], scale: [0.5, 0.05, 0.2], color: "#22302a" },
      ];
    case "observatory":
      return [
        { kind: "box", position: [0, -0.42, 0], scale: [1.3, 0.08, 0.8], color: "#171226" },
        { kind: "cyl", position: [0, -0.12, 0], scale: [0.4, 0.5, 0.4], color: "#241c3a" },
        { kind: "cyl", position: [0, 0.22, 0], scale: [0.44, 0.16, 0.44], color: "#2f2749" },
        { kind: "cyl", position: [0.12, 0.38, 0], scale: [0.08, 0.3, 0.08], color: "#a78bfa", animated: true },
        { kind: "box", position: [-0.45, -0.3, 0.2], scale: [0.3, 0.2, 0.2], color: "#241c3a" },
        { kind: "box", position: [0.5, -0.34, -0.15], scale: [0.2, 0.12, 0.2], color: "#241c3a" },
      ];
  }
}

export interface CabinetPose {
  position: [number, number, number];
  target: [number, number, number];
}

/** Camera: -1 = đứng ngắm cả tủ; index ô = dolly sát ô đó. */
export function cameraForCell(index: number): CabinetPose {
  if (index < 0 || index >= CELLS.length) {
    return { position: [0, 0.7, 6.4], target: [0, 0.6, 0] };
  }
  const cell = CELLS[index];
  const [x, y] = cellCenter(cell.col, cell.row);
  return {
    position: [x * 0.85, y, 2.1],
    target: [x, y, 0],
  };
}
