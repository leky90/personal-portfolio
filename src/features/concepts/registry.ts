export type ConceptStatus = "ready" | "planned";

/** Vòng đề xuất: v1 = 18 concept gốc (07/2026), v2 = 8 concept bổ sung họ "phán đoán kỹ nghệ" */
export type ConceptOrigin = "v1" | "v2";

export type ConceptId =
  | "decision-diff"
  | "monolith-to-mesh"
  | "incident-black-box"
  | "terrain"
  | "maintenance-archaeology"
  | "request-lifecycle"
  | "cost-of-change"
  | "daily-driver"
  | "constraint-prism"
  | "leverage-engine"
  | "living-topology"
  | "gravity-toybox"
  | "resolution"
  | "dependency-constellation"
  | "knowledge-relay"
  | "full-stack-strata"
  | "glyph-field"
  | "monolith"
  | "desk-version-controlled"
  | "commit-skyline"
  | "cabinet-of-shipped-worlds"
  | "compiled-light"
  | "phosphor-lens"
  | "signal-from-noise"
  | "lanyard-badge"
  | "ten-year-galaxy";

export interface ConceptScores {
  overall: number;
  originality: number;
  seniorSignal: number;
  feasibility: number;
  performance: number;
}

export interface ConceptMeta {
  id: ConceptId;
  /** Thứ hạng theo vòng chấm mù thống nhất 2026-07-20 (3 giám khảo, cùng rubric) */
  rank: number;
  title: string;
  /** Tagline tiếng Việt hiển thị trên trang lab */
  tagline: string;
  /** Pitch gốc (EN) từ brief */
  pitch: string;
  status: ConceptStatus;
  origin: ConceptOrigin;
  difficulty: number;
  effortDays: number;
  scores: ConceptScores;
  /** Màu accent đặc trưng (hex) — dùng cho sketch khi concept được build */
  accent: string;
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "decision-diff",
    rank: 1,
    title: "Decision Diff",
    tagline:
      "Mười năm quyết định kiến trúc nén thành một đường ray 3D: mỗi ngã rẽ là một diff sống, nhánh đã chọn đông đặc màu xanh, nhánh không đi treo lơ lửng dạng nét đứt đỏ kèm chi phí ước tính. Chạm vào bóng ma để nhìn thấy tương lai đã không xảy ra.",
    pitch:
      "A decade of architecture decisions compiled into a walkable 3D rail: at every fork the chosen path solidifies in diff-green while the road not taken hangs beside it as a dashed red ghost you can materialize, estimated cost and all.",
    status: "ready",
    origin: "v2",
    difficulty: 4,
    effortDays: 7,
    scores: { overall: 8.7, originality: 8.0, seniorSignal: 9.0, feasibility: 8.0, performance: 8.7 },
    accent: "#4ade80",
  },
  {
    id: "monolith-to-mesh",
    rank: 2,
    title: "Monolith to Mesh",
    tagline:
      "Khối kiến trúc nguyên khối bị cắt thành từng service mang tên thật, tách rời rồi tự đan lại thành service mesh khi bạn cuộn qua 10 năm quyết định kiến trúc. Có cả lần tách sai phải gộp ngược lại, vì lộ trình kiến trúc thật không bao giờ là chuyện thắng lợi một chiều.",
    pitch:
      "A graphite monolith kerf-cut into ~40 named services fractures apart and reweaves into a pulsing service mesh as you scroll a decade of real architecture decisions, including the premature split that visibly drifts back and fuses again.",
    status: "ready",
    origin: "v2",
    difficulty: 4,
    effortDays: 7,
    scores: { overall: 8.7, originality: 8.0, seniorSignal: 9.0, feasibility: 7.7, performance: 9.0 },
    accent: "#9aa5ff",
  },
  {
    id: "incident-black-box",
    rank: 3,
    title: "Incident Black Box",
    tagline:
      "Tua lại một sự cố production như đọc hộp đen máy bay: từng tín hiệu, từng cảnh báo, từng quyết định lần lượt đi qua vạch đọc theo cuộn băng thời gian. Mười năm trực chiến được kể lại bằng một bản postmortem không đổ lỗi.",
    pitch:
      "A real SEV-1 replayed as a physical flight-recorder tape: scroll scrubs glowing telemetry through a fixed playhead as alerts fire, decisions land, and the ending pulls back into the hindsight postmortem view where the whole incident's shape is visible at once.",
    status: "ready",
    origin: "v2",
    difficulty: 3,
    effortDays: 9,
    scores: { overall: 8.3, originality: 8.0, seniorSignal: 9.0, feasibility: 8.0, performance: 8.7 },
    accent: "#ff8a3d",
  },
  {
    id: "terrain",
    rank: 4,
    title: "Ten Years of Terrain",
    tagline:
      "10 năm sự nghiệp bake thành data texture rồi extrude thành địa hình ridgeline ~300 đường contour. Cuộn timeline là camera bay qua 10 năm địa hình.",
    pitch:
      "A decade of real work encoded into a data texture and extruded into a monochrome ridgeline terrain; scrolling the timeline is a camera dolly across ten years of topography.",
    status: "ready",
    origin: "v1",
    difficulty: 4,
    effortDays: 6,
    scores: { overall: 8.0, originality: 6.7, seniorSignal: 8.0, feasibility: 9.0, performance: 9.0 },
    accent: "#ffb454",
  },
  {
    id: "maintenance-archaeology",
    rank: 5,
    title: "Maintenance Archaeology",
    tagline:
      "Codebase lâu năm là một di chỉ khảo cổ, mỗi lớp trầm tích là một thời kỳ kiến trúc. Cuộn để đào sâu xuống mười năm, chạm vào từng mảnh module để định tuổi bằng chính lịch sử git và đọc ghi chú của những người bảo trì đi trước.",
    pitch:
      "A decade-old codebase excavated as a stratigraphic trench wall: scrolling descends through sediment layers of architectural eras while a carbon-dating probe reads the real git-history age of half-buried module artifacts and surfaces field notes from past maintainers.",
    status: "ready",
    origin: "v2",
    difficulty: 3,
    effortDays: 12,
    scores: { overall: 8.0, originality: 8.0, seniorSignal: 9.0, feasibility: 7.0, performance: 8.7 },
    accent: "#d4a24c",
  },
  {
    id: "request-lifecycle",
    rank: 6,
    title: "Request Lifecycle",
    tagline:
      "Cả trang web là một request duy nhất được trace từ đầu đến cuối. Bạn cuộn trang, gói tin đi qua edge, service mesh, hàng đợi và database, và mỗi chặng kể một phần câu chuyện nghề của tôi.",
    pitch:
      "The whole portfolio is one distributed trace: scrolling drives a luminous packet from edge to database and back, and every section of the page is a live span in the waterfall.",
    status: "ready",
    origin: "v1",
    difficulty: 4,
    effortDays: 10,
    scores: { overall: 8.0, originality: 8.0, seniorSignal: 9.0, feasibility: 7.0, performance: 8.0 },
    accent: "#f59e0b",
  },
  {
    id: "cost-of-change",
    rank: 7,
    title: "Cost of Change",
    tagline:
      "Nợ kỹ thuật hiện hình thành ứng suất vật lý: mỗi năm code là một tầng chịu lực, mỗi lần refactor là một lần kết cấu được giải phóng. Giữ để xem dòng thời gian giả định nếu khoản nợ đó không bao giờ được trả.",
    pitch:
      "A decade of one codebase rendered as a load-bearing truss tower that visibly strains under each year of shipped features and springs back at each refactor the engineer led, with a press-and-hold counterfactual revealing the timeline where the debt was never paid.",
    status: "ready",
    origin: "v2",
    difficulty: 3,
    effortDays: 11,
    scores: { overall: 7.7, originality: 7.7, seniorSignal: 8.3, feasibility: 8.0, performance: 9.0 },
    accent: "#f2c94c",
  },
  {
    id: "daily-driver",
    rank: 8,
    title: "The Daily Driver",
    tagline:
      "Bàn phím cơ 3D mà bạn gõ được thật: mỗi phím bấm vật lý nhấn xuống đúng keycap và điều hướng cả trang web. Công cụ tôi dùng mỗi ngày trở thành giao diện của chính portfolio này.",
    pitch:
      "A procedurally-built 3D mechanical keyboard you can actually type on: every physical keystroke depresses the matching keycap and feeds a terminal-style command line that navigates the whole site.",
    status: "ready",
    origin: "v1",
    difficulty: 3,
    effortDays: 12,
    scores: { overall: 7.7, originality: 7.0, seniorSignal: 8.0, feasibility: 6.7, performance: 9.0 },
    accent: "#a3e635",
  },
  {
    id: "constraint-prism",
    rank: 9,
    title: "Constraint Prism",
    tagline:
      "Ràng buộc không phải rào cản, mà là lăng kính hội tụ ý tưởng thành thiết kế. Bật tắt từng ràng buộc để thấy cùng một ý tưởng khúc xạ thành một kiến trúc khác.",
    pitch:
      "Engineering constraints rendered as optics: five labeled glass planes bend a raw idea beam into a system design, and toggling any constraint live re-refracts the beam into a different, honestly simpler architecture.",
    status: "ready",
    origin: "v2",
    difficulty: 4,
    effortDays: 12,
    scores: { overall: 7.3, originality: 7.7, seniorSignal: 8.3, feasibility: 6.7, performance: 8.0 },
    accent: "#7dd3fc",
  },
  {
    id: "leverage-engine",
    rank: 10,
    title: "Leverage Engine",
    tagline:
      "Quay tay quay một vòng, cả đội tăng tốc bốn mươi bảy vòng. Mỗi bánh răng là một công cụ hoặc một người được kèm cặp, và tỷ số truyền lấy từ số liệu đo được thật, không phải con số trang trí.",
    pitch:
      "A kinematically correct, patent-plate gear train where one crank of senior effort visibly multiplies into dozens of team-velocity revolutions, and every gear is a real tool, doc, or mentee with a measured ratio.",
    status: "ready",
    origin: "v2",
    difficulty: 3,
    effortDays: 10,
    scores: { overall: 7.0, originality: 7.0, seniorSignal: 8.3, feasibility: 7.7, performance: 8.3 },
    accent: "#c084fc",
  },
  {
    id: "living-topology",
    rank: 11,
    title: "Living Topology",
    tagline:
      "Mission-control map: network graph 3D data-driven của mọi hệ thống từng xây. Packet pulse chạy qua kiến trúc 10 năm, hover là 'query' hệ thống.",
    pitch:
      "A quiet mission-control map: a real, data-driven 3D network graph of every system the engineer has built, with packets pulsing through a decade of architecture.",
    status: "ready",
    origin: "v1",
    difficulty: 4,
    effortDays: 9,
    scores: { overall: 7.0, originality: 6.0, seniorSignal: 8.0, feasibility: 7.0, performance: 9.0 },
    accent: "#4af2a1",
  },
  {
    id: "gravity-toybox",
    rank: 12,
    title: "Weight of Experience",
    tagline:
      "Kinh nghiệm ở đây có khối lượng thật: mỗi công nghệ nặng đúng bằng số năm tôi đã dùng nó. Hãy kéo và ném thử để cảm nhận sự khác biệt giữa 9 năm và 1 năm.",
    pitch:
      "A rigid-body hero where the engineer's name crashes in and every tech token carries physical mass equal to years of experience, so flicking TypeScript (9 yrs) literally feels heavier than flicking a 1-yr framework.",
    status: "ready",
    origin: "v1",
    difficulty: 4,
    effortDays: 9,
    scores: { overall: 7.0, originality: 7.3, seniorSignal: 8.0, feasibility: 6.7, performance: 8.0 },
    accent: "#fb7185",
  },
  {
    id: "resolution",
    rank: 13,
    title: "Resolution",
    tagline:
      "Một fragment shader (luminance, Bayer dither, glyph ASCII) là toàn bộ ngôn ngữ render của site. Con trỏ là thấu kính lấy nét resolve ký tự về ảnh thật.",
    pitch:
      "A single hand-written fragment shader (luminance to Bayer dither to monospace glyph atlas) becomes the site's entire rendering identity; hovering resolves coarse characters toward clarity.",
    status: "ready",
    origin: "v1",
    difficulty: 3,
    effortDays: 4.5,
    scores: { overall: 6.7, originality: 5.0, seniorSignal: 7.0, feasibility: 9.0, performance: 9.0 },
    accent: "#b4ff39",
  },
  {
    id: "dependency-constellation",
    rank: 14,
    title: "Dependency Constellation",
    tagline:
      "Mười năm sự nghiệp được phân giải thành một chòm sao phụ thuộc. Chạm vào một kỹ năng để thấy mọi dự án từng kéo nó vào, theo đúng những liên kết thật.",
    pitch:
      "A senior career rendered as a fully resolved dependency graph: hover any skill and watch every project that ever pulled it in light up along its real edges, like running pnpm-why on ten years of work.",
    status: "ready",
    origin: "v1",
    difficulty: 3,
    effortDays: 7,
    scores: { overall: 6.7, originality: 5.3, seniorSignal: 8.3, feasibility: 8.0, performance: 9.0 },
    accent: "#38bdf8",
  },
  {
    id: "knowledge-relay",
    rank: 15,
    title: "Knowledge Relay",
    tagline:
      "Mười năm truyền nghề vẽ thành sơ đồ relay 3D: mỗi practice là một cây gậy phát sáng được trao qua các team lane theo dòng thời gian. Dự án có thể đóng lại nhưng gậy vẫn chạy tiếp, vì thứ senior để lại sống lâu hơn codebase.",
    pitch:
      "A decade of mentorship drawn as a 3D Marey-style relay timetable: practices forged as glowing batons that keep passing between team lanes even after each project's lane goes dark, proving that what a senior teaches outlives what he ships.",
    status: "ready",
    origin: "v2",
    difficulty: 4,
    effortDays: 9.5,
    scores: { overall: 6.7, originality: 8.0, seniorSignal: 7.7, feasibility: 7.3, performance: 8.7 },
    accent: "#34d399",
  },
  {
    id: "full-stack-strata",
    rank: 16,
    title: "Full-Stack Strata",
    tagline:
      "Lát cắt của hòn đảo nổi chính là stack: thành phố sản phẩm trên bề mặt, tầng dịch vụ phát sáng ở giữa, và lớp đá dữ liệu kết tinh dưới đáy. Cuộn để khoan sâu qua từng tầng, chạm để bắn một request xuyên suốt cả hệ thống.",
    pitch:
      "A floating island's cutaway IS the stack: scroll drills from the product city on the surface through the glowing services seam into crystalline database bedrock, and every tap fires a visible request trace through all three layers.",
    status: "planned",
    origin: "v1",
    difficulty: 4,
    effortDays: 11,
    scores: { overall: 6.7, originality: 6.7, seniorSignal: 7.3, feasibility: 5.7, performance: 7.7 },
    accent: "#2dd4bf",
  },
  {
    id: "glyph-field",
    rank: 17,
    title: "Glyph Field",
    tagline:
      "Tên tôi là 40 nghìn hạt glyph sống trong một draw call duy nhất. Cuộn trang, cả hệ chữ tan ra rồi tự xếp lại thành từng tiêu đề bạn đang đọc.",
    pitch:
      "The engineer's name and every section heading are a single 40k-particle GPU field that dissolves and re-forms as you scroll, one draw call carrying the entire site's typography.",
    status: "planned",
    origin: "v1",
    difficulty: 3,
    effortDays: 7,
    scores: { overall: 6.3, originality: 5.3, seniorSignal: 7.3, feasibility: 8.0, performance: 8.7 },
    accent: "#e2e8f0",
  },
  {
    id: "monolith",
    rank: 18,
    title: "Monolith",
    tagline:
      "Cả site là một scene: khối điêu khắc chữ tên bạn matte-black kiểu tượng đài. Scroll dolly camera xuyên qua các letterform, mỗi section một góc máy.",
    pitch:
      "The whole portfolio is one continuous scene: a monumental matte-black extruded typographic sculpture; scrolling dollies the camera along and through the letterforms.",
    status: "ready",
    origin: "v1",
    difficulty: 4,
    effortDays: 6,
    scores: { overall: 6.3, originality: 5.3, seniorSignal: 6.3, feasibility: 8.0, performance: 9.0 },
    accent: "#ff4d4d",
  },
  {
    id: "desk-version-controlled",
    rank: 19,
    title: "Desk, Version-Controlled",
    tagline:
      "Mười năm sự nghiệp gói trong một chiếc bàn làm việc. Cuộn trang để xem từng commit biến góc bàn junior 2016 thành workstation senior 2026, nơi trưởng thành nghĩa là bớt đi chứ không phải thêm vào.",
    pitch:
      "An isometric desk diorama that scrubs through ten years of commit history as you scroll: every career step is a conventional commit, and seniority visibly reads as a refactor toward less clutter, not more gear.",
    status: "planned",
    origin: "v1",
    difficulty: 3,
    effortDays: 11,
    scores: { overall: 6.3, originality: 5.3, seniorSignal: 7.3, feasibility: 6.7, performance: 8.0 },
    accent: "#fbbf24",
  },
  {
    id: "commit-skyline",
    rank: 20,
    title: "Commit Skyline",
    tagline:
      "Mười năm commit dựng thành một thành phố về đêm. Cuộn trang để bay dọc đại lộ thời gian, mỗi tòa nhà là một ngày viết code.",
    pitch:
      "Ten years of real GitHub contribution data extruded into a fog-drenched instanced night city, and scrolling flies the camera down the decade boulevard one year-block at a time.",
    status: "planned",
    origin: "v1",
    difficulty: 3,
    effortDays: 10,
    scores: { overall: 6.0, originality: 4.0, seniorSignal: 7.0, feasibility: 8.0, performance: 9.0 },
    accent: "#60a5fa",
  },
  {
    id: "cabinet-of-shipped-worlds",
    rank: 21,
    title: "Cabinet of Shipped Worlds",
    tagline:
      "Mỗi ô kính là một thế giới thu nhỏ của một sản phẩm đã ra mắt. Chạm vào lớp kính để bước hẳn vào bên trong và xem nó được xây nên như thế nào.",
    pitch:
      "A museum vitrine where every glass cell holds a live micro-diorama of a real shipped project, and clicking carries the camera through the glass into that project's world via portal rendering.",
    status: "planned",
    origin: "v1",
    difficulty: 4,
    effortDays: 14,
    scores: { overall: 6.0, originality: 7.3, seniorSignal: 7.3, feasibility: 4.7, performance: 6.7 },
    accent: "#f472b6",
  },
  {
    id: "compiled-light",
    rank: 22,
    title: "Compiled Light",
    tagline:
      "Dune-field FBM đơn sắc render qua pipeline ASCII/dither tự dựng. Con trỏ là thấu kính 'decompile' glyph về bề mặt ánh sáng mượt bên dưới.",
    pitch:
      "A monochrome noise landscape rendered through a hand-built ASCII/dither post-pipeline; the cursor acts as a lens that decompiles the glyphs back into smooth light.",
    status: "ready",
    origin: "v1",
    difficulty: 3,
    effortDays: 5,
    scores: { overall: 5.7, originality: 4.7, seniorSignal: 6.0, feasibility: 8.7, performance: 9.0 },
    accent: "#e8e3d5",
  },
  {
    id: "phosphor-lens",
    rank: 23,
    title: "Phosphor Lens",
    tagline:
      "Dưới lớp ký tự phosphor là một khối kim loại được tiện chính xác. Con trỏ của bạn là thấu kính, nhìn kỹ ở đâu thì sự thật hiện ra ở đó.",
    pitch:
      "One precision-machined 3D object lives beneath a hand-written ASCII/CRT post shader, and your cursor is an optical lens that resolves phosphor glyphs into the clean PBR render wherever you look closely.",
    status: "planned",
    origin: "v1",
    difficulty: 3,
    effortDays: 8,
    scores: { overall: 5.7, originality: 4.3, seniorSignal: 6.7, feasibility: 8.0, performance: 8.7 },
    accent: "#67e8f9",
  },
  {
    id: "signal-from-noise",
    rank: 24,
    title: "Signal From Noise",
    tagline:
      "Tín hiệu giữa nhiễu. Mười năm biến hỗn độn thành những hệ thống vận hành chính xác.",
    pitch:
      "One persistent GPGPU particle field that repeatedly collapses chaos into precise, data-driven engineered forms; the visitor's first scroll literally reenacts ten years of turning noise into systems.",
    status: "planned",
    origin: "v1",
    difficulty: 4,
    effortDays: 11,
    scores: { overall: 5.3, originality: 4.0, seniorSignal: 6.7, feasibility: 6.0, performance: 7.0 },
    accent: "#94a3b8",
  },
  {
    id: "lanyard-badge",
    rank: 25,
    title: "The Credential",
    tagline:
      "Tấm thẻ kỹ sư treo trên dây đeo thật sự cầm được, kéo được, búng được. Mười năm kinh nghiệm in thành dữ liệu sống ngay trên thẻ, kéo thẻ xuống để bước vào.",
    pitch:
      "A physically simulated conference badge on a lanyard that you grab, flick, flip and finally pull down to enter the site; every line printed on the card is real, build-time engineer data.",
    status: "planned",
    origin: "v1",
    difficulty: 3,
    effortDays: 9,
    scores: { overall: 5.0, originality: 3.3, seniorSignal: 6.3, feasibility: 8.0, performance: 8.0 },
    accent: "#e879f9",
  },
  {
    id: "ten-year-galaxy",
    rank: 26,
    title: "Ten-Year Galaxy",
    tagline:
      "Mười năm viết code kết tinh thành một dải ngân hà: mỗi tuần làm việc là một ngôi sao, mỗi chặng nghề là một cánh tay xoắn ốc. Cuộn trang để xem thiên hà tự lắp ráp theo đúng dòng thời gian sự nghiệp.",
    pitch:
      "A decade of shipped work assembles into a data-driven spiral galaxy: every working week becomes a star cluster, every career era a spiral arm, and scroll is the arrow of time.",
    status: "planned",
    origin: "v1",
    difficulty: 3,
    effortDays: 8,
    scores: { overall: 4.7, originality: 3.0, seniorSignal: 5.3, feasibility: 8.0, performance: 8.0 },
    accent: "#a78bfa",
  },
];

export function getConcept(id: ConceptId): ConceptMeta {
  const concept = CONCEPTS.find((c) => c.id === id);
  if (!concept) {
    throw new Error(`Concept "${id}" không tồn tại trong registry`);
  }
  return concept;
}
