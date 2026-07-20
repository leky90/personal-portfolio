import type { ConceptId } from "@/features/concepts/registry";

/**
 * Mini data-viz generative cho từng concept: mỗi sketch vẽ đúng KỸ THUẬT
 * của concept đó (ridgeline, dither, extrude, quantize, graph) bằng SVG
 * deterministic — server-render, không runtime JS, màu theo currentColor
 * để trang giữ đúng một accent.
 */

const W = 200;
const H = 120;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Terrain: 7 đường ridgeline, đỉnh dồn quanh 2/3 chiều ngang. */
function TerrainMarks() {
  const rand = mulberry32(7);
  const lines: string[] = [];
  for (let l = 0; l < 7; l += 1) {
    const base = 28 + l * 13;
    const points: string[] = [];
    for (let x = 0; x <= W; x += 8) {
      const peak =
        Math.exp(-((x - 122) ** 2) / 3600) *
        30 *
        (0.45 + 0.55 * Math.abs(Math.sin(l * 1.1 + 0.6)));
      const ripple = Math.sin(x * 0.09 + l * 2.3) * 2 + rand() * 1.4;
      points.push(`${x},${(base - peak - ripple).toFixed(1)}`);
    }
    lines.push(points.join(" "));
  }
  return (
    <>
      {lines.map((points, index) => (
        <polyline
          key={points.slice(0, 12)}
          points={points}
          stroke="currentColor"
          strokeWidth={index === 3 ? 1.4 : 0.9}
          opacity={index === 3 ? 0.95 : 0.4 + index * 0.05}
        />
      ))}
    </>
  );
}

/** Resolution: lưới dither Bayer 4×4 quanh một nguồn sáng lệch tâm. */
function ResolutionMarks() {
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const cells: { x: number; y: number; o: number }[] = [];
  for (let row = 0; row < 12; row += 1) {
    for (let col = 0; col < 20; col += 1) {
      const cx = col * 10 + 5;
      const cy = row * 10 + 5;
      const dist = Math.hypot(cx - 128, cy - 50);
      const intensity = Math.max(0, 1 - dist / 92);
      const threshold = (bayer[(row % 4) * 4 + (col % 4)] + 0.5) / 16;
      if (intensity > threshold) {
        cells.push({ x: col * 10, y: row * 10, o: 0.2 + intensity * 0.65 });
      }
    }
  }
  return (
    <>
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x + 2.5}
          y={cell.y + 2.5}
          width={5}
          height={5}
          fill="currentColor"
          opacity={cell.o}
        />
      ))}
    </>
  );
}

