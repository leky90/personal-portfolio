"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import {
  buildMeshLinks,
  fragmentPositionAt,
  sliceMonolith,
} from "@/features/concepts/monolith-to-mesh/lib/slice-monolith";
import { FragmentMaterial } from "@/features/concepts/monolith-to-mesh/lib/fragment-material";
import { MeshLinkMaterial } from "@/features/concepts/monolith-to-mesh/lib/mesh-link-material";
import {
  progressToU,
  type MeshState,
} from "@/features/concepts/monolith-to-mesh/lib/mesh-state";

interface MeshSceneProps {
  meshState: MeshState;
}

/**
 * 3 draw call: 1 InstancedMesh mảnh (morph 100% trong vertex shader từ một
 * uniform uU), 1 LineSegments filament, 1 hit-proxy vô hình (matrix CPU chỉ
 * cập nhật khi bucket u đổi — mirror fragmentPositionAt cho raycast đúng).
 */
export function MeshScene({ meshState }: MeshSceneProps) {
  const camera = useThree((three) => three.camera);
  const clock = useThree((three) => three.clock);

  const { entries, fragmentGeometry, fragmentMaterial, linkGeometry, linkMaterial } =
    useMemo(() => {
      const builtEntries = sliceMonolith(7);
      const count = builtEntries.length;

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const home = new Float32Array(count * 3);
      const target = new Float32Array(count * 3);
      const phase = new Float32Array(count * 2);
      const phase2 = new Float32Array(count * 2);
      const kind = new Float32Array(count);
      const size = new Float32Array(count * 3);
      const index = new Float32Array(count);
      builtEntries.forEach((entry, i) => {
        home.set(entry.home.center, i * 3);
        target.set(entry.target, i * 3);
        phase.set(entry.phase, i * 2);
        phase2.set(entry.phase2, i * 2);
        kind[i] = entry.kind;
        size.set(entry.home.size, i * 3);
        index[i] = i;
      });
      geometry.setAttribute("aHome", new THREE.InstancedBufferAttribute(home, 3));
      geometry.setAttribute("aTarget", new THREE.InstancedBufferAttribute(target, 3));
      geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 2));
      geometry.setAttribute("aPhase2", new THREE.InstancedBufferAttribute(phase2, 2));
      geometry.setAttribute("aKind", new THREE.InstancedBufferAttribute(kind, 1));
      geometry.setAttribute("aSize", new THREE.InstancedBufferAttribute(size, 3));
      geometry.setAttribute("aIndex", new THREE.InstancedBufferAttribute(index, 1));

      // Filament: mỗi cặp entry một segment, đặt tại TARGET (chỉ hiện khi đã tách)
      const links = buildMeshLinks(builtEntries);
      const pairCount = links.pairs.length / 2;
      const positions = new Float32Array(pairCount * 2 * 3);
      const births = new Float32Array(pairCount * 2);
      const params = new Float32Array(pairCount * 2);
      for (let p = 0; p < pairCount; p += 1) {
        const a = builtEntries[links.pairs[p * 2]];
        const b = builtEntries[links.pairs[p * 2 + 1]];
        positions.set(a.target, p * 6);
        positions.set(b.target, p * 6 + 3);
        births[p * 2] = links.births[p];
        births[p * 2 + 1] = links.births[p];
        params[p * 2] = 0;
        params[p * 2 + 1] = 1;
      }
      const lGeometry = new THREE.BufferGeometry();
      lGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      lGeometry.setAttribute("aBirth", new THREE.BufferAttribute(births, 1));
      lGeometry.setAttribute("aParam", new THREE.BufferAttribute(params, 1));

      return {
        entries: builtEntries,
        fragmentGeometry: geometry,
        fragmentMaterial: new FragmentMaterial(),
        linkGeometry: lGeometry,
        linkMaterial: new MeshLinkMaterial(),
      };
    }, []);

  useEffect(() => {
    return () => {
      fragmentGeometry.dispose();
      fragmentMaterial.dispose();
      linkGeometry.dispose();
      linkMaterial.dispose();
    };
  }, [fragmentGeometry, fragmentMaterial, linkGeometry, linkMaterial]);

  const hitRef = useRef<THREE.InstancedMesh>(null);
  const smoothU = useRef({ u: 0 });
  const lastBucket = useRef(-1);
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpVec = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = meshState;

    easing.damp(smoothU.current, "u", progressToU(state.progress), 0.3, dt);
    const u = smoothU.current.u;

    fragmentMaterial.uniforms.uU.value = u;
    fragmentMaterial.uniforms.uHover.value = state.hover;
    linkMaterial.uniforms.uU.value = u;
    linkMaterial.uniforms.uTime.value = clock.getElapsedTime();

    // Camera 3/4 cố định, dolly-out chậm cả thập kỷ + parallax nhẹ
    camera.position.set(
      7 + u * 3.5 + state.pointer.x * 0.5,
      4.5 + u * 2 + state.pointer.y * 0.35,
      9 + u * 4.5,
    );
    camera.lookAt(0, 0.4, 0);

    // Hit proxies theo kịp morph — chỉ khi bucket u đổi
    const bucket = Math.round(u * 40);
    const hits = hitRef.current;
    if (hits && bucket !== lastBucket.current) {
      lastBucket.current = bucket;
      entries.forEach((entry, i) => {
        fragmentPositionAt(entry, u, tmpVec.current);
        tmpMatrix.current.makeTranslation(
          tmpVec.current.x,
          tmpVec.current.y,
          tmpVec.current.z,
        );
        hits.setMatrixAt(i, tmpMatrix.current);
      });
      hits.instanceMatrix.needsUpdate = true;
    }

    if (Math.abs(u - progressToU(state.progress)) > 0.0005) {
      root.invalidate();
    }
  });

  const handleFragmentMove = (event: ThreeEvent<PointerEvent>) => {
    const instanceId = event.instanceId;
    if (instanceId === undefined) return;
    if (meshState.hover !== instanceId) {
      meshState.hover = instanceId;
      meshState.setServiceHud?.(instanceId);
      meshState.invalidate?.();
    }
  };

  const handleFragmentOut = () => {
    if (meshState.hover !== -1) {
      meshState.hover = -1;
      meshState.setServiceHud?.(-1);
      meshState.invalidate?.();
    }
  };

  return (
    <>
      <instancedMesh
        args={[fragmentGeometry, fragmentMaterial, entries.length]}
        frustumCulled={false}
      />

      <lineSegments
        geometry={linkGeometry}
        material={linkMaterial}
        frustumCulled={false}
      />

      {/* Hit proxies vô hình bám theo vị trí morph của từng mảnh */}
      <instancedMesh
        ref={hitRef}
        args={[undefined, undefined, entries.length]}
        frustumCulled={false}
        onPointerMove={handleFragmentMove}
        onPointerOut={handleFragmentOut}
        onClick={handleFragmentMove}
      >
        <sphereGeometry args={[0.75, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>
    </>
  );
}
