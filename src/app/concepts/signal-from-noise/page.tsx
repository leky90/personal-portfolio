import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { NoiseExperience } from "@/features/concepts/signal-from-noise";

export const metadata: Metadata = {
  title: "Signal From Noise — 3D Concept",
  description:
    "Concept demo: một trường hạt duy nhất kết tinh nhiễu lạnh thành tín hiệu ấm — cái tên, quả cầu đội ngũ, lattice kiến trúc. Con trỏ là ordering lens: trật tự nở ra dưới tay bạn.",
};

export default function SignalFromNoiseConceptPage() {
  return (
    <ConceptShell concept={getConcept("signal-from-noise")}>
      <NoiseExperience />
    </ConceptShell>
  );
}
