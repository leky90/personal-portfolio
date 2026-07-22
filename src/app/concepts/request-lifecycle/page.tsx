import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { TraceExperience } from "@/features/concepts/request-lifecycle";

export const metadata: PageMetadata = {
  title: "Request Lifecycle — 3D Concept",
  description:
    "Concept demo: cả trang là một distributed trace của dashboard dApp DeFi. Cuộn để đẩy gói tin qua CDN edge, app shell đọc ví, API/BFF, job nền on-chain và RPC node đọc chuỗi bằng Ethers.js; rail waterfall lấp dần như Jaeger.",
};

export default function RequestLifecycleConceptPage() {
  return (
    <ConceptShell concept={getConcept("request-lifecycle")}>
      <TraceExperience />
    </ConceptShell>
  );
}
