"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  SKILLS,
  buildLetters,
  heightAt,
  massRatio,
  restitutionOf,
  settleTime,
} from "@/features/concepts/gravity-toybox/lib/toybox-data";
import {
  notifyHover,
  type ToyboxState,
} from "@/features/concepts/gravity-toybox/lib/toybox-state";

interface ToyboxSceneProps {
  toyboxState: ToyboxState;
}

const GRAVITY = 14;
const ACCENT = new THREE.Color("#fb7185");
const CELL = 0.34;
/** Trạng thái token: 0 đang mưa rơi, 1 nằm yên, 2 đang bị nắm, 3 đang bay */
const RAIN = 0;
const REST = 1;
const HELD = 2;
const FLY = 3;

/**
 * Sân tạ: 12 đĩa 1 InstancedMesh + toàn bộ chữ "KY LE" (dot-matrix) 1
 * InstancedMesh + bóng blob 1 InstancedMesh — 3 instanced draw call cho
 * mọi thứ chuyển động. Rơi/nảy là heightAt closed-form; nắm kéo lag theo
 * khối lượng (λ = k/năm) nên 14 năm lì tay hơn 3 năm thấy rõ.
 */
export function ToyboxScene({ toyboxState }: ToyboxSceneProps) {
  const camera = useThree((three) => three.camera);

  const { letters, letterCellCount, greys } = useMemo(() => {
    const built = buildLetters();
    const color = new THREE.Color();
    return {
      letters: built,
      letterCellCount: built.reduce((sum, l) => sum + l.cells.length, 0),
      greys: SKILLS.map((skill) =>
        color
          .set("#d3d7dd")
          .lerp(new THREE.Color("#676d78"), massRatio(skill.years))
          .clone(),
      ),
    };
  }, []);

  const tokensRef = useRef<THREE.InstancedMesh>(null);
  const cellsRef = useRef<THREE.InstancedMesh>(null);
  const shadowsRef = useRef<THREE.InstancedMesh>(null);

  // Runtime per-token — typed arrays, không React state
  const clock = useRef(0);
  const positions = useRef(new Float32Array(SKILLS.length * 3));
  const velocities = useRef(new Float32Array(SKILLS.length * 3));
  const modes = useRef(new Int8Array(SKILLS.length));
  const rests = useRef(
    Float32Array.from(SKILLS.flatMap((skill) => skill.rest)),
  );
  const heldTarget = useRef(new THREE.Vector3());
  const lastHeld = useRef(new THREE.Vector3());
  const lastHover = useRef(-1);
  const lastNonce = useRef(0);

  const maxSettle = useMemo(
    () =>
      Math.max(
        ...SKILLS.map((skill) => settleTime(skill)),
        ...buildLetters().map((letter) => settleTime(letter)),
      ),
    [],
  );

  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const flatQuat = useRef(
    new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
  );
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());

  const resetRun = () => {
    clock.current = 0;
    modes.current.fill(RAIN);
    SKILLS.forEach((skill, index) => {
      rests.current[index * 3] = skill.rest[0];
      rests.current[index * 3 + 1] = skill.rest[1];
      rests.current[index * 3 + 2] = skill.rest[2];
    });
  };

  // Màu xám theo khối lượng đặt một lần
  useLayoutEffect(() => {
    const tokens = tokensRef.current;
    if (!tokens) return;
    SKILLS.forEach((_, index) => {
      tokens.setColorAt(index, greys[index]);
    });
    if (tokens.instanceColor) tokens.instanceColor.needsUpdate = true;
    resetRun();
     
  }, [greys]);

  const writeToken = (index: number, x: number, y: number, z: number) => {
    const tokens = tokensRef.current;
    const shadows = shadowsRef.current;
    const skill = SKILLS[index];
    positions.current[index * 3] = x;
    positions.current[index * 3 + 1] = y;
    positions.current[index * 3 + 2] = z;
    if (tokens) {
      tmpMatrix.current.compose(
        tmpPos.current.set(x, y, z),
        tmpQuat.current,
        tmpScale.current.set(skill.radius, skill.thickness, skill.radius),
      );
      tokens.setMatrixAt(index, tmpMatrix.current);
    }
    if (shadows) {
      const altitude = Math.min(Math.max(y - skill.rest[1], 0), 3);
      const spread = skill.radius * (1.35 - (altitude / 3) * 0.55);
      tmpMatrix.current.compose(
        tmpPos.current.set(x, 0.006, z),
        flatQuat.current,
        tmpScale.current.set(spread, spread, 1),
      );
      shadows.setMatrixAt(index, tmpMatrix.current);
    }
  };

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = toyboxState;

    if (state.replayNonce !== lastNonce.current) {
      lastNonce.current = state.replayNonce;
      resetRun();
    }

    let animating = false;
    const raining = clock.current < maxSettle + 0.3;
    if (raining) {
      clock.current += dt;
      animating = true;
    }

    // 12 đĩa tạ
    for (let i = 0; i < SKILLS.length; i += 1) {
      const skill = SKILLS[i];
      const mode = modes.current[i];
      const px = positions.current[i * 3];
      const py = positions.current[i * 3 + 1];
      const pz = positions.current[i * 3 + 2];

      if (mode === RAIN) {
        const y = heightAt(clock.current, skill);
        writeToken(i, skill.rest[0], y, skill.rest[2]);
        if (clock.current > settleTime(skill)) modes.current[i] = REST;
        animating = true;
      } else if (mode === HELD && state.grabbed === i) {
        // Lag theo khối lượng: nặng bám tay chậm — CẢM được số năm
        const lambda = 1 - Math.exp(-dt * (14 / skill.years));
        const nx = px + (heldTarget.current.x - px) * lambda;
        const nz = pz + (heldTarget.current.z - pz) * lambda;
        const ny = py + (1.25 - py) * lambda;
        velocities.current[i * 3] = (nx - px) / Math.max(dt, 1e-3);
        velocities.current[i * 3 + 2] = (nz - pz) / Math.max(dt, 1e-3);
        writeToken(i, nx, ny, nz);
        animating = true;
      } else if (mode === FLY) {
        let vx = velocities.current[i * 3];
        let vy = velocities.current[i * 3 + 1];
        let vz = velocities.current[i * 3 + 2];
        vy -= GRAVITY * dt;
        const nx = px + vx * dt;
        let ny = py + vy * dt;
        const nz = pz + vz * dt;
        const floorY = skill.rest[1];
        if (ny <= floorY) {
          ny = floorY;
          const e = restitutionOf(skill.years);
          vy = Math.abs(vy) > 1.2 ? -vy * e : 0;
          vx *= 0.55;
          vz *= 0.55;
          if (vy === 0 && Math.hypot(vx, vz) < 0.3) {
            modes.current[i] = REST;
            rests.current[i * 3] = nx;
            rests.current[i * 3 + 2] = nz;
          }
        }
        // Giữ đĩa trong sàn
        const range = 6.5;
        if (Math.abs(nx) > range) vx = -Math.abs(vx) * Math.sign(nx) * 0.8;
        if (Math.abs(nz) > range) vz = -Math.abs(vz) * Math.sign(nz) * 0.8;
        velocities.current[i * 3] = vx;
        velocities.current[i * 3 + 1] = vy;
        velocities.current[i * 3 + 2] = vz;
        writeToken(i, nx, ny, nz);
        if (modes.current[i] === FLY) animating = true;
      }
    }

    // Chữ "KY LE" rơi theo cùng mô hình
    const cells = cellsRef.current;
    if (cells && raining) {
      let cellIndex = 0;
      const totalWidth = 25 * CELL;
      for (const letter of letters) {
        const y0 = heightAt(clock.current, letter);
        for (const [cx, cy] of letter.cells) {
          tmpMatrix.current.compose(
            tmpPos.current.set(
              (letter.offsetX + cx) * CELL - totalWidth / 2,
              y0 + cy * CELL + CELL / 2,
              -2.6,
            ),
            tmpQuat.current,
            tmpScale.current.set(CELL * 0.92, CELL * 0.92, CELL * 0.92),
          );
          cells.setMatrixAt(cellIndex, tmpMatrix.current);
          cellIndex += 1;
        }
      }
      cells.instanceMatrix.needsUpdate = true;
    }

    // Hover tint accent
    const tokens = tokensRef.current;
    if (tokens && state.hover !== lastHover.current) {
      if (lastHover.current >= 0) {
        tokens.setColorAt(lastHover.current, greys[lastHover.current]);
      }
      if (state.hover >= 0) {
        tokens.setColorAt(state.hover, ACCENT);
      }
      if (tokens.instanceColor) tokens.instanceColor.needsUpdate = true;
      lastHover.current = state.hover;
    }

    if (tokens) tokens.instanceMatrix.needsUpdate = true;
    const shadows = shadowsRef.current;
    if (shadows) shadows.instanceMatrix.needsUpdate = true;

    camera.lookAt(0, 0.7, 0);

    if (animating || state.grabbed >= 0) {
      root.invalidate();
    }
  });

  const onTokenDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    toyboxState.grabbed = event.instanceId;
    modes.current[event.instanceId] = HELD;
    heldTarget.current.set(event.point.x, 1.25, event.point.z);
    lastHeld.current.copy(heldTarget.current);
    toyboxState.invalidate?.();
  };

  const releaseGrab = () => {
    const grabbed = toyboxState.grabbed;
    if (grabbed < 0) return;
    // Cú ném: vận tốc tay chia cho khối lượng — nhẹ văng xa, nặng rơi tại chỗ
    const factor = 2.6 / SKILLS[grabbed].years;
    velocities.current[grabbed * 3] *= factor;
    velocities.current[grabbed * 3 + 1] = 2.2;
    velocities.current[grabbed * 3 + 2] *= factor;
    modes.current[grabbed] = FLY;
    toyboxState.grabbed = -1;
    toyboxState.invalidate?.();
  };

  const onPlaneMove = (event: ThreeEvent<PointerEvent>) => {
    if (toyboxState.grabbed < 0) return;
    heldTarget.current.set(event.point.x, 1.25, event.point.z);
    toyboxState.invalidate?.();
  };

  return (
    <group>
      <hemisphereLight args={["#e8edf4", "#101318", 0.85]} />
      <directionalLight position={[2.5, 5, 3]} intensity={1.15} color="#ffe9d2" />
      <directionalLight position={[-3, 4, -4]} intensity={0.45} color="#bcd7ff" />

      {/* 12 đĩa tạ: 1 draw call, raycast instanceId */}
      <instancedMesh
        ref={tokensRef}
        args={[undefined, undefined, SKILLS.length]}
        onPointerDown={onTokenDown}
        onPointerUp={releaseGrab}
        onPointerMove={(event) => {
          if (toyboxState.grabbed < 0 && event.instanceId !== undefined) {
            notifyHover(toyboxState, event.instanceId);
          }
        }}
        onPointerOut={() => {
          if (toyboxState.grabbed < 0) notifyHover(toyboxState, -1);
        }}
      >
        <cylinderGeometry args={[1, 1, 1, 28]} />
        <meshStandardMaterial roughness={0.55} metalness={0.35} />
      </instancedMesh>

      {/* "KY LE" dot-matrix: toàn bộ ô của 4 chữ trong 1 draw call */}
      <instancedMesh
        ref={cellsRef}
        args={[undefined, undefined, letterCellCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#aeb6c2" roughness={0.35} metalness={0.85} />
      </instancedMesh>

      {/* Bóng blob giả: 1 draw call, to nhỏ theo độ cao đĩa */}
      <instancedMesh
        ref={shadowsRef}
        args={[undefined, undefined, SKILLS.length]}
      >
        <circleGeometry args={[1, 20]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Sàn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial color="#14171c" roughness={0.9} metalness={0} />
      </mesh>

      {/* Drag plane vô hình cho kéo-thả */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 1.15, 0]}
        onPointerMove={onPlaneMove}
        onPointerUp={releaseGrab}
      >
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
