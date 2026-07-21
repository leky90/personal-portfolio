import { describe, expect, it } from "vitest";
import * as barrel from "@/features/concepts/cabinet-of-shipped-worlds";

describe("barrel export của feature cabinet-of-shipped-worlds", () => {
  it("export CabinetExperience và CELLS", () => {
    expect(typeof barrel.CabinetExperience).toBe("function");
    expect(Array.isArray(barrel.CELLS)).toBe(true);
    expect(barrel.CELLS.length).toBeGreaterThan(0);
  });
});
