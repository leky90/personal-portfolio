import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { ChangeExperience } from "@/features/concepts/cost-of-change";

export const metadata: Metadata = {
  title: "Cost of Change — 3D Concept",
  description:
    "Concept demo: 10 năm của một codebase thành tháp truss chịu lực. Cuộn để xây từng năm, refactor giải phóng ứng suất; giữ toggle để xem timeline giả định nơi nợ không bao giờ được trả.",
};

export default function CostOfChangeConceptPage() {
  return (
    <ConceptShell concept={getConcept("cost-of-change")}>
      <ChangeExperience />
    </ConceptShell>
  );
}
