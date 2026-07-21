"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  BADGE_FRONT,
  pendulumStep,
} from "@/features/concepts/lanyard-badge/lib/badge-data";
import {
  releaseBadge,
  type BadgeState,
} from "@/features/concepts/lanyard-badge/lib/badge-state";

interface BadgeSceneProps {
  badgeState: BadgeState;
}

const ANCHOR_Y = 2.6;
const ROPE_LENGTH = 1.9;
const ROPE_POINTS = 9;

/**
 * Con lắc thuần: MỘT phương trình θ tích phân semi-implicit (test được)
 * điều khiển cả thẻ lẫn dây; nắm kéo là kinematic theo pointer, thả ra
 * ω lấy từ vận tốc tay; double-click lật thẻ bằng spring; kéo xuống
 * quá ngưỡng rồi thả = pull-to-enter. Thẻ + kẹp + dây ~6 draw call.
 */
export function BadgeScene({ badgeState }: BadgeSceneProps) {
  const ropeGeometry = useMemo(() => {
    const positions = new Float32Array((ROPE_POINTS - 1) * 6);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    return geometry;
  }, []);

  const cardRef = useRef<THREE.Group>(null);
  const foilRef = useRef<THREE.MeshBasicMaterial>(null);
  const sim = useRef({
    theta: 0.35,
    omega: 0,
    flip: 0,
    stretch: 0,
    lastPointerX: 0,
    lastTime: 0,
  });

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = badgeState;
    const s = sim.current;
    const lambda = 1 - Math.exp(-dt * 8);

    if (state.grabbed) {
      // Kinematic: θ suy từ vị trí pointer so với anchor
      const dx = state.pointer[0];
      const dy = ANCHOR_Y - state.pointer[1];
      const targetTheta = Math.atan2(dx, Math.max(dy, 0.3));
      const now = performance.now();
      const dtPointer = Math.max((now - s.lastTime) / 1000, 1e-3);
      s.omega = THREE.MathUtils.clamp(
        (targetTheta - s.theta) / dtPointer,
        -9,
        9,
      );
      s.theta += (targetTheta - s.theta) * Math.min(dt * 14, 1);
      s.lastTime = now;

      // Kéo giãn xuống quá chiều dây
      const reach = Math.hypot(dx, dy);
      state.pull = Math.max(reach - ROPE_LENGTH, 0);
      s.stretch += (state.pull - s.stretch) * lambda;
    } else {
      [s.theta, s.omega] = pendulumStep(s.theta, s.omega, dt);
      s.stretch += (0 - s.stretch) * lambda;
    }

    s.flip += (state.flip - s.flip) * Math.min(dt * 7, 1);

    // Vị trí thẻ từ θ + stretch
    const length = ROPE_LENGTH + s.stretch;
    const cardX = Math.sin(s.theta) * length;
    const cardY = ANCHOR_Y - Math.cos(s.theta) * length;

    const card = cardRef.current;
    if (card) {
      card.position.set(cardX, cardY, 0);
      card.rotation.z = -s.theta * 0.9;
      card.rotation.y = s.flip * Math.PI;
    }

    // Dây: cong nhẹ qua điểm giữa lệch theo ω
    const positions = ropeGeometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < ROPE_POINTS - 1; i += 1) {
      const t0 = i / (ROPE_POINTS - 1);
      const t1 = (i + 1) / (ROPE_POINTS - 1);
      const sag = (t: number) =>
        Math.sin(t * Math.PI) * s.omega * -0.03;
      positions.set(
        [
          Math.sin(s.theta * t0) * length * t0 + sag(t0),
          ANCHOR_Y - Math.cos(s.theta * t0) * length * t0,
          0,
          Math.sin(s.theta * t1) * length * t1 + sag(t1),
          ANCHOR_Y - Math.cos(s.theta * t1) * length * t1,
          0,
        ],
        i * 6,
      );
    }
    ropeGeometry.attributes.position.needsUpdate = true;

    // Foil đổi màu theo góc nghiêng (giả iridescence rẻ)
    const foil = foilRef.current;
    if (foil) {
      const hue = 0.45 + Math.sin(s.theta * 2.2) * 0.18;
      foil.color.setHSL(hue, 0.75, 0.62);
    }

    if (
      state.grabbed ||
      Math.abs(s.theta) > 1e-4 ||
      Math.abs(s.omega) > 1e-3 ||
      Math.abs(state.flip - s.flip) > 1e-3 ||
      s.stretch > 1e-3
    ) {
      root.invalidate();
    }
  });

  const onCardDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    badgeState.grabbed = true;
    badgeState.pointer[0] = event.point.x;
    badgeState.pointer[1] = event.point.y;
    sim.current.lastTime = performance.now();
    (event.target as Element | null)?.setPointerCapture?.(event.pointerId);
    badgeState.invalidate?.();
  };

  const onPlaneMove = (event: ThreeEvent<PointerEvent>) => {
    if (!badgeState.grabbed) return;
    badgeState.pointer[0] = event.point.x;
    badgeState.pointer[1] = event.point.y;
    badgeState.invalidate?.();
  };

  const onDoubleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    badgeState.flip = badgeState.flip === 0 ? 1 : 0;
    badgeState.invalidate?.();
  };

  return (
    <group>
      <hemisphereLight args={["#e6e9ee", "#0c0c0e", 0.9]} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#cdb8ff" />

      {/* Anchor + dây đeo */}
      <mesh position={[0, ANCHOR_Y, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#8d95a3" metalness={0.8} roughness={0.3} />
      </mesh>
      <lineSegments geometry={ropeGeometry}>
        <lineBasicMaterial color="#9aa3b2" transparent opacity={0.9} />
      </lineSegments>

      {/* Thẻ: mặt trước PVC + foil + kẹp thép; mặt sau spec tối */}
      <group ref={cardRef} position={[0.6, 0.9, 0]}>
        <mesh onPointerDown={onCardDown} onDoubleClick={onDoubleClick}>
          <boxGeometry args={[0.86, 1.24, 0.03]} />
          <meshStandardMaterial color="#ece9e2" roughness={0.65} />
        </mesh>
        {/* Foil hologram đổi màu theo tilt */}
        <mesh position={[0, 0.34, 0.017]}>
          <planeGeometry args={[0.86, 0.2]} />
          <meshBasicMaterial ref={foilRef} color="#2dd4bf" toneMapped={false} />
        </mesh>
        {/* Vạch tên + chức danh (khối mực in) */}
        <mesh position={[0, -0.05, 0.017]}>
          <planeGeometry args={[0.66, 0.09]} />
          <meshBasicMaterial color="#17181c" />
        </mesh>
        <mesh position={[0, -0.22, 0.017]}>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="#3c3f47" />
        </mesh>
        {/* Mặt sau: spec sheet tối */}
        <mesh position={[0, 0, -0.017]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 1.16]} />
          <meshBasicMaterial color="#0e1512" />
        </mesh>
        {/* Kẹp thép */}
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[0.18, 0.1, 0.05]} />
          <meshStandardMaterial color="#b9c0cb" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* Plane vô hình cho kéo thẻ */}
      <mesh onPointerMove={onPlaneMove} onPointerUp={() => releaseBadge(badgeState)}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Nhãn im lặng cho a11y debug — không render text 3D */}
      <group name={`badge-${BADGE_FRONT.name}`} />
    </group>
  );
}
