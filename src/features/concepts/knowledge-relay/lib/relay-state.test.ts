import { describe, expect, it } from "vitest";
import {
  createRelayState,
  relayYearFromProgress,
} from "@/features/concepts/knowledge-relay/lib/relay-state";

describe("relay-state — cầu nối DOM ↔ canvas", () => {
  it("mặc định: năm 2016, chưa chọn baton, chưa gắn invalidate", () => {
    const state = createRelayState();
    expect(state.year).toBe(2016);
    expect(state.selected).toBe(-1);
    expect(state.invalidate).toBeNull();
    expect(state.isMobile).toBe(false);
  });

  it("relayYearFromProgress map [0,1] → [2016,2026] có clamp", () => {
    expect(relayYearFromProgress(0)).toBe(2016);
    expect(relayYearFromProgress(0.5)).toBe(2021);
    expect(relayYearFromProgress(1)).toBe(2026);
    expect(relayYearFromProgress(-1)).toBe(2016);
    expect(relayYearFromProgress(2)).toBe(2026);
  });
});
