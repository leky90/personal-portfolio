import { Link } from "react-router";
import { SITE } from "@/lib/data/site";

const NAV_ITEMS = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#work", label: "work" },
  { href: "#skills", label: "skills" },
  { href: "/writing", label: "writing" },
  { href: "#contact", label: "contact" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-neutral-900 focus:px-3 focus:py-1.5 focus:font-mono focus:text-xs focus:text-neutral-100"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="rounded bg-black/40 px-2 py-1 font-mono text-sm tracking-wide text-neutral-100 backdrop-blur transition-colors hover:text-[#ffb454]"
        >
          {SITE.name}
        </Link>
        <nav aria-label="Main" className="hidden gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 font-mono text-[11px] tracking-wider text-neutral-400 uppercase backdrop-blur transition-colors hover:bg-neutral-900/60 hover:text-neutral-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
