"use client";

import { createRef, useEffect, useRef, type RefObject } from "react";
import { ResolutionCanvasLoader } from "@/features/concepts/resolution/components/resolution-canvas-loader";
import { COVER_PROJECTS } from "@/features/concepts/resolution/lib/cover-data";
import {
  createSceneState,
  type SceneState,
} from "@/features/concepts/resolution/lib/scene-state";

interface SkillEntry {
  name: string;
  /** Số ô đặc trên thang 16 — khớp 16 bucket glyph của shader */
  level: number;
}

const SKILLS: SkillEntry[] = [
  { name: "TypeScript / Node", level: 14 },
  { name: "React / Next.js", level: 13 },
  { name: "Distributed Systems", level: 12 },
  { name: "PostgreSQL / Data", level: 11 },
  { name: "WebGL / Three.js", level: 9 },
  { name: "Infra / Kubernetes", level: 10 },
];

function skillBar(level: number): string {
  return "▮".repeat(level) + "▯".repeat(16 - level);
}

/**
 * Layout DOM của concept Resolution. Mọi tương tác pointer ghi thẳng vào
 * SceneState (mutable ref) rồi gọi invalidate() — không re-render React.
 */
export function ResolutionExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const coverTrackRefs = useRef(
    COVER_PROJECTS.map(() => createRef<HTMLDivElement>()),
  ).current;

  const sceneStateRef = useRef<SceneState | null>(null);
  if (sceneStateRef.current === null) {
    sceneStateRef.current = createSceneState(COVER_PROJECTS.length);
  }
  const sceneState = sceneStateRef.current;

  useEffect(() => {
    // jsdom không có matchMedia — guard để test DOM chạy được.
    if (typeof window.matchMedia !== "function") return;
    sceneState.isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    sceneState.cellScale = window.matchMedia("(max-width: 640px)").matches
      ? 1.5
      : 1;
  }, [sceneState]);

  const updateLens = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = heroTrackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    sceneState.lens.x = event.clientX - rect.left;
    // Đổi gốc DOM (trên-trái) sang gốc GL (dưới-trái)
    sceneState.lens.y = rect.height - (event.clientY - rect.top);
    sceneState.lens.active = true;
    sceneState.invalidate?.();
  };

  const deactivateLens = () => {
    sceneState.lens.active = false;
    sceneState.invalidate?.();
  };

  const toggleTapFine = () => {
    sceneState.tapFine = !sceneState.tapFine;
    sceneState.invalidate?.();
  };

  const setCardFocus = (index: number, value: number) => {
    sceneState.cardFocus[index] = value;
    sceneState.invalidate?.();
  };

  return (
    <div ref={containerRef} className="relative">
      <ResolutionCanvasLoader
        sceneStateRef={sceneStateRef as { current: SceneState }}
        eventSourceRef={containerRef}
        heroTrackRef={heroTrackRef}
        coverTrackRefs={coverTrackRefs as RefObject<HTMLDivElement | null>[]}
      />

      {/* HERO */}
      <section className="mx-auto grid min-h-dvh w-full max-w-5xl items-center gap-8 px-4 pt-20 pb-10 sm:grid-cols-2 sm:px-6">
        <div>
          <h2 className="font-mono text-3xl leading-tight font-semibold tracking-tight text-neutral-50 sm:text-5xl">
            <span className="block">KY LE</span>
            <span className="mt-2 block text-neutral-500">
              I BUILD SYSTEMS THAT SHIP.
            </span>
          </h2>
          <p className="mt-6 max-w-sm font-mono text-xs leading-relaxed text-neutral-500">
            Khối TorusKnot bên phải là nguồn placeholder — bản chính thức thay
            bằng chân dung video 480p render qua đúng pipeline ASCII này. Rê
            chuột lên để &ldquo;lấy nét&rdquo;; trên mobile, chạm để toggle.
          </p>
        </div>
        <div
          ref={heroTrackRef}
          role="button"
          tabIndex={0}
          aria-label="Chân dung ASCII — rê chuột để lấy nét, chạm hoặc Enter để toggle độ nét"
          className="aspect-square w-full cursor-crosshair rounded-lg border border-neutral-900 outline-none focus-visible:border-[#b4ff39]/60"
          onPointerMove={updateLens}
          onPointerLeave={deactivateLens}
          onClick={() => {
            if (sceneState.isCoarsePointer) toggleTapFine();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleTapFine();
            }
          }}
        />
      </section>

      {/* SELECTED WORK */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h3 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
          Selected Work
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {COVER_PROJECTS.map((project, index) => (
            <article
              key={project.id}
              tabIndex={0}
              className="group rounded-lg border border-neutral-900 p-3 outline-none focus-visible:border-[#b4ff39]/60"
              onPointerEnter={() => setCardFocus(index, 1)}
              onPointerLeave={() => setCardFocus(index, 0)}
              onFocus={() => setCardFocus(index, 1)}
              onBlur={() => setCardFocus(index, 0)}
            >
              <div
                ref={coverTrackRefs[index]}
                className="aspect-[4/3] w-full rounded"
              />
              <h4 className="mt-3 font-mono text-sm text-neutral-100">
                {project.title}
              </h4>
              <p className="mt-1 font-mono text-[11px] text-neutral-500">
                {project.role}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-neutral-600">
          Hover / focus một cover — cùng một shader với hero, cell co 4× và ảnh
          nguồn &ldquo;resolve&rdquo; dần về nét.
        </p>
      </section>

      {/* SKILLS — dot-matrix DOM thuần, nói cùng ngôn ngữ glyph */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h3 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
          Skills
        </h3>
        <dl className="mt-6 space-y-2">
          {SKILLS.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4"
            >
              <dt className="w-48 shrink-0 font-mono text-xs text-neutral-400">
                {skill.name}
              </dt>
              <dd
                className="font-mono text-xs tracking-tight text-[#b4ff39]/80"
                aria-label={`${skill.level} trên 16`}
              >
                {skillBar(skill.level)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CORE IDEA */}
      <section className="mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6">
        <div className="rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h3 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Toàn bộ visual identity là <em>một</em> fragment shader viết tay:
            luminance → Bayer dither 8×8 → glyph atlas monospace. Vì output đã
            lượng tử hóa theo cell, canvas render ở DPR 1 by design — chi phí
            retina bằng 0, và với frameloop=&ldquo;demand&rdquo; GPU gần như
            nghỉ khi bạn ngừng tương tác. Một WebGL context duy nhất phục vụ
            hero lẫn 3 cover qua drei View.
          </p>
        </div>
      </section>
    </div>
  );
}
