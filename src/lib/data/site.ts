/**
 * Nguồn sự thật cho brand/liên hệ của portfolio.
 * ⚠️ PLACEHOLDER — thay bằng thông tin thật trước khi deploy:
 * tên hiển thị, tagline, link socials, location.
 */
export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  /** Tên hiển thị (hero + header + metadata) */
  name: string;
  /** Canonical URL production — ⚠️ thay bằng domain thật trước khi deploy */
  url: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  /** Đang mở cho cơ hội mới — hiện chip trên hero */
  available: boolean;
  socials: SocialLink[];
}

export const SITE: SiteConfig = {
  name: "Ky Le",
  url: "https://ldky90.dev",
  title: "Senior Software Engineer",
  tagline: "Ten years of shipped systems, rendered as terrain.",
  email: "ldky90@gmail.com",
  location: "Ho Chi Minh City · UTC+7",
  available: true,
  socials: [
    { label: "GitHub", href: "https://github.com/ldky90" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ldky90" },
  ],
};
