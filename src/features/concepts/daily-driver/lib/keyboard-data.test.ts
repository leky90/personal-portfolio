import { describe, expect, it } from "vitest";
import {
  ACCENT_CODES,
  COMMANDS,
  buildKeyboard,
  keyIndexByCode,
  matchCommand,
} from "@/features/concepts/daily-driver/lib/keyboard-data";

describe("keyboard-data — layout 60% procedural + bảng lệnh", () => {
  it("61 phím, code không trùng, bề rộng dương", () => {
    const keys = buildKeyboard();
    expect(keys).toHaveLength(61);
    expect(new Set(keys.map((k) => k.code)).size).toBe(61);
    for (const key of keys) {
      expect(key.w).toBeGreaterThan(0);
    }
  });

  it("mỗi hàng cộng đúng 15u và không có phím chồng lấn", () => {
    const keys = buildKeyboard();
    const rows = new Map<number, typeof keys>();
    for (const key of keys) {
      const row = rows.get(key.z) ?? [];
      row.push(key);
      rows.set(key.z, row);
    }
    expect(rows.size).toBe(5);
    for (const row of rows.values()) {
      const total = row.reduce((sum, k) => sum + k.w, 0);
      expect(total).toBeCloseTo(15, 5);
      const sorted = [...row].sort((a, b) => a.x - b.x);
      for (let i = 1; i < sorted.length; i += 1) {
        const prevEdge = sorted[i - 1].x + sorted[i - 1].w / 2;
        const nextEdge = sorted[i].x - sorted[i].w / 2;
        expect(nextEdge).toBeGreaterThanOrEqual(prevEdge - 1e-6);
      }
    }
  });

  it("đúng 5 phím lệnh accent W/A/L/C/R", () => {
    const keys = buildKeyboard();
    const accents = keys.filter((k) => k.accent).map((k) => k.code);
    expect(accents.sort()).toEqual([...ACCENT_CODES].sort());
    expect(ACCENT_CODES).toEqual(["KeyW", "KeyA", "KeyL", "KeyC", "KeyR"]);
  });

  it("mỗi lệnh bắt đầu bằng đúng chữ cái phím accent của nó", () => {
    expect(COMMANDS).toHaveLength(5);
    for (const command of COMMANDS) {
      expect(command.cmd.startsWith(command.key)).toBe(true);
      expect(ACCENT_CODES).toContain(`Key${command.key.toUpperCase()}`);
    }
  });

  it("matchCommand: prefix khớp lệnh đầu tiên, rỗng/lạ trả null", () => {
    expect(matchCommand("w")?.cmd).toBe("work");
    expect(matchCommand("wo")?.cmd).toBe("work");
    expect(matchCommand("lab")?.cmd).toBe("lab");
    expect(matchCommand("")).toBeNull();
    expect(matchCommand("xyz")).toBeNull();
  });

  it("keyIndexByCode: tra đúng index, code lạ trả -1", () => {
    const keys = buildKeyboard();
    const qIndex = keyIndexByCode("KeyQ");
    expect(keys[qIndex].code).toBe("KeyQ");
    expect(keyIndexByCode("KeyNope")).toBe(-1);
  });
});
