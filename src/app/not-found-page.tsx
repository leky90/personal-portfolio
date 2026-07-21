import { Link } from "react-router";
import { PageMeta } from "@/lib/page-meta";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-start justify-center px-4 sm:px-6">
      <PageMeta meta={{ title: "404" }} />
      <p className="font-mono text-[11px] tracking-[0.3em] text-[#ffb454] uppercase">
        404 · không có route này
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-50">
        Trang không tồn tại
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
        Đường dẫn này không khớp trang nào trong portfolio. Có thể bạn
        theo một link cũ, hoặc gõ nhầm slug.
      </p>
      <Link
        to="/"
        className="mt-8 rounded border border-neutral-800 px-3 py-1.5 font-mono text-xs text-neutral-300 transition-colors hover:border-neutral-500"
      >
        ← về trang chủ
      </Link>
    </div>
  );
}
