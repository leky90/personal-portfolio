import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { MonolithExperience } from "@/features/concepts/monolith";

export const metadata: PageMetadata = {
  title: "Monolith — 3D Concept",
  description:
    "Concept demo: khối điêu khắc chữ matte-black kiểu tượng đài — scroll dolly camera xuyên qua các letterform, mỗi section một góc máy.",
};

export default function MonolithConceptPage() {
  return (
    <ConceptShell concept={getConcept("monolith")}>
      <MonolithExperience />
    </ConceptShell>
  );
}
