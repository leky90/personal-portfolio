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

/** Daily Driver: bàn phím 60% top-down, 5 phím lệnh accent, 1 phím đang nhấn. */
function DailyDriverMarks() {
  const rowOffsets = [0, 0.5, 0.75, 1.25, 0];
  const rowKeys = [14, 14, 13, 12, 8];
  const cell = 12.6;
  const startY = 26;
  const accents = new Set(["1-2", "2-1", "2-9", "3-3", "1-4"]);
  const pressed = "1-2";
  const keys: { x: number; y: number; w: number; id: string }[] = [];
  rowKeys.forEach((count, row) => {
    const isBottom = row === 4;
    for (let col = 0; col < count; col += 1) {
      const wide = isBottom && col === 3;
      keys.push({
        id: `${row}-${col}`,
        x: 12 + (col + rowOffsets[row]) * cell + (isBottom ? col * 6 : 0),
        y: startY + row * 14.5,
        w: wide ? cell * 3.6 : cell - 2.6,
      });
    }
  });
  return (
    <>
      <rect
        x={7}
        y={startY - 6}
        width={186}
        height={5 * 14.5 + 8}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        opacity={0.5}
      />
      {keys.map((key) => {
        const isAccent = accents.has(key.id);
        const isPressed = key.id === pressed;
        return (
          <rect
            key={key.id}
            x={key.x}
            y={isPressed ? key.y + 1.6 : key.y}
            width={key.w}
            height={10}
            fill={isAccent ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isPressed ? 1.2 : 0.6}
            opacity={isAccent ? 0.9 : isPressed ? 0.95 : 0.35}
          />
        );
      })}
    </>
  );
}

/** Constraint Prism: tia gập qua 5 wedge rồi toả thành phổ 6 tia. */
function ConstraintPrismMarks() {
  const wedgeXs = [64, 78, 92, 106, 120];
  const deflections = [-7, 6, -5, 7, -4.5];
  const beam: string[] = [`6,60`, `48,60`];
  let y = 60;
  wedgeXs.forEach((x, index) => {
    y += deflections[index];
    beam.push(`${x},${y.toFixed(1)}`);
  });
  const exitY = y;
  beam.push(`150,${exitY.toFixed(1)}`);
  const rays = Array.from({ length: 6 }, (_, index) => {
    const t = (index - 2.5) / 2.5;
    return { y2: exitY + t * 26, o: 0.85 - Math.abs(t) * 0.35 };
  });
  return (
    <>
      {wedgeXs.map((x, index) => (
        <line
          key={x}
          x1={x + (index % 2 === 0 ? 3 : -3)}
          y1={26}
          x2={x - (index % 2 === 0 ? 3 : -3)}
          y2={94}
          stroke="currentColor"
          strokeWidth={2.4}
          opacity={0.3}
        />
      ))}
      <polyline
        points={beam.join(" ")}
        stroke="currentColor"
        strokeWidth={1.6}
        opacity={0.95}
      />
      {rays.map((ray) => (
        <line
          key={ray.y2}
          x1={150}
          y1={exitY}
          x2={192}
          y2={ray.y2}
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={ray.o}
        />
      ))}
      <circle cx={6} cy={60} r={2.4} fill="currentColor" opacity={0.95} />
    </>
  );
}

