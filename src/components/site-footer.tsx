import Link from "next/link";
import { SITE } from "@/lib/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-[10px] text-neutral-500">
          © 2026 {SITE.name} · Next.js + React Three Fiber
        </p>
        <p className="font-mono text-[10px] leading-relaxed text-neutral-500">
          The terrain is one draw call, frameloop=&ldquo;demand&rdquo; — the
          GPU sleeps when you stop scrolling ·{" "}
          <Link
            href="/lab"
            className="underline underline-offset-2 transition-colors hover:text-neutral-300"
          >
            concept lab
          </Link>
        </p>
      </div>
    </footer>
  );
}
