# Migration: Next.js → React + Vite static, deploy GitHub Pages

## Quyết định

Bỏ hoàn toàn Next.js. Site trở thành **Vite SPA build ra static files**,
deploy lên **GitHub Pages** bằng GitHub Actions (actions/deploy-pages).

Lý do: không cần server runtime — toàn bộ 40 route đã static; GH Pages
miễn phí và đơn giản hơn Vercel cho nhu cầu này.

## Kiến trúc mới

| Trước (Next) | Sau (Vite) |
|---|---|
| App Router file-system routes | `react-router` library mode, bảng route ở `src/app/routes.tsx` |
| `next/dynamic` ssr:false | `React.lazy` + `<Suspense fallback={<ScenePoster/>}>` |
| `export const metadata: Metadata` | Giữ nguyên convention, type `PageMetadata` từ `@/lib/page-meta`; router wrapper render `<PageMeta/>` set `document.title` + meta description |
| `next/link` | `react-router` `<Link to>` |
| `next-mdx-remote` compileMDX RSC | `@mdx-js/rollup`: import `.mdx` như component, frontmatter qua `remark-frontmatter` + `remark-mdx-frontmatter`, highlight `rehype-pretty-code` giữ nguyên; load bằng `import.meta.glob` |
| `sitemap.ts` / `robots.ts` (route handlers) | Builder thuần `src/lib/static-seo.ts` (tested) + vite plugin `closeBundle` ghi `dist/sitemap.xml`, `dist/robots.txt`, `dist/404.html` (SPA fallback), `dist/.nojekyll` |
| `opengraph-image.tsx` (next/og) | Bỏ — OG meta tĩnh trong `index.html` |
| `next/font/google` Geist | `@fontsource-variable/geist(-mono)` import trong `main.tsx` |
| `@vercel/analytics`, `speed-insights` | Bỏ (không chạy trên GH Pages) |
| Turbopack + React Compiler | Vite mặc định (bỏ react-compiler) |

## Ràng buộc giữ nguyên

- Pages ở `src/app/**` (đúng global rule "pages in /app"); import path
  của 40 page test KHÔNG đổi trừ 2 route slug.
- 26 concept demo + lab + home giữ nguyên hành vi; loader test
  (reduced-motion → poster) giữ nguyên assertions.
- Port dev 3000 (khớp `.claude/launch.json`).
- Alias `@/*`, vitest jsdom, 816 test phải xanh lại sau migration.

## Chi tiết

1. **Base path GH Pages**: `vite.config` đọc `process.env.VITE_BASE`
   (default `/`); workflow set `VITE_BASE=/<repo>/`. Router dùng
   `basename={import.meta.env.BASE_URL}`.
2. **SPA fallback**: copy `index.html` → `404.html` lúc build (GH Pages
   trick chuẩn cho deep-link).
3. **Route slug**: `src/app/projects/[slug]/page.tsx` →
   `src/app/projects/case-study-page.tsx` (useParams, sync render);
   tương tự `writing/[slug]` → `writing/writing-post-page.tsx`.
   Slug sai → render `NotFoundPage`.
4. **Concept routes**: một route `/concepts/:conceptId` + resolver dùng
   `import.meta.glob("./concepts/*/page.tsx")` — không liệt kê tay 26 lần.
5. **Tests đổi**: layout/sitemap/robots/og tests thay bằng
   root-layout/static-seo tests; test render component có `<Link>` bọc
   `MemoryRouter`; mdx tests chuyển sang glob modules.
6. **ESLint**: bỏ `eslint-config-next`, dùng flat config tối thiểu
   (`@eslint/js` + `typescript-eslint` + `react-hooks`).

## Definition of done

- `pnpm dev` chạy Vite tại :3000, đủ 40 route.
- `pnpm build` ra `dist/` kèm sitemap.xml, robots.txt, 404.html, .nojekyll.
- `pnpm test` xanh toàn bộ; `pnpm typecheck` sạch.
- `.github/workflows/deploy.yml` build + deploy Pages khi push main.
- AGENTS.md mô tả stack mới; không còn dependency `next*`/`@vercel/*`.