/** Monolith: letterform K extrude — mặt sau offset, nối cạnh góc. */
function MonolithMarks() {
  const outline: [number, number][] = [
    [0, 0], [0.24, 0], [0.24, 0.36], [0.52, 0], [0.8, 0],
    [0.42, 0.5], [0.8, 1], [0.52, 1], [0.24, 0.64], [0.24, 1], [0, 1],
  ];
  const sx = 78;
  const toFront = ([u, v]: [number, number]) =>
    [52 + u * sx, 108 - v * 92] as [number, number];
  const front = outline.map(toFront);
  const back = front.map(([x, y]) => [x + 18, y - 11] as [number, number]);
  const corners = [0, 4, 6, 10];
  return (
    <>
      <polygon
        points={back.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
        stroke="currentColor"
        strokeWidth={0.8}
        opacity={0.3}
      />
      {corners.map((index) => (
        <line
          key={index}
          x1={front[index][0]}
          y1={front[index][1]}
          x2={back[index][0]}
          y2={back[index][1]}
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.4}
        />
      ))}
      <polygon
        points={front.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
        fill="currentColor"
        fillOpacity={0.1}
        stroke="currentColor"
        strokeWidth={1.3}
        opacity={0.9}
      />
    </>
  );
}

/** Compiled Light: dải quantize thô dần mịn + thấu kính decompile. */
function CompiledLightMarks() {
  const bands: { y: number; h: number; o: number }[] = [];
  for (let i = 0; i < 4; i += 1) {
    bands.push({ y: 8 + i * 13, h: 9, o: 0.14 + i * 0.05 });
  }
  for (let i = 0; i < 4; i += 1) {
    bands.push({ y: 62 + i * 8, h: 5, o: 0.32 + i * 0.05 });
  }
  for (let i = 0; i < 5; i += 1) {
    bands.push({ y: 96 + i * 4.4, h: 2.4, o: 0.5 + i * 0.04 });
  }
  return (
    <>
      {bands.map((band) => (
        <rect
          key={band.y}
          x={8}
          y={band.y}
          width={W - 16}
          height={band.h}
          fill="currentColor"
          opacity={band.o}
        />
      ))}
      <clipPath id="cl-lens">
        <circle cx={128} cy={50} r={27} />
      </clipPath>
      <g clipPath="url(#cl-lens)">
        <rect x={98} y={22} width={62} height={58} fill="#050505" />
        {Array.from({ length: 15 }, (_, i) => (
          <rect
            key={i}
            x={98}
            y={23 + i * 4}
            width={62}
            height={1.6}
            fill="currentColor"
            opacity={0.75}
          />
        ))}
      </g>
      <circle
        cx={128}
        cy={50}
        r={27}
        stroke="currentColor"
        strokeWidth={1.2}
        opacity={0.9}
      />
    </>
  );
}

/** Living Topology: graph trái→phải theo trục thời gian, hub nối chuỗi. */
function TopologyMarks() {
  const rand = mulberry32(21);
  const nodes: [number, number][] = [];
  for (let i = 0; i < 14; i += 1) {
    const x = 14 + (i / 13) * 168 + (rand() - 0.5) * 16;
    const y = 60 + (rand() - 0.5) * 78;
    nodes.push([x, Math.min(106, Math.max(14, y))]);
  }
  const edges: [number, number][] = [];
  for (let i = 1; i < nodes.length; i += 1) {
    edges.push([i, i - 1 - Math.floor(rand() * Math.min(3, i))]);
    if (rand() > 0.6 && i > 2) {
      edges.push([i, i - 2]);
    }
  }
  return (
    <>
      {edges.map(([a, b], index) => (
        <line
          key={index}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="currentColor"
          strokeWidth={0.7}
          opacity={0.3}
        />
      ))}
      {nodes.map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={index % 5 === 0 ? 3 : 2}
          fill="currentColor"
          opacity={index % 5 === 0 ? 0.9 : 0.55}
        />
      ))}
    </>
  );
}

/** Decision Diff: rail đã đi (liền) + tương lai (đứt) + nhánh ma rẽ nhánh. */
function DecisionDiffMarks() {
  const trunkSolid = "0,70 30,68 55,72 80,66";
  const trunkDashed = "80,66 105,70 130,64 155,68 200,62";
  const ghosts = [
    { points: "55,72 70,56 88,44 104,38", fork: [55, 72] },
    { points: "130,64 146,80 164,92 180,98", fork: [130, 64] },
  ];
  return (
    <>
      <polyline
        points={trunkSolid}
        stroke="currentColor"
        strokeWidth={2.2}
        opacity={0.95}
      />
      <polyline
        points={trunkDashed}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeDasharray="4 3"
        opacity={0.4}
      />
      {ghosts.map((ghost) => (
        <g key={ghost.points}>
          <polyline
            points={ghost.points}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="2.5 2.5"
            opacity={0.35}
          />
          <circle
            cx={ghost.fork[0]}
            cy={ghost.fork[1]}
            r={2.6}
            fill="currentColor"
            opacity={0.9}
          />
        </g>
      ))}
    </>
  );
}

/** Monolith to Mesh: slab kerf-cut bên trái, mesh node + filament bên phải. */
function MonolithToMeshMarks() {
  const rand = mulberry32(31);
  const slab: { x: number; y: number; w: number; h: number }[] = [];
  const cuts = [0, 14, 30, 48, 62];
  const rows = [22, 44, 70, 98];
  for (let r = 0; r < rows.length - 1; r += 1) {
    for (let c = 0; c < cuts.length - 1; c += 1) {
      slab.push({
        x: 14 + cuts[c],
        y: rows[r],
        w: cuts[c + 1] - cuts[c] - 2,
        h: rows[r + 1] - rows[r] - 2,
      });
    }
  }
  const nodes: [number, number][] = [];
  for (let i = 0; i < 10; i += 1) {
    nodes.push([118 + rand() * 70, 20 + rand() * 82]);
  }
  return (
    <>
      {slab.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={cell.w}
          height={cell.h}
          fill="currentColor"
          opacity={0.28}
          stroke="currentColor"
          strokeWidth={0.6}
        />
      ))}
      {nodes.map(([x, y], index) => (
        <g key={`${x.toFixed(1)}-${y.toFixed(1)}`}>
          {index > 0 && (
            <line
              x1={nodes[index - 1][0]}
              y1={nodes[index - 1][1]}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth={0.7}
              opacity={0.3}
            />
          )}
          <rect
            x={x - 3}
            y={y - 3}
            width={6}
            height={6}
            fill="currentColor"
            opacity={0.8}
          />
        </g>
      ))}
    </>
  );
}

