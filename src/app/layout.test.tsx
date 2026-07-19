import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

describe("RootLayout", () => {
  it("metadata là brand portfolio với title template + metadataBase", async () => {
    const { metadata } = await import("@/app/layout");
    const title = metadata.title as { default: string; template: string };
    expect(title.default).toMatch(/Ky Le/);
    expect(title.default).toMatch(/Senior Software Engineer/i);
    expect(title.template).toContain("%s");
    expect(String(metadata.metadataBase)).toMatch(/^https:\/\//);
    expect(metadata.description).toBeTruthy();
  });
});
