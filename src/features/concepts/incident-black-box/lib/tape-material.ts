import * as THREE from "three";
import {
  METRIC_SAMPLES,
  buildMetrics,
} from "@/features/concepts/incident-black-box/lib/incident-data";
import {
  TAPE_FRAGMENT_SHADER,
  TAPE_VERTEX_SHADER,
} from "@/features/concepts/incident-black-box/lib/tape-shaders";

/** Đóng gói metrics thành DataTexture 128×3 (mỗi hàng một metric). */
function buildMetricsTexture(): THREE.DataTexture {
  const metrics = buildMetrics();
  const bytes = new Uint8Array(metrics.length);
  for (let i = 0; i < metrics.length; i += 1) {
    bytes[i] = Math.round(metrics[i] * 255);
  }
  const texture = new THREE.DataTexture(
    bytes,
    METRIC_SAMPLES,
    3,
    THREE.RedFormat,
    THREE.UnsignedByteType,
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** Material băng từ — telemetry khắc trong fragment, playhead cyan cố định. */
export class TapeMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: TAPE_VERTEX_SHADER,
      fragmentShader: TAPE_FRAGMENT_SHADER,
      uniforms: {
        uMetrics: { value: buildMetricsTexture() },
        uSeverity: { value: 0 },
        uBase: { value: new THREE.Color("#191b1f") },
        uTraceP99: { value: new THREE.Color("#ffb454") },
        uTraceErr: { value: new THREE.Color("#ff5a1f") },
        uTraceThr: { value: new THREE.Color("#3fb950") },
        uEmber: { value: new THREE.Color("#ff3b1f") },
      },
    });
  }
}
