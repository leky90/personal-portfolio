/**
 * Weight of Experience: khối lượng LÀ dữ liệu — mỗi công nghệ nặng đúng
 * số năm tôi đã dùng nó, tính đến 2026. Demo không chở physics engine:
 * rơi + nảy là mô hình ballistic closed-form thuần (test được),
 * restitution giảm theo khối lượng nên đĩa 12 năm rơi thịch còn đĩa 3
 * năm nảy tưng. Bản chính thức thay bằng Rapier bake replay ~70KB, giữ
 * nguyên schema.
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

/**
 * Số năm suy thẳng từ bốn chặng nghề (mốc bắt đầu đi làm: 2014, mốc
 * chốt: 2026):
 *   2014–2016 freelance (Huế) · 2017–2018 Synova · 2019–2021 TESO ·
 *   08/2021–nay Treehouse.
 * Quy tắc: years = 2026 − max(2014, năm bắt đầu dùng); công nghệ đã
 * gác thì dừng đếm ở năm cuối thực sự dùng. Nặng xếp trước (index 0
 * nằm giữa sàn).
 */
const RAW: [id: string, name: string, years: number][] = [
  // 2014→nay: viết JS từ ngày đi làm, chưa ngày nào bỏ → 2026 − 2014 = 12.
  ["javascript", "JavaScript", 12],
  // 2014→nay: khởi nghiệp freelance bằng PHP, qua Synova, vẫn trong stack backend → 2026 − 2014 = 12.
  ["php", "PHP", 12],
  // 2014→nay: mốc mở tài khoản github.com/leky90 — từ đó mọi việc đều qua Git → 2026 − 2014 = 12.
  ["git", "Git", 12],
  // 2017→nay: vào Synova là bắt đầu Laravel, đến giờ vẫn giữ trong stack backend.
  ["laravel", "Laravel", 9],
  // 2019→nay: TESO chuyển hẳn sang JavaScript/React, rồi thành dApp ở Treehouse.
  ["react", "React", 7],
  // 2019→nay: cùng nhịp với React — tooling, API service, Express/NestJS.
  ["node", "Node.js", 7],
  // 2014–2018: xương sống mọi site freelance, gác khi rời stack PHP ở Synova → dừng đếm 2018, còn 5.
  ["jquery", "jQuery", 5],
  // 2014–2018: dựng và bảo trì site khách bằng WordPress, hết thời Synova là gác → dừng đếm 2018, còn 5.
  ["wordpress", "WordPress", 5],
  // 08/2021→nay: Treehouse là nơi TypeScript thành mặc định, không quay lại JS trần.
  ["typescript", "TypeScript", 5],
  // 08/2021→nay: dApp tETH dựng trên Next.js ngay từ ngày đầu.
  ["nextjs", "Next.js", 5],
  // 08/2021→nay: wallet integration + đọc/ghi on-chain cho tAssets đều qua Ethers.
  ["ethers", "Ethers.js", 5],
  // Hồ sơ không ghi mốc; ước lượng từ 2023 — giai đoạn API LLM vào việc thật.
  ["openai", "OpenAI API", 3],
];

const GOLDEN_ANGLE = 2.39996;

/**
 * 12 đĩa tạ, nặng xếp giữa sàn (spiral golden-angle), nhẹ văng rìa.
 * Hệ số radius/thickness ánh xạ miền năm thật 3..14 về đúng khoảng
 * kích thước cũ (~0.41..0.83 và ~0.15..0.34) để khung hình không đổi.
 */
export const SKILLS: SkillToken[] = RAW.map(([id, name, years], index) => {
  const thickness = 0.1 + years * 0.017;
  const spiralRadius = 0.55 + index * 0.33;
  const angle = index * GOLDEN_ANGLE;
  return {
    id,
    name,
    years,
    radius: 0.3 + years * 0.038,
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

const MIN_YEARS = Math.min(...SKILLS.map((skill) => skill.years));
const MAX_YEARS = Math.max(...SKILLS.map((skill) => skill.years));

/**
 * Vị trí của một khối lượng trong bảng: 0 = nhẹ nhất, 1 = nặng nhất.
 * Thang màu xám của scene ăn số này thay vì hằng số miền cứng, nên
 * miền năm thật (3..14) đổi thế nào cũng không tràn khỏi dải màu.
 */
export function massRatio(years: number): number {
  const span = MAX_YEARS - MIN_YEARS;
  if (span <= 0) return 0;
  return Math.min(Math.max((years - MIN_YEARS) / span, 0), 1);
}

/**
 * Hệ số nảy: nhẹ nảy tưng (~0.5 ở 3 năm), nặng rơi thịch (~0.25 ở 14
 * năm). Hằng số căn lại theo miền năm thật 3..14 để giữ nguyên độ
 * tương phản nảy như khi miền còn là 1..9.
 */
export function restitutionOf(years: number): number {
  return Math.min(Math.max(0.15 + 1.6 / (years + 1.6), 0.15), 0.75);
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

/** "KY LE" rơi trước các đĩa tạ — chữ lấy khối lượng của đĩa nặng nhất
 * trong bảng (12 năm) nên chạm sàn là nằm im, gần như không nảy. */
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
      years: 12,
      drop: { height: 7 + index * 0.3, delay: index * 0.14 },
      rest: [0, 0, 0],
    };
  });
}
