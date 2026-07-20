/**
 * Shader băng từ: telemetry vẽ trực tiếp trong fragment từ một DataTexture
 * 128×3 (0 draw call phụ), tick thời gian bằng fract, tint ember đỏ theo
 * uSeverity trong cửa sổ sự cố. Băng võng nhẹ trong vertex như dây thật.
 */

export const TAPE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying float vWorldX;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Băng võng nhẹ giữa hai điểm treo, gợn rất khẽ theo chiều dài
    pos.y -= sin(uv.x * 3.14159265) * 0.12;
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldX = worldPosition.x;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const TAPE_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMetrics;
  uniform float uSeverity;
  uniform vec3 uBase;
  uniform vec3 uTraceP99;
  uniform vec3 uTraceErr;
  uniform vec3 uTraceThr;
  uniform vec3 uEmber;

  varying vec2 vUv;
  varying float vWorldX;

  float traceLine(float value, float y, float thickness) {
    return 1.0 - smoothstep(0.0, thickness, abs(y - value));
  }

  void main() {
    // Nền băng charcoal + tick thời gian mảnh mỗi 2% chiều dài
    float tick = step(0.965, fract(vUv.x * 50.0)) * 0.12;
    vec3 color = uBase + vec3(tick);

    // 3 dải trace, mỗi metric một band ngang trên băng
    float p99 = texture2D(uMetrics, vec2(vUv.x, 0.1666)).r;
    float err = texture2D(uMetrics, vec2(vUv.x, 0.5)).r;
    float thr = texture2D(uMetrics, vec2(vUv.x, 0.8333)).r;

    float yLocal = vUv.y;
    float band = 1.0 / 3.0;
    float y0 = clamp((yLocal - 0.0) / band, 0.0, 1.0);
    float y1 = clamp((yLocal - band) / band, 0.0, 1.0);
    float y2 = clamp((yLocal - 2.0 * band) / band, 0.0, 1.0);

    float inBand0 = step(0.0, yLocal) * (1.0 - step(band, yLocal));
    float inBand1 = step(band, yLocal) * (1.0 - step(2.0 * band, yLocal));
    float inBand2 = step(2.0 * band, yLocal);

    float t0 = traceLine(thr * 0.8 + 0.1, y0, 0.05) * inBand0;
    float t1 = traceLine(err * 0.8 + 0.1, y1, 0.05) * inBand1;
    float t2 = traceLine(p99 * 0.8 + 0.1, y2, 0.05) * inBand2;

    color += uTraceThr * t0 * 0.9;
    color += uTraceErr * t1;
    color += uTraceP99 * t2 * 0.95;

    // Cửa sổ SEV: cả băng ám ember đỏ theo severity
    color = mix(color, color + uEmber * 0.35, uSeverity * smoothstep(0.0, 1.0, t1 + 0.4));

    // Vạch đọc: sáng nhẹ quanh worldX = 0 (playhead cố định giữa màn)
    float gate = 1.0 - smoothstep(0.0, 0.35, abs(vWorldX));
    color += vec3(0.35, 0.9, 1.0) * gate * 0.12;

    gl_FragColor = vec4(color, 1.0);
  }
`;
