import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { BadgeExperience } from "@/features/concepts/lanyard-badge";

export const metadata: Metadata = {
  title: "The Credential — 3D Concept",
  description:
    "Concept demo: tấm thẻ kỹ sư treo dây đeo cầm được thật — nắm kéo, búng, double-click lật xem spec sheet; kéo thẻ xuống rồi thả để bước vào site.",
};

export default function LanyardBadgeConceptPage() {
  return (
    <ConceptShell concept={getConcept("lanyard-badge")}>
      <BadgeExperience />
    </ConceptShell>
  );
}
