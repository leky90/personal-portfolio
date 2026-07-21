import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { MeshExperience } from "@/features/concepts/monolith-to-mesh";

export const metadata: PageMetadata = {
  title: "Monolith to Mesh — 3D Concept",
  description:
    "Concept demo: khối monolith graphite kerf-cut thành 36 service theo đúng lịch sử migration, đan lại thành service mesh. Có cả lần tách sai phải gộp ngược lại.",
};

export default function MonolithToMeshConceptPage() {
  return (
    <ConceptShell concept={getConcept("monolith-to-mesh")}>
      <MeshExperience />
    </ConceptShell>
  );
}
