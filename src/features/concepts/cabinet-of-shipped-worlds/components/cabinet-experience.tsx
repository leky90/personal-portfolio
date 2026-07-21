"use client";

import { useEffect, useRef } from "react";
import { CabinetCanvasLoader } from "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas-loader";
import { CELLS } from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-data";
import {
  createCabinetState,
  enterCell,
  type CabinetState,
} from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-state";

const PLAQUE_DEFAULT =
  "Rê lên một ô kính để sương tan · click để bước xuyên qua lớp kính";

/**
 * Layout DOM: hero + plaque đồng + 4 card thế giới live + core idea.
 * Hover ô kính đẩy plaque qua callback; ESC lùi ra khỏi ô đang xem.
 */
export function CabinetExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const plaqueRef = useRef<HTMLParagraphElement>(null);

  const cabinetStateRef = useRef<CabinetState | null>(null);
  if (cabinetStateRef.current === null) {
    cabinetStateRef.current = createCabinetState();
  }
  const cabinetState = cabinetStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      cabinetState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    cabinetState.setPlaque = (cellIndex: number) => {
      const plaque = plaqueRef.current;
      if (!plaque) return;
      const cell = cellIndex >= 0 ? CELLS[cellIndex] : null;
      if (!cell || cell.world === null) {
        plaque.textContent = cell
          ? "ô lưu kho · dự án chưa trưng bày"
          : PLAQUE_DEFAULT;
        plaque.classList.remove("text-[#f472b6]");
      } else {
        plaque.textContent = `${cell.title} · ${cell.years} · ${cell.metric}`;
        plaque.classList.add("text-[#f472b6]");
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && cabinetState.entered >= 0) {
        enterCell(cabinetState, cabinetState.entered);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cabinetState.setPlaque = null;
    };
  }, [cabinetState]);

  const liveCells = CELLS.filter((cell) => cell.world !== null);

  return (
    <div ref={containerRef} className="relative">
      <CabinetCanvasLoader
        cabinetStateRef={cabinetStateRef as { current: CabinetState }}
        eventSourceRef={containerRef}
      />

      {/* Plaque đồng */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={plaqueRef}
          data-testid="cabinet-plaque"
          className="line-clamp-2 font-mono text-[11px] text-neutral-400"
        >
          {PLAQUE_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#f472b6] uppercase">
          Bảo tàng những thế giới đã ship
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          CABINET OF SHIPPED WORLDS
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Một tủ kính gỗ óc chó 4×2: bốn ô là thế giới thu nhỏ đang sống
          của bốn sản phẩm thật, bốn ô còn phủ sương chờ trưng bày. Rê
          lên một ô để sương tan và diorama thức dậy; click để camera
          đưa bạn xuyên qua lớp kính vào bên trong. ESC để lùi ra.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          rê lên ô kính · click bước vào · ESC lùi ra
        </p>
      </section>

      {/* 4 CARD THẾ GIỚI */}
      {liveCells.map((cell, index) => (
        <section
          key={cell.id}
          className="mx-auto flex min-h-[75vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#f472b6] uppercase">
              ô kính {index + 1}/4 · {cell.world}
            </p>
            <h3 className="mt-1 font-mono text-xl text-neutral-100">
              {cell.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-neutral-500">
              {cell.years}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {cell.metric}
            </p>
          </article>
        </section>
      ))}

      {/* CORE IDEA */}
      <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Mỗi sản phẩm đã ship là một thế giới có bảng màu riêng, và
            bạn được mời bước hẳn vào. Demo dựng choreography bằng frost
            plane + camera dolly (~45 draw call, chỉ ô được đánh thức
            mới invalidate — "frozen portal economy" đúng nghĩa demand);
            bản chính thức thay bằng drei MeshPortalMaterial với blend
            0→1 render portal thành scene chính và Next intercepting
            route để back/forward đảo ngược cú xuyên kính.
          </p>
        </div>
      </section>
    </div>
  );
}
