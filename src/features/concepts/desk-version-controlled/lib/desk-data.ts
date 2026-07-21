/**
 * Chiếc bàn được version-control: mỗi đồ vật là một commit có birth/
 * death trên timeline 2016→2026, mọi animation là hàm thuần của MỘT
 * giá trị progress (scrub-safe, demand-safe). Câu chuyện nằm ở chỗ
 * 2026 ÍT đồ hơn 2019 — trưởng thành là refactor bớt đi.
 */

export type DeskMaterialKey =
  | "wood"
  | "plastic"
  | "metal"
  | "screen"
  | "paper";

export interface DeskObject {
  id: string;
  label: string;
  /** Conventional commit khi đồ vật xuất hiện */
  commit: string;
  /** Micro-ADR: lý do, không chỉ là cái gì */
  story: string;
  /** Mốc xuất hiện trên timeline [0,1) */
  birth: number;
  /** Mốc biến mất (1 = sống tới 2026] */
  death: number;
  kind: "box" | "cyl";
  material: DeskMaterialKey;
  position: [number, number, number];
  size: [number, number, number];
}

export const DESK_OBJECTS: DeskObject[] = [
  {
    id: "desk-slab",
    label: "mặt bàn",
    commit: "chore(desk): dựng góc làm việc đầu tiên",
    story: "Cái bàn gỗ ép 2016. Mọi thứ khác đến rồi đi, mặt bàn thì được refactor chứ không bị thay.",
    birth: 0,
    death: 1,
    kind: "box",
    material: "wood",
    position: [0, 0, 0],
    size: [4.4, 0.12, 2.2],
  },
  {
    id: "laptop-2016",
    label: "laptop 15 inch",
    commit: "feat(desk): laptop công ty nóng ran",
    story: "Máy duy nhất tôi có. Compile lâu tới mức tôi học được thói quen đọc code người khác trong lúc chờ.",
    birth: 0,
    death: 0.38,
    kind: "box",
    material: "plastic",
    position: [-1.1, 0.31, 0.25],
    size: [1.15, 0.5, 0.8],
  },
  {
    id: "monitor-19",
    label: "màn 19 inch secondhand",
    commit: "feat(desk): thêm màn 19 inch mua lại",
    story: "Màn ngoài đầu tiên. Từ đây tôi hiểu real-estate màn hình là năng suất, và bắt đầu tiết kiệm cho màn thứ hai.",
    birth: 0.02,
    death: 0.4,
    kind: "box",
    material: "screen",
    position: [0.7, 0.62, -0.5],
    size: [1.05, 0.72, 0.07],
  },
  {
    id: "sticky-notes",
    label: "rừng sticky note",
    commit: "feat(desk): dán todo lên mọi mặt phẳng",
    story: "Task tracking 2016 là giấy nhớ. Chết năm 2021 khi tôi nhận ra backlog phải sống ở nơi cả team nhìn thấy.",
    birth: 0.04,
    death: 0.58,
    kind: "box",
    material: "paper",
    position: [1.7, 0.1, 0.65],
    size: [0.55, 0.02, 0.55],
  },
  {
    id: "noodle-cup",
    label: "cốc mì deadline",
    commit: "chore(desk): mì tôm ăn tại bàn",
    story: "2016: deadline nghĩa là ăn tối tại bàn. Bỏ được năm 2019 — bài học sức bền đầu tiên của nghề.",
    birth: 0.05,
    death: 0.3,
    kind: "cyl",
    material: "paper",
    position: [-2.0, 0.2, -0.6],
    size: [0.22, 0.28, 0.22],
  },
  {
    id: "js-book",
    label: "cuốn JS 800 trang",
    commit: "docs(desk): gối đầu giường JavaScript",
    story: "Đọc hết thật. Nghỉ hưu năm 2021 khi tài liệu sống chuyển hẳn lên MDN và source code.",
    birth: 0.06,
    death: 0.52,
    kind: "box",
    material: "paper",
    position: [2.0, 0.16, -0.55],
    size: [0.55, 0.14, 0.75],
  },
  {
    id: "cable-mess",
    label: "búi dây lộ thiên",
    commit: "chore(desk): dây nhợ chạy khắp mặt bàn",
    story: "Không ai commit búi dây, nó tự xuất hiện. Được 'trả nợ' năm 2022 cùng đợt nâng bàn đứng.",
    birth: 0.03,
    death: 0.66,
    kind: "cyl",
    material: "plastic",
    position: [0.1, 0.08, 0.85],
    size: [1.6, 0.05, 0.3],
  },
  {
    id: "monitor-left",
    label: "màn đôi trái",
    commit: "feat(desk): lên đời màn đôi",
    story: "2019: một màn code, một màn dashboard. Cặp đôi này sống tới khi ultrawide gộp cả hai.",
    birth: 0.32,
    death: 0.68,
    kind: "box",
    material: "screen",
    position: [-0.75, 0.72, -0.55],
    size: [1.15, 0.78, 0.07],
  },
  {
    id: "monitor-right",
    label: "màn đôi phải",
    commit: "feat(desk): màn thứ hai cho dashboard",
    story: "Grafana thường trực bên phải suốt ba năm on-call. Nhìn nó là biết đêm nay ngủ được không.",
    birth: 0.34,
    death: 0.68,
    kind: "box",
    material: "screen",
    position: [0.75, 0.72, -0.55],
    size: [1.15, 0.78, 0.07],
  },
  {
    id: "mech-keyboard",
    label: "bàn phím cơ split",
    commit: "feat(desk): bàn phím split sau lần đau cổ tay",
    story: "RSI scare 2019. Đổi sang split, giữ nguyên nó bảy năm — quyết định sức khoẻ tốt nhất sự nghiệp.",
    birth: 0.36,
    death: 1,
    kind: "box",
    material: "plastic",
    position: [0, 0.13, 0.35],
    size: [1.25, 0.1, 0.45],
  },
  {
    id: "plant",
    label: "chậu trầu bà",
    commit: "feat(desk): một sinh vật sống trên bàn",
    story: "Nghe thì màu mè nhưng nó là cái mốc: 2019 tôi bắt đầu coi chỗ ngồi là nơi ở lâu dài, không phải trạm dừng.",
    birth: 0.38,
    death: 1,
    kind: "cyl",
    material: "wood",
    position: [2.05, 0.28, 0.5],
    size: [0.24, 0.42, 0.24],
  },
  {
    id: "kanban-notes",
    label: "kanban giấy",
    commit: "feat(desk): kanban ba cột bằng giấy",
    story: "Todo/Doing/Done dán mép màn. Chết khi tôi lead team 2022 — board phải là của team, không phải của bàn tôi.",
    birth: 0.4,
    death: 0.72,
    kind: "box",
    material: "paper",
    position: [-1.85, 0.1, 0.55],
    size: [0.7, 0.02, 0.5],
  },
  {
    id: "phone-stand",
    label: "giá đỡ điện thoại",
    commit: "feat(desk): giá test mobile-first",
    story: "Thời kỳ mobile-api: mọi PR đều xem trên máy thật trước khi merge. Về sau simulator đủ tốt để nó nghỉ.",
    birth: 0.42,
    death: 0.75,
    kind: "box",
    material: "metal",
    position: [1.5, 0.16, 0.15],
    size: [0.28, 0.24, 0.2],
  },
  {
    id: "standing-frame",
    label: "khung bàn đứng",
    commit: "refactor(desk): nâng cả mặt bàn lên chân điện",
    story: "Refactor lớn nhất của chiếc bàn: giữ nguyên mặt gỗ cũ, thay toàn bộ khung — đúng nghĩa đổi nền không đổi API.",
    birth: 0.62,
    death: 1,
    kind: "box",
    material: "metal",
    position: [0, -0.42, 0],
    size: [4.0, 0.08, 1.8],
  },
  {
    id: "ultrawide",
    label: "màn ultrawide",
    commit: "refactor(desk): gộp màn đôi thành một ultrawide",
    story: "Hai màn thành một: ít bezel hơn, ít cáp hơn, một quyết định 'bớt đi' điển hình của 2022.",
    birth: 0.64,
    death: 1,
    kind: "box",
    material: "screen",
    position: [0, 0.78, -0.55],
    size: [2.5, 0.9, 0.08],
  },
  {
    id: "mic-arm",
    label: "mic arm",
    commit: "feat(desk): mic arm cho call mentoring",
    story: "2022 lịch tuần có tám tiếng call kèm cặp. Âm thanh tốt là phép lịch sự tối thiểu với người nghe.",
    birth: 0.66,
    death: 1,
    kind: "cyl",
    material: "metal",
    position: [-1.9, 0.75, -0.35],
    size: [0.07, 1.0, 0.07],
  },
  {
    id: "homelab",
    label: "rack homelab mini",
    commit: "feat(desk): rack homelab dưới bàn",
    story: "Ba năm nghịch k8s tại nhà. Remove năm 2025 khi mọi thí nghiệm chuyển lên cloud — tri thức ở lại, tiếng quạt thì không.",
    birth: 0.68,
    death: 0.92,
    kind: "box",
    material: "plastic",
    position: [1.9, -0.15, -0.4],
    size: [0.55, 0.6, 0.5],
  },
  {
    id: "eink-tablet",
    label: "máy e-ink",
    commit: "feat(desk): e-ink đọc RFC không notification",
    story: "Màn hình duy nhất trên bàn không thể mở Slack. Đọc sâu là kỹ năng phải được bảo vệ bằng phần cứng.",
    birth: 0.86,
    death: 1,
    kind: "box",
    material: "paper",
    position: [1.35, 0.12, 0.45],
    size: [0.5, 0.03, 0.65],
  },
  {
    id: "whiteboard",
    label: "whiteboard kiến trúc",
    commit: "feat(desk): whiteboard sau lưng cho sơ đồ",
    story: "2026: thứ giá trị nhất trên 'bàn' không nằm trên bàn — là sơ đồ kiến trúc vẽ tay sau lưng, nơi mọi cuộc họp bắt đầu.",
    birth: 0.88,
    death: 1,
    kind: "box",
    material: "paper",
    position: [0, 1.1, -1.5],
    size: [3.0, 1.5, 0.06],
  },
];

