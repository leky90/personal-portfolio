/**
 * Chữ số kiểu 7-segment dựng từ instance của MỘT khối cube — mọi con số
 * trên tượng đài (năm, số thứ tự project) đi chung 1 draw call InstancedMesh.
 * Hộp đơn vị digit: rộng 0.62, cao 1.
 */

type SegmentKey = "a" | "b" | "c" | "d" | "e" | "f" | "g";

export interface SegmentTransform {
  position: [number, number, number];
  scale: [number, number, number];
}

/** Vị trí + kích thước từng thanh trong hộp digit đơn vị. */
const SEGMENT_GEOMS: Record<SegmentKey, SegmentTransform> = {
  a: { position: [0.31, 0.96, 0], scale: [0.42, 0.1, 0.12] },
  g: { position: [0.31, 0.5, 0], scale: [0.42, 0.1, 0.12] },
  d: { position: [0.31, 0.04, 0], scale: [0.42, 0.1, 0.12] },
  f: { position: [0.06, 0.73, 0], scale: [0.1, 0.42, 0.12] },
  b: { position: [0.56, 0.73, 0], scale: [0.1, 0.42, 0.12] },
  e: { position: [0.06, 0.27, 0], scale: [0.1, 0.42, 0.12] },
  c: { position: [0.56, 0.27, 0], scale: [0.1, 0.42, 0.12] },
};

export const DIGIT_SEGMENTS: Record<string, SegmentKey[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "f", "g", "c", "d"],
};

export function segmentTransforms(digit: string): SegmentTransform[] {
  const segments = DIGIT_SEGMENTS[digit];
  if (!segments) {
    throw new Error(`Ký tự "${digit}" không có trong bảng 7-segment`);
  }
  return segments.map((key) => SEGMENT_GEOMS[key]);
}

export interface PlacedSegment extends SegmentTransform {
  /** Ký tự thứ mấy trong chuỗi — dùng để kiểm thử layout */
  digitIndex: number;
}

/** Khoảng cách tâm-tâm giữa hai digit liền kề. */
export const DIGIT_ADVANCE = 0.82;

/** Trải một chuỗi số thành danh sách instance, offset x tăng theo ký tự. */
export function layoutSegmentString(text: string): PlacedSegment[] {
  const placed: PlacedSegment[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    for (const segment of segmentTransforms(char)) {
      placed.push({
        position: [
          segment.position[0] + i * DIGIT_ADVANCE,
          segment.position[1],
          segment.position[2],
        ],
        scale: segment.scale,
        digitIndex: i,
      });
    }
  }
  return placed;
}
