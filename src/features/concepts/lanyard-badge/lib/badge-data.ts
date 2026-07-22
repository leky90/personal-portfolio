/**
 * The Credential: thẻ hội thảo treo dây với vật lý con lắc THUẦN —
 * một phương trình θ'' = -(g/L)sinθ - cθ' tích phân semi-implicit,
 * test được từng bước, không physics engine. Mọi dòng in trên thẻ là
 * dữ liệu in trên thẻ là hồ sơ nghề thật, không phải chữ trang trí.
 */

export const BADGE_FRONT = {
  name: "KY LE DINH",
  title: "SENIOR SOFTWARE ENGINEER · FRONTEND LEAD",
  /** Nhận job freelance đầu tiên trên Freelancer.com từ 11/07/2012 */
  est: "EST. 2012",
};

/**
 * Mặt sau thẻ: spec sheet kiểu terminal. Mọi con số lấy từ hồ sơ công khai —
 * Freelancer.com (@Leky90) và vai trò hiện tại ở Treehouse. Không có số nào bịa.
 */
export const BADGE_SPECS = [
  "rating = 4.9/5 · 125 reviews (freelancer.com)",
  "on_time = 99% · on_budget = 100%",
  "team.led = 8 engineers @ treehouse",
  "stack.core = react · typescript · next.js · node",
  "domain = defi / rwa · ethers.js · wallet integration",
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
