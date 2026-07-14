# Portfolio Senior Software Engineer — Kế hoạch & Concept 3D (Three.js)

> Ngày: 2026-07-14 · Trạng thái: **chờ chốt concept** · Quy trình: 1 trend-scout + 6 concept generator + 3 giám khảo độc lập (hiring manager / graphics-perf expert / Awwwards judge), tổng 18 concept được chấm điểm.

## 1. Tóm tắt & giả định

Xây portfolio cá nhân cho **senior software engineer** (định vị: 10+ năm, full-stack, hướng tới nhà tuyển dụng quốc tế và khách hàng freelance). 3D phải **nâng tầm thương hiệu cá nhân** — ấn tượng nhưng tinh tế, không bao giờ là gimmick giật lag.

**Giả định đã chốt (điều chỉnh được):**
- Stack: **Next.js 15 App Router + TypeScript + Tailwind v4 + shadcn/ui**, 3D qua **React Three Fiber v9 + drei** (three r185). Deploy **Vercel**.
- Nội dung tiếng Anh (đối tượng quốc tế); các section: hero, about, experience timeline, projects/case studies, skills, writing, contact.
- Ràng buộc cứng: mobile-first (375px), LCP < 2.5s, có fallback `prefers-reduced-motion`, pnpm + `@latest` + alias `@/*` theo global rules.

## 2. Xu hướng 2025–2026 (digest từ trend-scout)

**Đang "fresh":**
- **WebGPU-first** với fallback WebGL2 (three `WebGPURenderer` production-ready từ ~r171, TSL compile ra cả WGSL + GLSL) — tín hiệu kỹ thuật mạnh.
- **Scroll là động cơ kể chuyện**: cả trải nghiệm là một scene 3D được đạo diễn, không phải trang 2D "rắc" 3D lên.
- **"One hard idea, executed cleanly"** — một ý tưởng khó làm tới nơi thắng mọi combo hiệu ứng chồng chất; giám khảo giờ đòi ~60fps trên điện thoại tầm trung.
- **ASCII / dithering / CRT shader** gắn với văn hóa terminal-builder (monospace, layout thưa) — mạnh khi là shader craft thật, yếu khi chỉ là CSS filter.

**Đã "dated":** purple/gradient blob hero, particle field trôi vô định, mouse-distortion RGB-shift, bento grid không có twist — đọc ra là template 2019–2022.

**Phiên bản ecosystem (verify 07/2026):** `three@0.185.1`, `@react-three/fiber@9.6.1` (React 19), `@react-three/drei@10.7.7`, `@react-three/postprocessing@3.0.4` — tương thích Next.js 15 / React 19.

## 3. Bảng xếp hạng 18 concept (điểm trung bình 3 giám khảo, thang 10)

| # | Concept | Overall | Originality | Senior signal | Feasibility | Perf | Khó | Ước lượng |
|---|---|---|---|---|---|---|---|---|
| 1 | **Ten Years of Terrain** | **8.7** | 7.7 | 9.0 | 7.7 | 9.0 | 4/5 | ~6d |
| 2 | Resolution | 7.7 | 6.3 | 7.7 | 9.0 | 9.3 | 3/5 | ~4.5d |
| 3 | Monolith | 7.7 | 6.7 | 7.7 | 7.0 | 9.0 | 4/5 | ~6d |
| 4 | Compiled Light | 7.3 | 5.3 | 7.3 | 8.3 | 9.0 | 3/5 | ~5d |
| 5 | Living Topology | 7.3 | 5.7 | 8.3 | 6.7 | 8.0 | 4/5 | ~9d |
| 6 | Dependency Constellation | 7.0 | 5.0 | 7.3 | 8.7 | 9.0 | 3/5 | ~6d |
| 7 | Cabinet of Shipped Worlds | 6.7 | 7.0 | 7.0 | 5.3 | 7.7 | 4/5 | ~8d |
| 8 | Glyph Field | 6.7 | 4.7 | 7.3 | 7.7 | 8.7 | 4/5 | ~7d |
| 9 | The Daily Driver (Typeable Keyboard) | 6.7 | 5.7 | 6.7 | 8.0 | 9.0 | 3/5 | ~5d |
| 10 | Phosphor Lens | 6.3 | 4.3 | 7.0 | 9.0 | 9.0 | 3/5 | ~5.5d |
| 11 | Signal From Noise | 5.7 | 4.3 | 7.0 | 6.0 | 7.3 | 4/5 | ~7d |
| 12 | Commit Skyline | 5.7 | 3.0 | 6.3 | 8.3 | 9.0 | 3/5 | ~7d |
| 13 | Weight of Experience (Gravity Toybox) | 5.7 | 5.0 | 5.7 | 6.0 | 7.0 | 4/5 | ~8d |
| 14 | Request Lifecycle | 5.7 | 9.0 | 8.7 | **3.0** | 5.7 | 5/5 | ~15d |
| 15 | Ten-Year Galaxy | 5.3 | 3.7 | 6.3 | 6.3 | 7.7 | 4/5 | ~9d |
| 16 | Full-Stack Strata | 5.0 | 5.3 | 6.3 | 4.0 | 6.0 | 4/5 | ~11d |
| 17 | Desk, Version-Controlled | 4.7 | 3.7 | 5.3 | 4.3 | 7.0 | 3/5 | ~8d |
| 18 | The Credential (Lanyard Badge) | 4.0 | 2.3 | 4.7 | 8.0 | 8.0 | 3/5 | ~5d |

