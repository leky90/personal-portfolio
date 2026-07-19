/**
 * Kỹ năng theo nhóm — hiển thị badge, không dùng progress bar (điểm trừ
 * với hiring manager). ⚠️ PLACEHOLDER — chỉnh theo stack thật.
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "Go", "Python", "SQL"],
  },
  {
    label: "Backend & Data",
    items: ["Node.js", "PostgreSQL", "Kafka", "Redis", "ClickHouse"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Three.js / R3F", "Tailwind CSS"],
  },
  {
    label: "Infra & Practice",
    items: ["Kubernetes", "AWS", "Terraform", "Observability", "Incident response"],
  },
];
