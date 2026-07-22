/** State chia sẻ DOM ↔ canvas của living-topology (mutable ref, không re-render). */
export interface TopologyState {
  /** Tiến độ cuộn [0,1] — drive năm timeline qua yearForProgress */
  progress: number;
  /** Hệ thống đang hover trên canvas (-1 = không) */
  hoverSystem: number;
  /** Hệ thống được isolate từ DOM project card (-1 = không) */
  focusSystem: number;
  /** Canvas gọi để đẩy telemetry ra HUD DOM (experience gán vào) */
  setTelemetry: ((systemIndex: number) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

const YEAR_START = 2013.5;
const YEAR_END = 2026.4;

/** Scroll [0,1] → năm timeline; kẹp ngoài khoảng. */
export function yearForProgress(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return YEAR_START + clamped * (YEAR_END - YEAR_START);
}

export function createTopologyState(): TopologyState {
  return {
    progress: 0,
    hoverSystem: -1,
    focusSystem: -1,
    setTelemetry: null,
    invalidate: null,
    isMobile: false,
  };
}
