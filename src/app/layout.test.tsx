import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

describe("RootLayout", () => {
  it("khai báo metadata cho concept lab", async () => {
    const { metadata } = await import("@/app/layout");
    expect(String(metadata.title)).toMatch(/concept lab/i);
    expect(metadata.description).toBeTruthy();
  });
});
