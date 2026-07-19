"use client";

import { useEffect, useRef } from "react";
import { TerrainCanvasLoader } from "@/features/concepts/terrain/components/terrain-canvas-loader";
import {
  createTerrainState,
  type TerrainState,
} from "@/features/concepts/terrain/lib/terrain-state";
import { nearestEraIndex } from "@/lib/scroll-era";

interface TerrainStageProps {
  children: React.ReactNode;
}

/**
 * Sân khấu 3D của trang chủ: canvas terrain fixed phía sau, toàn bộ nội dung
 * site (server-rendered) là children phía trên. Scroll của cả trang drive
 * camera; era active dò theo vị trí thật của các card [data-era-index] —
 * nên các section khác chen giữa hành trình thoải mái.
 */
export function TerrainStage({ children }: TerrainStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const terrainStateRef = useRef<TerrainState | null>(null);
  if (terrainStateRef.current === null) {
    terrainStateRef.current = createTerrainState();
  }
  const terrainState = terrainStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      terrainState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      terrainState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      const eraCards = el.querySelectorAll<HTMLElement>("[data-era-index]");
      const eraRects: { top: number; height: number }[] = [];
      eraCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        eraRects.push({ top: cardRect.top, height: cardRect.height });
      });
      terrainState.era = nearestEraIndex(eraRects, window.innerHeight);
      terrainState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [terrainState]);

  return (
    <div ref={containerRef} className="relative">
      <TerrainCanvasLoader
        terrainStateRef={terrainStateRef as { current: TerrainState }}
        eventSourceRef={containerRef}
      />
      {children}
    </div>
  );
}
