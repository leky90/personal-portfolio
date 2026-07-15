import * as THREE from "three";

/**
 * Letterform procedural — mọi chữ của "KY LE" + "HI" đều là nét thẳng nên
 * outline định nghĩa được bằng polygon thuần: 0 KB font asset, bevel/extrude
 * tùy ý, và bản thân dữ liệu chữ là code kiểm thử được.
 * Hộp đơn vị: x ∈ [0, ~0.8], y ∈ [0, 1].
 */
export type LetterChar = "K" | "Y" | "L" | "E" | "H" | "I";

const LETTER_OUTLINES: Record<LetterChar, [number, number][]> = {
  L: [
    [0, 0],
    [0.72, 0],
    [0.72, 0.24],
    [0.24, 0.24],
    [0.24, 1],
    [0, 1],
  ],
  I: [
    [0, 0],
    [0.24, 0],
    [0.24, 1],
    [0, 1],
  ],
  E: [
    [0, 0],
    [0.72, 0],
    [0.72, 0.2],
    [0.2, 0.2],
    [0.2, 0.4],
    [0.62, 0.4],
    [0.62, 0.6],
    [0.2, 0.6],
    [0.2, 0.8],
    [0.72, 0.8],
    [0.72, 1],
    [0, 1],
  ],
  H: [
    [0, 0],
    [0.24, 0],
    [0.24, 0.38],
    [0.48, 0.38],
    [0.48, 0],
    [0.72, 0],
    [0.72, 1],
    [0.48, 1],
    [0.48, 0.62],
    [0.24, 0.62],
    [0.24, 1],
    [0, 1],
  ],
  K: [
    [0, 0],
    [0.24, 0],
    [0.24, 0.36],
    [0.52, 0],
    [0.8, 0],
    [0.42, 0.5],
    [0.8, 1],
    [0.52, 1],
    [0.24, 0.64],
    [0.24, 1],
    [0, 1],
  ],
  Y: [
    [0.24, 0],
    [0.48, 0],
    [0.48, 0.46],
    [0.72, 1],
    [0.54, 1],
    [0.36, 0.6],
    [0.18, 1],
    [0, 1],
    [0.24, 0.46],
  ],
};

export function letterShape(char: LetterChar): THREE.Shape {
  const outline = LETTER_OUTLINES[char];
  if (!outline) {
    throw new Error(`Letterform "${char}" chưa được định nghĩa`);
  }
  const shape = new THREE.Shape();
  shape.moveTo(outline[0][0], outline[0][1]);
  for (let i = 1; i < outline.length; i += 1) {
    shape.lineTo(outline[i][0], outline[i][1]);
  }
  shape.closePath();
  return shape;
}

export interface MonolithLetter {
  char: LetterChar;
  position: [number, number, number];
  rotationY: number;
  scale: number;
}

/** 4 khối chữ tượng đài K-Y-L-E xếp dọc trục z, so le trái/phải. */
export const MONOLITH_LETTERS: MonolithLetter[] = [
  { char: "K", position: [-2.8, -1, 0], rotationY: -0.14, scale: 6.5 },
  { char: "Y", position: [2.1, -1, 9], rotationY: 0.18, scale: 6.5 },
  { char: "L", position: [-3.2, -1, 18], rotationY: -0.1, scale: 6.5 },
  { char: "E", position: [2.3, -1, 27], rotationY: 0.12, scale: 6.5 },
];

/** "HI" nhỏ khắc sau khối E — phần thưởng ở cuối đường bay. */
export const HI_LETTERS: MonolithLetter[] = [
  { char: "H", position: [-1.15, 1.1, 36.5], rotationY: 0, scale: 1.7 },
  { char: "I", position: [0.45, 1.1, 36.5], rotationY: 0, scale: 1.7 },
];
