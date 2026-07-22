import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { DecisionExperience } from "@/features/concepts/decision-diff";

export const metadata: PageMetadata = {
  title: "Decision Diff — 3D Concept",
  description:
    "Concept demo: 14 năm quyết định kiến trúc compile thành đường ray 3D. Nhánh đã chọn đông đặc diff-green, con đường không đi treo dạng bóng ma nét đứt kèm chi phí.",
};

export default function DecisionDiffConceptPage() {
  return (
    <ConceptShell concept={getConcept("decision-diff")}>
      <DecisionExperience />
    </ConceptShell>
  );
}
