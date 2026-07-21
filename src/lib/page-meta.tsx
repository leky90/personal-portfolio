"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/data/site";

/**
 * Thay thế convention `Metadata` của Next sau khi chuyển sang Vite SPA:
 * mỗi page vẫn `export const metadata` cùng shape cũ (title/description),
 * router wrapper render <PageMeta> để set document.title + meta
 * description lúc điều hướng client-side.
 */
export interface PageMetadata {
  title?: string;
  description?: string;
}

/** Áp template "%s · <name>" như layout Next cũ; không title → brand. */
export function formatDocumentTitle(title: string | undefined): string {
  return title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.title}`;
}

export function PageMeta({ meta }: { meta?: PageMetadata }) {
  useEffect(() => {
    document.title = formatDocumentTitle(meta?.title);
    if (meta?.description) {
      let tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = meta.description;
    }
  }, [meta]);

  return null;
}
