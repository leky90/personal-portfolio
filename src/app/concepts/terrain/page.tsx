import type { PageMetadata } from "@/lib/page-meta";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { TerrainExperience } from "@/features/concepts/terrain";

export const metadata: PageMetadata = {
  title: "Ten Years of Terrain — 3D Concept",
  description:
    "Concept demo: 10 năm sự nghiệp bake thành data texture, extrude thành địa hình ridgeline — cuộn timeline là camera bay qua 10 năm địa hình.",
};

export default function TerrainConceptPage() {
  return (
    <ConceptShell concept={getConcept("terrain")}>
      <TerrainExperience />
    </ConceptShell>
  );
}
