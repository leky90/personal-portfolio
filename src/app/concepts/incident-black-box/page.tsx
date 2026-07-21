import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { BlackBoxExperience } from "@/features/concepts/incident-black-box";

export const metadata: PageMetadata = {
  title: "Incident Black Box — 3D Concept",
  description:
    "Concept demo: một SEV-1 thật (đã khử danh) tua lại như băng hộp đen máy bay. Cuộn để kéo telemetry qua vạch đọc, kết bằng góc nhìn postmortem không đổ lỗi.",
};

export default function IncidentBlackBoxConceptPage() {
  return (
    <ConceptShell concept={getConcept("incident-black-box")}>
      <BlackBoxExperience />
    </ConceptShell>
  );
}
