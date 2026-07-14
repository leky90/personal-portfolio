/**
 * State chia sẻ giữa DOM (scroll/pointer) và canvas (useFrame) qua mutable
 * ref — như SceneState của resolution, không đi qua React state để giữ 60fps.
 */
export interface TerrainState {
  /** Tiến độ cuộn [0,1] của cả experience — target cho camera damp */
  progress: number;
  /** Era active (-1 = hero/contact), tính từ activeEraIndex(progress) */
  era: number;
  /** Gợn sóng từ pointer: tọa độ world xz + thời điểm kích hoạt (giây clock) */
  ripple: { x: number; z: number; startAt: number };
  /** invalidate() của R3F — canvas gắn vào sau khi mount */
  invalidate: (() => void) | null;
  /** Màn hình hẹp: giảm mật độ line/segment ngay lúc dựng geometry */
  isMobile: boolean;
}

export function createTerrainState(): TerrainState {
  return {
    progress: 0,
    era: -1,
    ripple: { x: 0, z: -999, startAt: -999 },
    invalidate: null,
    isMobile: false,
  };
}
