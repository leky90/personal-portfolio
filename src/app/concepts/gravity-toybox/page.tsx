import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { ToyboxExperience } from "@/features/concepts/gravity-toybox";

export const metadata: PageMetadata = {
  title: "Weight of Experience — 3D Concept",
  description:
    "Concept demo: kinh nghiệm có khối lượng thật. Tên rơi xuống sàn, 12 đĩa tạ công nghệ nặng đúng số năm rơi theo; nắm kéo và ném thử để cảm 9 năm lì tay hơn 1 năm thế nào.",
};

export default function GravityToyboxConceptPage() {
  return (
    <ConceptShell concept={getConcept("gravity-toybox")}>
      <ToyboxExperience />
    </ConceptShell>
  );
}
