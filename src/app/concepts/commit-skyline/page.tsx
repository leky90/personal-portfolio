import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { SkylineExperience } from "@/features/concepts/commit-skyline";

export const metadata: PageMetadata = {
  title: "Commit Skyline — 3D Concept",
  description:
    "Concept demo: 5475 ngày commit (2012 → 2026) dựng thành thành phố đêm trong sương. Cuộn để bay dọc đại lộ sự nghiệp, mỗi block một năm; tháp beacon xanh đánh dấu những ngày đổi nghĩa: freelance, Synova, TESO, Treehouse.",
};

export default function CommitSkylineConceptPage() {
  return (
    <ConceptShell concept={getConcept("commit-skyline")}>
      <SkylineExperience />
    </ConceptShell>
  );
}
