"use client";

import { useEffect, useRef } from "react";
import { BadgeCanvasLoader } from "@/features/concepts/lanyard-badge/components/badge-canvas-loader";
import {
  BADGE_FRONT,
  BADGE_SPECS,
} from "@/features/concepts/lanyard-badge/lib/badge-data";
import {
  createBadgeState,
  type BadgeState,
} from "@/features/concepts/lanyard-badge/lib/badge-state";

/**
 * Layout DOM: hero + spec sheet + section đích pull-to-enter. Kéo thẻ
 * xuống quá ngưỡng rồi thả trong canvas → onEnter cuộn tới section
 * đầu tiên, đúng nghi thức "pull to enter".
 */
export function BadgeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const badgeStateRef = useRef<BadgeState | null>(null);
  if (badgeStateRef.current === null) {
    badgeStateRef.current = createBadgeState();
  }
  const badgeState = badgeStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      badgeState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    badgeState.onEnter = () => {
      document
        .querySelector("[data-enter-target]")
        ?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      if (hudRef.current) {
        hudRef.current.textContent =
          "▶ đã bước vào — nghi thức pull-to-enter hoàn tất";
        hudRef.current.classList.add("text-[#e879f9]");
      }
    };

    return () => {
      badgeState.onEnter = null;
    };
  }, [badgeState]);

  return (
    <div ref={containerRef} className="relative">
      <BadgeCanvasLoader
        badgeStateRef={badgeStateRef as { current: BadgeState }}
        eventSourceRef={containerRef}
      />

      {/* HUD */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="badge-hud"
          className="font-mono text-[11px] text-neutral-400"
        >
          nắm kéo thẻ · búng thử · double-click để lật · kéo thẻ xuống rồi
          thả để bước vào
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#e879f9] uppercase">
          {BADGE_FRONT.name} · {BADGE_FRONT.title} · {BADGE_FRONT.est}
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          THE CREDENTIAL
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Tấm thẻ kỹ sư treo trên dây đeo cầm được thật: nắm kéo, búng
          cho nó lắc, double-click lật xem spec sheet mặt sau. Và nghi
          thức quan trọng nhất: kéo thẻ xuống quá ngưỡng rồi thả — thẻ
          bật ngược lên và trang tự cuộn vào phần đầu tiên. Đây là cách
          bạn "quẹt thẻ" để vào ca làm việc của tôi.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          kéo thẻ xuống rồi thả ↓
        </p>
      </section>

      {/* SECTION ĐÍCH PULL-TO-ENTER + SPEC SHEET */}
      <section
        data-enter-target
        className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center px-4 sm:px-6"
      >
        <article className="max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm sm:ml-14">
          <p className="font-mono text-xs tracking-[0.2em] text-[#e879f9] uppercase">
            spec sheet · mặt sau thẻ
          </p>
          <ul className="mt-3 space-y-1.5">
            {BADGE_SPECS.map((line) => (
              <li
                key={line}
                className="font-mono text-[12px] text-neutral-400"
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Mọi dòng trên thẻ là hồ sơ nghề thật, không phải chữ trang
            trí: rating và tỉ lệ đúng hạn lấy từ 125 review trên
            Freelancer.com, phần còn lại là vai trò đang làm ở Treehouse.
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
            Vật thể quen thuộc nhất của đời kỹ sư trở thành cánh cửa vào
            site. Demo không chở physics engine: dây đeo là MỘT phương
            trình con lắc tích phân semi-implicit được unit-test (điểm
            cân bằng bất động, damping rút năng lượng), nên frameloop
            demand ngủ hẳn khi thẻ đứng yên; thẻ + kẹp + dây ~6 draw
            call, foil hologram đổi màu theo tilt bằng HSL rẻ tiền. Bản
            chính thức thay bằng rapier rope joint + RenderTexture in
            dữ liệu sống lên mặt thẻ.
          </p>
        </div>
      </section>
    </div>
  );
}
