import { EXPERIENCE } from "@/lib/data/experience";

/**
 * Timeline = hành trình camera qua địa hình. Mỗi card chiếm gần trọn màn
 * hình để terrain phía sau có sân khấu; data-era-index cho TerrainStage dò
 * era active (dải contour hổ phách quét theo card đang đọc).
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-5xl px-4 pt-24 sm:px-6">
        <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
          Experience — twelve years in terrain
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
          Scroll to fly along the time axis. Peaks are the years the work
          peaked; the amber contour marks the era you are reading.
        </p>
      </div>
      <ol className="list-none">
        {EXPERIENCE.map((era, index) => (
          <li key={era.year}>
            <div className="mx-auto flex min-h-[92vh] w-full max-w-5xl items-center px-4 sm:px-6">
              <article
                data-era-index={index}
                className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 backdrop-blur-sm ${
                  era.side === "right" ? "ml-auto" : ""
                }`}
              >
                <p className="font-mono text-3xl text-[#ffb454] sm:text-4xl">
                  {era.year}
                </p>
                <h3 className="mt-2 text-lg font-medium text-neutral-100">
                  {era.title}
                </h3>
                <p className="mt-1 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                  {era.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {era.description}
                </p>
                <p className="mt-4 border-t border-neutral-900 pt-3 font-mono text-[11px] text-neutral-500">
                  {era.metric}
                </p>
              </article>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
