import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PROJECTS } from "@/lib/data/projects";
import {
  compileMdxBody,
  getProjectStudySource,
  listProjectStudySlugs,
} from "@/lib/mdx";
import { SITE } from "@/lib/data/site";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listProjectStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  return {
    title: project ? `${project.title} — Case Study` : "Case Study",
    description: project?.summary,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: CaseStudyPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  const source = getProjectStudySource(slug);
  if (!project || !source) {
    notFound();
  }
  const body = await compileMdxBody(source);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/#work"
        className="inline-block rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
      >
        ← work
      </Link>

      <header className="mt-8">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#ffb454] uppercase">
          Case study · {project.period}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-2 font-mono text-xs tracking-wider text-neutral-500 uppercase">
          {project.role}
        </p>
        <p className="mt-4 font-mono text-xs text-[#ffb454]/80">
          {project.metrics.join(" · ")}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="border-neutral-800 font-mono text-[10px] text-neutral-400"
            >
              {item}
            </Badge>
          ))}
        </div>
      </header>

      <Separator className="my-10 bg-neutral-900" />

      <article className="prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-[#ffb454] prose-code:font-mono prose-pre:border prose-pre:border-neutral-900 prose-pre:bg-neutral-950">
        {body}
      </article>

      <Separator className="my-10 bg-neutral-900" />

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-400">
          Muốn nghe phần chưa viết ra ở đây?
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="rounded border border-[#ffb454]/40 px-4 py-2 font-mono text-sm text-[#ffb454] transition-colors hover:bg-[#ffb454]/10"
        >
          {SITE.email} →
        </a>
      </footer>
    </div>
  );
}
