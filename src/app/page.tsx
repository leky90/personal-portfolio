import { TerrainStage } from "@/components/three/terrain-stage";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";

/**
 * Trang chủ portfolio — art direction: Ten Years of Terrain.
 * Mọi nội dung là DOM server-rendered (LCP = text hero); TerrainStage đặt
 * canvas fixed phía sau và ánh xạ scroll → camera, era card → dải contour.
 */
export default function Home() {
  return (
    <TerrainStage>
      <SiteHeader />
      <main id="content">
        <Hero />
        <About />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </TerrainStage>
  );
}
