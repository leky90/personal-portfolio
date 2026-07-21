import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { SkylineExperience } from "@/features/concepts/commit-skyline";

export const metadata: Metadata = {
  title: "Commit Skyline — 3D Concept",
  description:
    "Concept demo: 3650 ngày commit dựng thành thành phố đêm trong sương. Cuộn để bay dọc đại lộ thập kỷ, mỗi block một năm; tháp beacon xanh đánh dấu những ngày đổi nghĩa sự nghiệp.",
};

export default function CommitSkylineConceptPage() {
  return (
    <ConceptShell concept={getConcept("commit-skyline")}>
      <SkylineExperience />
    </ConceptShell>
  );
}
