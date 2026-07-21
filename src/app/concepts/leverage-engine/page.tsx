import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { EngineExperience } from "@/features/concepts/leverage-engine";

export const metadata: PageMetadata = {
  title: "Leverage Engine — 3D Concept",
  description:
    "Concept demo: hộp số đòn bẩy kiểu bản vẽ patent. Kéo tay quay, một vòng công sức senior truyền qua 4 chuỗi bánh răng compound thành 60 vòng đầu ra của đội, tỷ số nào cũng đo được thật.",
};

export default function LeverageEngineConceptPage() {
  return (
    <ConceptShell concept={getConcept("leverage-engine")}>
      <EngineExperience />
    </ConceptShell>
  );
}
