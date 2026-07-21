import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { DigExperience } from "@/features/concepts/maintenance-archaeology";

export const metadata: PageMetadata = {
  title: "Maintenance Archaeology — 3D Concept",
  description:
    "Concept demo: codebase 10 năm khai quật như di chỉ khảo cổ. Cuộn để đào xuyên 5 địa tầng kiến trúc, probe từng mảnh module để carbon-date bằng lịch sử git.",
};

export default function MaintenanceArchaeologyConceptPage() {
  return (
    <ConceptShell concept={getConcept("maintenance-archaeology")}>
      <DigExperience />
    </ConceptShell>
  );
}
