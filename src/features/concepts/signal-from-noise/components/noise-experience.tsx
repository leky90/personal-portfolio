"use client";

import { useEffect, useRef } from "react";
import { NoiseCanvasLoader } from "@/features/concepts/signal-from-noise/components/noise-canvas-loader";
import {
  createNoiseState,
  noisePhaseFromScroll,
  type NoiseState,
} from "@/features/concepts/signal-from-noise/lib/noise-state";

const FORM_SECTIONS = [
  {
    id: "name",
    title: "form 1 · cái tên",
    note: "Nhiễu lạnh kết tinh thành chữ đầu tiên: KY LE DINH. H1 thật của trang chỉ hiện outline SAU khi hạt đã xếp đúng raster của nó — progressive enhancement chính là màn reveal.",
  },
  {
    id: "globe",
    title: "form 2 · quả cầu đội ngũ",
    note: "Cùng đám hạt đó tan ra rồi hợp lại thành khung cầu lat/long: đội 8 kỹ sư tôi đang dẫn, làm remote cho một công ty ở Singapore trong khi tôi ngồi Huế. Không hạt nào được sinh thêm.",
  },
  {
    id: "lattice",
    title: "form 3 · lattice kiến trúc",
    note: "Kết tinh cuối: hạt xếp dọc cạnh của đồ thị kiến trúc dApp đang chạy thật — ví, frontend, RPC, hợp đồng tETH, cache lợi suất, indexer, dashboard TVL. Beat lặp lại của cả sự nghiệp: nhiễu vào, hệ thống ra.",
  },
];

/**
 * Layout DOM: hero + 3 section form + HUD. Cuộn scrub phase 3 form;
 * con trỏ là ordering lens (trật tự nở dưới tay, KHÔNG phải repel).
 */
export function NoiseExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const noiseStateRef = useRef<NoiseState | null>(null);
  if (noiseStateRef.current === null) {
    noiseStateRef.current = createNoiseState();
  }
  const noiseState = noiseStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      noiseState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scroll =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      noiseState.phase = noisePhaseFromScroll(scroll);
      noiseState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [noiseState]);

  return (
    <div ref={containerRef} className="relative">
      <NoiseCanvasLoader
        noiseStateRef={noiseStateRef as { current: NoiseState }}
        eventSourceRef={containerRef}
      />

      {/* HUD */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          data-testid="noise-hud"
          className="font-mono text-[11px] text-neutral-400"
        >
          con trỏ là ordering lens: trật tự nở ra dưới tay bạn, không xua
          hạt đi
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#94a3b8] uppercase">
          Nhiễu lạnh vào · hệ thống ấm ra
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          SIGNAL FROM NOISE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Một trường hạt duy nhất, lặp đi lặp lại đúng một động tác kể
          từ 2012 tới nay: gom hỗn độn thành hình dạng chính xác. Cuộn
          để nhiễu kết tinh lần lượt thành cái tên, quả cầu đội ngũ và
          lattice kiến trúc dApp; hạt lạnh màu cyan, hạt đã vào trật tự
          ấm dần thành amber.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: kết tinh thứ nhất · rê con trỏ để trật tự nở sớm
        </p>
      </section>

      {/* 3 SECTION FORM */}
      {FORM_SECTIONS.map((section, index) => (
        <section
          key={section.id}
          data-form-section={section.id}
          className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#94a3b8] uppercase">
              {section.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {section.note}
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
            Ba lựa chọn chống particle-soup có chủ đích: blend thường
            thay vì additive, ordering lens ĐẢO chiều trope repel cũ, và
            mọi form đều là dữ liệu thật (raster họ tên, toạ độ cầu,
            cạnh đồ thị kiến trúc dApp DeFi). Kỹ thuật: 4096 hạt trong đúng 1 draw
            call, toạ độ 3 form bake một DataTexture, chaos là hàm thuần
            của seed nên demand ngủ hẳn khi form đã kết tinh. Bản chính
            thức nâng GPGPU ping-pong 131k hạt với spring-damper +
            curl-noise trong velocity shader, cùng schema.
          </p>
        </div>
      </section>
    </div>
  );
}