/** Incident Black Box: băng telemetry qua vạch đọc, pin sự kiện đứng trên mép. */
function IncidentBlackBoxMarks() {
  const rand = mulberry32(43);
  const trace: string[] = [];
  for (let x = 0; x <= W; x += 6) {
    const t = x / W;
    const sev = Math.min(
      Math.max((t - 0.3) / 0.12, 0),
      Math.max(1 - (t - 0.55) / 0.3, 0),
    );
    const clamped = Math.min(1, Math.max(0, sev));
    trace.push(`${x},${(78 - clamped * 34 - rand() * 3).toFixed(1)}`);
  }
  const pins = [0.16, 0.33, 0.44, 0.55, 0.72, 0.95];
  return (
    <>
      <rect x={0} y={34} width={W} height={62} fill="currentColor" opacity={0.08} />
      <polyline
        points={trace.join(" ")}
        stroke="currentColor"
        strokeWidth={1.4}
        opacity={0.85}
      />
      {pins.map((t) => (
        <g key={t}>
          <line
            x1={t * W}
            y1={30}
            x2={t * W}
            y2={38}
            stroke="currentColor"
            strokeWidth={1.2}
            opacity={0.7}
          />
          <circle cx={t * W} cy={27} r={2} fill="currentColor" opacity={0.85} />
        </g>
      ))}
      <line
        x1={W / 2}
        y1={16}
        x2={W / 2}
        y2={104}
        stroke="currentColor"
        strokeWidth={1.6}
        opacity={0.95}
      />
    </>
  );
}

/** Maintenance Archaeology: địa tầng band ngang + mảnh module chôn trong vách. */
function MaintenanceArchaeologyMarks() {
  const rand = mulberry32(53);
  const bands = [
    { y: 8, h: 18, o: 0.12 },
    { y: 27, h: 22, o: 0.2 },
    { y: 50, h: 26, o: 0.3 },
    { y: 77, h: 22, o: 0.42 },
    { y: 100, h: 14, o: 0.55 },
  ];
  const shards: { x: number; y: number; r: number }[] = [];
  bands.forEach((band) => {
    for (let i = 0; i < 5; i += 1) {
      shards.push({
        x: 12 + rand() * 176,
        y: band.y + 3 + rand() * (band.h - 6),
        r: 2 + rand() * 2.4,
      });
    }
  });
  return (
    <>
      {bands.map((band) => (
        <rect
          key={band.y}
          x={4}
          y={band.y}
          width={W - 8}
          height={band.h}
          fill="currentColor"
          opacity={band.o * 0.5}
        />
      ))}
      {bands.slice(1).map((band) => (
        <line
          key={`seam-${band.y}`}
          x1={4}
          y1={band.y}
          x2={W - 4}
          y2={band.y}
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.5}
        />
      ))}
      {shards.map((shard) => (
        <rect
          key={`${shard.x.toFixed(1)}-${shard.y.toFixed(1)}`}
          x={shard.x}
          y={shard.y}
          width={shard.r * 2}
          height={shard.r * 1.5}
          transform={`rotate(${(shard.x * 7) % 40} ${shard.x} ${shard.y})`}
          fill="currentColor"
          opacity={0.75}
        />
      ))}
    </>
  );
}

