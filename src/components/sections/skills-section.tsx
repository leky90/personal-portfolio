import { Badge } from "@/components/ui/badge";
import { SKILL_GROUPS } from "@/lib/data/skills";

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
        Skills
      </h2>
      <div className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
              {group.label}
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="bg-neutral-900/80 font-mono text-[11px] font-normal text-neutral-300"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
