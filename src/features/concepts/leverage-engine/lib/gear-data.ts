import * as THREE from "three";

/**
 * Hộp số đòn bẩy: 1 crank 48 răng → 4 chuỗi compound (mid + gear đồng
 * trục to hơn ở lớp z sau) → 4 đầu ra. Động học thuần toán trên một
 * DAG: tốc độ nhân -(răng cha / răng con) qua mỗi mesh, gear đồng trục
 * đồng tốc. Vị trí SUY RA từ góc đặt + tổng bán kính pitch nên khoảng
 * cách ăn khớp đúng theo cấu tạo — và được khoá bằng test.
 */

/** Module bánh răng (world unit / răng) — mọi gear ăn khớp phải chung module */
export const MODULE_M = 0.11;

interface GearSpec {
  id: string;
  teeth: number;
  /** Đồng trục (đồng tốc) với gear này — nằm ở lớp z sau */
  coaxialWith?: string;
  /** Ăn khớp với gear này */
  drivenBy?: string;
  /** Góc đặt tâm so với gear cha (radian) */
  angleFromParent?: number;
}

const SPECS: GearSpec[] = [
  { id: "crank", teeth: 48 },

  { id: "mid-mentor", teeth: 24, drivenBy: "crank", angleFromParent: 1.31 },
  { id: "coax-mentor", teeth: 40, coaxialWith: "mid-mentor" },
  { id: "out-mentor", teeth: 10, drivenBy: "coax-mentor", angleFromParent: 0.35 },

  { id: "mid-docs", teeth: 16, drivenBy: "crank", angleFromParent: 0.44 },
  { id: "coax-docs", teeth: 40, coaxialWith: "mid-docs" },
  { id: "out-docs", teeth: 10, drivenBy: "coax-docs", angleFromParent: 0 },

  { id: "mid-standards", teeth: 12, drivenBy: "crank", angleFromParent: -0.44 },
  { id: "coax-standards", teeth: 40, coaxialWith: "mid-standards" },
  { id: "out-standards", teeth: 10, drivenBy: "coax-standards", angleFromParent: -0.35 },

  { id: "mid-review", teeth: 12, drivenBy: "crank", angleFromParent: -1.31 },
  { id: "coax-review", teeth: 60, coaxialWith: "mid-review" },
  { id: "out-review", teeth: 10, drivenBy: "coax-review", angleFromParent: -0.79 },
];

export interface Gear {
  id: string;
  teeth: number;
  pitchRadius: number;
  position: [number, number];
  /** Lớp z: 0 = mặt trước (crank + mid), 1 = mặt sau (coax + out) */
  layer: number;
  /** Hệ số tốc độ so với crank; dấu = chiều quay */
  speed: number;
  /** Lệch pha nửa răng để răng hai gear cài nhau */
  phase: number;
  drivenBy?: string;
  coaxialWith?: string;
}

/** Dựng cả hộp số: vị trí, tốc độ, pha — thuần dữ liệu cho scene. */
export function buildTrain(): Gear[] {
  const gears = new Map<string, Gear>();

  for (const spec of SPECS) {
    const pitchRadius = (spec.teeth * MODULE_M) / 2;

    if (!spec.drivenBy && !spec.coaxialWith) {
      gears.set(spec.id, {
        id: spec.id,
        teeth: spec.teeth,
        pitchRadius,
        position: [0, 0],
        layer: 0,
        speed: 1,
        phase: 0,
      });
      continue;
    }

    if (spec.coaxialWith) {
      const partner = gears.get(spec.coaxialWith);
      if (!partner) throw new Error(`coaxialWith chưa build: ${spec.id}`);
      gears.set(spec.id, {
        id: spec.id,
        teeth: spec.teeth,
        pitchRadius,
        position: partner.position,
        layer: partner.layer + 1,
        speed: partner.speed,
        phase: partner.phase,
        coaxialWith: spec.coaxialWith,
      });
      continue;
    }

    const parent = gears.get(spec.drivenBy!);
    if (!parent) throw new Error(`drivenBy chưa build: ${spec.id}`);
    const distance = parent.pitchRadius + pitchRadius;
    const angle = spec.angleFromParent ?? 0;
    gears.set(spec.id, {
      id: spec.id,
      teeth: spec.teeth,
      pitchRadius,
      position: [
        parent.position[0] + Math.cos(angle) * distance,
        parent.position[1] + Math.sin(angle) * distance,
      ],
      layer: parent.layer,
      speed: -parent.speed * (parent.teeth / spec.teeth),
      phase: Math.PI / spec.teeth,
      drivenBy: spec.drivenBy,
    });
  }

  return [...gears.values()];
}

