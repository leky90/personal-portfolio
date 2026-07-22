/** Chỉ dùng số liệu kiểm chứng được trên hồ sơ công khai (xem lib/data/site.ts). */
const STATS = [
  { value: "12", label: "years shipping" },
  { value: "4.9", label: "rating · 125 reviews" },
  { value: "8", label: "engineers led" },
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
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-300">
        I started in 2014 taking freelance PHP jobs from Hue, and I now lead the
        frontend of a DeFi platform for tokenised real-world assets, with a team
        of eight. Between those two points: agency full-stack work, remote
        delivery for client after client, and a lot of legacy code made to run
        properly again. The terrain behind this page is that arc.
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
