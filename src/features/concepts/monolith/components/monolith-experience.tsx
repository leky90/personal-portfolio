"use client";

import { useEffect, useRef } from "react";
import { MonolithCanvasLoader } from "@/features/concepts/monolith/components/monolith-canvas-loader";
import {
  createMonolithState,
  type MonolithState,
} from "@/features/concepts/monolith/lib/monolith-state";

interface WorkEntry {
  index: string;
  title: string;
  role: string;
  summary: string;
}

const WORK_ENTRIES: WorkEntry[] = [
  {
    index: "01",
    title: "Atlas Platform",
    role: "Lead Engineer · 2021—2024",
    summary:
      "Rebuild platform 40M req/day — kiến trúc, tooling và cả câu chuyện trade-off đằng sau.",
  },
  {
    index: "02",
    title: "Pulse Analytics",
    role: "Staff Engineer · 2019—2021",
    summary:
      "Data pipeline gần realtime cho 200+ dashboard nội bộ, chi phí hạ tầng giảm một nửa.",
  },
  {
    index: "03",
    title: "Relay Payments",
    role: "Senior Engineer · 2017—2019",
    summary:
      "Hệ thanh toán đa vùng đầu tiên của công ty — idempotency, reconciliation, ngủ ngon.",
  },
];

interface YearEntry {
  year: string;
  label: string;
}

const YEAR_ENTRIES: YearEntry[] = [
  { year: "2016", label: "Software Engineer" },
  { year: "2019", label: "Senior Engineer" },
  { year: "2022", label: "Staff · Tech Lead" },
  { year: "2026", label: "Principal" },
];

const NAV_ITEMS = [
  { href: "#hero", label: "hero" },
  { href: "#work", label: "work" },
  { href: "#years", label: "years" },
  { href: "#contact", label: "hi" },
];

/**
 * Cả trang là MỘT scene 3D — mỗi section DOM chỉ là một góc máy lên khối
 * chữ. Anchor nav = camera choreography: nhảy #work là nhảy khung hình,
 * URL hash chính là deep-link trạng thái camera.
 */
export function MonolithExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const monolithStateRef = useRef<MonolithState | null>(null);
  if (monolithStateRef.current === null) {
    monolithStateRef.current = createMonolithState();
  }
  const monolithState = monolithStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      monolithState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      monolithState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      monolithState.invalidate?.();
    };

    const onPointerMove = (event: PointerEvent) => {
      monolithState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      monolithState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      monolithState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [monolithState]);

  return (
    <div ref={containerRef} className="relative">
      <MonolithCanvasLoader
        monolithStateRef={monolithStateRef as { current: MonolithState }}
        eventSourceRef={containerRef}
      />

      {/* Section nav — anchor = deep-link trạng thái camera */}
      <nav
        aria-label="Điều hướng section"
        className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded border border-neutral-900 bg-black/50 px-2 py-1 font-mono text-[10px] text-neutral-500 backdrop-blur transition-colors hover:border-neutral-600 hover:text-neutral-200"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6"
      >
        <p className="font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
          One scene · four vantage points
        </p>
        <h2 className="mt-4 text-5xl font-semibold tracking-tight text-neutral-50 sm:text-7xl">
          KY LE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Cái tên là kiến trúc: bốn khối chữ đá đen đứng trong sương, và mỗi
          section của trang chỉ là một góc máy khác lên cùng một tượng đài.
          Cuộn để camera bay dọc — và xuyên qua — các letterform.
        </p>
        <p className="mt-8 animate-pulse font-mono text-xs text-neutral-600">
          ↓ cuộn để tiến vào khối K
        </p>
      </section>

      {/* SELECTED WORK */}
      <section
        id="work"
        className="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-4 sm:px-6"
      >
        <div className="max-w-md">
          <h3 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Selected Work
          </h3>
          <ol className="mt-6 space-y-5">
            {WORK_ENTRIES.map((entry) => (
              <li
                key={entry.index}
                className="rounded-lg border border-neutral-900 bg-neutral-950/70 p-4 backdrop-blur-sm"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xl text-[#ff4d4d]">
                    {entry.index}
                  </span>
                  <h4 className="text-base font-medium text-neutral-100">
                    {entry.title}
                  </h4>
                </div>
                <p className="mt-1 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                  {entry.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {entry.summary}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DECADE */}
      <section
        id="years"
        className="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-4 sm:px-6"
      >
        <div className="ml-auto max-w-md rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 backdrop-blur-sm">
          <h3 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Decade
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Các con số 7-segment bạn thấy dọc đường bay là năm nghề thật —
            mỗi chữ số là instance của đúng một khối cube.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            {YEAR_ENTRIES.map((entry) => (
              <div key={entry.year}>
                <dt className="font-mono text-2xl text-neutral-100">
                  {entry.year}
                </dt>
                <dd className="mt-1 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                  {entry.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CONTACT — camera dừng trước "HI" khắc sau khối E */}
      <section
        id="contact"
        className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6"
      >
        <h3 className="text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          SAY HI
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          Đường bay kết thúc sau khối E — nơi chữ &ldquo;HI&rdquo; nhỏ bắt ánh
          đèn đỏ. Phần còn lại là một cuộc trò chuyện.
        </p>
        <a
          href="mailto:ldky90@gmail.com"
          className="mt-8 rounded border border-[#ff4d4d]/40 px-5 py-2.5 font-mono text-sm text-[#ff4d4d] transition-colors hover:bg-[#ff4d4d]/10"
        >
          ldky90@gmail.com →
        </a>

        <div className="mt-16 w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 text-left">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Geometry tĩnh hoàn toàn + frameloop=&ldquo;demand&rdquo; → ngừng
            cuộn là GPU vẽ đúng 0 frame: <em>0% GPU at rest</em>, kiểm chứng
            được trong devtools. ~12 draw call: 6 khối chữ extrude từ polygon
            tự định nghĩa (0 KB font asset) + MỘT InstancedMesh cho toàn bộ
            chữ số 7-segment. Scroll, anchor nav và URL hash là cùng một state
            machine điều khiển camera — motion là state, không phải trang trí.
          </p>
        </div>
      </section>
    </div>
  );
}
