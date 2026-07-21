import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PageMeta,
  formatDocumentTitle,
  type PageMetadata,
} from "@/lib/page-meta";
import { SITE } from "@/lib/data/site";

describe("page-meta — thay convention Metadata của Next", () => {
  it("formatDocumentTitle: áp template '%s · <name>' như layout cũ", () => {
    expect(formatDocumentTitle("Concept Lab")).toBe(
      `Concept Lab · ${SITE.name}`,
    );
  });

  it("formatDocumentTitle: không title → brand mặc định name + title", () => {
    expect(formatDocumentTitle(undefined)).toBe(
      `${SITE.name} — ${SITE.title}`,
    );
  });

  it("PageMeta set document.title và meta description khi mount", async () => {
    const meta: PageMetadata = {
      title: "Trang thử",
      description: "Mô tả thử nghiệm",
    };
    render(<PageMeta meta={meta} />);
    await waitFor(() => {
      expect(document.title).toBe(`Trang thử · ${SITE.name}`);
    });
    const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe("Mô tả thử nghiệm");
  });
});
