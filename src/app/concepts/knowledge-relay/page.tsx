import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { RelayExperience } from "@/features/concepts/knowledge-relay";

export const metadata: Metadata = {
  title: "Knowledge Relay — 3D Concept",
  description:
    "Concept demo: 10 năm truyền nghề vẽ thành biểu đồ relay kiểu Marey. Cuộn để chạy thập kỷ: team lane lần lượt nguội đi nhưng những cây gậy practice vẫn được trao tiếp, vì thứ senior để lại sống lâu hơn codebase.",
};

export default function KnowledgeRelayConceptPage() {
  return (
    <ConceptShell concept={getConcept("knowledge-relay")}>
      <RelayExperience />
    </ConceptShell>
  );
}
