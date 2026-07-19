import type { Metadata } from "next";
import Link from "next/link";
import {
  CONCEPTS,
  type ConceptId,
  type ConceptMeta,
} from "@/features/concepts/registry";

export const metadata: Metadata = {
  title: "Concept Lab — 5 hướng 3D đã thử",
  description:
    "Kho lưu 5 concept 3D đã demo và chấm điểm trong quá trình chọn art direction cho portfolio — Terrain là hướng được chốt.",
};

// Tailwind cần class literal để compile — map accent tĩnh theo concept id.
const ACCENT_CLASSES: Record<ConceptId, { border: string; text: string }> = {
  terrain: {
    border: "hover:border-[#ffb454]/60",
    text: "text-[#ffb454]",
  },
  resolution: {
    border: "hover:border-[#b4ff39]/60",
    text: "text-[#b4ff39]",
  },
  monolith: {
    border: "hover:border-[#ff4d4d]/60",
    text: "text-[#ff4d4d]",
  },
  "compiled-light": {
    border: "hover:border-[#e8e3d5]/60",
    text: "text-[#e8e3d5]",
  },
  "living-topology": {
    border: "hover:border-[#4af2a1]/60",
    text: "text-[#4af2a1]",
  },
};

/** Concept đã được chốt làm art direction của portfolio. */
const CHOSEN_ID: ConceptId = "terrain";

interface ScoreChipProps {
  label: string;
  value: number;
}

function ScoreChip({ label, value }: ScoreChipProps) {
  return (
    <span className="rounded border border-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
      {label} <span className="text-neutral-200">{value.toFixed(1)}</span>
    </span>
  );
}

interface ConceptCardProps {
  concept: ConceptMeta;
}

function ConceptCard({ concept }: ConceptCardProps) {
  const accent = ACCENT_CLASSES[concept.id];
  const isChosen = concept.id === CHOSEN_ID;

  return (
    <Link
      href={`/concepts/${concept.id}`}
      className={`block rounded-lg border bg-neutral-950/60 p-4 transition-colors sm:p-5 ${
        isChosen
          ? "border-[#ffb454]/50"
          : "border-neutral-800/80"
      } ${accent.border} hover:bg-neutral-900/60`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className={`font-mono text-sm ${accent.text}`}>
            {String(concept.rank).padStart(2, "0")}
          </span>
          <span className="truncate text-base font-medium text-neutral-100 sm:text-lg">
            {concept.title}
          </span>
        </div>
        {isChosen ? (
          <span className="shrink-0 rounded bg-[#ffb454]/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-[#ffb454] uppercase">
            ★ đã chốt
          </span>
        ) : (
          <span className="shrink-0 rounded bg-neutral-900 px-2 py-0.5 font-mono text-[10px] tracking-wider text-neutral-300 uppercase">
            xem demo →
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400">
        {concept.tagline}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ScoreChip label="overall" value={concept.scores.overall} />
        <ScoreChip label="senior" value={concept.scores.seniorSignal} />
        <ScoreChip label="feas" value={concept.scores.feasibility} />
        <ScoreChip label="perf" value={concept.scores.performance} />
        <span className="ml-auto font-mono text-[10px] text-neutral-600">
          khó {concept.difficulty}/5 · ~{concept.effortDays} ngày
        </span>
      </div>
    </Link>
  );
}

export default function ConceptLabPage() {
  const sorted = [...CONCEPTS].sort((a, b) => a.rank - b.rank);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <Link
          href="/"
          className="inline-block rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
        >
          ← portfolio
        </Link>
        <p className="mt-6 font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
          3D Concept Lab — kho lưu trữ
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
          5 hướng đã thử trước khi chốt Terrain
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          18 đề xuất → hội đồng 3 giám khảo → 5 demo chạy được. Terrain thắng
          và trở thành art direction của portfolio; 4 hướng còn lại giữ ở đây
          để tham khảo.
        </p>
      </header>

      <section aria-label="Danh sách concept" className="mt-8 flex flex-col gap-3 sm:mt-10">
        {sorted.map((concept) => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </section>

      <footer className="mt-10 border-t border-neutral-900 pt-4">
        <p className="font-mono text-[10px] leading-relaxed text-neutral-600">
          Nguồn điểm: docs/plans/2026-07-14-portfolio-3d-design.md
        </p>
      </footer>
    </main>
  );
}
