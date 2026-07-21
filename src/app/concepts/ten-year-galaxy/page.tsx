import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { GalaxyExperience } from "@/features/concepts/ten-year-galaxy";

export const metadata: PageMetadata = {
  title: "Ten-Year Galaxy — 3D Concept",
  description:
    "Concept demo: mười năm viết code kết tinh thành dải ngân hà 4 cánh tay era. Cuộn để frontier hình thành sao quét qua 520 tuần làm việc theo đúng dòng thời gian sự nghiệp.",
};

export default function TenYearGalaxyConceptPage() {
  return (
    <ConceptShell concept={getConcept("ten-year-galaxy")}>
      <GalaxyExperience />
    </ConceptShell>
  );
}
