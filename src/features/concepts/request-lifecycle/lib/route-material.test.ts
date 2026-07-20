import { describe, expect, it } from "vitest";
import { RouteMaterial } from "@/features/concepts/request-lifecycle/lib/route-material";
import { SPANS } from "@/features/concepts/request-lifecycle/lib/trace-data";

describe("RouteMaterial — tube xung 1 draw call", () => {
  it("khởi tạo uProgress = 0, transparent để đuôi mờ dần", () => {
    const material = new RouteMaterial();
    expect(material.uniforms.uProgress.value).toBe(0);
    expect(material.transparent).toBe(true);
    material.dispose();
  });

  it("cửa sổ hàng đợi bake sẵn từ SPANS", () => {
    const material = new RouteMaterial();
    const queue = SPANS.find((span) => span.id === "queue")!;
    expect(material.uniforms.uQueueT0.value).toBeCloseTo(queue.t0, 5);
    expect(material.uniforms.uQueueT1.value).toBeCloseTo(queue.t1, 5);
    material.dispose();
  });

  it("setProgress mutate uniform tại chỗ", () => {
    const material = new RouteMaterial();
    material.setProgress(0.42);
    expect(material.uniforms.uProgress.value).toBeCloseTo(0.42, 5);
    material.dispose();
  });
});
