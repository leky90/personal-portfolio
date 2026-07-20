import type { Metadata } from "next";
import { getConcept } from "@/features/concepts/registry";
import { ConceptShell } from "@/features/concepts/shared/components/concept-shell";
import { DriverExperience } from "@/features/concepts/daily-driver";

export const metadata: Metadata = {
  title: "The Daily Driver — 3D Concept",
  description:
    "Concept demo: bàn phím cơ 3D gõ được thật. Mỗi keydown nhấn đúng keycap theo lò xo vật lý, prompt terminal tự hoàn thành lệnh work/about/lab/contact/resume và điều hướng cả trang.",
};

export default function DailyDriverConceptPage() {
  return (
    <ConceptShell concept={getConcept("daily-driver")}>
      <DriverExperience />
    </ConceptShell>
  );
}
