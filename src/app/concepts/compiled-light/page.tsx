import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { CompiledExperience } from "@/features/concepts/compiled-light";

export const metadata: PageMetadata = {
  title: "Compiled Light — 3D Concept",
  description:
    "Concept demo: dune-field FBM render qua pipeline ASCII/dither 3 pass — cuộn để compile độ phân giải, con trỏ là thấu kính decompile.",
};

export default function CompiledLightConceptPage() {
  return (
    <ConceptShell concept={getConcept("compiled-light")}>
      <CompiledExperience />
    </ConceptShell>
  );
}
