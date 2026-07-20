"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import {
  MODULE_M,
  TOTAL_LEVERAGE,
  buildGearShape,
  buildTrain,
} from "@/features/concepts/leverage-engine/lib/gear-data";
import {
  decayOmega,
  type EngineState,
} from "@/features/concepts/leverage-engine/lib/engine-state";

interface EngineSceneProps {
  engineState: EngineState;
}

const LAYER_Z = -0.38;
const ACCENT = "#c084fc";

/**
 * Bản vẽ patent sống: 13 gear chia 7 extrusion cache + đúng 2 material
 * dùng chung (mực fill + mực nét). Mọi chuyển động là MỘT số: góc crank;
 * các gear khác quay theo hệ số tốc độ của DAG. Kéo crank = direct
 * drive, thả ra = momentum với ma sát mũ, snap 0 là ngừng render.
 */
export function EngineScene({ engineState }: EngineSceneProps) {
  const camera = useThree((three) => three.camera);

  const { train, geometries, edgeGeometries, fillMaterial, lineMaterial } =
    useMemo(() => {
      const gears = buildTrain();
      const geometryByTeeth = new Map<number, THREE.ExtrudeGeometry>();
      const edgesByTeeth = new Map<number, THREE.EdgesGeometry>();
      for (const gear of gears) {
        if (!geometryByTeeth.has(gear.teeth)) {
          const extrude = new THREE.ExtrudeGeometry(
            buildGearShape(gear.teeth, MODULE_M),
            { depth: 0.16, bevelEnabled: false },
          );
          geometryByTeeth.set(gear.teeth, extrude);
          edgesByTeeth.set(gear.teeth, new THREE.EdgesGeometry(extrude, 25));
        }
      }
      return {
        train: gears,
        geometries: geometryByTeeth,
        edgeGeometries: edgesByTeeth,
        fillMaterial: new THREE.MeshBasicMaterial({
          color: "#343a43",
          transparent: true,
          opacity: 0.82,
        }),
        lineMaterial: new THREE.LineBasicMaterial({
          color: "#cfd6df",
          transparent: true,
          opacity: 0.75,
        }),
      };
    }, []);

  useEffect(() => {
    return () => {
      for (const geometry of geometries.values()) geometry.dispose();
      for (const edges of edgeGeometries.values()) edges.dispose();
      fillMaterial.dispose();
      lineMaterial.dispose();
    };
  }, [geometries, edgeGeometries, fillMaterial, lineMaterial]);

  const gearRefs = useRef<(THREE.Group | null)[]>([]);
  const crankAngle = useRef(0);
  const lastOdometerTick = useRef(-1);
  const drag = useRef({ active: false, lastAngle: 0, lastTime: 0, velocity: 0 });
  const smooth = useRef({ p: 0 });

  const crankGear = train.find((gear) => gear.id === "crank")!;

  const angleFromEvent = (event: ThreeEvent<PointerEvent>) =>
    Math.atan2(
      event.point.y - crankGear.position[1],
      event.point.x - crankGear.position[0],
    );

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    drag.current.active = true;
    drag.current.lastAngle = angleFromEvent(event);
    drag.current.lastTime = performance.now();
    drag.current.velocity = 0;
    engineState.dragging = true;
    (event.target as Element | null)?.setPointerCapture?.(event.pointerId);
    engineState.invalidate?.();
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    const angle = angleFromEvent(event);
    let delta = angle - drag.current.lastAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    const now = performance.now();
    const dt = Math.max((now - drag.current.lastTime) / 1000, 1e-3);
    crankAngle.current += delta;
    drag.current.velocity = THREE.MathUtils.clamp(delta / dt, -8, 8);
    drag.current.lastAngle = angle;
    drag.current.lastTime = now;
    engineState.invalidate?.();
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    engineState.dragging = false;
    engineState.omega = drag.current.velocity;
    engineState.invalidate?.();
  };

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = engineState;

    // Momentum + ma sát khi không kéo trực tiếp
    if (!drag.current.active && state.omega !== 0) {
      state.omega = decayOmega(state.omega, dt);
      crankAngle.current += state.omega * dt;
    }

    // Cả hộp số quay theo MỘT góc crank nhân hệ số DAG
    train.forEach((gear, index) => {
      const group = gearRefs.current[index];
      if (group) {
        group.rotation.z = gear.phase + gear.speed * crankAngle.current;
      }
    });

    // Odometer throttle theo bước 1/20 vòng
    const inputRevs = crankAngle.current / (Math.PI * 2);
    const tick = Math.floor(Math.abs(inputRevs) * 20);
    if (tick !== lastOdometerTick.current) {
      lastOdometerTick.current = tick;
      state.setOdometer?.(inputRevs, inputRevs * TOTAL_LEVERAGE);
    }

    // Camera pan dọc hộp số theo cuộn
    easing.damp(smooth.current, "p", state.progress, 0.3, dt);
    const camX = THREE.MathUtils.lerp(1.1, 3.6, smooth.current.p);
    camera.position.set(camX, 0.4, 11);
    camera.lookAt(camX, 0.4, 0);

    if (
      drag.current.active ||
      state.omega !== 0 ||
      Math.abs(state.progress - smooth.current.p) > 1e-4
    ) {
      root.invalidate();
    }
  });

  return (
    <group>
      {/* 13 gear: mesh mực fill + nét EdgesGeometry, 2 material chung */}
      {train.map((gear, index) => (
        <group
          key={gear.id}
          ref={(group) => {
            gearRefs.current[index] = group;
          }}
          position={[gear.position[0], gear.position[1], gear.layer * LAYER_Z]}
        >
          <mesh
            geometry={geometries.get(gear.teeth)}
            material={fillMaterial}
          />
          <lineSegments
            geometry={edgeGeometries.get(gear.teeth)}
            material={lineMaterial}
          />
          {/* Núm tay quay accent trên vành crank */}
          {gear.id === "crank" ? (
            <mesh position={[gear.pitchRadius * 0.68, 0, 0.22]}>
              <cylinderGeometry args={[0.16, 0.16, 0.3, 16]} />
              <meshBasicMaterial color={ACCENT} />
            </mesh>
          ) : null}
        </group>
      ))}

      {/* Đĩa hit vô hình quanh crank: kéo theo cung tròn */}
      <mesh
        position={[crankGear.position[0], crankGear.position[1], 0.3]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <circleGeometry args={[crankGear.pitchRadius + 0.6, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Trục gear: chấm tâm kiểu bản vẽ */}
      {train
        .filter((gear) => !gear.coaxialWith)
        .map((gear) => (
          <mesh
            key={`shaft-${gear.id}`}
            position={[gear.position[0], gear.position[1], 0.18]}
          >
            <circleGeometry args={[0.055, 12]} />
            <meshBasicMaterial color="#8b93a0" />
          </mesh>
        ))}
    </group>
  );
}
