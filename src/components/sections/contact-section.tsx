import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/data/site";

/**
 * Cuối hành trình: sau ridge cuối, địa hình phẳng thành đường chân trời —
 * dấu chấm hết thị giác của 10 năm, và lời mời cho 10 năm tiếp theo.
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto flex min-h-[92vh] w-full max-w-5xl scroll-mt-20 flex-col items-center justify-center px-4 text-center sm:px-6"
    >
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-neutral-50 sm:text-5xl">
        The next peak is your project.
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
        The terrain has flattened into a horizon — the next ten years start
        with a conversation.
      </p>
      <Button
        asChild
        className="mt-8 border border-[#ffb454]/40 bg-transparent font-mono text-[#ffb454] hover:bg-[#ffb454]/10"
      >
        <a href={`mailto:${SITE.email}`}>{SITE.email} →</a>
      </Button>
      <div className="mt-6 flex gap-4">
        {SITE.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-200 hover:underline"
          >
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );
}
