/**
 * Profile 2D của khối kim loại tiện (bán kính, cao độ) cho
 * LatheGeometry: chamfer hai đầu, hai rãnh V, một collar nhô — thứ
 * hình học chỉ máy tiện làm ra được, không cần tải model nào.
 */

export function buildLatheProfile(): [number, number][] {
  return [
    [0.0, 0.0],
    [0.42, 0.0],
    [0.5, 0.06],
    [0.5, 0.34],
    // Rãnh V thứ nhất
    [0.38, 0.4],
    [0.5, 0.46],
    [0.5, 0.78],
    // Rãnh V thứ hai
    [0.38, 0.84],
    [0.5, 0.9],
    [0.5, 1.12],
    // Collar nhô (khối chuẩn để cầm khi tiện)
    [0.62, 1.16],
    [0.62, 1.34],
    [0.5, 1.38],
    [0.5, 1.62],
    // Cổ thon
    [0.34, 1.7],
    [0.34, 1.92],
    [0.42, 1.98],
    [0.42, 2.14],
    // Chamfer đỉnh
    [0.3, 2.22],
    [0.0, 2.24],
  ];
}
