"use client";

import { useEffect, useRef } from "react";
import { SkylineCanvasLoader } from "@/features/concepts/commit-skyline/components/skyline-canvas-loader";
import {
  LANDMARKS,
  dayCommits,
  dayInfo,
} from "@/features/concepts/commit-skyline/lib/skyline-data";
import {
  createSkylineState,
  type SkylineState,
} from "@/features/concepts/commit-skyline/lib/skyline-state";

const HUD_DEFAULT = "Rê lên một toà nhà để đọc ngày và số commit của nó";

const WEEKDAY_LABELS = ["thứ 2", "thứ 3", "thứ 4", "thứ 5", "thứ 6", "thứ 7", "chủ nhật"];

const SECTIONS = [
  {
    id: "rhythm",
    title: "nhịp tuần đọc được từ xa",
    note: "Hai hàng nhà thấp cuối mỗi cột là thứ 7 và chủ nhật. Một thập kỷ nhìn từ đại lộ, điều dễ thấy nhất không phải cường độ mà là kỷ luật nghỉ.",
  },
  {
    id: "landmarks",
    title: "6 tháp landmark",
    note: "Không phải ngày code nhiều nhất nào cũng quan trọng. Tháp xanh đánh dấu những ngày đổi nghĩa: đổi việc, go-live, release OSS, lên lead.",
  },
  {
    id: "honest-data",
    title: "vì sao phải là dữ liệu thật",
    note: "Skyline chỉ có sức nặng khi từng toà nhà là một ngày có thật. Bản chính thức chạy ETL GitHub GraphQL lúc build, bake JSON ~8KB; demo này dùng model deterministic cùng schema.",
  },
];

/**
 * Layout DOM: hero + HUD ngày + 3 section + danh sách landmark. Cuộn
 * bay camera dọc đại lộ; hover toà nhà đẩy ngày + commit ra HUD qua
 * callback, landmark thì kèm câu chuyện.
 */
export function SkylineExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const skylineStateRef = useRef<SkylineState | null>(null);
  if (skylineStateRef.current === null) {
    skylineStateRef.current = createSkylineState();
  }
  const skylineState = skylineStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      skylineState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    skylineState.setTooltip = (dayIndex: number) => {
      const hud = hudRef.current;
      if (!hud) return;
      if (dayIndex < 0) {
        hud.textContent = HUD_DEFAULT;
        hud.classList.remove("text-[#60a5fa]");
        return;
      }
      const info = dayInfo(dayIndex);
      const landmark = LANDMARKS.find((l) => l.dayIndex === dayIndex);
      const base = `${info.year} · tuần ${info.week + 1} · ${WEEKDAY_LABELS[info.weekday]} · ${dayCommits(dayIndex)} commit`;
      hud.textContent = landmark
        ? `${base} · ★ ${landmark.label}: ${landmark.story}`
        : base;
      hud.classList.add("text-[#60a5fa]");
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      skylineState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      skylineState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      skylineState.setTooltip = null;
    };
  }, [skylineState]);

  return (
    <div ref={containerRef} className="relative">
      <SkylineCanvasLoader
        skylineStateRef={skylineStateRef as { current: SkylineState }}
        eventSourceRef={containerRef}
      />

      {/* HUD ngày + landmark */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="skyline-hud"
          className="line-clamp-3 font-mono text-[11px] text-neutral-400"
        >
          {HUD_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#60a5fa] uppercase">
          3650 ngày · mỗi toà nhà một ngày viết code
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          COMMIT SKYLINE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mười năm commit dựng thành một thành phố về đêm chìm trong
          sương. Cuộn để bay thấp dọc đại lộ thời gian: mỗi block là
          một năm, nhà cao là ngày code nhiều, tháp xanh có beacon là
          những ngày đổi nghĩa cả sự nghiệp. Rê lên bất kỳ toà nào để
          đọc đúng ngày của nó.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: cất cánh từ block 2016
        </p>
      </section>

      {/* 3 SECTION */}
      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#60a5fa] uppercase">
              {section.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {section.note}
            </p>
            {section.id === "landmarks" ? (
              <ul className="mt-3 space-y-1">
                {LANDMARKS.map((landmark) => (
                  <li
                    key={landmark.dayIndex}
                    className="font-mono text-[11px] text-neutral-500"
                  >
                    ★ {dayInfo(landmark.dayIndex).year} · {landmark.label}
                  </li>
                ))}
              </ul>
            ) : null}
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
            Contribution graph là thứ ai cũng có nhưng hiếm ai bước vào
            được. Kỹ thuật: cả thành phố 3650 toà là MỘT InstancedMesh
            (matrix scale theo commit, instanceColor ấm dần theo cường
            độ), landmark + beacon mỗi loại một draw call nữa — tổng ~6
            draw call cho một thập kỷ; fogExp2 làm mood thay
            postprocessing; raycast instanceId → đúng ngày. Frameloop
            demand: thành phố đóng băng cho tới khi bạn cuộn, đứng yên
            là 0% GPU.
          </p>
        </div>
      </section>
    </div>
  );
}
