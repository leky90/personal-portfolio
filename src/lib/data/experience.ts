import {
  ERAS,
  type CareerEra,
} from "@/features/concepts/terrain/lib/career-data";

/**
 * Adapter timeline cho section Experience — nguồn sự thật là career-data
 * của feature terrain (cùng dữ liệu drive địa hình 3D và card DOM, đúng
 * tinh thần "3D chính là nội dung").
 * Dữ liệu là 4 chặng nghề thật (2012 freelance → 2017 Synova → 2019 TESO →
 * 2021 Treehouse), đối chiếu từ LinkedIn/Freelancer/Upwork. Muốn sửa timeline
 * thì sửa MỘT file: src/features/concepts/terrain/lib/career-data.ts.
 */
export type ExperienceEra = CareerEra;

export const EXPERIENCE: ExperienceEra[] = ERAS;
