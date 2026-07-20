/**
 * Chòm sao phụ thuộc: 10 năm sự nghiệp resolve sẵn thành một đồ thị
 * (role → project → skill). Không mô phỏng lực client-side: layout là
 * ba vành đai bán kính cố định + jitter deterministic; BFS và các path
 * kiểu `pnpm why` đều tính từ dữ liệu thuần, test được. Bản chính thức
 * bake bằng d3-force-3d lúc build, cùng schema.
 */

export type NodeKind = "role" | "project" | "skill";

export interface CareerNode {
  id: string;
  kind: NodeKind;
  label: string;
  year: number;
}

export const NODES: CareerNode[] = [
  { id: "r-backend", kind: "role", label: "Backend Engineer", year: 2016 },
  { id: "r-fullstack", kind: "role", label: "Full-stack Engineer", year: 2018 },
  { id: "r-senior", kind: "role", label: "Senior Engineer", year: 2020 },
  { id: "r-lead", kind: "role", label: "Tech Lead", year: 2022 },
  { id: "r-staff", kind: "role", label: "Staff Engineer", year: 2024 },

  { id: "p-billing", kind: "project", label: "billing-core", year: 2017 },
  { id: "p-search", kind: "project", label: "search-svc", year: 2018 },
  { id: "p-mobile-api", kind: "project", label: "mobile-api", year: 2018 },
  { id: "p-checkout", kind: "project", label: "checkout-platform", year: 2019 },
  { id: "p-obsv", kind: "project", label: "observability-kit", year: 2020 },
  { id: "p-realtime", kind: "project", label: "realtime-pipeline", year: 2021 },
  { id: "p-design", kind: "project", label: "design-system", year: 2022 },
  { id: "p-multiregion", kind: "project", label: "multi-region", year: 2023 },
  { id: "p-mlserve", kind: "project", label: "ml-serving", year: 2024 },
  { id: "p-portfolio", kind: "project", label: "portfolio-2026", year: 2026 },

  { id: "s-ts", kind: "skill", label: "TypeScript", year: 2017 },
  { id: "s-node", kind: "skill", label: "Node.js", year: 2016 },
  { id: "s-react", kind: "skill", label: "React", year: 2018 },
  { id: "s-pg", kind: "skill", label: "PostgreSQL", year: 2016 },
  { id: "s-redis", kind: "skill", label: "Redis", year: 2018 },
  { id: "s-kafka", kind: "skill", label: "Kafka", year: 2021 },
  { id: "s-aws", kind: "skill", label: "AWS", year: 2019 },
  { id: "s-k8s", kind: "skill", label: "Kubernetes", year: 2020 },
  { id: "s-grafana", kind: "skill", label: "Grafana", year: 2020 },
  { id: "s-go", kind: "skill", label: "Go", year: 2018 },
  { id: "s-three", kind: "skill", label: "three.js", year: 2025 },
  { id: "s-terraform", kind: "skill", label: "Terraform", year: 2022 },
];

/** [từ, tới] — role sở hữu project, project kéo skill vào. */
export const EDGES: [string, string][] = [
  ["r-backend", "p-billing"],
  ["r-fullstack", "p-search"],
  ["r-fullstack", "p-mobile-api"],
  ["r-fullstack", "p-checkout"],
  ["r-senior", "p-obsv"],
  ["r-senior", "p-realtime"],
  ["r-lead", "p-design"],
  ["r-lead", "p-multiregion"],
  ["r-staff", "p-mlserve"],
  ["r-staff", "p-portfolio"],

  ["p-billing", "s-node"],
  ["p-billing", "s-pg"],
  ["p-search", "s-node"],
  ["p-search", "s-redis"],
  ["p-search", "s-go"],
  ["p-mobile-api", "s-node"],
  ["p-mobile-api", "s-ts"],
  ["p-mobile-api", "s-pg"],
  ["p-checkout", "s-ts"],
  ["p-checkout", "s-react"],
  ["p-checkout", "s-pg"],
  ["p-checkout", "s-redis"],
  ["p-obsv", "s-grafana"],
  ["p-obsv", "s-k8s"],
  ["p-obsv", "s-go"],
  ["p-realtime", "s-kafka"],
  ["p-realtime", "s-node"],
  ["p-realtime", "s-aws"],
  ["p-design", "s-react"],
  ["p-design", "s-ts"],
  ["p-multiregion", "s-aws"],
  ["p-multiregion", "s-terraform"],
  ["p-multiregion", "s-k8s"],
  ["p-multiregion", "s-pg"],
  ["p-mlserve", "s-aws"],
  ["p-mlserve", "s-k8s"],
  ["p-mlserve", "s-go"],
  ["p-portfolio", "s-three"],
  ["p-portfolio", "s-react"],
  ["p-portfolio", "s-ts"],
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
