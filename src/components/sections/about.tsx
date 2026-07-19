const STATS = [
  { value: "10+", label: "years shipping" },
  { value: "12", label: "systems built & run" },
  { value: "4", label: "teams led" },
];

export function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
        About
      </h2>
      {/* ⚠️ PLACEHOLDER — thay bằng giới thiệu thật */}
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-300">
        I design, build and operate systems that outlive their launch week —
        from the first monolith to a platform serving 40M requests a day. The
        terrain behind this page is that decade, rendered from real weekly
        output.
      </p>
      <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dt className="font-mono text-3xl text-neutral-100">
              {stat.value}
            </dt>
            <dd className="mt-1 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
