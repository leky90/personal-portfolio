import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { ConstellationExperience } from "@/features/concepts/dependency-constellation";

export const metadata: PageMetadata = {
  title: "Dependency Constellation — 3D Concept",
  description:
    "Concept demo: 12 năm sự nghiệp (2014 → 2026) resolve thành chòm sao phụ thuộc. Chạm một công nghệ để chạy pnpm why: mọi dự án từng kéo nó vào sáng lên theo cạnh thật, terminal in đúng đường phân giải.",
};

export default function DependencyConstellationConceptPage() {
  return (
    <ConceptShell concept={getConcept("dependency-constellation")}>
      <ConstellationExperience />
    </ConceptShell>
  );
}
