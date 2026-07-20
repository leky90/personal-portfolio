/**
 * Shader của rail (TubeGeometry): tọa độ dọc rail = uv.x có sẵn của tube.
 * Đoạn đã đi qua đông đặc diff-green với lõi sáng; đoạn chưa tới render
 * dashed mờ (dash thủ tục bằng fract) và "đông đặc dần khi camera tới".
 */

export const RAIL_VERTEX_SHADER = /* glsl */ `
  varying float vPathT;
  varying float vDepth;

  void main() {
    vPathT = uv.x;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const RAIL_FRAGMENT_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform vec3 uGreen;
  uniform vec3 uDim;
  uniform vec3 uCore;
  uniform vec3 uBackground;
  uniform float uFogDensity;

  varying float vPathT;
  varying float vDepth;

  void main() {
    // Đã đi qua: 1 quanh vPathT < uProgress, mềm ở mép trước
    float traveled = 1.0 - smoothstep(uProgress - 0.015, uProgress + 0.01, vPathT);

    // Tương lai: dash thủ tục, đông đặc dần khi tiến gần camera
    float dash = step(0.45, fract(vPathT * 110.0));
    float approaching = 1.0 - smoothstep(uProgress, uProgress + 0.18, vPathT);
    float futureAlpha = mix(0.10, 0.30, approaching) * dash;

    // Lõi trắng nóng ngay sau mép tiến
    float core = smoothstep(uProgress - 0.05, uProgress - 0.005, vPathT) * traveled;

    vec3 color = mix(uDim, uGreen, traveled);
    color = mix(color, uCore, core * 0.55);

    float fogFactor = 1.0 - exp(-vDepth * uFogDensity);
    color = mix(color, uBackground, fogFactor);
    float alpha = mix(futureAlpha, 0.95, traveled) * (1.0 - fogFactor * 0.85);

    gl_FragColor = vec4(color, alpha);
  }
`;
