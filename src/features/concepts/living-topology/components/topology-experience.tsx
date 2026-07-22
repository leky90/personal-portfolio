"use client";

import { useEffect, useRef } from "react";
import { TopologyCanvasLoader } from "@/features/concepts/living-topology/components/topology-canvas-loader";
import {
  SYSTEMS,
  systemIndexById,
} from "@/features/concepts/living-topology/lib/systems-data";
import {
  createTopologyState,
  type TopologyState,
} from "@/features/concepts/living-topology/lib/topology-state";

const DEFAULT_TELEMETRY =
  "— rê chuột lên một node trên graph để query hệ thống";

interface EraStop {
  year: string;
  title: string;
  copy: string;
  side: "left" | "right";
}

const ERA_STOPS: EraStop[] = [
  {
    year: "2014",
    title: "Freelance ở Huế",
    copy: "Bắt đầu bằng PHP và WordPress: dựng rồi nuôi site cho khách trên Freelancer.com, lo cross-browser và responsive mobile. Hai cụm xa nhất bên trái là chỗ mọi thứ về sau mọc lên.",
    side: "left",
  },
  {
    year: "2017",
    title: "Synova · full-stack PHP",
    copy: "Vào TP.HCM làm dự án end-to-end: từ design thành giao diện tĩnh tới web động tích hợp API — Laravel, CakePHP, Drupal, rồi Magento và OpenCart cho eCommerce.",
    side: "right",
  },
  {
    year: "2019",
    title: "TESO · chuyển sang JavaScript",
    copy: "Sở hữu end-to-end các dự án React của khách và chủ trì tối ưu codebase legacy. Cũng là lúc bắt đầu dẫn dắt: hướng dẫn đồng đội, chuẩn hoá quy trình, tài liệu và release.",
    side: "left",
  },
  {
    year: "2021",
    title: "Treehouse · DeFi/RWA",
    copy: "Dẫn đội 8 kỹ sư dựng dApp cho tài sản token hoá, sản phẩm đầu là tETH. Next.js và TypeScript ở trên, ví Web3 với Ethers.js ở dưới, dashboard giá – yield – TVL ở giữa: cụm mới nhất, xa nhất bên phải.",
    side: "right",
  },
];

interface ProjectCard {
  title: string;
  role: string;
  systemId: string;
}

const PROJECT_CARDS: ProjectCard[] = [
  {
    title: "Treehouse dApp",
    role: "Lead Frontend Engineer · 2021—nay",
    systemId: "treehouse-dapp",
  },
  {
    title: "Build-to-Rent",
    role: "React · Node.js · web app + admin",
    systemId: "build-to-rent",
  },
  {
    title: "FoodMap",
    role: "React · marketplace nông sản",
    systemId: "foodmap",
  },
];

/**
 * Layout DOM của living-topology: cuộn = timeline mọc graph theo năm,
 * hover node (canvas) hoặc project card (DOM) = query một hệ thống —
 * telemetry đổ ra HUD bằng mutate DOM trực tiếp, không re-render.
 */
export function TopologyExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const topologyStateRef = useRef<TopologyState | null>(null);
  if (topologyStateRef.current === null) {
    topologyStateRef.current = createTopologyState();
  }
  const topologyState = topologyStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      topologyState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    topologyState.setTelemetry = (systemIndex: number) => {
      const hud = hudRef.current;
      if (!hud) return;
      if (systemIndex < 0) {
        hud.textContent = DEFAULT_TELEMETRY;
        hud.classList.remove("text-[#4af2a1]");
      } else {
        const system = SYSTEMS[systemIndex];
        hud.textContent = `${system.name} — ${system.stack} · ${system.metric} · since ${system.year}`;
        hud.classList.add("text-[#4af2a1]");
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      topologyState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      topologyState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      topologyState.setTelemetry = null;
    };
  }, [topologyState]);

  const focusSystem = (systemId: string | null) => {
    topologyState.focusSystem =
      systemId === null ? -1 : systemIndexById(systemId);
    topologyState.setTelemetry?.(topologyState.focusSystem);
    topologyState.invalidate?.();
  };

  return (
    <div ref={containerRef} className="relative">
      <TopologyCanvasLoader
        topologyStateRef={topologyStateRef as { current: TopologyState }}
        eventSourceRef={containerRef}
      />

      {/* HUD telemetry — mutate textContent trực tiếp từ canvas hover */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/70 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="telemetry"
          className="truncate font-mono text-[11px] text-neutral-400"
        >
          {DEFAULT_TELEMETRY}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
          Mission control · 2014—2026
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          LIVING TOPOLOGY
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mỗi node phía sau là một mảnh hệ thống tôi từng xây — từ site
          WordPress cho khách tới dApp DeFi của Treehouse; mỗi đốm xanh là một
          request đang chạy qua kiến trúc đó. Cuộn để xem bản đồ mọc lên theo
          hơn 12 năm nghề — rê chuột lên node để query một hệ thống.
        </p>
        <p className="mt-8 animate-pulse font-mono text-xs text-neutral-600">
          ↓ cuộn: 2014, những site WordPress đầu tiên
        </p>
      </section>

      {/* TIMELINE — graph mọc theo năm */}
      {ERA_STOPS.map((era) => (
        <section
          key={era.year}
          className="mx-auto flex min-h-[90vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 backdrop-blur-sm ${
              era.side === "right" ? "ml-auto" : ""
            }`}
          >
            <p className="font-mono text-3xl text-[#4af2a1]">{era.year}</p>
            <h3 className="mt-2 text-lg font-medium text-neutral-100">
              {era.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {era.copy}
            </p>
          </article>
        </section>
      ))}

      {/* QUERY THE MAP — project card isolate subgraph */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h3 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
          Query the map
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
          Hover một case study — subgraph của hệ thống tương ứng sáng lên,
          phần còn lại chìm xuống.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PROJECT_CARDS.map((project) => (
            <article
              key={project.systemId}
              tabIndex={0}
              className="rounded-lg border border-neutral-900 bg-neutral-950/70 p-4 backdrop-blur-sm outline-none focus-visible:border-[#4af2a1]/60"
              onPointerEnter={() => focusSystem(project.systemId)}
              onPointerLeave={() => focusSystem(null)}
              onFocus={() => focusSystem(project.systemId)}
              onBlur={() => focusSystem(null)}
            >
              <h4 className="font-mono text-sm text-neutral-100">
                {project.title}
              </h4>
              <p className="mt-1 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                {project.role}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT + CORE IDEA */}
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          Mở một connection mới.
        </h3>
        <a
          href="mailto:ldky90@gmail.com"
          className="mt-8 rounded border border-[#4af2a1]/40 px-5 py-2.5 font-mono text-sm text-[#4af2a1] transition-colors hover:bg-[#4af2a1]/10"
        >
          ldky90@gmail.com →
        </a>

        <div className="mt-16 w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 text-left">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Chất liệu ở đây chính là kiến trúc hệ thống: graph dựng từ một
            model JSON của các service thật. Layout được <em>bake</em> một lần
            lúc mount (không physics runtime), cả bản đồ là 3 draw call —
            nodes instanced, edges merge một LineSegments, packets instanced —
            useFrame không cấp phát bộ nhớ, và frameloop=&ldquo;demand&rdquo;
            để GPU nghỉ khi bạn dừng. Bản chính thức: bake bằng d3-force-3d
            lúc build + selective bloom cho packet.
          </p>
        </div>
      </section>
    </div>
  );
}
