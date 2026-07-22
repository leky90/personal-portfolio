/**
 * Selected work — card trên trang chủ, case study MDX chi tiết ở
 * content/projects/. Dữ liệu lấy từ portfolio công khai trên
 * Freelancer.com (@Leky90) và Upwork; mô tả chỉ nêu vai trò, stack và
 * phạm vi có thể đối chiếu được, không kèm số liệu tự bịa.
 */
export interface ProjectMeta {
  slug: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
  metrics: string[];
  /** Năm kết thúc/đỉnh của dự án — dùng để sắp xếp */
  year: number;
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: "treehouse-defi",
    title: "Treehouse — DeFi / RWA Platform",
    role: "Lead Frontend Engineer",
    period: "2021 — nay",
    summary:
      "Frontend của một nền tảng DeFi cho tài sản token hoá như tETH: kết nối ví, đọc ghi on-chain, dashboard giá và lợi suất theo thời gian thực. Tôi dẫn 8 kỹ sư và sở hữu toàn bộ stack frontend.",
    stack: ["React", "TypeScript", "Next.js", "Ethers.js", "Web3 wallet"],
    metrics: ["Đội 8 kỹ sư", "tETH / tAssets", "Realtime TVL & yields"],
    year: 2026,
  },
  {
    slug: "build-to-rent",
    title: "Build-to-Rent — Real Estate Web App",
    role: "Full-stack Engineer",
    period: "Freelance",
    summary:
      "Web app bất động sản cho thuê kèm trang quản trị: danh sách sản phẩm, luồng thuê và khu vực admin cho đội vận hành nhập liệu.",
    stack: ["React", "Next.js", "Node.js", "REST API"],
    metrics: ["Web app + admin", "Dự án freelance"],
    year: 2023,
  },
  {
    slug: "controllermodz",
    title: "Controllermodz — Custom Controller eCommerce",
    role: "Full-stack Engineer",
    period: "Freelance",
    summary:
      "Cửa hàng thương mại điện tử bán tay cầm chơi game tuỳ biến: khách chọn cấu hình từng bộ phận rồi đặt hàng theo đúng cấu hình đó.",
    stack: ["JavaScript", "PHP", "eCommerce", "REST API"],
    metrics: ["Đặt hàng theo cấu hình", "Dự án freelance"],
    year: 2022,
  },
];
