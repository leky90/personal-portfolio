"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Trả về true nếu user bật giảm chuyển động. Check TRƯỚC khi mount canvas
 * để chunk three.js không bao giờ được tải cho user reduced-motion.
 * Giá trị khởi tạo false để server render ổn định (poster chỉ thay canvas
 * sau khi client xác nhận preference).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReduced(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReduced;
}
