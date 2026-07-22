"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BATONS,
  LANES,
  RELAY_YEAR_MIN,
  RELAY_YEAR_SPAN,
  buildBatonPath,
  xForYear,
} from "@/features/concepts/knowledge-relay/lib/relay-data";
import { TrailMaterial } from "@/features/concepts/knowledge-relay/lib/trail-material";
import type { RelayState } from "@/features/concepts/knowledge-relay/lib/relay-state";

interface RelaySceneProps {
  relayState: RelayState;
}

const LANE_ALIVE = new THREE.Color("#8b96a5");
const LANE_DEAD = new THREE.Color("#3a4048");

/**
 * Marey timetable 3D: 6 lane kệ theo z, thời gian dọc x. TẤT CẢ hành
 * trình gậy merge 1 LineSegments + 1 shader (lộ dần theo uYear), 5 đầu
 * gậy 1 InstancedMesh. Lane chết nguội màu khi năm vượt endYear — gậy
 * thì không bao giờ nguội. Scrub-only: không ambient loop.
 */
export function RelayScene({ relayState }: RelaySceneProps) {
  const camera = useThree((three) => three.camera);

  const { laneGeometry, laneColors, trailGeometry, trailMaterial, paths } =
    useMemo(() => {
      // 6 lane: mỗi lane một đoạn thẳng theo lifespan
      const lanePositions = new Float32Array(LANES.length * 6);
      const laneColorArray = new Float32Array(LANES.length * 6);
      LANES.forEach((lane, index) => {
        lanePositions.set(
          [
            xForYear(lane.startYear),
            lane.y,
            lane.z,
            xForYear(lane.endYear),
            lane.y,
            lane.z,
          ],
          index * 6,
        );
      });
      const lanes = new THREE.BufferGeometry();
      lanes.setAttribute(
        "position",
        new THREE.BufferAttribute(lanePositions, 3),
      );
      lanes.setAttribute(
        "color",
        new THREE.BufferAttribute(laneColorArray, 3),
      );

      // Mọi vệt gậy merge thành segment pairs + aYear per vertex
      const batonPaths = BATONS.map((baton) => buildBatonPath(baton));
      let segmentCount = 0;
      for (const path of batonPaths) segmentCount += path.points.length - 1;
      const trailPositions = new Float32Array(segmentCount * 6);
      const trailYears = new Float32Array(segmentCount * 2);
      let cursor = 0;
      for (const path of batonPaths) {
        for (let i = 0; i < path.points.length - 1; i += 1) {
          trailPositions.set(
            [...path.points[i], ...path.points[i + 1]],
            cursor * 6,
          );
          trailYears[cursor * 2] = path.years[i];
          trailYears[cursor * 2 + 1] = path.years[i + 1];
          cursor += 1;
        }
      }
      const trails = new THREE.BufferGeometry();
      trails.setAttribute(
        "position",
        new THREE.BufferAttribute(trailPositions, 3),
      );
      trails.setAttribute(
        "aYear",
        new THREE.BufferAttribute(trailYears, 1),
      );

      return {
        laneGeometry: lanes,
        laneColors: laneColorArray,
        trailGeometry: trails,
        trailMaterial: new TrailMaterial(),
        paths: batonPaths,
      };
    }, []);

  useEffect(() => {
    return () => {
      laneGeometry.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
    };
  }, [laneGeometry, trailGeometry, trailMaterial]);

  const batonsRef = useRef<THREE.InstancedMesh>(null);
  const smooth = useRef({ year: RELAY_YEAR_MIN });
  const lastYearInt = useRef(-1);
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());

  /** Nội suy vị trí đầu gậy từ path đã cache — zero allocation. */
  const headPosition = (
    pathIndex: number,
    year: number,
    out: THREE.Vector3,
  ) => {
    const { points, years } = paths[pathIndex];
    const last = points.length - 1;
    if (year <= years[0]) return out.set(...points[0]);
    if (year >= years[last]) return out.set(...points[last]);
    for (let i = 1; i <= last; i += 1) {
      if (year <= years[i]) {
        const span = years[i] - years[i - 1];
        const t = span > 0 ? (year - years[i - 1]) / span : 1;
        return out.set(
          points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
          points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
          points[i - 1][2] + (points[i][2] - points[i - 1][2]) * t,
        );
      }
    }
    return out.set(...points[last]);
  };

  const paintLanes = (year: number) => {
    LANES.forEach((lane, index) => {
      const color = year > lane.endYear ? LANE_DEAD : LANE_ALIVE;
      for (const vertex of [0, 1]) {
        laneColors.set(
          [color.r, color.g, color.b],
          index * 6 + vertex * 3,
        );
      }
    });
    laneGeometry.attributes.color.needsUpdate = true;
  };

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = relayState;

    smooth.current.year +=
      (state.year - smooth.current.year) * (1 - Math.exp(-dt * 6));
    const year = smooth.current.year;

    trailMaterial.setYear(year);

    // Lane nguội màu khi chết — chỉ ghi lại khi năm nguyên đổi
    const yearInt = Math.floor(year);
    if (yearInt !== lastYearInt.current) {
      lastYearInt.current = yearInt;
      paintLanes(year);
    }

    // 5 đầu gậy trượt theo path; chưa rèn thì scale 0
    const batons = batonsRef.current;
    if (batons) {
      BATONS.forEach((baton, index) => {
        headPosition(index, year, tmpPos.current);
        const visible = year >= baton.forgedYear;
        const s = visible ? 1 : 0.0001;
        tmpMatrix.current.compose(
          tmpPos.current,
          tmpQuat.current,
          tmpScale.current.set(s, s, s),
        );
        batons.setMatrixAt(index, tmpMatrix.current);
      });
      batons.instanceMatrix.needsUpdate = true;
    }

    // Camera: 2014 nhìn xiên thấp → 2026 nhìn tổng quan từ trên
    const p = (year - RELAY_YEAR_MIN) / RELAY_YEAR_SPAN;
    camera.position.set(
      -3 + p * 5.5,
      1.2 + p * 5.3,
      8.6 + p * 0.9,
    );
    camera.lookAt(0, 1.2, -1.6);

    if (Math.abs(state.year - year) > 1e-3) {
      root.invalidate();
    }
  });

  return (
    <group>
      {/* 6 lane team: 1 LineSegments, nguội màu khi dự án đóng */}
      <lineSegments geometry={laneGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.9} />
      </lineSegments>

      {/* Mọi hành trình gậy: 1 draw call, lộ dần theo uYear */}
      <lineSegments geometry={trailGeometry} material={trailMaterial} />

      {/* 5 đầu gậy: 1 InstancedMesh capsule trắng nóng */}
      <instancedMesh ref={batonsRef} args={[undefined, undefined, BATONS.length]}>
        <capsuleGeometry args={[0.09, 0.2, 4, 10]} />
        <meshBasicMaterial color="#f2fff9" toneMapped={false} />
      </instancedMesh>

      {/* Sàn kệ mờ */}
      <gridHelper
        args={[24, 24, "#1c2028", "#12151b"]}
        position={[0, -0.55, -1.6]}
      />
    </group>
  );
}
