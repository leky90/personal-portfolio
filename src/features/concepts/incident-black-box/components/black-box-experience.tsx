"use client";

import { useEffect, useRef } from "react";
import { BlackBoxCanvasLoader } from "@/features/concepts/incident-black-box/components/black-box-canvas-loader";
import {
  EVENTS,
  INCIDENT,
  SCENARIO_DISCLAIMER,
} from "@/features/concepts/incident-black-box/lib/incident-data";
import {
  createBlackBoxState,
  type BlackBoxState,
} from "@/features/concepts/incident-black-box/lib/black-box-state";

interface Phase {
  title: string;
  copy: string;
  side: "left" | "right";
}

const PHASES: Phase[] = [
  {
    title: "Tín hiệu trước còi báo",
    copy: "Trong kịch bản, connection pool trôi từ T+05 nhưng pager chỉ kêu ở T+15. Đó là chỗ đáng nói: tín hiệu gần như luôn đến trước cảnh báo, chỉ là ngưỡng đang canh giá trị chứ không canh độ dốc.",
    side: "left",
  },
  {
    title: "Cầm máu trước, chẩn đoán sau",
    copy: "T+28 là quyết định đáng giá nhất của ca trực: chuyển bớt read traffic sang replica TRƯỚC khi biết nguyên nhân. Error rate gãy xuống gần như ngay, và cái mua được là thời gian để nghĩ tử tế.",
    side: "right",
  },
  {
    title: "Một thay đổi nhỏ, hai người review",
    copy: "Nguyên nhân gốc: client tự thử lại khi pool timeout, không jitter, nên nó tự khuếch đại chính nó. Bản vá là cap retry cộng jitter. Nhỏ, nhưng vẫn để hai người review, vì giữa sự cố là lúc dễ sai nhất.",
    side: "left",
  },
];

interface Lesson {
  id: string;
  title: string;
  copy: string;
}

const LESSONS: Lesson[] = [
  {
    id: "page-on-drift",
    title: "Page trên drift, đừng đợi đỉnh",
    copy: "Cảnh báo luôn đến sau tín hiệu. Ngưỡng tốt canh trên đạo hàm, không phải trên giá trị tuyệt đối.",
  },
  {
    id: "mitigate-first",
    title: "Mitigate trước root cause",
    copy: "Cầm máu mua lại thời gian suy nghĩ. Hệ thống sống sót nhờ thứ tự ưu tiên, không nhờ thiên tài.",
  },
  {
    id: "retry-budget",
    title: "Retry cần ngân sách",
    copy: "Cap và jitter chỉ là vài dòng config, nhưng thiếu nó thì client tự khuếch đại chính mình.",
  },
];

/**
 * Layout DOM: hero với metadata sự cố, panel annotation dock từng dòng log
 * khi event qua playhead (mutate class, không re-render), 3 phase card,
 * postmortem 3 bài học. Phím mũi tên trái/phải nhảy giữa các event.
 */
