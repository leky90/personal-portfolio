import path from "node:path";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vitest/config";
import { staticSeoPlugin } from "./scripts/static-seo-plugin";

/**
 * Một config duy nhất cho cả Vite lẫn Vitest (vitest đọc `test` field).
 * base: GH Pages project site cần "/<repo>/" — workflow set VITE_BASE;
 * local dev/preview mặc định "/".
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    {
      // MDX phải chạy trước react plugin; frontmatter export qua remark
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
        ],
        rehypePlugins: [
          [rehypePrettyCode, { theme: "vesper", keepBackground: false }],
        ],
      }),
    },
    react(),
    tailwindcss(),
    staticSeoPlugin(),
  ],
  server: {
    // Khớp .claude/launch.json + thói quen port của repo
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    // globals bật để @testing-library/react tự cleanup DOM sau mỗi test
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["@testing-library/jest-dom/vitest"],
  },
});
