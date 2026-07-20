import {
  NODES,
  resolvePaths,
} from "@/features/concepts/dependency-constellation/lib/constellation-data";

/** State chia sẻ DOM ↔ canvas của dependency-constellation (mutable ref). */
export interface ConstellationState {
  /** Node đang được query pnpm-why (null = không) */
  queried: string | null;
  /** Click pin query để đọc, click-away thả */
  pinned: boolean;
  /** Tiến độ cuộn [0,1] — camera orbit quanh chòm sao */
  progress: number;
  /** Canvas đẩy các dòng terminal ra HUD DOM */
  setTerminal: ((lines: string[]) => void) | null;
  invalidate: (() => void) | null;
  isMobile: boolean;
}

export function createConstellationState(): ConstellationState {
  return {
    queried: null,
    pinned: false,
    progress: 0,
    setTerminal: null,
    invalidate: null,
    isMobile: false,
  };
}

const LABEL_BY_ID = new Map(NODES.map((node) => [node.id, node.label]));

/** Chạy một query pnpm-why — chỉ khi node đổi, kèm dòng lệnh + paths. */
export function queryNode(
  state: ConstellationState,
  nodeId: string | null,
): void {
  if (nodeId === state.queried) return;
  state.queried = nodeId;
  if (nodeId === null) {
    state.setTerminal?.([]);
  } else {
    state.setTerminal?.([
      `$ pnpm why ${LABEL_BY_ID.get(nodeId) ?? nodeId}`,
      ...resolvePaths(nodeId),
    ]);
  }
  state.invalidate?.();
}
