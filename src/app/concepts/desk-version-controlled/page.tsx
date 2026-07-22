import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { DeskExperience } from "@/features/concepts/desk-version-controlled";

export const metadata: PageMetadata = {
  title: "Desk, Version-Controlled — 3D Concept",
  description:
    "Concept demo: mười hai năm sự nghiệp là git log của một chiếc bàn. Cuộn để scrub từng commit từ góc bàn freelance PHP ở Huế năm 2014 tới bàn lead frontend 2026 — trưởng thành đọc được bằng số đồ bị remove.",
};

export default function DeskVersionControlledConceptPage() {
  return (
    <ConceptShell concept={getConcept("desk-version-controlled")}>
      <DeskExperience />
    </ConceptShell>
  );
}
