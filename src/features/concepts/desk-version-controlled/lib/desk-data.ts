/**
 * Chiếc bàn được version-control: mỗi đồ vật là một commit có birth/
 * death trên timeline 2012→2026, mọi animation là hàm thuần của MỘT
 * giá trị progress (scrub-safe, demand-safe). Dữ liệu bám đúng bốn
 * chặng nghề thật: freelance PHP ở Huế (2012), văn phòng Synova ở
 * TP.HCM (2017), remote TESO ở Huế (2019), lead frontend Treehouse
 * (08/2021). Câu chuyện nằm ở chỗ 2026 ÍT đồ hơn 2019 — trưởng thành
 * là refactor bớt đi.
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
    commit: "chore(desk): khởi tạo góc làm việc ở Huế",
    story: "Mặt bàn đầu tiên, 2012, trong một căn phòng ở Huế. Mọi thứ khác đến rồi đi; riêng mặt bàn chỉ được refactor chứ chưa lần nào bị thay.",
    birth: 0,
    death: 1,
    kind: "box",
    material: "wood",
    position: [0, 0, 0],
    size: [4.4, 0.12, 2.2],
  },
  {
    id: "laptop-freelance",
    label: "laptop cũ",
    commit: "feat(desk): laptop cũ, máy duy nhất",
    story: "Cỗ máy độc nhất suốt thời freelance PHP. Tài khoản Freelancer mở ngày 11/07/2012 và mọi job đầu đời đều chạy trên đúng cái máy này. Nó chỉ nghỉ khi tôi chuyển hẳn sang stack JavaScript.",
    birth: 0,
    death: 0.52,
    kind: "box",
    material: "plastic",
    position: [-1.1, 0.31, 0.25],
    size: [1.15, 0.5, 0.8],
  },
  {
    id: "php-book",
    label: "sách PHP & WordPress",
    commit: "docs(desk): sách PHP và WordPress gối đầu",
    story: "Nghề bắt đầu từ PHP và WordPress, học bằng sách giấy vì không có ai kèm. Đọc hết thật. Nghỉ hưu khi tài liệu sống chuyển hẳn lên docs online và source code.",
    birth: 0.02,
    death: 0.56,
    kind: "box",
    material: "paper",
    position: [2.0, 0.16, -0.55],
    size: [0.55, 0.14, 0.75],
  },
  {
    id: "sticky-notes",
    label: "sticky note theo job",
    commit: "feat(desk): dán todo của từng job khách",
    story: "Mỗi tờ là một job đang chạy: sửa cross-browser, kê lại responsive cho mobile, chờ khách duyệt. Người làm một mình thì giấy nhớ là đủ; có team rồi thì backlog phải sống ở nơi ai cũng nhìn thấy.",
    birth: 0.04,
    death: 0.6,
    kind: "box",
    material: "paper",
    position: [1.7, 0.1, 0.65],
    size: [0.55, 0.02, 0.55],
  },
  {
    id: "noodle-cup",
    label: "cốc mì deadline",
    commit: "chore(desk): mì tôm ăn tại bàn",
    story: "Deadline freelance nghĩa là ăn tối tại bàn. Bỏ được khi tôi hiểu tỉ lệ giao đúng hạn 99% đến từ ước lượng chuẩn, không phải từ việc thức khuya thêm.",
    birth: 0.05,
    death: 0.55,
    kind: "cyl",
    material: "paper",
    position: [-2.0, 0.2, -0.6],
    size: [0.22, 0.28, 0.22],
  },
  {
    id: "cable-mess",
    label: "búi dây lộ thiên",
    commit: "chore(desk): dây nhợ chạy khắp mặt bàn",
    story: "Không ai commit búi dây, nó tự mọc ra. Món nợ kỹ thuật đúng nghĩa vật lý, phải tới đợt dựng lại cả cái bàn mới trả xong.",
    birth: 0.03,
    death: 0.68,
    kind: "cyl",
    material: "plastic",
    position: [0.1, 0.08, 0.85],
    size: [1.6, 0.05, 0.3],
  },
  {
    id: "monitor-secondhand",
    label: "màn secondhand",
    commit: "feat(desk): thêm màn hình mua lại",
    story: "Màn ngoài đầu tiên, mua lại của người khác. Từ đây tôi hiểu diện tích màn hình là năng suất chứ không phải trang trí, và bài học đó quyết định mọi lần bày bàn về sau.",
    birth: 0.08,
    death: 0.62,
    kind: "box",
    material: "screen",
    position: [0.7, 0.62, -0.5],
    size: [1.05, 0.72, 0.07],
  },
  {
    id: "test-phone",
    label: "giá điện thoại test",
    commit: "feat(desk): giá điện thoại test responsive",
    story: "Phần việc được giao nhiều nhất thời đầu là cross-browser và responsive mobile, nên mọi giao diện đều phải xem trên máy thật trước khi giao khách. Sau này simulator đủ tốt để nó nghỉ.",
    birth: 0.12,
    death: 0.8,
    kind: "box",
    material: "metal",
    position: [1.5, 0.16, 0.15],
    size: [0.28, 0.24, 0.2],
  },
  {
    id: "office-badge",
    label: "thẻ nhân viên",
    commit: "feat(desk): thẻ nhân viên văn phòng TP.HCM",
    story: "2017 rời Huế vào Synova làm full-stack on-site: Laravel, CakePHP, CodeIgniter, Zend, Yii, WordPress, Magento. Hai năm đi làm có thẻ, rồi cái thẻ biến mất khi tôi quay lại làm từ xa.",
    birth: 0.36,
    death: 0.5,
    kind: "box",
    material: "plastic",
    position: [-1.62, 0.1, 0.72],
    size: [0.34, 0.02, 0.5],
  },
  {
    id: "framework-stack",
    label: "chồng doc framework",
    commit: "docs(desk): chồng tài liệu framework PHP",
    story: "Mỗi khách một framework khác nhau nên bàn luôn có một chồng tài liệu. Hai năm on-site dạy tôi đọc codebase lạ nhanh hơn viết codebase mới, và đó là kỹ năng còn dùng tới giờ.",
    birth: 0.38,
    death: 0.64,
    kind: "box",
    material: "paper",
    position: [-1.9, 0.24, 0.05],
    size: [0.5, 0.3, 0.7],
  },
  {
    id: "desk-frame",
    label: "khung bàn mới",
    commit: "refactor(desk): thay khung, giữ nguyên mặt gỗ",
    story: "2019 về Huế làm remote cho TESO, lần đầu đầu tư nghiêm túc vào chỗ ngồi: giữ nguyên mặt bàn cũ, thay toàn bộ khung bên dưới. Đúng nghĩa đổi nền mà không đổi API.",
    birth: 0.48,
    death: 1,
    kind: "box",
    material: "metal",
    position: [0, -0.42, 0],
    size: [4.0, 0.08, 1.8],
  },
  {
    id: "monitor-main",
    label: "màn chính",
    commit: "feat(desk): màn chính cho setup remote",
    story: "Làm từ xa nghĩa là cái bàn này chính là văn phòng. Màn này sống lâu nhất trên bàn, đi cùng đúng quãng tôi chuyển hẳn sang JavaScript và React.",
    birth: 0.48,
    death: 1,
    kind: "box",
    material: "screen",
    position: [-0.75, 0.72, -0.55],
    size: [1.15, 0.78, 0.07],
  },
  {
    id: "mech-keyboard",
    label: "bàn phím cơ",
    commit: "feat(desk): bàn phím cơ thay bàn phím kèm máy",
    story: "Gõ cả ngày thì bàn phím là công cụ chính chứ không phải phụ kiện. Mua một lần, giữ tới giờ, và là khoản chi cho sức khoẻ hời nhất tôi từng quyết.",
    birth: 0.5,
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
    story: "Nghe màu mè nhưng nó là cái mốc: từ 2019 tôi coi chỗ ngồi này là nơi ở lâu dài chứ không phải trạm dừng giữa hai hợp đồng.",
    birth: 0.52,
    death: 1,
    kind: "cyl",
    material: "wood",
    position: [2.05, 0.28, 0.5],
    size: [0.24, 0.42, 0.24],
  },
  {
    id: "legacy-binder",
    label: "sổ ghi chú legacy",
    commit: "docs(desk): sổ ghi chú refactor codebase cũ",
    story: "Việc tôi chủ trì ở TESO là tối ưu và bảo trì codebase legacy. Sổ này chép chỗ nào đã đụng, chỗ nào chưa có gì bảo vệ. Nó chết khi ghi chú riêng biến thành tài liệu chung của cả team.",
    birth: 0.54,
    death: 0.74,
    kind: "box",
    material: "paper",
    position: [-1.85, 0.1, 0.55],
    size: [0.7, 0.03, 0.5],
  },
  {
    id: "monitor-dashboard",
    label: "màn dashboard on-chain",
    commit: "feat(desk): màn thứ hai cho dashboard on-chain",
    story: "08/2021 vào Treehouse làm dApp DeFi/RWA: một màn để code, một màn treo dashboard giá, yield và TVL của tETH. Liếc sang phải là biết thị trường đang thế nào.",
    birth: 0.64,
    death: 1,
    kind: "box",
    material: "screen",
    position: [0.75, 0.72, -0.55],
    size: [1.15, 0.78, 0.07],
  },
  {
    id: "mic-arm",
    label: "mic arm",
    commit: "feat(desk): mic arm cho standup và pair programming",
    story: "Lead một đội 8 kỹ sư từ xa, công ty ở Singapore: ngày nào cũng review, workshop chia sẻ và pair programming. Âm thanh tốt là phép lịch sự tối thiểu với người ngồi đầu kia.",
    birth: 0.66,
    death: 1,
    kind: "cyl",
    material: "metal",
    position: [-1.9, 0.75, -0.35],
    size: [0.07, 1.0, 0.07],
  },
  {
    id: "hardware-wallet",
    label: "ví cứng",
    commit: "feat(desk): ví cứng để thử giao dịch on-chain",
    story: "Tích hợp ví và đọc/ghi on-chain qua Ethers.js thì phải tự cầm khoá mà thử. Vật nhỏ nhất trên bàn nhưng là thứ dạy tôi cẩn thận nhất: ở đây không có nút undo.",
    birth: 0.7,
    death: 1,
    kind: "box",
    material: "metal",
    position: [1.3, 0.13, 0.5],
    size: [0.18, 0.06, 0.34],
  },
  {
    id: "whiteboard",
    label: "whiteboard kiến trúc",
    commit: "feat(desk): whiteboard kiến trúc sau lưng",
    story: "Thứ giá trị nhất không nằm trên bàn: kiến trúc front-end và coding standards được vẽ tay ở đây trước, rồi mới thành tài liệu onboarding cho người mới.",
    birth: 0.74,
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
    year: 2012,
    t: 0,
    accent: "#d97b53",
    note: "Freelance ở Huế: PHP, WordPress, HTML/CSS/JS, lo cross-browser và responsive cho khách. Một laptop, một chồng sách, và mọi commit đều là thêm vào.",
  },
  {
    year: 2017,
    t: 0.36,
    accent: "#2dd4bf",
    note: "Vào văn phòng TP.HCM ở Synova làm full-stack: từ design tĩnh tới web động gắn API, mỗi khách một framework PHP khác nhau. Bàn có thêm thẻ nhân viên và một chồng tài liệu.",
  },
  {
    year: 2019,
    t: 0.5,
    accent: "#a78bfa",
    note: "Về Huế làm remote cho TESO: chuyển hẳn sang JavaScript/React, sở hữu dự án khách end-to-end và bắt đầu dẫn dắt đồng đội. Cái bàn được dựng lại tử tế vì nó chính là văn phòng.",
  },
  {
    year: 2021,
    t: 0.64,
    accent: "#4af2a1",
    note: "Treehouse: lead frontend một đội 8 kỹ sư cho dApp DeFi/RWA. Thêm màn dashboard on-chain, thêm mic cho họp remote, và bớt hẳn giấy. Trưởng thành đọc được bằng số đồ bị remove.",
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

/** Số năm timeline phủ: 2012 (job freelance đầu tiên) → 2026 (hôm nay). */
const YEAR_SPAN = 14;

/** Năm hiển thị trên ticker: 0 → 2012, 1 → 2026. */
export function yearAt(t: number): number {
  return 2012 + Math.round(Math.min(Math.max(t, 0), 1) * YEAR_SPAN);
}
