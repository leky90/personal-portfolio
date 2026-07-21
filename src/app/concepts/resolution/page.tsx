import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { ResolutionExperience } from "@/features/concepts/resolution";

export const metadata: PageMetadata = {
  title: "Resolution — 3D Concept",
  description:
    "Concept demo: một fragment shader ASCII/Bayer-dither là toàn bộ ngôn ngữ render — hover để resolve ký tự về ảnh nét.",
};

export default function ResolutionConceptPage() {
  return (
    <ConceptShell concept={getConcept("resolution")}>
      <ResolutionExperience />
    </ConceptShell>
  );
}
