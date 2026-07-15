import * as THREE from "three";

export interface MonolithRig {
  position: THREE.CatmullRomCurve3;
  target: THREE.CatmullRomCurve3;
}

/**
 * Đường bay camera: lượn so le qua 4 khối chữ K-Y-L-E rồi dừng trước "HI".
 * Target luôn dẫn trước ~8-11 đơn vị z nên khung hình lúc nào cũng hướng
 * về phía trước hành trình.
 */
export function createMonolithRig(): MonolithRig {
  const positionPoints = [
    new THREE.Vector3(-7.5, 2.6, -12),
    new THREE.Vector3(5.5, 2.8, -2),
    new THREE.Vector3(-5.5, 2.4, 7.5),
    new THREE.Vector3(5.8, 2.6, 16),
    new THREE.Vector3(-5.2, 2.8, 24.5),
    new THREE.Vector3(0, 2.1, 33),
  ];
  const targetPoints = [
    new THREE.Vector3(0, 3.2, 2),
    new THREE.Vector3(-1, 3.0, 10),
    new THREE.Vector3(1.5, 3.0, 19),
    new THREE.Vector3(-1.5, 3.2, 28),
    new THREE.Vector3(0.5, 2.6, 34),
    new THREE.Vector3(0, 1.9, 44),
  ];
  return {
    position: new THREE.CatmullRomCurve3(positionPoints, false, "centripetal"),
    target: new THREE.CatmullRomCurve3(targetPoints, false, "centripetal"),
  };
}

/** Sample vào vector có sẵn — gọi mỗi frame, zero allocation. */
export function sampleMonolithRig(
  rig: MonolithRig,
  t: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  const clamped = Math.min(Math.max(t, 0), 1);
  rig.position.getPointAt(clamped, outPosition);
  rig.target.getPointAt(clamped, outTarget);
}
