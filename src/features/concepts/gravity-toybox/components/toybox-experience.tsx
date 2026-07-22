"use client";

import { useEffect, useRef } from "react";
import { ToyboxCanvasLoader } from "@/features/concepts/gravity-toybox/components/toybox-canvas-loader";
import { SKILLS } from "@/features/concepts/gravity-toybox/lib/toybox-data";
import {
  createToyboxState,
  redrop,
  type ToyboxState,
} from "@/features/concepts/gravity-toybox/lib/toybox-state";

const HUD_DEFAULT =
  "Rê lên một đĩa tạ để đọc khối lượng kinh nghiệm · nắm kéo rồi ném thử";

/**
 * Layout DOM: hero + bảng cân 12 công nghệ + HUD khối lượng + nút thả
 * lại. Grab-toss diễn ra trong canvas; HUD nhận nhãn qua callback,
 * không setState theo pointermove.
 */
export function ToyboxExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const toyboxStateRef = useRef<ToyboxState | null>(null);
  if (toyboxStateRef.current === null) {
    toyboxStateRef.current = createToyboxState();
  }
  const toyboxState = toyboxStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      toyboxState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    toyboxState.setLabel = (tokenIndex: number) => {
      const hud = hudRef.current;
      if (!hud) return;
      if (tokenIndex < 0) {
        hud.textContent = HUD_DEFAULT;
        hud.classList.remove("text-[#fb7185]");
      } else {
        const skill = SKILLS[tokenIndex];
        hud.textContent = `${skill.name} · ${skill.years} năm · ${skill.years.toFixed(1)} kg`;
        hud.classList.add("text-[#fb7185]");
      }
    };

    return () => {
      toyboxState.setLabel = null;
    };
  }, [toyboxState]);

  const onRedrop = () => {
    redrop(toyboxState);
    if (hudRef.current) {
      hudRef.current.textContent =
        "đang thả lại 4 chữ cái + 12 đĩa tạ từ độ cao cũ…";
      hudRef.current.classList.remove("text-[#fb7185]");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <ToyboxCanvasLoader
        toyboxStateRef={toyboxStateRef as { current: ToyboxState }}
        eventSourceRef={containerRef}
      />

      {/* HUD khối lượng */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="mass-hud"
          className="line-clamp-2 font-mono text-[11px] text-neutral-400"
        >
          {HUD_DEFAULT}
        </p>
      </div>

      {/* Nút thả lại */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <button
          type="button"
          data-testid="redrop-button"
          onClick={onRedrop}
          className="rounded-full border border-neutral-700 bg-black/70 px-4 py-2 font-mono text-[11px] tracking-wide text-neutral-400 backdrop-blur transition-colors hover:border-[#fb7185] hover:text-[#fb7185]"
        >
          thả lại từ đầu
        </button>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#fb7185] uppercase">
          Kinh nghiệm có khối lượng thật · năm = kg
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          WEIGHT OF EXPERIENCE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Tên tôi rơi xuống sàn trước, rồi mười hai đĩa tạ công nghệ rơi
          theo: mỗi đĩa nặng đúng số năm tôi đã dùng nó. Đĩa 12 năm rơi
          thịch và nằm im; đĩa 3 năm nảy tưng và văng ra rìa. Hãy nắm
          một đĩa kéo thử — bạn sẽ cảm được 12 năm lì tay hơn 3 năm thế nào.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          rê để cân · nắm kéo để cảm khối lượng · ném để tin
        </p>
      </section>

      {/* BẢNG CÂN */}
      <section className="mx-auto flex min-h-[90vh] w-full max-w-5xl items-center px-4 sm:px-6">
        <div className="w-full max-w-md rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm sm:ml-14">
          <p className="font-mono text-xs tracking-[0.2em] text-[#fb7185] uppercase">
            biên bản cân · 12 công nghệ
          </p>
          <ul className="mt-3 space-y-1.5">
            {SKILLS.map((skill) => (
              <li
                key={skill.id}
                className="flex items-baseline justify-between font-mono text-[12px] text-neutral-400"
              >
                <span>{skill.name}</span>
                <span className="text-neutral-600">
                  {skill.years} năm · {skill.years.toFixed(1)} kg
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CHUYỆN NGHỀ */}
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6">
        <article className="ml-auto max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm">
          <p className="font-mono text-xs tracking-[0.2em] text-[#fb7185] uppercase">
            vì sao khối lượng trung thực
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            CV nào cũng liệt kê logo; khối lượng thì không nói dối được.
            JavaScript nặng 12 kg vì tôi viết nó từ 2014, hồi còn nhận
            site khách ở Huế, và chưa năm nào bỏ. jQuery vẫn 5 kg dù tôi
            gác nó lại sau Synova 2018 — năm đã dùng thì không trả lại
            được. OpenAI API 3 kg nằm chỏng chơ trên đỉnh đống tạ, và
            điều đó cũng trung thực nốt: có thứ tôi mới cầm lên gần đây.
          </p>
        </article>
      </section>

      {/* CORE IDEA */}
      <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Demo này không chở physics engine nào: rơi + nảy là mô hình
            ballistic closed-form được unit-test, restitution giảm theo
            khối lượng; nắm kéo lag theo λ = k/năm nên bàn tay cảm được
            dữ liệu. 12 đĩa + toàn bộ chữ cái dot-matrix + bóng blob gói
            trong đúng 3 instanced draw call; frameloop demand nên đống
            tạ nằm yên là 0% GPU. Bản chính thức thay bằng Rapier bake
            replay ~70KB cùng schema, chữ thật bằng Text3D.
          </p>
        </div>
      </section>
    </div>
  );
}