export function BlackBoxExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const blackBoxStateRef = useRef<BlackBoxState | null>(null);
  if (blackBoxStateRef.current === null) {
    blackBoxStateRef.current = createBlackBoxState();
  }
  const blackBoxState = blackBoxStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      blackBoxState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const container = containerRef.current;

    blackBoxState.setDocked = (eventIndex: number) => {
      const items = container?.querySelectorAll<HTMLElement>("[data-event-t]");
      items?.forEach((item, index) => {
        const docked = index <= eventIndex;
        item.classList.toggle("opacity-100", docked);
        item.classList.toggle("opacity-30", !docked);
        item.classList.toggle("text-neutral-200", index === eventIndex);
      });
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      blackBoxState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      blackBoxState.invalidate?.();
    };

    // Trái/phải nhảy giữa event — trục dọc vẫn là cuộn trang bình thường
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const el = containerRef.current;
      if (!el) return;
      const total = el.getBoundingClientRect().height - window.innerHeight;
      const p = blackBoxState.progress;
      const target =
        event.key === "ArrowRight"
          ? EVENTS.find((e) => e.t > p + 0.01)?.t
          : [...EVENTS].reverse().find((e) => e.t < p - 0.01)?.t;
      if (target === undefined) return;
      event.preventDefault();
      const top = el.offsetTop + target * total;
      window.scrollTo({ top, behavior: "smooth" });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      blackBoxState.setDocked = null;
    };
  }, [blackBoxState]);

  return (
    <div ref={containerRef} className="relative">
      <BlackBoxCanvasLoader
        blackBoxStateRef={blackBoxStateRef as { current: BlackBoxState }}
        eventSourceRef={containerRef}
      />

      {/* Panel annotation — log dock dần khi băng chạy */}
      <aside
        aria-label="Nhật ký sự cố"
        className="fixed right-4 bottom-4 z-40 max-h-40 w-[calc(100vw-2rem)] overflow-y-auto rounded border border-neutral-800 bg-black/75 p-3 backdrop-blur sm:top-24 sm:bottom-auto sm:max-h-[60vh] sm:w-72"
      >
        <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
          Flight recorder log · kịch bản
        </p>
        <ol className="mt-2 space-y-1.5">
          {EVENTS.map((event) => (
            <li
              key={event.id}
              data-event-t={event.t}
              className="font-mono text-[11px] leading-snug text-neutral-400 opacity-30 transition-opacity"
            >
              {event.label}
            </li>
          ))}
        </ol>
      </aside>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#ff5a1f] uppercase">
          Blameless postmortem · kịch bản minh hoạ
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          INCIDENT BLACK BOX
        </h2>
        <p className="mt-4 font-mono text-xs text-neutral-400">
          {INCIDENT.sev} · {INCIDENT.durationMin} phút · thời gian tới
          mitigation {INCIDENT.mttrMin} phút · {INCIDENT.date}
        </p>
        <p
          data-testid="scenario-disclaimer"
          className="mt-4 max-w-md rounded border border-[#ff5a1f]/40 bg-[#ff5a1f]/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-[#ffb08a]"
        >
          {SCENARIO_DISCLAIMER}
        </p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Hộp đen máy bay sơn cam vì để được tìm thấy. Băng telemetry phía sau
          cũng vậy: cuộn để tua {INCIDENT.durationMin} phút của kịch bản qua
          vạch đọc, xem tín hiệu, cảnh báo và từng quyết định lần lượt đi qua.
          Thứ đem ra khoe ở đây là trình tự ra quyết định, không phải dữ liệu
          của ai.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn để tua băng · phím mũi tên trái/phải nhảy giữa các event
        </p>
      </section>

      {/* 3 PHASE */}
      {PHASES.map((phase) => (
        <section
          key={phase.title}
          className="mx-auto flex min-h-[92vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              phase.side === "right" ? "ml-auto sm:mr-80" : ""
            }`}
          >
            <h3 className="text-lg font-medium text-neutral-100">
              {phase.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {phase.copy}
            </p>
          </article>
        </section>
      ))}

      {/* POSTMORTEM */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 sm:px-6">
        <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          Góc nhìn postmortem
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
          Camera nhấc lên và cả hình dạng sự cố hiện ra một lượt. Postmortem
          không đổ lỗi (blameless): hệ thống sai, không phải người sai.
        </p>
        <p className="mt-3 max-w-md font-mono text-[11px] leading-relaxed text-neutral-500">
          Nhắc lại: {SCENARIO_DISCLAIMER}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {LESSONS.map((lesson) => (
            <article
              key={lesson.id}
              data-lesson={lesson.id}
              className="rounded-lg border border-neutral-900 bg-neutral-950/80 p-4 backdrop-blur-sm"
            >
              <h4 className="font-mono text-sm text-[#ff5a1f]">
                {lesson.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {lesson.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Một incident JSON typed là nguồn sự thật cho cả ba lớp: băng WebGL
            (telemetry vẽ trong fragment shader từ một DataTexture 128×3,
            không thêm draw call), panel log DOM dock theo playhead, và
            postmortem. Tổng ~8 draw call, băng là một PlaneGeometry duy nhất,
            frameloop=&ldquo;demand&rdquo; nên băng đứng yên là GPU đứng yên.
            Dữ liệu là kịch bản tự dựng chứ không phải log của khách: cái đem
            ra chấm là cách đọc tín hiệu và thứ tự quyết định, phần đó không
            cần mượn số của ai.
          </p>
        </div>
      </section>
    </div>
  );
}
