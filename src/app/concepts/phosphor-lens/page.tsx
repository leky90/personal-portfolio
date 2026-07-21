import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { LensExperience } from "@/features/concepts/phosphor-lens";

export const metadata: PageMetadata = {
  title: "Phosphor Lens — 3D Concept",
  description:
    "Concept demo: dưới lớp glyph phosphor CRT là một khối kim loại tiện chính xác. Con trỏ của bạn là thấu kính — nhìn kỹ ở đâu, sự thật hiện ra ở đó; cuộn để rack focus toàn cục.",
};

export default function PhosphorLensConceptPage() {
  return (
    <ConceptShell concept={getConcept("phosphor-lens")}>
      <LensExperience />
    </ConceptShell>
  );
}
