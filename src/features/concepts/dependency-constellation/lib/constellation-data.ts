/**
 * Chòm sao phụ thuộc: 12 năm nghề thật (2014 → 2026) resolve sẵn thành
 * một đồ thị (role → project → skill). Node lấy từ hồ sơ thật: 5 chặng
 * (freelance Huế → Synova → TESO → Treehouse), 10 dự án (6 cái công khai
 * trên Freelancer/Upwork + các mảng việc mô tả trong từng chặng) và 12
 * công nghệ thực sự đã dùng. Cạnh phản ánh đúng ai kéo gì vào giai đoạn
 * nào — không có dependency nào bịa.
 *
 * Không mô phỏng lực client-side: layout là ba vành đai bán kính cố định
 * + jitter deterministic; BFS và các path kiểu `pnpm why` đều tính từ dữ
 * liệu thuần, test được.
 */

export type NodeKind = "role" | "project" | "skill";

export interface CareerNode {
  id: string;
  kind: NodeKind;
  label: string;
  year: number;
}

export const NODES: CareerNode[] = [
  // 5 chặng nghề — năm là lúc bắt đầu chặng đó.
  {
    id: "r-freelance",
    kind: "role",
    label: "Freelance Web Developer",
    year: 2014,
  },
  {
    id: "r-fullstack",
    kind: "role",
    label: "Full Stack Engineer · Synova",
    year: 2017,
  },
  {
    id: "r-swe",
    kind: "role",
    label: "Software Engineer · TESO",
    year: 2019,
  },
  {
    id: "r-senior",
    kind: "role",
    label: "Senior Software Engineer · Treehouse",
    year: 2021,
  },
  {
    id: "r-lead",
    kind: "role",
    label: "Lead Frontend Engineer · Treehouse",
    year: 2021,
  },

  // 10 dự án — đặt tên kiểu package cho hợp ẩn dụ lockfile.
  { id: "p-client-sites", kind: "project", label: "client-sites-wp", year: 2014 },
  { id: "p-responsive", kind: "project", label: "responsive-retrofit", year: 2015 },
  { id: "p-controllermodz", kind: "project", label: "controllermodz", year: 2017 },
  { id: "p-ciga", kind: "project", label: "ciga.fr", year: 2018 },
  { id: "p-foodmap", kind: "project", label: "foodmap", year: 2019 },
  { id: "p-native", kind: "project", label: "native-travel", year: 2020 },
  { id: "p-build-to-rent", kind: "project", label: "build-to-rent", year: 2021 },
  { id: "p-treehouse", kind: "project", label: "treehouse-dapp", year: 2021 },
  { id: "p-teth", kind: "project", label: "teth-dashboard", year: 2022 },
  { id: "p-standards", kind: "project", label: "frontend-standards", year: 2023 },

  // 12 công nghệ — năm là lúc bắt đầu dùng thật trong việc.
  { id: "s-php", kind: "skill", label: "PHP", year: 2014 },
  { id: "s-js", kind: "skill", label: "JavaScript", year: 2014 },
  { id: "s-wordpress", kind: "skill", label: "WordPress", year: 2014 },
  { id: "s-jquery", kind: "skill", label: "jQuery", year: 2014 },
  { id: "s-magento", kind: "skill", label: "Magento", year: 2017 },
  { id: "s-laravel", kind: "skill", label: "Laravel", year: 2017 },
  { id: "s-react", kind: "skill", label: "React", year: 2019 },
  { id: "s-node", kind: "skill", label: "Node.js", year: 2019 },
  { id: "s-ts", kind: "skill", label: "TypeScript", year: 2021 },
  { id: "s-next", kind: "skill", label: "Next.js", year: 2021 },
  { id: "s-ethers", kind: "skill", label: "Ethers.js", year: 2021 },
  { id: "s-tailwind", kind: "skill", label: "Tailwind CSS", year: 2021 },
];