/** Leverage Engine: hộp số patent-plate, crank to bên trái nhân qua chuỗi nhỏ dần. */
function LeverageEngineMarks() {
  const gears = [
    { x: 46, y: 60, r: 27, teeth: 24, accent: true },
    { x: 88, y: 34, r: 13, teeth: 12 },
    { x: 88, y: 34, r: 19, teeth: 18, ghost: true },
    { x: 122, y: 26, r: 7, teeth: 8 },
    { x: 92, y: 82, r: 10, teeth: 10 },
    { x: 92, y: 82, r: 17, teeth: 16, ghost: true },
    { x: 126, y: 90, r: 6.5, teeth: 8 },
    { x: 158, y: 58, r: 8.5, teeth: 9 },
  ];
  return (
    <>
      {gears.map((gear) => {
        const ticks = Array.from({ length: gear.teeth }, (_, tooth) => {
          const angle = (tooth / gear.teeth) * Math.PI * 2;
          return (
            <line
              key={tooth}
              x1={gear.x + Math.cos(angle) * gear.r}
              y1={gear.y + Math.sin(angle) * gear.r}
              x2={gear.x + Math.cos(angle) * (gear.r + 3)}
              y2={gear.y + Math.sin(angle) * (gear.r + 3)}
              stroke="currentColor"
              strokeWidth={0.7}
              opacity={gear.ghost ? 0.25 : 0.6}
            />
          );
        });
        return (
          <g key={`${gear.x}-${gear.y}-${gear.r}`}>
            <circle
              cx={gear.x}
              cy={gear.y}
              r={gear.r}
              fill="none"
              stroke="currentColor"
              strokeWidth={gear.accent ? 1.5 : 0.9}
              opacity={gear.ghost ? 0.3 : gear.accent ? 0.95 : 0.65}
              strokeDasharray={gear.ghost ? "2 2" : undefined}
            />
            <circle
              cx={gear.x}
              cy={gear.y}
              r={1.6}
              fill="currentColor"
              opacity={0.8}
            />
            {ticks}
            {gear.accent ? (
              <circle
                cx={gear.x + gear.r * 0.62}
                cy={gear.y}
                r={3.2}
                fill="currentColor"
                opacity={0.95}
              />
            ) : null}
          </g>
        );
      })}
      <text
        x={158}
        y={44}
        fontSize={7}
        fontFamily="monospace"
        fill="currentColor"
        opacity={0.7}
      >
        ×60
      </text>
    </>
  );
}

/** Weight of Experience: đống đĩa tạ nặng giữa nhẹ rìa + hai đĩa đang rơi. */
function GravityToyboxMarks() {
  const resting = [
    { x: 100, r: 26, h: 9 },
    { x: 62, r: 20, h: 7.5 },
    { x: 138, r: 18, h: 7 },
    { x: 36, r: 12, h: 5.5 },
    { x: 164, r: 11, h: 5 },
    { x: 82, r: 15, h: 6, stack: 1 },
    { x: 122, r: 13, h: 5.5, stack: 1 },
    { x: 102, r: 9, h: 4.5, stack: 2 },
  ];
  const groundY = 102;
  const falling = [
    { x: 74, y: 26, r: 8 },
    { x: 140, y: 40, r: 6 },
  ];
  return (
    <>
      <line
        x1={10}
        y1={groundY}
        x2={W - 10}
        y2={groundY}
        stroke="currentColor"
        strokeWidth={0.9}
        opacity={0.5}
      />
      {resting.map((disc) => {
        const y = groundY - disc.h / 2 - (disc.stack ?? 0) * 9;
        return (
          <ellipse
            key={`${disc.x}-${disc.r}`}
            cx={disc.x}
            cy={y}
            rx={disc.r}
            ry={disc.h / 2}
            fill="currentColor"
            opacity={0.28 + disc.r * 0.02}
            stroke="currentColor"
            strokeWidth={0.7}
          />
        );
      })}
      {falling.map((disc) => (
        <g key={`fall-${disc.x}`}>
          <ellipse
            cx={disc.x}
            cy={disc.y}
            rx={disc.r}
            ry={disc.r * 0.42}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.85}
          />
          <line
            x1={disc.x}
            y1={disc.y - 16}
            x2={disc.x}
            y2={disc.y - 7}
            stroke="currentColor"
            strokeWidth={0.7}
            strokeDasharray="2 2.6"
            opacity={0.5}
          />
        </g>
      ))}
    </>
  );
}

