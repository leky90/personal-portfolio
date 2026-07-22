import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { RelayExperience } from "@/features/concepts/knowledge-relay";

export const metadata: PageMetadata = {
  title: "Knowledge Relay — 3D Concept",
  description:
    "Concept demo: mười bốn năm nghề (2012–2026) vẽ thành biểu đồ relay kiểu Marey. Cuộn để chạy từ khách freelance ở Huế tới đội frontend Treehouse: mỗi lane lần lượt nguội đi nhưng những cây gậy practice vẫn được trao tiếp, vì thứ senior để lại sống lâu hơn codebase.",
};

export default function KnowledgeRelayConceptPage() {
  return (
    <ConceptShell concept={getConcept("knowledge-relay")}>
      <RelayExperience />
    </ConceptShell>
  );
}
