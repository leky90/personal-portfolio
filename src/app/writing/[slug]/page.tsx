import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  compileMdxBody,
  getWritingPost,
  listWritingPosts,
} from "@/lib/mdx";

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listWritingPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingPost(slug);
  return {
    title: post ? `${post.meta.title} — Writing` : "Writing",
    description: post?.meta.description,
  };
}

export default async function WritingPostPage({
  params,
}: WritingPostPageProps) {
  const { slug } = await params;
  const post = getWritingPost(slug);
  if (!post) {
    notFound();
  }
  const body = await compileMdxBody(post.source);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/writing"
        className="inline-block rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
      >
        ← writing
      </Link>

      <header className="mt-8">
        <p className="font-mono text-[11px] text-neutral-500">
          {post.meta.date}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          {post.meta.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.meta.tags.map((tag) => (
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
        {body}
      </article>
    </div>
  );
}
