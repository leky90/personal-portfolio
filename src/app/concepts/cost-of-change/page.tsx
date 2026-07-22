import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { ChangeExperience } from "@/features/concepts/cost-of-change";

export const metadata: PageMetadata = {
  title: "Cost of Change — 3D Concept",
  description:
    "Concept demo: 12 năm nghề (2014 → hôm nay) nén thành tháp truss chịu lực mười tầng. Cuộn để xây từng chặng, ba lần dọn nợ giải phóng ứng suất; bật toggle để xem timeline giả định nơi nợ không bao giờ được trả.",
};

export default function CostOfChangeConceptPage() {
  return (
    <ConceptShell concept={getConcept("cost-of-change")}>
      <ChangeExperience />
    </ConceptShell>
  );
}
