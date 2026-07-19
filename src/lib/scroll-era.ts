export interface EraRect {
  top: number;
  height: number;
}

/**
 * Era đang "đọc" = card có tâm gần tâm viewport nhất, trong ngưỡng 60%
 * chiều cao viewport. Trang chủ dùng thay cho activeEraIndex(progress) của
 * demo vì layout thật có nhiều section chen giữa các era.
 */
export function nearestEraIndex(
  rects: EraRect[],
  viewportHeight: number,
): number {
  const viewportCenter = viewportHeight / 2;
  const threshold = viewportHeight * 0.6;

  let best = -1;
  let bestDistance = Infinity;
  for (let i = 0; i < rects.length; i += 1) {
    const center = rects[i].top + rects[i].height / 2;
    const distance = Math.abs(center - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return bestDistance <= threshold ? best : -1;
}
