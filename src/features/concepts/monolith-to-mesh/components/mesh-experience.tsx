"use client";

import { useEffect, useRef } from "react";
import { MeshCanvasLoader } from "@/features/concepts/monolith-to-mesh/components/mesh-canvas-loader";
import { sliceMonolith } from "@/features/concepts/monolith-to-mesh/lib/slice-monolith";
import {
  createMeshState,
  type MeshState,
} from "@/features/concepts/monolith-to-mesh/lib/mesh-state";

const SERVICE_HUD_DEFAULT =
  "Hover một mảnh để đọc ADR whisper: tên service, năm tách, lý do";

interface Chapter {
  year: string;
  title: string;
  copy: string;
  side: "left" | "right";
}

const CHAPTERS: Chapter[] = [
  {
    year: "2012",
    title: "Một khối, một người",
    copy: "Nghề bắt đầu bằng freelance ở Huế: PHP, WordPress, HTML và CSS nằm gọn trong một khối. Một codebase, một database, một lần upload. Với một người làm hết, đó là kiến trúc đúng.",
    side: "left",
  },
  {
    year: "2017",
    title: "Những lát cắt đầu tiên",
    copy: "Vào công ty làm eCommerce: catalog, checkout và CMS tách ra vì chúng đổi theo những nhịp khác nhau. Một năm sau search cũng tách, và đó là vết cắt sai: ranh giới vẽ theo cảm giác chứ không theo dữ liệu.",
    side: "right",
  },
  {
    year: "2021",
    title: "Nhịp gộp ngược",
    copy: "Search-index bay trở lại khối và hàn liền vết kerf. Tách non là một khoản nợ, trả nợ công khai là quyết định kiến trúc trưởng thành nhất giai đoạn này. Cùng năm, wallet-connect ra đời và mở đường cho mọi lát cắt DeFi về sau.",
    side: "left",
  },
  {
    year: "2023",
    title: "Mesh thành hình",
    copy: "Filament cyan đan giữa các service: price feed, yield, TVL và tx queue đọc chung một lớp on-chain thay vì mỗi màn hình tự gọi contract. Traffic pulse chạy dọc các cạnh như nhịp thở của hệ thống.",
    side: "right",
  },
  {
    year: "2026",
    title: "Hợp nhất, không phình to",
    copy: "Core co cụm lại thay vì tách vụn tiếp: app shell, design system, routing, store và api client ở lại vì chúng gắn chặt với nhau. Mesh cuối chặng thở trong không gian âm, không phải một mạng nhện rối.",
    side: "left",
  },
];

/**
 * Layout DOM: hero + 5 chương theo bốn chặng nghề + era stepper (anchor a11y)
 * + HUD ADR whisper. Cuộn cả trang là timeline 2012→2026 của transformation.
 */
export function MeshExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const meshStateRef = useRef<MeshState | null>(null);
  if (meshStateRef.current === null) {
    meshStateRef.current = createMeshState();
  }
  const meshState = meshStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      meshState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const entries = sliceMonolith(7);
    meshState.setServiceHud = (entryIndex: number) => {
      const hud = hudRef.current;
      if (!hud) return;
      if (entryIndex < 0) {
        hud.textContent = SERVICE_HUD_DEFAULT;
        hud.classList.remove("text-[#6ce0ff]");
      } else {
        const entry = entries[entryIndex];
        hud.textContent = `${entry.service.name}: ${entry.service.reason}`;
        hud.classList.add("text-[#6ce0ff]");
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      meshState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      meshState.invalidate?.();
    };

    const onPointerMove = (event: PointerEvent) => {
      meshState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      meshState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      meshState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      meshState.setServiceHud = null;
    };
  }, [meshState]);

  return (
    <div ref={containerRef} className="relative">
      <MeshCanvasLoader
        meshStateRef={meshStateRef as { current: MeshState }}
        eventSourceRef={containerRef}
      />

      {/* Era stepper — anchor nav a11y, mirror 5 chương */}
      <nav
        aria-label="Điều hướng theo năm"
        className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex"
      >
        {CHAPTERS.map((chapter) => (
          <a
            key={chapter.year}
            href={`#ch-${chapter.year}`}
            className="rounded border border-neutral-900 bg-black/50 px-2 py-1 font-mono text-[10px] text-neutral-500 backdrop-blur transition-colors hover:border-neutral-600 hover:text-neutral-200"
          >
            {chapter.year}
          </a>
        ))}
      </nav>

      {/* HUD ADR whisper */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/70 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="service-hud"
          className="truncate font-mono text-[11px] text-neutral-400"
        >
          {SERVICE_HUD_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#6ce0ff] uppercase">
          Mười bốn năm kiến trúc · 36 services
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          MONOLITH TO MESH
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Khối graphite phía sau là hệ thống năm 2012: một mình, một codebase
          PHP. Cuộn để xem nó bị kerf-cut thành 36 service theo đúng thứ tự
          lịch sử, từ catalog và checkout thời eCommerce tới wallet, staking
          và price feed thời DeFi, đan lại thành mesh, và một lần duy nhất:
          bay ngược trở về. Hover một mảnh để đọc lý do tách.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: bắt đầu cắt 2013
        </p>
      </section>

      {/* 5 CHƯƠNG */}
      {CHAPTERS.map((chapter) => (
        <section
          key={chapter.year}
          id={`ch-${chapter.year}`}
          className="mx-auto flex min-h-[92vh] w-full max-w-5xl scroll-mt-20 items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              chapter.side === "right" ? "ml-auto" : ""
            }`}
          >
            <p className="font-mono text-3xl text-[#6ce0ff] sm:text-4xl">
              {chapter.year}
            </p>
            <h3 className="mt-2 text-lg font-medium text-neutral-100">
              {chapter.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {chapter.copy}
            </p>
          </article>
        </section>
      ))}

      {/* CORE IDEA */}
      <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 text-left">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Cả transformation là một câu chú thích kiểm chứng được: 36 service
            trong đúng 1 instanced draw call, morph chạy 100% trong vertex
            shader từ một uniform duy nhất (scrub không tốn một matrix CPU),
            filament là 1 LineSegments sinh theo năm, kerf-cut bằng thuật toán
            chia đệ quy thuần TS có test (0 KB model), và nhịp GỘP NGƯỢC 2021
            nằm ngay trong dữ liệu migration. Đây là ADR trail được render,
            không phải cinematic monolith.
          </p>
        </div>
      </section>
    </div>
  );
}
