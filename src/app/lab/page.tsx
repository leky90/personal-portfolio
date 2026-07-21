import type { PageMetadata } from "@/lib/page-meta";
import { Link } from "react-router";
import { ConceptSketch } from "@/components/lab/concept-sketch";
import {
  CONCEPTS,
  type ConceptMeta,
} from "@/features/concepts/registry";

const READY_COUNT = CONCEPTS.filter(
  (concept) => concept.status === "ready",
).length;

export const metadata: PageMetadata = {
  title: "Concept Lab",
  description: `Kho lưu quá trình chọn art direction cho portfolio: ${CONCEPTS.length} concept từ hai vòng đề xuất, chấm mù trên cùng một thang điểm, ${READY_COUNT} demo chạy được. Terrain là hướng được chốt.`,
};

/**
 * Trang review concept theo ngôn ngữ editorial-tech / Neo-Swiss:
 * index dạng bảng biên tập với numeral lớn, sketch generative per-concept,
 * hairline phân hàng, một accent hổ phách duy nhất, góc vuông toàn trang.
 */

function ConceptRow({ concept }: { concept: ConceptMeta }) {
  const isChosen = concept.id === "terrain";
  const isReady = concept.status === "ready";

  const rowBody = (
    <>
      <p className="font-mono text-2xl text-neutral-600 tabular-nums transition-colors group-hover:text-neutral-300 sm:col-span-1">
        {String(concept.rank).padStart(2, "0")}
      </p>

      <div
        className={`border border-neutral-800 bg-neutral-950 p-3 transition-all group-hover:border-neutral-600 group-hover:shadow-[6px_6px_0_0_#262626] sm:col-span-3 ${
          isChosen ? "text-[#ffb454]" : "text-neutral-400"
        }`}
      >
        <div className="aspect-[5/3]">
          <ConceptSketch id={concept.id} />
        </div>
      </div>

      <div className="sm:col-span-5">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-100 transition-colors group-hover:text-[#ffb454] sm:text-2xl">
          {concept.title}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-400">
          {concept.tagline}
        </p>
        <p className="mt-3 font-mono text-[11px] text-neutral-500">
          khó {concept.difficulty}/5 · ~{concept.effortDays} ngày build
        </p>
      </div>

      <div className="font-mono text-[11px] leading-relaxed text-neutral-500 tabular-nums sm:col-span-2">
        <p className="text-2xl text-neutral-100">
          {concept.scores.overall.toFixed(1)}
        </p>
        <p>senior {concept.scores.seniorSignal.toFixed(1)}</p>
        <p>khả thi {concept.scores.feasibility.toFixed(1)}</p>
        <p>perf {concept.scores.performance.toFixed(1)}</p>
      </div>

      <div className="sm:col-span-1 sm:justify-self-end">
        {isChosen ? (
          <span className="inline-block -rotate-3 border-2 border-[#ffb454] px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-[#ffb454] uppercase">
            đã chốt
          </span>
        ) : isReady ? (
          <span className="inline-block border border-neutral-800 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            đã build
          </span>
        ) : (
          <span className="inline-block border border-dashed border-neutral-800 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
            chờ build
          </span>
        )}
      </div>
    </>
  );

  const rowClasses =
    "group grid grid-cols-1 gap-x-8 gap-y-4 py-8 sm:grid-cols-12 sm:items-center";

  if (!isReady) {
    return <div className={`${rowClasses} opacity-75`}>{rowBody}</div>;
  }

  return (
    <Link to={`/concepts/${concept.id}`} className={rowClasses}>
      {rowBody}
    </Link>
  );
}

const MATRIX_COLUMNS = [
  { key: "overall", label: "Overall" },
  { key: "originality", label: "Original" },
  { key: "seniorSignal", label: "Senior" },
  { key: "feasibility", label: "Khả thi" },
  { key: "performance", label: "Perf" },
] as const;

export default function ConceptLabPage() {
  const sorted = [...CONCEPTS].sort((a, b) => a.rank - b.rank);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      <header className="border-b border-neutral-800 pt-8 pb-12 sm:pt-10">
        <div className="flex items-start justify-between gap-4">
          <Link
            to="/"
            className="border border-neutral-800 px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-100"
          >
            ← portfolio
          </Link>
          <div className="text-right font-mono text-[11px] leading-relaxed text-neutral-500 tabular-nums">
            <p>{CONCEPTS.length} concept</p>
            <p>3 giám khảo chấm mù</p>
            <p>{READY_COUNT} demo chạy được</p>
          </div>
        </div>
        <h1 className="mt-12 text-5xl font-semibold tracking-tighter text-neutral-50 sm:text-7xl">
          Concept Lab
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-400">
          Nhật ký chọn art direction cho portfolio. Terrain đang chạy ở trang
          chủ; bảng dưới là 26 concept từ hai vòng đề xuất, chấm lại trên cùng
          một thang điểm ngày 20/07. Toàn bộ 26 demo đã build xong và click
          vào được từng cái.
        </p>
      </header>

      <section
        aria-label="Danh sách concept"
        className="divide-y divide-neutral-800 border-b border-neutral-800"
      >
        {sorted.map((concept) => (
          <ConceptRow key={concept.id} concept={concept} />
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
          Ma trận điểm
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-400">
          Trung bình từ ba giám khảo mô phỏng: hiring manager, chuyên gia hiệu
          năng đồ họa và giám khảo Awwwards.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse font-mono text-xs tabular-nums">
            <thead>
              <tr className="border-b border-neutral-700 text-left text-[10px] tracking-wider text-neutral-500 uppercase">
                <th className="py-2 pr-4 font-normal">Concept</th>
                {MATRIX_COLUMNS.map((column) => (
                  <th key={column.key} className="py-2 pr-4 font-normal">
                    {column.label}
                  </th>
                ))}
                <th className="py-2 pr-4 font-normal">Khó</th>
                <th className="py-2 font-normal">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70">
              {sorted.map((concept) => {
                const isChosen = concept.id === "terrain";
                return (
                  <tr
                    key={concept.id}
                    className={isChosen ? "text-[#ffb454]" : "text-neutral-300"}
                  >
                    <td className="py-2.5 pr-4 font-sans text-sm">
                      {concept.title}
                      {isChosen && " ★"}
                    </td>
                    {MATRIX_COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className={`py-2.5 pr-4 ${
                          column.key === "overall" ? "font-semibold" : ""
                        }`}
                      >
                        {concept.scores[column.key].toFixed(1)}
                      </td>
                    ))}
                    <td className="py-2.5 pr-4">{concept.difficulty}/5</td>
                    <td className="py-2.5">~{concept.effortDays}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[11px] text-neutral-500">
          Nguồn: docs/plans/2026-07-14-portfolio-3d-design.md
        </p>
      </section>
    </main>
  );
}
