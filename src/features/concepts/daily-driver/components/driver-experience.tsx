"use client";

import { useEffect, useMemo, useRef } from "react";
import { KeyboardCanvasLoader } from "@/features/concepts/daily-driver/components/keyboard-canvas-loader";
import {
  COMMANDS,
  buildKeyboard,
  keyIndexByCode,
  matchCommand,
} from "@/features/concepts/daily-driver/lib/keyboard-data";
import {
  createKeyboardState,
  pressKey,
  type KeyboardState,
} from "@/features/concepts/daily-driver/lib/keyboard-state";

/**
 * Layout DOM: hero + prompt terminal cố định + 5 section lệnh. Mọi
 * keydown đi hai đường: event.code → nhấn keycap vật lý trên canvas,
 * event.key → buffer lệnh (ghost autocomplete, Enter chạy, Esc xoá).
 * Không setState theo keystroke — prompt mutate DOM ref trực tiếp.
 */
export function DriverExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const execRef = useRef<HTMLParagraphElement>(null);

  const keys = useMemo(() => buildKeyboard(), []);
  const buffer = useRef("");

  const keyboardStateRef = useRef<KeyboardState | null>(null);
  if (keyboardStateRef.current === null) {
    keyboardStateRef.current = createKeyboardState();
  }
  const keyboardState = keyboardStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      keyboardState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const updatePrompt = () => {
      const match = matchCommand(buffer.current);
      if (bufferRef.current) bufferRef.current.textContent = buffer.current;
      if (ghostRef.current) {
        ghostRef.current.textContent = match
          ? match.cmd.slice(buffer.current.length)
          : "";
      }
    };

    const execute = () => {
      if (buffer.current.length === 0) return;
      const match = matchCommand(buffer.current);
      if (execRef.current) {
        execRef.current.textContent = match
          ? `> ${match.cmd}: ${match.label}`
          : `> không có lệnh '${buffer.current}'`;
      }
      if (match) {
        document
          .querySelector(`[data-cmd-section="${match.cmd}"]`)
          ?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      }
      buffer.current = "";
      updatePrompt();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      // Không cướp shortcut trình duyệt, không phá a11y (Tab đi tự nhiên)
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        typeof target.tagName === "string" &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Nhấn keycap vật lý theo event.code (AZERTY/Dvorak vẫn đúng cap)
      pressKey(keyboardState, keyIndexByCode(event.code));

      if (event.key === "Enter") {
        execute();
        return;
      }
      if (event.key === "Escape") {
        buffer.current = "";
        updatePrompt();
        return;
      }
      if (event.key === "Backspace") {
        buffer.current = buffer.current.slice(0, -1);
        updatePrompt();
        return;
      }
      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        buffer.current = (buffer.current + event.key.toLowerCase()).slice(
          0,
          24,
        );
        updatePrompt();
      }
    };

    // Click keycap trên canvas → gõ đúng ký tự đó
    keyboardState.onKeyClick = (keyIndex: number) => {
      const key = keys[keyIndex];
      if (!key) return;
      if (key.label.length === 1 && /[a-z]/i.test(key.label)) {
        buffer.current = (buffer.current + key.label.toLowerCase()).slice(
          0,
          24,
        );
        updatePrompt();
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      keyboardState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      keyboardState.invalidate?.();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      keyboardState.onKeyClick = null;
    };
  }, [keyboardState, keys]);

  return (
    <div ref={containerRef} className="relative">
      <KeyboardCanvasLoader
        keyboardStateRef={keyboardStateRef as { current: KeyboardState }}
        eventSourceRef={containerRef}
      />

      {/* Prompt terminal cố định — gõ ở bất kỳ đâu trên trang */}
      <div className="fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 font-mono text-[12px] backdrop-blur sm:max-w-md">
        <p className="text-neutral-300">
          <span className="text-neutral-600">guest@kyle:~$ </span>
          <span ref={bufferRef} data-testid="prompt-buffer" />
          <span
            ref={ghostRef}
            data-testid="prompt-ghost"
            className="text-neutral-600"
          />
          <span className="ml-[1px] inline-block h-3 w-[7px] translate-y-[2px] bg-[#a3e635] motion-safe:animate-pulse" />
        </p>
        <p
          ref={execRef}
          data-testid="exec-line"
          className="mt-1 text-[11px] text-neutral-500"
        >
          Enter chạy lệnh · Esc xoá · Tab vẫn là Tab của trình duyệt
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#a3e635] uppercase">
          Gõ để điều hướng · bàn phím là trang chủ
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          THE DAILY DRIVER
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Công cụ tôi chạm vào nhiều nhất mỗi ngày trở thành giao diện của
          chính portfolio. Gõ thật trên bàn phím của bạn: keycap tương ứng
          nhấn xuống theo lò xo, buffer lệnh tự hoàn thành, Enter đưa bạn
          tới đúng nơi. Cuộn xuống, camera lật dần về góc top-down.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          thử gõ: w → &apos;work&apos; tự hoàn thành → Enter · hoặc click
          một keycap
        </p>
      </section>

      {/* 5 SECTION LỆNH */}
      {COMMANDS.map((command, index) => (
        <section
          key={command.cmd}
          data-cmd-section={command.cmd}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#a3e635] uppercase">
              phím {command.key.toUpperCase()} · lệnh {index + 1}/5
            </p>
            <h3 className="mt-1 font-mono text-2xl text-neutral-100">
              &gt; {command.cmd}
            </h3>
            <p className="mt-1 text-sm text-neutral-300">{command.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {command.note}
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
            Một input thật thay vì một animation trang trí. Kỹ thuật: 61
            keycap trong đúng 1 instanced draw call, map phím theo
            event.code (vị trí vật lý nên AZERTY hay Dvorak vẫn nhấn đúng
            cap), vật lý lò xo là mảng typed imperative không đụng React
            state; frameloop demand chỉ render khi lò xo còn năng lượng,
            gõ xong là GPU về 0%. Bản chính thức bake legend vào một
            CanvasTexture atlas, thêm thock WebAudio sau toggle, và
            Konami code mở RGB underglow.
          </p>
        </div>
      </section>
    </div>
  );
}
