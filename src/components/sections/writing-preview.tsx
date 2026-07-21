import { Link } from "react-router";
import { listWritingPosts } from "@/lib/mdx";

export function WritingPreview() {
  const posts = listWritingPosts().slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
          Writing
        </h2>
        <Link
          to="/writing"
          className="font-mono text-[11px] text-neutral-400 underline-offset-4 transition-colors hover:text-[#ffb454] hover:underline"
        >
          All posts →
        </Link>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/writing/${post.slug}`}
              className="group block rounded-lg border border-neutral-900 bg-neutral-950/70 p-4 backdrop-blur-sm transition-colors hover:border-neutral-700"
            >
              <p className="font-mono text-[11px] text-neutral-500">
                {post.date}
              </p>
              <h3 className="mt-1 text-base font-medium text-neutral-100 transition-colors group-hover:text-[#ffb454]">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
