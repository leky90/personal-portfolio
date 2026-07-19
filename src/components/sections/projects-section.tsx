import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROJECTS } from "@/lib/data/projects";

export function ProjectsSection() {
  return (
    <section
      id="work"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
        Selected Work
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {PROJECTS.map((project) => (
          <Card
            key={project.slug}
            className="border-neutral-900 bg-neutral-950/70 backdrop-blur-sm"
          >
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">
                {project.title}
              </CardTitle>
              <p className="font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                {project.role} · {project.period}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-400">
                {project.summary}
              </p>
              <p className="mt-3 font-mono text-[11px] text-[#ffb454]/80">
                {project.metrics.join(" · ")}
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className="mt-3 inline-block font-mono text-[11px] text-neutral-300 underline-offset-4 transition-colors hover:text-[#ffb454] hover:underline"
              >
                Read case study →
              </Link>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="border-neutral-800 font-mono text-[10px] text-neutral-400"
                >
                  {item}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
