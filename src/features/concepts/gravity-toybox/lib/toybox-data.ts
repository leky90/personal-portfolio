/**
 * Weight of Experience: khối lượng LÀ dữ liệu — mỗi công nghệ nặng đúng
 * số năm đã dùng. Demo không chở physics engine: rơi + nảy là mô hình
 * ballistic closed-form thuần (test được), restitution giảm theo khối
 * lượng nên đĩa 9 năm rơi thịch còn đĩa 1 năm nảy tưng. Bản chính thức
 * thay bằng Rapier bake replay ~70KB, giữ nguyên schema.
 */

const GRAVITY = 14;
/** Vận tốc nảy tối thiểu — dưới ngưỡng này coi như nằm yên */
const V_REST = 0.55;

export interface FallingBody {
  years: number;
  drop: { height: number; delay: number };
  rest: [number, number, number];
}

export interface SkillToken extends FallingBody {
  id: string;
  name: string;
  radius: number;
  thickness: number;
}

const RAW: [id: string, name: string, years: number][] = [
  ["typescript", "TypeScript", 9],
  ["node", "Node.js", 9],
  ["react", "React", 8],
  ["postgres", "PostgreSQL", 8],
  ["aws", "AWS", 7],
  ["docker", "Docker", 7],
  ["redis", "Redis", 6],
  ["kafka", "Kafka", 5],
  ["go", "Go", 4],
  ["k8s", "Kubernetes", 4],
  ["rust", "Rust", 2],
  ["zig", "Zig", 1],
];

const GOLDEN_ANGLE = 2.39996;

/** 12 đĩa tạ, nặng xếp giữa sàn (spiral golden-angle), nhẹ văng rìa. */
export const SKILLS: SkillToken[] = RAW.map(([id, name, years], index) => {
  const thickness = 0.14 + years * 0.022;
  const spiralRadius = 0.55 + index * 0.33;
  const angle = index * GOLDEN_ANGLE;
  return {
    id,
    name,
    years,
    radius: 0.34 + years * 0.055,
    thickness,
    drop: {
      height: 5.2 + (index % 3) * 0.9,
      delay: 1.1 + index * 0.16,
    },
    rest: [
      Math.cos(angle) * spiralRadius,
      thickness / 2,
      Math.sin(angle) * spiralRadius * 0.75,
    ],
  };
});

/** Hệ số nảy: nhẹ nảy tưng (0.5+), nặng rơi thịch (~0.23). */
export function restitutionOf(years: number): number {
  return Math.min(Math.max(0.18 + 0.5 / (years + 0.5), 0.15), 0.75);
}

/**
 * Cao độ y tại thời điểm t: treo trước delay, rơi tự do, chuỗi nảy
 * closed-form với năng lượng giảm e² mỗi lần chạm, rồi nằm yên.
 */
export function heightAt(t: number, body: FallingBody): number {
  const restY = body.rest[1];
  let tt = t - body.drop.delay;
  if (tt <= 0) return restY + body.drop.height;

  const e = restitutionOf(body.years);
  const fallTime = Math.sqrt((2 * body.drop.height) / GRAVITY);
  if (tt < fallTime) {
    return restY + body.drop.height - 0.5 * GRAVITY * tt * tt;
  }
  tt -= fallTime;

  let v = GRAVITY * fallTime * e;
  while (v > V_REST) {
    const bounceTime = (2 * v) / GRAVITY;
    if (tt < bounceTime) {
      return restY + v * tt - 0.5 * GRAVITY * tt * tt;
    }
    tt -= bounceTime;
    v *= e;
  }
  return restY;
}

/** Thời điểm một vật nằm hẳn xuống sàn. */
export function settleTime(body: FallingBody): number {
  const e = restitutionOf(body.years);
  const fallTime = Math.sqrt((2 * body.drop.height) / GRAVITY);
  let total = body.drop.delay + fallTime;
  let v = GRAVITY * fallTime * e;
  while (v > V_REST) {
    total += (2 * v) / GRAVITY;
    v *= e;
  }
  return total;
}

type LetterChar = "K" | "Y" | "L" | "E";

const LETTER_ROWS: Record<LetterChar, string[]> = {
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  Y: ["10001", "01010", "00100", "00100", "00100", "00100", "00100"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
};

/** Ma trận dot 5×7 của một chữ cái (7 hàng × 5 cột boolean). */
export function letterMatrix(char: LetterChar): boolean[][] {
  return LETTER_ROWS[char].map((row) => [...row].map((cell) => cell === "1"));
}

export interface LetterSpec extends FallingBody {
  char: LetterChar;
  /** Trượt phải theo thứ tự chữ (đơn vị cột dot) */
  offsetX: number;
  /** Ô đặc của chữ: [cột, hàng-từ-dưới] */
  cells: [number, number][];
}

/** "KY LE" rơi trước các đĩa tạ — chữ nặng 10 năm, gần như không nảy. */
export function buildLetters(): LetterSpec[] {
  const chars: LetterChar[] = ["K", "Y", "L", "E"];
  const offsets = [0, 6, 15, 21];
  return chars.map((char, index) => {
    const matrix = letterMatrix(char);
    const cells: [number, number][] = [];
    matrix.forEach((row, rowIndex) => {
      row.forEach((filled, colIndex) => {
        if (filled) cells.push([colIndex, 6 - rowIndex]);
      });
    });
    return {
      char,
      offsetX: offsets[index],
      cells,
      years: 10,
      drop: { height: 7 + index * 0.3, delay: index * 0.14 },
      rest: [0, 0, 0],
    };
  });
}
