import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { PrismExperience } from "@/features/concepts/constraint-prism";

export const metadata: PageMetadata = {
  title: "Constraint Prism — 3D Concept",
  description:
    "Concept demo: ràng buộc kỹ thuật là lăng kính. Tia ý tưởng gập qua 5 mặt kính LATENCY/TEAM/DEADLINE/PCI/BUDGET thành phổ quyết định; rút một ràng buộc ra là kiến trúc đơn giản đi trông thấy.",
};

export default function ConstraintPrismConceptPage() {
  return (
    <ConceptShell concept={getConcept("constraint-prism")}>
      <PrismExperience />
    </ConceptShell>
  );
}