/** Request Lifecycle: waterfall Jaeger 6 span + packet trên route. */
function RequestLifecycleMarks() {
  const spans = [
    { start: 0, duration: 24 },
    { start: 24, duration: 9 },
    { start: 33, duration: 58 },
    { start: 91, duration: 31 },
    { start: 122, duration: 43 },
    { start: 165, duration: 22 },
  ];
  const total = 187;
  const left = 16;
  const right = W - 16;
  const bars = spans.map((span, index) => ({
    x: left + (span.start / total) * (right - left),
    w: Math.max((span.duration / total) * (right - left), 3),
    y: 14 + index * 12,
    o: index === 3 ? 0.9 : 0.4 + index * 0.07,
  }));
  const packetX = left + 0.62 * (right - left);
  return (
    <>
      {bars.map((bar) => (
        <g key={bar.y}>
          <line
            x1={left}
            y1={bar.y + 2.5}
            x2={right}
            y2={bar.y + 2.5}
            stroke="currentColor"
            strokeWidth={0.3}
            opacity={0.12}
          />
          <rect
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={5}
            fill="currentColor"
            opacity={bar.o}
          />
        </g>
      ))}
      <polyline
        points={`${left},104 ${left + 40},100 ${left + 80},106 ${left + 120},101 ${right},104`}
        stroke="currentColor"
        strokeWidth={0.9}
        opacity={0.45}
      />
      <circle cx={packetX} cy={102.6} r={6} fill="currentColor" opacity={0.22} />
      <circle cx={packetX} cy={102.6} r={2.8} fill="currentColor" opacity={0.95} />
    </>
  );
}

/** Cost of Change: tháp truss 10 tầng + bóng counterfactual nghiêng dần. */
function CostOfChangeMarks() {
  const floors = 10;
  const floorH = 9.4;
  const baseY = 110;
  const towerX = 74;
  const width = 40;
  const refactors = new Set([3, 6, 8]);
  const elements: React.ReactElement[] = [];
  for (let f = 0; f < floors; f += 1) {
    const y1 = baseY - f * floorH;
    const y0 = y1 - floorH;
    const heightFrac = (f + 1) / floors;
    const ghostLean = heightFrac * heightFrac * 26;
    const strainOpacity = 0.85 - f * 0.055;
    const zig = f % 2 === 0;
    elements.push(
      <g key={`floor-${f}`}>
        {/* Tháp thật: 2 cột + dầm + chéo zigzag */}
        <line x1={towerX} y1={y0} x2={towerX} y2={y1} stroke="currentColor" strokeWidth={1.1} opacity={strainOpacity} />
        <line x1={towerX + width} y1={y0} x2={towerX + width} y2={y1} stroke="currentColor" strokeWidth={1.1} opacity={strainOpacity} />
        <line x1={towerX} y1={y0} x2={towerX + width} y2={y0} stroke="currentColor" strokeWidth={0.7} opacity={strainOpacity * 0.8} />
        <line
          x1={zig ? towerX : towerX + width}
          y1={y1}
          x2={zig ? towerX + width : towerX}
          y2={y0}
          stroke="currentColor"
          strokeWidth={refactors.has(f) ? 1.2 : 0.55}
          opacity={refactors.has(f) ? 0.95 : strainOpacity * 0.7}
        />
        {/* Bóng counterfactual: cột phải nghiêng dần, nét đứt */}
        <line
          x1={towerX + width + 14 + ghostLean * 0.3}
          y1={y1}
          x2={towerX + width + 14 + ghostLean}
          y2={y0}
          stroke="currentColor"
          strokeWidth={0.7}
          strokeDasharray="2 2.4"
          opacity={0.3}
        />
      </g>,
    );
  }
  return (
    <>
      <line x1={12} y1={baseY} x2={W - 12} y2={baseY} stroke="currentColor" strokeWidth={0.8} opacity={0.5} />
      {elements}
    </>
  );
}

/** Placeholder cho concept chưa build demo: lưới chấm mờ, trạng thái chờ. */
function PendingMarks() {
  const dots: { x: number; y: number }[] = [];
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      dots.push({ x: 14 + col * 19, y: 15 + row * 18 });
    }
  }
  return (
    <>
      {dots.map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={1}
          fill="currentColor"
          opacity={0.25}
        />
      ))}
    </>
  );
}

const MARKS: Partial<Record<ConceptId, () => React.ReactElement>> = {
  terrain: TerrainMarks,
  resolution: ResolutionMarks,
  monolith: MonolithMarks,
  "compiled-light": CompiledLightMarks,
  "living-topology": TopologyMarks,
  "decision-diff": DecisionDiffMarks,
  "monolith-to-mesh": MonolithToMeshMarks,
  "incident-black-box": IncidentBlackBoxMarks,
  "maintenance-archaeology": MaintenanceArchaeologyMarks,
  "request-lifecycle": RequestLifecycleMarks,
  "cost-of-change": CostOfChangeMarks,
};

interface ConceptSketchProps {
  id: ConceptId;
}

export function ConceptSketch({ id }: ConceptSketchProps) {
  const Marks = MARKS[id] ?? PendingMarks;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      fill="none"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <Marks />
    </svg>
  );
}
