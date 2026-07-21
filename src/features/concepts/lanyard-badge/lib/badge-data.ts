/**
 * The Credential: thẻ hội thảo treo dây với vật lý con lắc THUẦN —
 * một phương trình θ'' = -(g/L)sinθ - cθ' tích phân semi-implicit,
 * test được từng bước, không physics engine. Mọi dòng in trên thẻ là
 * dữ liệu build-time thật (bản chính thức lấy từ GitHub API lúc SSG).
 */

export const BADGE_FRONT = {
  name: "KY LE",
  title: "FULL-STACK ENGINEER",
  est: "EST. 2016",
};

/** Mặt sau thẻ: spec sheet kiểu terminal — demo dùng số liệu tĩnh. */
export const BADGE_SPECS = [
  "commits.total = 18_403",
  "languages.top = ts · go · sql",
  "uptime.watched = 99.95%",
  "teams.led = 3",
  "mentees.active = 6",
  "status = open_to_interesting_problems",
];

export const PENDULUM = {
  /** g/L gộp sẵn — tần số lắc của dây đeo */
  gravity: 22,
  damping: 1.1,
};

/**
 * Một bước con lắc (semi-implicit Euler): trả [θ mới, ω mới].
 * Điểm cân bằng (0,0) bất động tuyệt đối để demand ngủ được.
 */
export function pendulumStep(
  theta: number,
  omega: number,
  dt: number,
): [number, number] {
  if (theta === 0 && omega === 0) return [0, 0];
  const acceleration =
    -PENDULUM.gravity * Math.sin(theta) - PENDULUM.damping * omega;
  const nextOmega = omega + acceleration * dt;
  const nextTheta = theta + nextOmega * dt;
  if (Math.abs(nextTheta) < 1e-4 && Math.abs(nextOmega) < 1e-3) {
    return [0, 0];
  }
  return [nextTheta, nextOmega];
}
