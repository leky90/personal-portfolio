/**
 * Nguồn sự thật cho brand/liên hệ của portfolio.
 * Dữ liệu đối chiếu từ hồ sơ công khai: LinkedIn (le-dinh-ky),
 * Freelancer.com (@Leky90) và Upwork.
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
  name: "Ky Le Dinh",
  // GH Pages project site của tài khoản leky90; đổi khi gắn custom domain
  url: "https://leky90.github.io/personal-portfolio",
  title: "Senior Software Engineer · Frontend Lead",
  tagline:
    "Twelve years of shipped web, rendered as terrain — freelance PHP in 2014 to leading the frontend of a DeFi platform today.",
  email: "ldky90@gmail.com",
  location: "Hue, Vietnam · UTC+7",
  available: true,
  socials: [
    { label: "GitHub", href: "https://github.com/leky90" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/le-dinh-ky" },
    { label: "Upwork", href: "https://www.upwork.com/freelancers/~01539b007b5baff014" },
    { label: "Freelancer", href: "https://www.freelancer.com/u/Leky90" },
  ],
};
