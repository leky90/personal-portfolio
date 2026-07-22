import { TerrainStage } from "@/components/three/terrain-stage";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { WritingPreview } from "@/components/sections/writing-preview";
import { ContactSection } from "@/components/sections/contact-section";
import { jsonLdScript, personJsonLd } from "@/lib/json-ld";

/**
 * Trang chủ portfolio — art direction: Fourteen Years of Terrain.
 * Mọi nội dung là DOM server-rendered (LCP = text hero); TerrainStage đặt
 * canvas fixed phía sau và ánh xạ scroll → camera, era card → dải contour.
 */
export default function Home() {
  return (
    <TerrainStage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd()) }}
      />
      <SiteHeader />
      <main id="content">
        <Hero />
        <About />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <WritingPreview />
        <ContactSection />
      </main>
      <SiteFooter />
    </TerrainStage>
  );
}