/** Dependency Constellation: 3 vành sao đồng tâm + một query pnpm-why đang sáng. */
function DependencyConstellationMarks() {
  const cx = 100;
  const cy = 60;
  const rings = [
    { r: 14, count: 5, size: 2.6 },
    { r: 30, count: 10, size: 1.9 },
    { r: 47, count: 12, size: 1.4 },
  ];
  const nodes: { x: number; y: number; size: number; ring: number; i: number }[] = [];
  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i += 1) {
      const angle = (i / ring.count) * Math.PI * 2 + ringIndex * 0.7;
      nodes.push({
        x: cx + Math.cos(angle) * ring.r * 1.7,
        y: cy + Math.sin(angle) * ring.r * 0.82,
        size: ring.size,
        ring: ringIndex,
        i,
      });
    }
  });
  const lit = [
    nodes.find((n) => n.ring === 2 && n.i === 3)!,
    nodes.find((n) => n.ring === 1 && n.i === 2)!,
    nodes.find((n) => n.ring === 1 && n.i === 6)!,
    nodes.find((n) => n.ring === 0 && n.i === 1)!,
  ];
  return (
    <>
      {[0, 1, 2].map((ringIndex) => (
        <ellipse
          key={ringIndex}
          cx={cx}
          cy={cy}
          rx={rings[ringIndex].r * 1.7}
          ry={rings[ringIndex].r * 0.82}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.4}
          opacity={0.18}
        />
      ))}
      <polyline
        points={`${lit[0].x},${lit[0].y} ${lit[1].x},${lit[1].y} ${lit[3].x},${lit[3].y}`}
        stroke="currentColor"
        strokeWidth={1.1}
        opacity={0.9}
      />
      <line
        x1={lit[0].x}
        y1={lit[0].y}
        x2={lit[2].x}
        y2={lit[2].y}
        stroke="currentColor"
        strokeWidth={1.1}
        opacity={0.9}
      />
      {nodes.map((node) => {
        const isLit = lit.includes(node);
        return (
          <circle
            key={`${node.ring}-${node.i}`}
            cx={node.x}
            cy={node.y}
            r={isLit ? node.size + 1 : node.size}
            fill="currentColor"
            opacity={isLit ? 0.95 : 0.35}
          />
        );
      })}
    </>
  );
}