export interface DeskEra {
  year: number;
  t: number;
  accent: string;
  note: string;
}

export const ERAS: DeskEra[] = [
  {
    year: 2016,
    t: 0,
    accent: "#d97b53",
    note: "Junior: mọi thứ đều thêm vào. Laptop nóng, mì tôm, sticky note — bàn càng đầy càng thấy mình chăm.",
  },
  {
    year: 2019,
    t: 0.33,
    accent: "#2dd4bf",
    note: "Mid: bắt đầu đầu tư vào công cụ sống lâu — bàn phím split sau RSI scare, màn đôi, và một chậu cây.",
  },
  {
    year: 2022,
    t: 0.66,
    accent: "#a78bfa",
    note: "Lead: refactor lớn — bàn đứng, ultrawide gộp màn đôi, mic arm cho tám tiếng mentoring mỗi tuần.",
  },
  {
    year: 2026,
    t: 1,
    accent: "#4af2a1",
    note: "Staff: bàn gần trống. Thứ giá trị nhất là whiteboard sau lưng. Trưởng thành đọc được bằng số đồ bị remove.",
  },
];

const POP_WINDOW = 0.08;
const FADE_WINDOW = 0.06;

/** Scale của một object tại tiến độ t: pop khi sinh, co lại khi chết. */
export function popScale(object: DeskObject, t: number): number {
  if (t < object.birth || t >= object.death) return 0;

  const born = Math.min((t - object.birth) / POP_WINDOW, 1);
  const back = born - 1;
  const pop = 1 + 2.2 * back * back * back + 1.2 * back * back;

  const fade = Math.min((object.death - t) / FADE_WINDOW, 1);
  return Math.max(pop, 0) * fade;
}

interface DeskEvent {
  t: number;
  message: string;
}

const EVENTS: DeskEvent[] = [
  ...DESK_OBJECTS.map((object) => ({
    t: object.birth,
    message: object.commit,
  })),
  ...DESK_OBJECTS.filter((object) => object.death < 1).map((object) => ({
    t: object.death,
    message: `refactor(desk): remove ${object.id}`,
  })),
].sort((a, b) => a.t - b.t);

/** Commit gần nhất đã xảy ra tính tới tiến độ t. */
export function latestCommit(t: number): string {
  let message = EVENTS[0].message;
  for (const event of EVENTS) {
    if (event.t <= Math.max(t, 0)) message = event.message;
  }
  return message;
}

/** Năm hiển thị trên ticker: 0 → 2016, 1 → 2026. */
export function yearAt(t: number): number {
  return 2016 + Math.round(Math.min(Math.max(t, 0), 1) * 10);
}
