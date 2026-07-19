import {
  ERAS,
  type CareerEra,
} from "@/features/concepts/terrain/lib/career-data";

/**
 * Adapter timeline cho section Experience — nguồn sự thật là career-data
 * của feature terrain (cùng dữ liệu drive địa hình 3D và card DOM, đúng
 * tinh thần "3D chính là nội dung").
 * ⚠️ PLACEHOLDER — khi có dữ liệu thật, sửa MỘT file:
 * src/features/concepts/terrain/lib/career-data.ts (title/role/description/
 * metric/year của 4 era + seed hoạt động tuần).
 */
export type ExperienceEra = CareerEra;

export const EXPERIENCE: ExperienceEra[] = ERAS;
