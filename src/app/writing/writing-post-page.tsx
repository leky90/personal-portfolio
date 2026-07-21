import { Link, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NotFoundPage } from "@/app/not-found-page";
import { getWritingPost } from "@/lib/mdx";
import { articleJsonLd, jsonLdScript } from "@/lib/json-ld";
import { PageMeta } from "@/lib/page-meta";

export default function WritingPostPage() {
  const { slug } = useParams();
  const post = slug ? getWritingPost(slug) : null;
  if (!post) {
    return <NotFoundPage />;
  }
  const { meta, Body } = post;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <PageMeta
        meta={{
          title: `${meta.title} — Writing`,
          description: meta.description,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(articleJsonLd(meta)),
        }}
      />
      <Link
        to="/writing"
        className="inline-block rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
      >
        ← writing
      </Link>

      <header className="mt-8">
        <p className="font-mono text-[11px] text-neutral-500">{meta.date}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          {meta.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-neutral-800 font-mono text-[10px] text-neutral-500"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <Separator className="my-10 bg-neutral-900" />

      <article className="prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-[#ffb454] prose-code:font-mono prose-pre:border prose-pre:border-neutral-900 prose-pre:bg-neutral-950">
        <Body />
      </article>
    </div>
  );
}
