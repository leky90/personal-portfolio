/**
 * Layout bàn phím 60% procedural (61 phím, 5 hàng × 15u) + bảng lệnh
 * terminal. Map theo KeyboardEvent.code (vị trí VẬT LÝ) nên AZERTY hay
 * Dvorak vẫn nhấn đúng keycap; ký tự nhập buffer lấy từ event.key ở DOM.
 */

export interface KeyCap {
  /** KeyboardEvent.code — định danh vị trí vật lý của phím */
  code: string;
  label: string;
  /** Tâm phím theo đơn vị u, gốc 0 ở giữa board */
  x: number;
  /** Hàng: -2 (số) → 2 (space) */
  z: number;
  /** Bề rộng theo đơn vị u (1u = phím chữ) */
  w: number;
  /** Phím lệnh accent W/A/L/C/R */
  accent: boolean;
}

export const ACCENT_CODES = ["KeyW", "KeyA", "KeyL", "KeyC", "KeyR"];

type RowSpec = [code: string, label: string, w?: number][];

const ROWS: RowSpec[] = [
  [
    ["Backquote", "`"],
    ["Digit1", "1"],
    ["Digit2", "2"],
    ["Digit3", "3"],
    ["Digit4", "4"],
    ["Digit5", "5"],
    ["Digit6", "6"],
    ["Digit7", "7"],
    ["Digit8", "8"],
    ["Digit9", "9"],
    ["Digit0", "0"],
    ["Minus", "-"],
    ["Equal", "="],
    ["Backspace", "⌫", 2],
  ],
  [
    ["Tab", "⇥", 1.5],
    ["KeyQ", "Q"],
    ["KeyW", "W"],
    ["KeyE", "E"],
    ["KeyR", "R"],
    ["KeyT", "T"],
    ["KeyY", "Y"],
    ["KeyU", "U"],
    ["KeyI", "I"],
    ["KeyO", "O"],
    ["KeyP", "P"],
    ["BracketLeft", "["],
    ["BracketRight", "]"],
    ["Backslash", "\\", 1.5],
  ],
  [
    ["CapsLock", "⇪", 1.75],
    ["KeyA", "A"],
    ["KeyS", "S"],
    ["KeyD", "D"],
    ["KeyF", "F"],
    ["KeyG", "G"],
    ["KeyH", "H"],
    ["KeyJ", "J"],
    ["KeyK", "K"],
    ["KeyL", "L"],
    ["Semicolon", ";"],
    ["Quote", "'"],
    ["Enter", "⏎", 2.25],
  ],
  [
    ["ShiftLeft", "⇧", 2.25],
    ["KeyZ", "Z"],
    ["KeyX", "X"],
    ["KeyC", "C"],
    ["KeyV", "V"],
    ["KeyB", "B"],
    ["KeyN", "N"],
    ["KeyM", "M"],
    ["Comma", ","],
    ["Period", "."],
    ["Slash", "/"],
    ["ShiftRight", "⇧", 2.75],
  ],
  [
    ["ControlLeft", "ctrl", 1.25],
    ["MetaLeft", "cmd", 1.25],
    ["AltLeft", "alt", 1.25],
    ["Space", "", 6.25],
    ["AltRight", "alt", 1.25],
    ["MetaRight", "cmd", 1.25],
    ["ContextMenu", "fn", 1.25],
    ["ControlRight", "ctrl", 1.25],
  ],
];

const ROW_WIDTH = 15;

/** Dựng 61 keycap với toạ độ tâm từ bề rộng cộng dồn của từng hàng. */
export function buildKeyboard(): KeyCap[] {
  const keys: KeyCap[] = [];
  ROWS.forEach((row, rowIndex) => {
    let cursor = -ROW_WIDTH / 2;
    for (const [code, label, w = 1] of row) {
      keys.push({
        code,
        label,
        x: cursor + w / 2,
        z: rowIndex - 2,
        w,
        accent: ACCENT_CODES.includes(code),
      });
      cursor += w;
    }
  });
  return keys;
}

const KEY_INDEX = new Map(buildKeyboard().map((key, index) => [key.code, index]));

/** Index instance của một code vật lý; -1 nếu không có trên board. */
export function keyIndexByCode(code: string): number {
  return KEY_INDEX.get(code) ?? -1;
}

export interface TerminalCommand {
  cmd: string;
  /** Chữ cái phím accent khởi đầu lệnh */
  key: string;
  label: string;
  note: string;
}

export const COMMANDS: TerminalCommand[] = [
  {
    cmd: "work",
    key: "w",
    label: "dự án tiêu biểu",
    note: "Ba case study sâu: bài toán, ràng buộc, số đo trước sau. Không gallery screenshot vô hồn.",
  },
  {
    cmd: "about",
    key: "a",
    label: "mười năm nghề",
    note: "Timeline 10 năm với những khúc cua thật: monolith đầu tiên, lần refactor lớn, giai đoạn dẫn team.",
  },
  {
    cmd: "lab",
    key: "l",
    label: "concept lab",
    note: "26 hướng art direction được chấm mù, demo chạy được từng cái. Chính là trang bạn vừa rời khỏi.",
  },
  {
    cmd: "contact",
    key: "c",
    label: "kênh liên hệ",
    note: "Email + lịch trống. Một form không bao giờ hỏi bạn 'budget range' trước khi biết bài toán.",
  },
  {
    cmd: "resume",
    key: "r",
    label: "cv một trang",
    note: "PDF tĩnh cho ATS và nhà tuyển dụng vội. Trang web này là bản CV chạy được, PDF là bản in.",
  },
];

/** Lệnh đầu tiên khớp prefix buffer (đã lowercase); rỗng/lạ → null. */
export function matchCommand(buffer: string): TerminalCommand | null {
  const query = buffer.trim().toLowerCase();
  if (query.length === 0) return null;
  return COMMANDS.find((command) => command.cmd.startsWith(query)) ?? null;
}
