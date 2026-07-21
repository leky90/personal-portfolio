import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { GlyphExperience } from "@/features/concepts/glyph-field";

export const metadata: PageMetadata = {
  title: "Glyph Field — 3D Concept",
  description:
    "Concept demo: tên và mọi heading là một hệ 4096 hạt glyph trong đúng một draw call. Cuộn để chữ tan ra rồi tự xếp lại; rê con trỏ để khắc wake vào hệ chữ và nhìn nó tự lành.",
};

export default function GlyphFieldConceptPage() {
  return (
    <ConceptShell concept={getConcept("glyph-field")}>
      <GlyphExperience />
    </ConceptShell>
  );
}