**Pattern thua cuộc mà cả 3 giám khảo cùng chỉ ra:** (a) clone các demo nổi tiếng mà chính đối tượng kỹ thuật sẽ nhận ra ngay (pmndrs lanyard, GitHub Skyline, galaxy tutorial của three.js-journey, isometric room) → đọc ra "copied CodePen"; (b) ý tưởng đẹp nhưng over-scoped cho một người làm buổi tối (Request Lifecycle được chấm originality 9.0 nhưng feasibility 3.0 — "site không bao giờ launch"); (c) tông "charming-junior" thay vì "confident-senior" (desk, island, toybox).

## 4. Top 3 concept — chi tiết

### 🥇 1. Ten Years of Terrain — 8.7/10 (top-3 của CẢ 3 giám khảo)

> **Pitch:** Mười năm làm việc thực (commits, vai trò, các lần launch) được encode vào data texture rồi extrude thành **địa hình ridgeline đơn sắc ~300 đường contour phát sáng** (kiểu Joy Division đưa vào không gian 3 chiều); cuộn timeline kinh nghiệm = camera dolly bay ngang qua 10 năm "địa hình sự nghiệp".

- **Visual:** nền tối, một vật thể duy nhất — field ~300 đường ngang mảnh, additive trắng trên đen, một đường contour màu **hổ phách điện** đánh dấu "vị trí hiện tại"; núi nhô cao ở nơi output đỉnh (đợt rebuild platform 2021 = khối núi lớn), sương mù nuốt phía xa, noise simplex "thở" nhẹ. Không một blob tím nào.
- **Tương tác hero:** parallax damped theo chuột; raycast xuống mặt phẳng ẩn tạo **gợn sóng highlight** lan qua các đường từ điểm trỏ. Scroll là tương tác chính — camera bay ngược trục thời gian.
- **Xuyên suốt các section (điểm ăn tiền — hero và timeline là MỘT scene liên tục):** mỗi "kỷ" núi align với card DOM timeline được pin (GSAP ScrollTrigger scrub); Skills = badge waveform dùng cùng shader displacement (drei `<View>` trên 1 canvas chung); Contact = địa hình phẳng dần thành **một đường chân trời tĩnh lặng** sau ridge cuối ("đỉnh tiếp theo là dự án của bạn").
- **Tech:** 1 BufferGeometry merged (300 × 512 segment ≈ 154k verts, **1 draw call**), toàn bộ displacement trong vertex shader, height từ DataTexture R16F 512×300 **bake lúc build** từ GitHub GraphQL contributions API + JSON sự kiện sự nghiệp (script Node commit texture vào repo — không gọi API runtime). Camera path CatmullRom bake sẵn, scrub bởi ScrollTrigger. **Tuỳ chọn flourish:** port displacement sang TSL để auto compile WGSL trên WebGPU / GLSL trên WebGL2 + dòng credit "rendered on WebGPU where available".
- **Perf:** `frameloop="demand"`, idle gần như 0 GPU; DPR [1,2] + PerformanceMonitor hạ segment 512→256 khi yếu. **Mobile 375px:** 150 đường × 256 segment, tắt ripple, DPR 1.5. **Reduced-motion:** thay dolly bằng crossfade giữa 4 camera keyframe theo section.
- **Senior signal:** đây là **pipeline data-engineering khoác áo generative art** — build-time ETL → GPU texture → single-draw-call vertex-shader renderer → TSL/WebGPU dual-compile. Mỗi tầng là một talking point khi phỏng vấn. 3D không trang trí; nó **chính là** timeline kinh nghiệm, render từ dữ liệu thật.
- **Libs:** `three` (+`three/webgpu` optional), `@react-three/fiber@9`, `@react-three/drei@10` (View, PerformanceMonitor), `gsap` + ScrollTrigger, `lenis`, `maath`, `r3f-perf` (dev).

