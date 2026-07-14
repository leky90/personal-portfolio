import * as THREE from "three";
import { ERAS } from "@/features/concepts/terrain/lib/career-data";

/** Kích thước sân khấu địa hình (đơn vị world) */
export const TERRAIN_WIDTH = 64;
export const TERRAIN_DEPTH = 110;

export interface CameraPath {
  position: THREE.CatmullRomCurve3;
  target: THREE.CatmullRomCurve3;
}

/** Đổi vị trí thời gian chuẩn hóa [0,1] sang tọa độ z world. */
export function eraZ(timeU: number): number {
  return timeU * TERRAIN_DEPTH;
}

/**
 * Đường bay camera: hero (trước mép 2016) → lượn trái/phải qua 4 era →
 * vượt ridge cuối ra đường chân trời (contact). Centripetal Catmull-Rom
 * để không vòng ngược khi rẽ.
 */
export function createCameraPath(): CameraPath {
  const positionPoints: THREE.Vector3[] = [new THREE.Vector3(0, 7.5, -16)];
  const targetPoints: THREE.Vector3[] = [new THREE.Vector3(0, 1.6, 14)];

  ERAS.forEach((era, index) => {
    const side = era.side === "left" ? -1 : 1;
    positionPoints.push(
      new THREE.Vector3(side * 9.5, 5.2 + index * 0.4, eraZ(era.timeU) - 11),
    );
    targetPoints.push(
      new THREE.Vector3(side * 2.5, 1.2, eraZ(era.timeU) + 3),
    );
  });

  positionPoints.push(new THREE.Vector3(0, 3.4, TERRAIN_DEPTH + 4));
  targetPoints.push(new THREE.Vector3(0, 0.8, TERRAIN_DEPTH + 60));

  return {
    position: new THREE.CatmullRomCurve3(
      positionPoints,
      false,
      "centripetal",
    ),
    target: new THREE.CatmullRomCurve3(targetPoints, false, "centripetal"),
  };
}

/**
 * Sample cả hai curve tại t vào vector CÓ SẴN — gọi mỗi frame,
 * không cấp phát mới.
 */
export function sampleCameraPath(
  path: CameraPath,
  t: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  const clamped = Math.min(Math.max(t, 0), 1);
  path.position.getPointAt(clamped, outPosition);
  path.target.getPointAt(clamped, outTarget);
}
