import Link from "next/link";
import type { ConceptMeta } from "@/features/concepts/registry";

interface ConceptShellProps {
  concept: ConceptMeta;
  children: React.ReactNode;
}

/**
 * Overlay khung chung cho mọi trang concept demo: link quay lại gallery,
 * tên + điểm concept. pointer-events-none để không chặn tương tác canvas,
 * chỉ bật lại trên phần tử tương tác được.
 */
export function ConceptShell({ concept, children }: ConceptShellProps) {
  return (
    // KHÔNG đặt bg ở đây — canvas concept nằm fixed -z-10, một background đặc
    // tại wrapper sẽ vẽ đè lên nó; nền tối đã có sẵn ở body.
    <div className="relative min-h-dvh text-foreground">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="min-w-0">
          <Link
            href="/"
            className="pointer-events-auto inline-block rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 backdrop-blur transition-colors hover:border-neutral-600 hover:text-neutral-100"
          >
            ← concepts
          </Link>
          <h1 className="mt-2 truncate font-mono text-xs tracking-widest text-neutral-300 uppercase sm:text-sm">
            {String(concept.rank).padStart(2, "0")} · {concept.title}
          </h1>
        </div>
        <span
          className="shrink-0 rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 backdrop-blur"
          title="Điểm trung bình từ hội đồng 3 giám khảo"
        >
          {concept.scores.overall.toFixed(1)}/10
        </span>
      </header>
      {children}
    </div>
  );
}
