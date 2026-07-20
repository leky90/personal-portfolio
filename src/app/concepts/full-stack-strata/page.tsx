import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { IslandExperience } from "@/features/concepts/full-stack-strata";

export const metadata: Metadata = {
  title: "Full-Stack Strata — 3D Concept",
  description:
    "Concept demo: lát cắt hòn đảo nổi chính là stack. Cuộn để khoan từ thành phố sản phẩm qua seam dịch vụ xuống đá dữ liệu; bấm để bắn một request xuyên ba tầng kèm trace log thật.",
};

export default function FullStackStrataConceptPage() {
  return (
    <ConceptShell concept={getConcept("full-stack-strata")}>
      <IslandExperience />
    </ConceptShell>
  );
}
