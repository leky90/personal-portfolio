# Stack: React + Vite static SPA (KHÔNG còn Next.js)

Repo đã migrate khỏi Next.js (xem `docs/features/2026-07-21-vite-static-migration.md`).

- **Build**: Vite (`vite.config.mts` — config duy nhất cho cả Vitest). `pnpm dev` chạy port 3000, `pnpm build` ra `dist/` static.
- **Routing**: `react-router` library mode — bảng route ở `src/app/routes.tsx`; pages vẫn nằm tại `src/app/**/page.tsx` (route slug dùng `useParams`, không còn thư mục `[slug]`).
- **Metadata**: mỗi page `export const metadata: PageMetadata` (từ `@/lib/page-meta`); router wrapper render `<PageMeta>` set `document.title`. KHÔNG import từ "next".
- **Lazy canvas**: `React.lazy` + `<Suspense fallback={<ScenePoster/>}>` (không có `next/dynamic`).
- **MDX**: import trực tiếp `.mdx` qua `@mdx-js/rollup` (`src/lib/mdx.tsx`, `import.meta.glob`); frontmatter validate Zod lúc build.
- **SEO tĩnh**: `src/lib/static-seo.ts` + `scripts/static-seo-plugin.ts` ghi `sitemap.xml`, `robots.txt`, `404.html` (SPA fallback), `.nojekyll` vào `dist/` lúc build.
- **Deploy**: GitHub Pages qua `.github/workflows/deploy.yml`; base path set bằng env `VITE_BASE=/<repo>/`. `SITE.url` trong `src/lib/data/site.ts` phải khớp nơi deploy.
- Test bằng Vitest (jsdom); component có `<Link>` phải render trong `MemoryRouter`.