### 🥈 2. Resolution — 7.7/10 (rẻ nhất, an toàn nhất, ~4.5 ngày)

> **Pitch:** MỘT fragment shader viết tay (luminance → Bayer dither 8×8 → glyph atlas monospace) trở thành **toàn bộ ngôn ngữ render của site**: chân dung, mọi cover dự án đều vẽ live bằng ASCII; hover vào đâu thì chỗ đó "resolve" từ ký tự thô về ảnh nét.

- Hero: headline DOM monospace lớn + chân dung video loop render ASCII real-time (off-white trên đen, highlight tint acid green); con trỏ là **thấu kính lấy nét** — trong bán kính ~180px cell nhỏ lại 4×, khuôn mặt hiện rõ dần dưới cursor.
- Xuyên suốt: cover dự án hover → resolve nét (metaphor "đưa vào tiêu điểm" cho cả site); skill = dot-matrix bar cùng glyph atlas; ảnh bài viết + OG image pre-dither lúc build bằng Sharp với đúng ma trận Bayer đó.
- Perf gần như không thể rẻ hơn: 1 pipeline fullscreen-quad, <10 draw call toàn site, **render ở DPR 1 by design** (độ thô là thẩm mỹ nên retina cost = 0), `frameloop="demand"`. Fallback reduced-motion là `<pre>` ASCII generate lúc build — fallback **chính là** aesthetic, không phải bản lỗi.
- Senior signal: "toàn bộ visual identity là một fragment shader, chạy DPR 1, idle 0 GPU" — một tuyên bố kiểm chứng được bằng devtools. Đúng sóng ASCII/dither 2026, map thẳng vào identity terminal-builder.

### 🥉 3. Monolith — 7.7/10 (điêu khắc typographic, "0% GPU at rest")

> **Pitch:** Cả portfolio là MỘT scene liên tục: khối điêu khắc chữ **tên của engineer** extrude matte-black kiểu tượng đài; scroll dolly camera lướt dọc và **xuyên qua** các letterform — mỗi section là một góc máy lên cùng một vật thể, như đi quanh biển hiệu trong gallery.

- Vật liệu tiết chế tuyệt đối: charcoal mờ, chỉ thấy hình khối nơi một rim light (trắng ấm + một cạnh key đỏ) chạm cạnh bevel; film grain mảnh. "Kubrick's monolith re-cut as type."
- Experience = các con số năm 2016→2026 extrude lùi dần theo trục Z trên đường camera — cuộn timeline là **du hành qua sự nghiệp**; project numerals 01–04 bắt rim light khi active; đường bay kết thúc chui vào letterform cuối lộ chữ "SAY HI" khắc mặt trong, camera dừng đúng cạnh form contact. Deep-link `#projects` khôi phục đúng camera t-value từ URL hash.
- Tech: drei `Text3D` + merge geometry (<15 draw call), camera CatmullRom + ScrollTrigger scrub zero-allocation, N8AO half-res chỉ desktop. Keyboard nav = cùng choreography camera (a11y first-class). `frameloop="demand"` → **GPU vẽ đúng 0 khi ngừng cuộn** — claim kiểm chứng được, đáng khoe trong colophon.
- Senior signal: scroll choreography + deep-linking + keyboard parity + rendering là **một state machine thống nhất** — cách một senior đối xử với motion: là state, không phải trang trí.

### Đáng cân nhắc thêm

- **Living Topology (7.3, ~9d):** network graph 3D data-driven của mọi hệ thống từng xây, packet pulse chạy qua kiến trúc 10 năm; layout d3-force-3d **bake lúc build**. Brand match mạnh nhất cho định vị distributed-systems, nhưng choreography "rewire theo timeline" nhiều rủi ro schedule/jank hơn Monolith với payoff tương đương (lý do giám khảo perf cắt).
- **Compiled Light (7.3, ~5d):** anh em với Resolution nhưng có scene 3D thật (dune-field FBM) dưới lớp ASCII + thấu kính "decompile" — nếu muốn hướng ASCII nhưng nhiều chất 3D hơn.

## 5. Khuyến nghị

**Chọn Ten Years of Terrain.** Lý do: duy nhất lọt top-3 của cả ba giám khảo với ba lăng kính đối nghịch; senior-signal cao nhất nhóm khả thi (9.0); trả lời sạch câu hỏi "vì sao 3D này tồn tại?" — vì nó **là** dữ liệu sự nghiệp thật; scope 6 ngày part-time là thật (geometry + shader tự viết, không phụ thuộc kỹ năng Blender); và có đường degrade sang tĩnh mà không mất thương hiệu.

