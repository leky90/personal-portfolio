# personal-portfolio

Portfolio của một senior software engineer, art direction **Ten Years of Terrain**:
mười năm hệ thống đã ship được render thành địa hình 3D, cuộn trang là trục thời gian.

Kèm theo là **Concept Lab** — 26 hướng art direction đã được đề xuất, chấm mù trên
cùng một thang điểm và **build thành demo chạy được từng cái**, để việc chọn hướng
thiết kế cũng là một sản phẩm đọc được.

**Live:** https://leky90.github.io/personal-portfolio

## Stack

| Lớp | Công nghệ |
|---|---|
| Build | Vite 8 (một config duy nhất cho cả build lẫn test) |
| UI | React 19, TypeScript, Tailwind v4, shadcn/ui |
| 3D | three.js, React Three Fiber, drei, maath |
| Routing | react-router (library mode), static SPA |
| Nội dung | MDX qua `@mdx-js/rollup`, frontmatter validate bằng Zod lúc build |
| Test | Vitest + Testing Library (jsdom) |
| Deploy | GitHub Pages qua GitHub Actions |

## Chạy local

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

```bash
pnpm test       # Vitest
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
pnpm build      # ra dist/ (kèm sitemap.xml, robots.txt, 404.html, .nojekyll)
pnpm preview    # phục vụ thử bản build
```

## Kiến trúc

```
src/
  app/            # pages (routes.tsx là bảng route; concept pages resolve bằng glob)
  components/     # section trang chủ + UI dùng chung
  features/
    concepts/     # 26 concept demo, mỗi cái một feature độc lập
      <id>/
        lib/        # dữ liệu + shader + state thuần, unit-tested
        components/ # scene / canvas / canvas-loader / experience
  lib/            # dữ liệu site, MDX pipeline, SEO tĩnh, metadata helper
content/          # case study + bài viết dạng .mdx
scripts/          # vite plugin sinh sitemap/robots/404 lúc build
```

Nguyên tắc xuyên suốt mọi demo 3D:

- **`frameloop="demand"`** — cảnh đứng yên thì GPU về 0%; chỉ render khi có cuộn,
  tương tác, hoặc còn spring chưa settle.
- **Dữ liệu và toán tách khỏi scene** — mọi thứ tính được (layout, vật lý, đường cong,
  BFS, strain) sống trong `lib/` dưới dạng hàm thuần và được unit-test; component chỉ
  lắp ráp và vẽ.
- **Đếm draw call có chủ đích** — instancing và merge geometry thay vì thêm mesh; nhiều
  demo cả cảnh chỉ một hoặc vài draw call.
- **Text-first** — nội dung là DOM server-side, canvas nằm sau và lazy-mount; bật
  `prefers-reduced-motion` thì canvas không bao giờ được tải.

## Deploy

Push lên `main` → workflow `.github/workflows/deploy.yml` chạy test, build với
`VITE_BASE=/<repo>/` rồi publish lên GitHub Pages. Cần bật **Settings → Pages →
Source: GitHub Actions** một lần.

Gắn custom domain: đổi `SITE.url` trong `src/lib/data/site.ts` và bỏ `VITE_BASE`
trong workflow.

## Trạng thái nội dung

> Số liệu, tên dự án và case study hiện tại là **dữ liệu mẫu** dùng để dựng và kiểm
> thử giao diện, chưa phải hồ sơ nghề nghiệp thật. Chúng sống tập trung trong
> `src/lib/data/*.ts` và `content/*.mdx` để thay bằng dữ liệu thật mà không đụng
> tới code.
