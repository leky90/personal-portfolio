import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { listWritingPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Writing — Ky Le",
  description:
    "Notes on systems, WebGL and the engineering behind this site.",
};

export default function WritingIndexPage() {
  const posts = listWritingPosts();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/"
        className="inline-block rounded border border-neutral-800 bg-black/60 px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
      >
        ← portfolio
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
        Writing
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
        Notes on systems, WebGL, and the engineering behind this site.
      </p>

      <ul className="mt-10 space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}`} className="group block">
              <p className="font-mono text-[11px] text-neutral-500">
                {post.date}
              </p>
              <h2 className="mt-1 text-lg font-medium text-neutral-100 transition-colors group-hover:text-[#ffb454]">
                {post.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                {post.description}
              </p>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-neutral-800 font-mono text-[10px] text-neutral-500"
                  >
                    {tag}
                  </Badge>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
