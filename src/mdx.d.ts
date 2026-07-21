declare module "*.mdx" {
  import type { ComponentType } from "react";

  /** remark-mdx-frontmatter export frontmatter đã parse của file */
  export const frontmatter: Record<string, unknown>;
  const MDXContent: ComponentType<Record<string, unknown>>;
  export default MDXContent;
}