- Nếu ưu tiên **ship nhanh nhất, rủi ro thấp nhất** → **Resolution** (~4.5d, khó 3/5).
- Nếu muốn **tượng đài typographic, camera điện ảnh** → **Monolith**.
- Có thể ghép: Terrain làm xương sống + mượn "lens/resolve" của Resolution cho project covers — nhưng chỉ sau khi Terrain chạy 60fps trên mobile (nguyên tắc "one hard idea").

## 6. Kế hoạch triển khai

### 6.1 Cấu trúc thư mục

```
personal-portfolio/
├── app/
│   ├── layout.tsx                  # Root layout: next/font, theme provider, metadata base
│   ├── page.tsx                    # Single-page home (Server Component ghép các section)
│   ├── globals.css                 # Tailwind v4 @theme tokens, CSS variables, motion prefs
│   ├── writing/{page.tsx,[slug]/page.tsx}
│   ├── projects/[slug]/page.tsx    # Case study (MDX + typed frontmatter)
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx
│   └── api/contact/route.ts        # (optional) Resend
├── components/
│   ├── sections/                   # hero, about, experience-timeline, projects, skills, writing-preview, contact
│   ├── three/                      # TOÀN BỘ code R3F cô lập ở đây (ranh giới bundle-split)
│   │   ├── scene-root.tsx          # 'use client' — dynamic(import('./canvas'), { ssr:false })
│   │   ├── canvas.tsx              # <Canvas> duy nhất + providers
│   │   ├── scene.tsx               # ═══ SLOT CONCEPT 3D (Terrain) ═══
│   │   └── poster.tsx              # Fallback tĩnh / Suspense placeholder
│   ├── ui/                         # shadcn/ui
│   └── site-header.tsx · site-footer.tsx · section-shell.tsx
├── content/{projects,writing}/*.mdx # Prose dài
├── lib/
│   ├── data/                       # experience.ts · projects.ts · skills.ts · site.ts (typed TS)
│   ├── mdx.ts · utils.ts
├── public/{models,images}/
└── types/index.ts
```

**Chiến lược nội dung — hybrid:** dữ liệu có cấu trúc (timeline, project cards, skills) = **TS typed** trong `lib/data` (type-safe, 0 chi phí parse, render trong Server Components); prose dài (case study, bài viết) = **MDX** với frontmatter validate bằng Zod lúc build.

### 6.2 Các phase (mỗi phase có Definition of Done)

| Phase | Nội dung | DoD chính | Buổi tối (~2h) |
|---|---|---|---|
| 0 | `pnpm create next-app@latest` + Tailwind v4 `@theme` tokens + `shadcn init` + next/font; deploy Vercel preview từ ngày 1 | Boot sạch, token render 2 theme | 2 |
| 1 | Layout, header/footer, anchor nav, sheet mobile, section-shell, outline semantic đủ 7 section | Lighthouse a11y ≥ 95 trên skeleton, chạy tốt 375/768/1280 | 3 |
| 2 | Content model (types + `lib/data`), About/Experience/Skills/Contact với nội dung THẬT; **hero text = LCP element, chốt ngay** | Không còn lorem ipsum; LCP < 1.5s (chừa headroom cho 3D) | 4–5 |
| 3 | MDX pipeline (Zod frontmatter, shiki), 3–5 case study, /writing, SSG toàn bộ | Build tĩnh sạch, 404 xử lý | 5 |
| 4 | **3D — Ten Years of Terrain**: script ETL GitHub→DataTexture, terrain vertex shader, camera spline + ScrollTrigger, View cho skills badges, mount sau intersection+idle | LCP không đổi so với Phase 3; 60fps desktop, không jank mobile tầm trung; reduced-motion ra poster; tắt JS/WebGL vẫn là trang hoàn chỉnh | 6–8 |
| 5 | Hardening: bundle analyzer (three chỉ nằm trong lazy chunk), image audit, keyboard/contrast/VoiceOver pass | Lighthouse ≥ 95 perf / 100 a11y / 100 BP / 100 SEO mobile | 3 |
| 6 | Metadata API, sitemap/robots, OG qua `ImageResponse`, JSON-LD Person/Article, Vercel Analytics + Speed Insights | OG validate, rich-results pass | 2 |
| 7 | Domain, cross-browser sweep, RUM check | CWV xanh trên production | 2 |
| | **Tổng** | | **27–30 buổi ≈ 5.5–6 tuần** |

