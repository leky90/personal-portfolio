import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/data/site";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.3em] text-[#ffb454] uppercase">
        2016 — 2026 · {SITE.location}
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-neutral-50 sm:text-7xl">
        {SITE.name}
      </h1>
      <p className="mt-3 text-lg text-neutral-300 sm:text-xl">{SITE.title}</p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
        {SITE.tagline}
      </p>

      {SITE.available && (
        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-neutral-800 bg-black/50 px-3 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur">
          <span className="inline-block size-1.5 rounded-full bg-[#4af2a1] motion-safe:animate-pulse" />
          Open to new opportunities
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          asChild
          variant="outline"
          className="border-[#ffb454]/40 font-mono text-[#ffb454] hover:bg-[#ffb454]/10 hover:text-[#ffb454]"
        >
          <a href="#experience">Fly through the decade ↓</a>
        </Button>
        <Button asChild variant="ghost" className="font-mono text-neutral-300">
          <a href={`mailto:${SITE.email}`}>Get in touch</a>
        </Button>
      </div>

      <p className="mt-14 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
        ↓ scroll — each contour line below is one week of work
      </p>
    </section>
  );
}