export interface EngineOutput {
  gearId: string;
  label: string;
  /**
   * Đòn bẩy đó là gì và đo được tới đâu. Lưu ý: số ×N hiển thị trên
   * trang là TỈ SỐ TRUYỀN của hộp số — động học của mô hình, không phải
   * số đo hiệu quả. Chỗ nào không đo được thì detail nói thẳng là định
   * tính, không dựng metric cho đẹp.
   */
  detail: string;
}

/**
 * Bốn đòn bẩy thật của vai trò lead front-end ở Treehouse (đội 8 kỹ sư,
 * dApp DeFi/RWA): mentoring, tài liệu onboarding, coding standards dùng
 * chung, code review hằng ngày.
 */
export const OUTPUTS: EngineOutput[] = [
  {
    gearId: "out-mentor",
    label: "mentoring đội 8",
    detail:
      "Một buổi pair programming hay workshop chia sẻ chạm tới cả tám kỹ sư trong đội cùng lúc — tám là số người thật, không phải hệ số ước lượng. Sau đó họ đi nhanh hơn bao nhiêu thì mình không có công cụ nào đo, nên không dựng số.",
  },
  {
    gearId: "out-docs",
    label: "tài liệu onboarding",
    detail:
      "Viết một lần, mỗi người mới vào đội đọc lại một lần: kiến trúc front-end, chỗ cắm ví, cách chạy dApp ở local. Thứ thấy được là PR đầu tiên của họ đến sớm hơn hồi chưa có tài liệu — quan sát định tính, chưa bao giờ bấm giờ.",
  },
  {
    gearId: "out-standards",
    label: "coding standards",
    detail:
      "Cấu trúc thư mục, cách đặt tên, chỗ để state, ranh giới component — thống nhất một lần rồi cả stack front-end đi theo. Đòn bẩy nằm ở những tranh luận không phải mở lại; không repo nào đếm được thứ đó.",
  },
  {
    gearId: "out-review",
    label: "code review hằng ngày",
    detail:
      "Review mỗi ngày thay vì dồn cuối sprint, kèm một quy trình QA có cấu trúc. Lỗi bị bắt lúc còn rẻ, và mỗi comment là một lần cách nghĩ được truyền sang người khác — giá trị thật, nhưng không có metric nào của mình đứng sau.",
  },
];

const TRAIN = buildTrain();
const speedOf = (id: string) =>
  TRAIN.find((gear) => gear.id === id)?.speed ?? 0;

/** Tổng đòn bẩy: một vòng tay quay → bao nhiêu vòng đầu ra cộng lại. */
export const TOTAL_LEVERAGE = Math.round(
  OUTPUTS.reduce((sum, output) => sum + Math.abs(speedOf(output.gearId)), 0),
);

/**
 * Profile răng thang (kiểu bản vẽ patent, không phải involute thật —
 * bản chính thức thay bằng generator involute ~80 dòng). 4 điểm/răng.
 */
export function buildGearShape(teeth: number, module: number): THREE.Shape {
  if (teeth < 8) {
    throw new Error(`Gear ${teeth} răng quá nhỏ — tối thiểu 8`);
  }
  const pitchRadius = (teeth * module) / 2;
  const outer = pitchRadius + module * 0.6;
  const root = pitchRadius - module * 0.55;
  const pitch = (Math.PI * 2) / teeth;

  const shape = new THREE.Shape();
  for (let i = 0; i < teeth; i += 1) {
    const a = i * pitch;
    const points: [number, number][] = [
      [Math.cos(a) * root, Math.sin(a) * root],
      [Math.cos(a + pitch * 0.2) * outer, Math.sin(a + pitch * 0.2) * outer],
      [Math.cos(a + pitch * 0.5) * outer, Math.sin(a + pitch * 0.5) * outer],
      [Math.cos(a + pitch * 0.7) * root, Math.sin(a + pitch * 0.7) * root],
    ];
    for (const [x, y] of points) {
      if (i === 0 && x === points[0][0] && y === points[0][1]) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
  }
  shape.closePath();
  return shape;
}
