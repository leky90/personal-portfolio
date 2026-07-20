"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import { DECISIONS } from "@/features/concepts/decision-diff/lib/decisions-data";
import {
  buildRail,
  sampleRailCamera,
} from "@/features/concepts/decision-diff/lib/rail-path";
import { RailMaterial } from "@/features/concepts/decision-diff/lib/rail-material";
import type { DecisionState } from "@/features/concepts/decision-diff/lib/decision-state";

interface DecisionSceneProps {
  decisionState: DecisionState;
}

/**
 * Rail = 1 TubeGeometry duy nhất compile từ decision log; 6 nhánh ma là
 * LineDashedMaterial riêng (materialize bằng damp opacity + gapSize);
 * fork markers và hit-proxy đều instanced. Camera bám trunk theo scroll.
 */
export function DecisionScene({ decisionState }: DecisionSceneProps) {
  const camera = useThree((three) => three.camera);

  const { rail, trunkGeometry, railMaterial, ghostLines } = useMemo(() => {
    const builtRail = buildRail();
    return {
      rail: builtRail,
      trunkGeometry: new THREE.TubeGeometry(builtRail.trunk, 260, 0.06, 8, false),
      railMaterial: new RailMaterial(),
      ghostLines: builtRail.forks.map((fork) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(
          fork.ghost.getPoints(28),
        );
        const material = new THREE.LineDashedMaterial({
          color: "#f85149",
          transparent: true,
          opacity: 0.4,
          dashSize: 0.5,
          gapSize: 0.35,
          depthWrite: false,
        });
        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        line.frustumCulled = false;
        return line;
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      trunkGeometry.dispose();
      railMaterial.dispose();
      for (const line of ghostLines) {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      }
    };
  }, [trunkGeometry, railMaterial, ghostLines]);

  const forkRef = useRef<THREE.InstancedMesh>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);

  // Đặt matrix cho fork markers + hit proxies một lần
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const forks = forkRef.current;
    const hits = hitRef.current;
    if (!forks || !hits) return;
    rail.forks.forEach((fork, index) => {
      matrix.makeTranslation(
        fork.position.x,
        fork.position.y,
        fork.position.z,
      );
      forks.setMatrixAt(index, matrix);
      const mid = fork.ghost.getPointAt(0.55);
      matrix.makeTranslation(mid.x, mid.y, mid.z);
      hits.setMatrixAt(index, matrix);
    });
    forks.instanceMatrix.needsUpdate = true;
    hits.instanceMatrix.needsUpdate = true;
  }, [rail]);

  const smoothProgress = useRef({ t: 0 });
  const cameraPos = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = decisionState;

    easing.damp(smoothProgress.current, "t", state.progress, 0.3, dt);
    sampleRailCamera(
      rail,
      smoothProgress.current.t,
      cameraPos.current,
      cameraTarget.current,
    );
    camera.position.copy(cameraPos.current);
    camera.lookAt(cameraTarget.current);

    railMaterial.uniforms.uProgress.value = smoothProgress.current.t;

    let settling = false;
    ghostLines.forEach((line, index) => {
      const material = line.material as THREE.LineDashedMaterial;
      const isLit = state.materialized === index;
      easing.damp(material, "opacity", isLit ? 0.95 : 0.4, 0.2, dt);
      easing.damp(material, "gapSize", isLit ? 0.02 : 0.35, 0.2, dt);
      if (Math.abs(material.opacity - (isLit ? 0.95 : 0.4)) > 0.01) {
        settling = true;
      }
    });

    if (
      Math.abs(smoothProgress.current.t - state.progress) > 0.0005 ||
      settling
    ) {
      root.invalidate();
    }
  });

  const handleGhostMove = (event: ThreeEvent<PointerEvent>) => {
    const instanceId = event.instanceId;
    if (instanceId === undefined) return;
    if (decisionState.materialized !== instanceId) {
      decisionState.materialized = instanceId;
      decisionState.setGhostHud?.(instanceId);
      decisionState.invalidate?.();
    }
  };

  const handleGhostOut = () => {
    if (decisionState.materialized !== -1) {
      decisionState.materialized = -1;
      decisionState.setGhostHud?.(-1);
      decisionState.invalidate?.();
    }
  };

  return (
    <>
      <mesh
        geometry={trunkGeometry}
        material={railMaterial}
        frustumCulled={false}
      />
      {ghostLines.map((line, index) => (
        <primitive key={DECISIONS[index].id} object={line} />
      ))}

      <instancedMesh
        ref={forkRef}
        args={[undefined, undefined, DECISIONS.length]}
        frustumCulled={false}
      >
        <octahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial color="#9aa0a8" />
      </instancedMesh>

      {/* Hit proxies vô hình quanh giữa mỗi nhánh ma */}
      <instancedMesh
        ref={hitRef}
        args={[undefined, undefined, DECISIONS.length]}
        frustumCulled={false}
        onPointerMove={handleGhostMove}
        onPointerOut={handleGhostOut}
        onClick={handleGhostMove}
      >
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>
    </>
  );
}