/** Knowledge Relay: biểu đồ Marey — lane chết dần, gậy vẫn chạy tiếp. */
function KnowledgeRelayMarks() {
  const lanes = [
    { y: 26, x0: 14, x1: 96 },
    { y: 40, x0: 30, x1: 118 },
    { y: 54, x0: 58, x1: 142 },
    { y: 68, x0: 76, x1: 164 },
    { y: 82, x0: 104, x1: 178 },
    { y: 96, x0: 132, x1: 188 },
  ];
  const baton1 = "14,26 60,26 74,40 100,40 112,54 134,54 148,68 160,68 172,82 186,82";
  const baton2 = "30,40 58,40 76,54 98,54 116,68 140,68 156,82 170,82 180,96 188,96";
  return (
    <>
      {lanes.map((lane, index) => (
        <line
          key={lane.y}
          x1={lane.x0}
          y1={lane.y}
          x2={lane.x1}
          y2={lane.y}
          stroke="currentColor"
          strokeWidth={1.6}
          opacity={index < 3 ? 0.22 : 0.5}
        />
      ))}
      <polyline
        points={baton1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        opacity={0.9}
      />
      <polyline
        points={baton2}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeDasharray="3 2.4"
        opacity={0.6}
      />
      <circle cx={186} cy={82} r={3} fill="currentColor" opacity={0.95} />
      <circle cx={188} cy={96} r={2.2} fill="currentColor" opacity={0.7} />
    </>
  );
}

/** Full-Stack Strata: lát cắt đảo 3 tầng + packet xuyên tầng. */
function FullStackStrataMarks() {
  const buildings = [
    { x: 68, w: 5, h: 9 },
    { x: 78, w: 6, h: 14 },
    { x: 90, w: 5, h: 7 },
    { x: 99, w: 7, h: 12 },
    { x: 112, w: 5, h: 10 },
    { x: 121, w: 6, h: 6 },
  ];
  const crystals = [
    { x: 82, y: 84 },
    { x: 96, y: 90 },
    { x: 112, y: 86 },
    { x: 124, y: 92 },
  ];
  return (
    <>
      {/* 3 tầng đảo: mặt cát, seam sáng, đá nền thuôn */}
      <polygon
        points="52,38 148,38 144,52 56,52"
        fill="currentColor"
        opacity={0.35}
        stroke="currentColor"
        strokeWidth={0.7}
      />
      <rect
        x={56}
        y={52}
        width={88}
        height={7}
        fill="currentColor"
        opacity={0.85}
      />
      <polygon
        points="58,59 142,59 118,102 84,102"
        fill="currentColor"
        opacity={0.22}
        stroke="currentColor"
        strokeWidth={0.7}
      />
      {buildings.map((building) => (
        <rect
          key={building.x}
          x={building.x}
          y={38 - building.h}
          width={building.w}
          height={building.h}
          fill="currentColor"
          opacity={0.6}
        />
      ))}
      {crystals.map((crystal) => (
        <polygon
          key={crystal.x}
          points={`${crystal.x},${crystal.y - 5} ${crystal.x + 3.4},${crystal.y} ${crystal.x},${crystal.y + 5} ${crystal.x - 3.4},${crystal.y}`}
          fill="currentColor"
          opacity={0.7}
        />
      ))}
      {/* Trace packet xuyên tầng */}
      <line
        x1={102}
        y1={20}
        x2={102}
        y2={88}
        stroke="currentColor"
        strokeWidth={0.8}
        strokeDasharray="2.5 2.5"
        opacity={0.6}
      />
      <circle cx={102} cy={55.5} r={3} fill="currentColor" opacity={0.95} />
    </>
  );
}

/** Glyph Field: chữ KY từ dot-matrix, hạt transit bay tản sang phải. */
function GlyphFieldMarks() {
  const K = ["10001", "10010", "10100", "11000", "10100", "10010", "10001"];
  const Y = ["10001", "01010", "00100", "00100", "00100", "00100", "00100"];
  const rand = mulberry32(17);
  const dots: { x: number; y: number; o: number }[] = [];
  const cell = 6.4;
  const baseY = 34;
  [K, Y].forEach((matrix, letterIndex) => {
    const baseX = 30 + letterIndex * 46;
    matrix.forEach((row, rowIndex) => {
      [...row].forEach((filled, colIndex) => {
        if (filled === "1") {
          dots.push({
            x: baseX + colIndex * cell,
            y: baseY + rowIndex * cell,
            o: 0.9,
          });
        }
      });
    });
  });
  const transit: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 26; i += 1) {
    transit.push({
      x: 118 + rand() * 74,
      y: 26 + rand() * 68,
      r: 0.8 + rand() * 1.3,
      o: 0.15 + rand() * 0.45,
    });
  }
  return (
    <>
      {dots.map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={2}
          fill="currentColor"
          opacity={dot.o}
        />
      ))}
      {transit.map((dot) => (
        <circle
          key={`t-${dot.x.toFixed(1)}-${dot.y.toFixed(1)}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill="currentColor"
          opacity={dot.o}
        />
      ))}
    </>
  );
}

/** Desk, Version-Controlled: bàn isometric + nhánh git, đồ cũ nét đứt đã remove. */
function DeskVersionControlledMarks() {
  const alive = [
    { x: 84, y: 40, w: 34, h: 20 },
    { x: 66, y: 58, w: 26, h: 6 },
    { x: 128, y: 52, w: 10, h: 14 },
  ];
  const removed = [
    { x: 46, y: 48, w: 18, h: 13 },
    { x: 122, y: 30, w: 14, h: 10 },
  ];
  const nodes = [24, 52, 80, 108, 136, 164];
  return (
    <>
      {/* Mặt bàn isometric */}
      <polygon
        points="30,78 100,62 170,78 100,94"
        fill="currentColor"
        opacity={0.3}
        stroke="currentColor"
        strokeWidth={0.8}
      />
      {alive.map((object) => (
        <rect
          key={`${object.x}-${object.y}`}
          x={object.x}
          y={object.y}
          width={object.w}
          height={object.h}
          fill="currentColor"
          opacity={0.7}
        />
      ))}
      {removed.map((object) => (
        <rect
          key={`${object.x}-${object.y}`}
          x={object.x}
          y={object.y}
          width={object.w}
          height={object.h}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.8}
          strokeDasharray="2.4 2.2"
          opacity={0.35}
        />
      ))}
      {/* Nhánh git dọc đáy */}
      <line
        x1={16}
        y1={106}
        x2={184}
        y2={106}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.6}
      />
      {nodes.map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy={106}
          r={index === nodes.length - 1 ? 3.2 : 2.2}
          fill="currentColor"
          opacity={index === nodes.length - 1 ? 0.95 : 0.55}
        />
      ))}
    </>
  );
}

/** Commit Skyline: 10 block năm bar-city, landmark cao với beacon. */
function CommitSkylineMarks() {
  const rand = mulberry32(29);
  const groundY = 100;
  const bars: { x: number; h: number }[] = [];
  for (let block = 0; block < 10; block += 1) {
    for (let i = 0; i < 5; i += 1) {
      bars.push({
        x: 12 + block * 18 + i * 2.9,
        h: 4 + rand() * 26 * (0.5 + block * 0.06),
      });
    }
  }
  const landmarks = [bars[17], bars[38]];
  return (
    <>
      <line
        x1={8}
        y1={groundY}
        x2={W - 8}
        y2={groundY}
        stroke="currentColor"
        strokeWidth={0.8}
        opacity={0.5}
      />
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={groundY - bar.h}
          width={2.1}
          height={bar.h}
          fill="currentColor"
          opacity={0.28 + (bar.h / 34) * 0.5}
        />
      ))}
      {landmarks.map((bar) => (
        <g key={`lm-${bar.x}`}>
          <rect
            x={bar.x - 0.4}
            y={groundY - bar.h - 16}
            width={3}
            height={bar.h + 16}
            fill="currentColor"
            opacity={0.9}
          />
          <circle
            cx={bar.x + 1.1}
            cy={groundY - bar.h - 19}
            r={2.2}
            fill="currentColor"
            opacity={0.95}
          />
        </g>
      ))}
    </>
  );
}

/** Cabinet of Shipped Worlds: tủ kính 4×2, hàng trên có diorama, hàng dưới phủ sương. */
function CabinetMarks() {
  const cellW = 42;
  const cellH = 38;
  const x0 = 16;
  const y0 = 18;
  const cells: React.ReactElement[] = [];
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 2; row += 1) {
      const x = x0 + col * cellW;
      const y = y0 + row * cellH;
      const live = row === 0;
      const hovered = col === 1 && row === 0;
      cells.push(
        <g key={`${col}-${row}`}>
          <rect
            x={x}
            y={y}
            width={cellW - 6}
            height={cellH - 6}
            fill="none"
            stroke="currentColor"
            strokeWidth={hovered ? 1.4 : 0.8}
            opacity={hovered ? 0.95 : 0.5}
          />
          {live ? (
            <>
              {col === 0 && (
                <>
                  <circle cx={x + 12} cy={y + 22} r={3} fill="currentColor" opacity={0.8} />
                  <circle cx={x + 20} cy={y + 22} r={3} fill="currentColor" opacity={0.6} />
                  <circle cx={x + 28} cy={y + 22} r={3} fill="currentColor" opacity={0.4} />
                </>
              )}
              {col === 1 && (
                <>
                  <line x1={x + 26} y1={y + 8} x2={x + 26} y2={y + 26} stroke="currentColor" strokeWidth={1} opacity={0.85} />
                  <line x1={x + 10} y1={y + 12} x2={x + 26} y2={y + 12} stroke="currentColor" strokeWidth={1} opacity={0.85} />
                  <rect x={x + 8} y={y + 20} width={8} height={6} fill="currentColor" opacity={0.7} />
                </>
              )}
              {col === 2 && (
                <>
                  <line x1={x + 8} y1={y + 12} x2={x + 24} y2={y + 12} stroke="currentColor" strokeWidth={1.4} opacity={0.7} />
                  <line x1={x + 8} y1={y + 18} x2={x + 20} y2={y + 18} stroke="currentColor" strokeWidth={1.4} opacity={0.5} />
                  <line x1={x + 8} y1={y + 24} x2={x + 27} y2={y + 24} stroke="currentColor" strokeWidth={1.4} opacity={0.6} />
                </>
              )}
              {col === 3 && (
                <>
                  <circle cx={x + 18} cy={y + 18} r={7} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.7} />
                  <line x1={x + 18} y1={y + 11} x2={x + 18} y2={y + 4} stroke="currentColor" strokeWidth={1} opacity={0.85} />
                </>
              )}
            </>
          ) : (
            [0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={x + 4 + i * 9}
                y1={y + 4}
                x2={x + 4 + i * 9 - 6}
                y2={y + cellH - 10}
                stroke="currentColor"
                strokeWidth={2.4}
                opacity={0.12}
              />
            ))
          )}
        </g>,
      );
    }
  }
  return <>{cells}</>;
}

/** Phosphor Lens: rừng glyph chấm với một vòng thấu kính lộ profile tiện. */
function PhosphorLensMarks() {
  const rand = mulberry32(23);
  const lensX = 118;
  const lensY = 58;
  const lensR = 30;
  const glyphs: { x: number; y: number; tall: boolean }[] = [];
  for (let i = 0; i < 210; i += 1) {
    const x = 10 + rand() * 180;
    const y = 14 + rand() * 92;
    if (Math.hypot(x - lensX, y - lensY) > lensR + 2) {
      glyphs.push({ x, y, tall: rand() > 0.6 });
    }
  }
  return (
    <>
      {glyphs.map((glyph) => (
        <rect
          key={`${glyph.x.toFixed(1)}-${glyph.y.toFixed(1)}`}
          x={glyph.x}
          y={glyph.y}
          width={1.6}
          height={glyph.tall ? 4 : 1.6}
          fill="currentColor"
          opacity={0.4}
        />
      ))}
      <circle
        cx={lensX}
        cy={lensY}
        r={lensR}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        opacity={0.9}
      />
      {/* Profile khối tiện lộ trong thấu kính */}
      <polyline
        points={`${lensX - 8},${lensY + 20} ${lensX - 8},${lensY + 4} ${lensX - 13},${lensY} ${lensX - 8},${lensY - 4} ${lensX - 8},${lensY - 12} ${lensX - 4},${lensY - 18} ${lensX + 4},${lensY - 18} ${lensX + 8},${lensY - 12} ${lensX + 8},${lensY - 4} ${lensX + 13},${lensY} ${lensX + 8},${lensY + 4} ${lensX + 8},${lensY + 20}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        opacity={0.95}
      />
      <line
        x1={lensX - 14}
        y1={lensY + 20}
        x2={lensX + 14}
        y2={lensY + 20}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.7}
      />
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
  "daily-driver": DailyDriverMarks,
  "constraint-prism": ConstraintPrismMarks,
  "leverage-engine": LeverageEngineMarks,
  "gravity-toybox": GravityToyboxMarks,
  "dependency-constellation": DependencyConstellationMarks,
  "knowledge-relay": KnowledgeRelayMarks,
  "full-stack-strata": FullStackStrataMarks,
  "glyph-field": GlyphFieldMarks,
  "desk-version-controlled": DeskVersionControlledMarks,
  "commit-skyline": CommitSkylineMarks,
  "cabinet-of-shipped-worlds": CabinetMarks,
  "phosphor-lens": PhosphorLensMarks,
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
