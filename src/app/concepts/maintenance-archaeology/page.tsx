import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { DigExperience } from "@/features/concepts/maintenance-archaeology";

export const metadata: PageMetadata = {
  title: "Maintenance Archaeology — 3D Concept",
  description:
    "Concept demo: 14 năm nghề (2012 tới 2026) khai quật như di chỉ khảo cổ. Cuộn để đào xuyên 5 địa tầng có thật, từ freelance PHP tới dApp TypeScript, probe từng mảnh module để carbon-date.",
};

export default function MaintenanceArchaeologyConceptPage() {
  return (
    <ConceptShell concept={getConcept("maintenance-archaeology")}>
      <DigExperience />
    </ConceptShell>
  );
}
