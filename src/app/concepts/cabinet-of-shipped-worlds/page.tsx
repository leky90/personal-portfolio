import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { CabinetExperience } from "@/features/concepts/cabinet-of-shipped-worlds";

export const metadata: Metadata = {
  title: "Cabinet of Shipped Worlds — 3D Concept",
  description:
    "Concept demo: tủ kính bảo tàng nơi mỗi ô là một thế giới thu nhỏ của sản phẩm đã ship. Rê để sương tan, click để bước xuyên lớp kính vào bên trong, ESC để lùi ra.",
};

export default function CabinetConceptPage() {
  return (
    <ConceptShell concept={getConcept("cabinet-of-shipped-worlds")}>
      <CabinetExperience />
    </ConceptShell>
  );
}
