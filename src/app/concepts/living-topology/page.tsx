import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { TopologyExperience } from "@/features/concepts/living-topology";

export const metadata: PageMetadata = {
  title: "Living Topology — 3D Concept",
  description:
    "Concept demo: bản đồ mission-control của hơn 12 năm nghề — từ site WordPress freelance tới dApp DeFi của Treehouse. Network graph 3D data-driven, packet pulse chạy qua hệ thống, hover để query một hệ thống.",
};

export default function LivingTopologyConceptPage() {
  return (
    <ConceptShell concept={getConcept("living-topology")}>
      <TopologyExperience />
    </ConceptShell>
  );
}