/** [từ, tới] — role sở hữu project, project kéo skill vào. */
export const EDGES: [string, string][] = [
  ["r-freelance", "p-client-sites"],
  ["r-freelance", "p-responsive"],
  ["r-fullstack", "p-controllermodz"],
  ["r-fullstack", "p-ciga"],
  ["r-swe", "p-foodmap"],
  ["r-swe", "p-native"],
  ["r-swe", "p-build-to-rent"],
  ["r-senior", "p-treehouse"],
  ["r-lead", "p-teth"],
  ["r-lead", "p-standards"],

  // Huế 2014–2016: site khách bằng WordPress, rồi kéo chúng về responsive.
  ["p-client-sites", "s-php"],
  ["p-client-sites", "s-wordpress"],
  ["p-client-sites", "s-js"],
  ["p-responsive", "s-jquery"],
  ["p-responsive", "s-js"],

  // Synova 2017–2018: eCommerce PHP, design → giao diện → tích hợp API.
  ["p-controllermodz", "s-php"],
  ["p-controllermodz", "s-magento"],
  ["p-controllermodz", "s-jquery"],
  ["p-ciga", "s-php"],
  ["p-ciga", "s-magento"],
  ["p-ciga", "s-laravel"],

  // TESO 2019–2021: dự án khách end-to-end bằng JavaScript/React.
  ["p-foodmap", "s-js"],
  ["p-foodmap", "s-react"],
  ["p-foodmap", "s-node"],
  ["p-native", "s-react"],
  ["p-native", "s-node"],
  ["p-build-to-rent", "s-react"],
  ["p-build-to-rent", "s-ts"],
  ["p-build-to-rent", "s-node"],

  // Treehouse 2021→nay: dApp DeFi/RWA, dashboard tAsset, rồi chuẩn hoá stack.
  ["p-treehouse", "s-react"],
  ["p-treehouse", "s-ts"],
  ["p-treehouse", "s-next"],
  ["p-treehouse", "s-ethers"],
  ["p-teth", "s-next"],
  ["p-teth", "s-ts"],
  ["p-teth", "s-ethers"],
  ["p-teth", "s-tailwind"],
  ["p-standards", "s-react"],
  ["p-standards", "s-ts"],
  ["p-standards", "s-tailwind"],
];

const RING_RADIUS: Record<NodeKind, number> = {
  role: 1.6,
  project: 3.6,
  skill: 5.6,
};

function hash01(seed: number): number {
  let a = (seed * 2654435761) >>> 0;
  a ^= a >>> 15;
  a = (a * 0x2c1b3c6d) >>> 0;
  a ^= a >>> 12;
  return (a >>> 0) / 4294967296;
}

const GOLDEN_ANGLE = 2.39996;

/** Ba vành đai đồng tâm, jitter y deterministic — zero mô phỏng. */
export function layoutConstellation(): Map<string, [number, number, number]> {
  const layout = new Map<string, [number, number, number]>();
  const byKind: Record<NodeKind, CareerNode[]> = {
    role: NODES.filter((n) => n.kind === "role"),
    project: NODES.filter((n) => n.kind === "project"),
    skill: NODES.filter((n) => n.kind === "skill"),
  };
  for (const kind of ["role", "project", "skill"] as const) {
    const radius = RING_RADIUS[kind];
    byKind[kind].forEach((node, index) => {
      const angle =
        kind === "role"
          ? (index / byKind.role.length) * Math.PI * 2
          : index * GOLDEN_ANGLE + radius;
      const y = (hash01(index + radius * 97) - 0.5) * 2.4;
      layout.set(node.id, [
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      ]);
    });
  }
  return layout;
}

/** Danh sách kề vô hướng — dùng cho BFS thắp sáng theo tầng. */
export function adjacency(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const node of NODES) map.set(node.id, []);
  for (const [a, b] of EDGES) {
    map.get(a)!.push(b);
    map.get(b)!.push(a);
  }
  return map;
}

const ADJACENCY = adjacency();

/** BFS từ một node: id → độ sâu (đồ thị liên thông nên phủ hết). */
export function bfsFrom(startId: string): Map<string, number> {
  const depths = new Map<string, number>([[startId, 0]]);
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const depth = depths.get(current)!;
    for (const next of ADJACENCY.get(current) ?? []) {
      if (!depths.has(next)) {
        depths.set(next, depth + 1);
        queue.push(next);
      }
    }
  }
  return depths;
}

const NODE_BY_ID = new Map(NODES.map((node) => [node.id, node]));
const OWNER_OF_PROJECT = new Map(
  EDGES.filter(([a]) => a.startsWith("r-")).map(([role, project]) => [
    project,
    role,
  ]),
);

function labelOf(id: string): string {
  return NODE_BY_ID.get(id)?.label ?? id;
}

/**
 * Path phân giải kiểu `pnpm why`: skill < project < role.
 * Skill trả mọi project từng kéo nó; project trả role sở hữu; role trả
 * chính nó.
 */
export function resolvePaths(nodeId: string): string[] {
  const node = NODE_BY_ID.get(nodeId);
  if (!node) return [];

  if (node.kind === "role") return [node.label];

  if (node.kind === "project") {
    const owner = OWNER_OF_PROJECT.get(node.id);
    return [owner ? `${node.label} < ${labelOf(owner)}` : node.label];
  }

  const paths: string[] = [];
  for (const [project, skill] of EDGES) {
    if (skill !== node.id || !project.startsWith("p-")) continue;
    const owner = OWNER_OF_PROJECT.get(project);
    paths.push(
      owner
        ? `${node.label} < ${labelOf(project)} < ${labelOf(owner)}`
        : `${node.label} < ${labelOf(project)}`,
    );
  }
  return paths.sort();
}
