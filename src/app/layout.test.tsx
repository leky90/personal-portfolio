import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

describe("RootLayout", () => {
  it("metadata là brand portfolio (tên + Senior Software Engineer)", async () => {
    const { metadata } = await import("@/app/layout");
    expect(String(metadata.title)).toMatch(/Ky Le/);
    expect(String(metadata.title)).toMatch(/Senior Software Engineer/i);
    expect(metadata.description).toBeTruthy();
  });
});