**De-risk quan trọng:** cuối Phase 3 đã có bản **shippable không-3D** — deploy luôn; 3D là enhancement đắp sau. Phase 4 là nguồn variance chính → timebox, nếu vỡ budget thì rơi về biến thể đơn giản hơn của Terrain (ít đường, không ripple). Viết copy (Phase 2–3) chạy song song từ tuần 1 vì đó mới là bottleneck thật.

### 6.3 Kiến trúc tích hợp R3F trong Next 15

```
page.tsx (Server Component)
  └─ <SceneRoot/>  ('use client')
       └─ dynamic(() => import('@/components/three/canvas'), { ssr:false, loading: () => <ScenePoster/> })
```

- Next 15 chỉ cho `ssr:false` trong Client Component → dynamic import phải nằm trong wrapper `'use client'` mỏng, **không** trong `page.tsx`. Wrapper cũng là nơi đặt IntersectionObserver + `requestIdleCallback` + nhánh reduced-motion → user reduced-motion **không bao giờ tải** chunk three.js.
- **Một `<Canvas>` duy nhất + drei `<View>`** thay vì nhiều canvas (mỗi canvas = một WebGL context riêng, browser cap ~8–16 context, không share texture/program). Một canvas fixed full-viewport, các `<View>` track theo placeholder DOM → scale sạch khi Terrain lan ra skills badges.
- Suspense fallback là **poster có thiết kế** (ảnh tĩnh đúng silhouette của scene) chứ không phải spinner — poster kiêm luôn trạng thái cuối của reduced-motion; giữ chỗ layout sẵn nên CLS = 0.

### 6.4 Ngân sách hiệu năng

| Chỉ số | Ngân sách |
|---|---|
| LCP mobile (RUM) | < 2.5s (target < 1.8s) |
| JS route đầu (gzip, chưa tính chunk three) | < 160 KB |
| Chunk three.js lazy (gzip) | < 250 KB |
| CLS / INP | < 0.05 / < 200ms |
| Frame | 60fps desktop, không jank mobile tầm trung |

Chiến thuật: LCP là text không phải canvas; bundle isolation (three chỉ import dưới `components/three/`); DPR clamp `[1, 1.75–2]`; `frameloop="demand"` + `invalidate()` theo scroll/pointer; ưu tiên geometry/shader thủ tục thay vì model (Terrain = **0 KB model**); profile trên điện thoại thật (DevTools 4× throttle chỉ là sàn).

### 6.5 A11y & fallback

- `prefers-reduced-motion` check **trước khi** tải chunk three; mọi transition site-wide qua hook chung + variant `motion-safe:`/`motion-reduce:` của Tailwind.
- Canvas là trang trí: `aria-hidden`, không nội dung nào chỉ tồn tại trong WebGL — mọi thông tin 3D thể hiện đều có DOM text thật (timeline là `<ol>` thật).
- Skip link, focus ring, heading order, contrast ≥ 4.5:1; không JS / không WebGL vẫn là một portfolio hoàn chỉnh, chuyên nghiệp.

### 6.6 SEO / OG / Analytics / Deploy

Metadata API + `generateMetadata` per-route, `sitemap.ts`/`robots.ts`, OG động qua `ImageResponse` (per-post variant), JSON-LD `Person`/`Article`/`BreadcrumbList`, `@vercel/analytics` + `@vercel/speed-insights`, SSG toàn bộ trên Vercel, domain custom ở Phase 7.

## 7. Nhận xét hội đồng giám khảo (trích)

- **Hiring manager:** "Nhóm thắng chung một tính chất: 3D **là** nội dung, không phải bộ trang phục… Biết mình ship được gì trong quỹ thời gian part-time chính là senior signal mà portfolio này tồn tại để chứng minh."
- **Graphics/perf expert:** "Terrain, Compiled Light, Monolith: GPU-resident animation, idle gần 0, LCP tách hoàn toàn khỏi WebGL, effort estimate trung thực — không giấu dependency Blender trong con số 'ngày'."
- **Awwwards judge:** "Ở concept thắng, art direction và nội dung là cùng một vật thể — bỏ 3D đi thì site mất **thông tin**, không phải mất trang trí… Một tuần sau vẫn nhớ."

## 8. Bước tiếp theo

1. **Chốt concept** (khuyến nghị: Ten Years of Terrain) + chốt accent color (hổ phách) & typeface pair (display + mono).
2. Phase 0: scaffold `pnpm create next-app@latest` → theme tokens → shadcn init → Vercel preview.
3. Song song: bắt đầu draft copy cho 3–5 case study (bottleneck thật của dự án).
