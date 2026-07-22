/**
 * Kỹ năng theo nhóm — hiển thị badge, không dùng progress bar (điểm trừ
 * với hiring manager). Danh sách khớp stack khai trên Upwork/LinkedIn.
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Redux",
      "Tailwind CSS",
    ],
  },
  {
    label: "Backend & Data",
    items: [
      "Node.js",
      "Express",
      "NestJS",
      "Laravel / PHP",
      "REST API",
      "GraphQL",
      "WebSockets",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
    ],
  },
  {
    label: "Web3 & AI",
    items: [
      "Ethers.js",
      "Wallet integration",
      "DeFi dApp frontend",
      "OpenAI API",
      "Anthropic API",
      "RAG",
    ],
  },
  {
    label: "Mobile & Tooling",
    items: ["React Native", "Git", "CI/CD", "Vercel", "AWS"],
  },
  {
    label: "Dẫn dắt",
    items: [
      "Lead đội 8 người",
      "Code review hằng ngày",
      "Chuẩn hoá kiến trúc",
      "Tài liệu onboarding",
      "Pair programming & workshop",
    ],
  },
];
