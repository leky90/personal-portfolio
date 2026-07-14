export type ConceptStatus = "ready" | "planned";

export type ConceptId =
  | "terrain"
  | "resolution"
  | "monolith"
  | "compiled-light"
  | "living-topology";

export interface ConceptScores {
  overall: number;
  originality: number;
  seniorSignal: number;
  feasibility: number;
  performance: number;
}

export interface ConceptMeta {
  id: ConceptId;
  rank: number;
  title: string;
  /** Tagline tiếng Việt hiển thị trên gallery để review */
  tagline: string;
  /** Pitch gốc (EN) từ vòng chấm concept */
  pitch: string;
  status: ConceptStatus;
  /** Lượt triển khai demo (2 concept / lượt) */
  batch: 1 | 2 | 3;
  difficulty: number;
  effortDays: number;
  scores: ConceptScores;
  /** Màu accent đặc trưng của concept (hex, dùng cho viền/chip trên gallery) */
  accent: string;
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "terrain",
    rank: 1,
    title: "Ten Years of Terrain",
    tagline:
      "10 năm sự nghiệp bake thành data texture, extrude thành địa hình ridgeline ~300 đường contour — cuộn timeline là camera bay qua 10 năm địa hình.",
    pitch:
      "A decade of real work encoded into a data texture and extruded into a monochrome ridgeline terrain; scrolling the timeline is a camera dolly across ten years of topography.",
    status: "ready",
    batch: 1,
    difficulty: 4,
    effortDays: 6,
    scores: {
      overall: 8.7,
      originality: 7.7,
      seniorSignal: 9.0,
      feasibility: 7.7,
      performance: 9.0,
    },
    accent: "#ffb454",
  },
  {
    id: "resolution",
    rank: 2,
    title: "Resolution",
    tagline:
      "Một fragment shader (luminance → Bayer dither → glyph ASCII) là toàn bộ ngôn ngữ render của site; con trỏ là thấu kính lấy nét resolve ký tự về ảnh thật.",
    pitch:
      "A single hand-written fragment shader — luminance → Bayer dither → monospace glyph atlas — becomes the site's entire rendering identity; hovering resolves coarse characters toward clarity.",
    status: "ready",
    batch: 1,
    difficulty: 3,
    effortDays: 4.5,
    scores: {
      overall: 7.7,
      originality: 6.3,
      seniorSignal: 7.7,
      feasibility: 9.0,
      performance: 9.3,
    },
    accent: "#b4ff39",
  },
  {
    id: "monolith",
    rank: 3,
    title: "Monolith",
    tagline:
      "Cả site là một scene: khối điêu khắc chữ tên bạn matte-black kiểu tượng đài, scroll dolly camera xuyên qua các letterform — mỗi section một góc máy.",
    pitch:
      "The whole portfolio is one continuous scene: a monumental matte-black extruded typographic sculpture; scrolling dollies the camera along and through the letterforms.",
    status: "planned",
    batch: 2,
    difficulty: 4,
    effortDays: 6,
    scores: {
      overall: 7.7,
      originality: 6.7,
      seniorSignal: 7.7,
      feasibility: 7.0,
      performance: 9.0,
    },
    accent: "#ff4d4d",
  },
  {
    id: "compiled-light",
    rank: 4,
    title: "Compiled Light",
    tagline:
      "Dune-field FBM đơn sắc render qua pipeline ASCII/dither tự dựng — con trỏ là thấu kính 'decompile' glyph về bề mặt ánh sáng mượt bên dưới.",
    pitch:
      "A monochrome noise landscape rendered through a hand-built ASCII/dither post-pipeline — the cursor acts as a lens that 'decompiles' the glyphs back into smooth light.",
    status: "planned",
    batch: 2,
    difficulty: 3,
    effortDays: 5,
    scores: {
      overall: 7.3,
      originality: 5.3,
      seniorSignal: 7.3,
      feasibility: 8.3,
      performance: 9.0,
    },
    accent: "#e8e3d5",
  },
  {
    id: "living-topology",
    rank: 5,
    title: "Living Topology",
    tagline:
      "Mission-control map: network graph 3D data-driven của mọi hệ thống từng xây, packet pulse chạy qua kiến trúc 10 năm, hover là 'query' hệ thống.",
    pitch:
      "A quiet mission-control map: a real, data-driven 3D network graph of every system the engineer has built, with packets pulsing through a decade of architecture.",
    status: "planned",
    batch: 3,
    difficulty: 4,
    effortDays: 9,
    scores: {
      overall: 7.3,
      originality: 5.7,
      seniorSignal: 8.3,
      feasibility: 6.7,
      performance: 8.0,
    },
    accent: "#4af2a1",
  },
];

export function getConcept(id: ConceptId): ConceptMeta {
  const concept = CONCEPTS.find((c) => c.id === id);
  if (!concept) {
    throw new Error(`Concept "${id}" không tồn tại trong registry`);
  }
  return concept;
}
