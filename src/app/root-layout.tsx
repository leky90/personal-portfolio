import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

/**
 * Khung app thay RootLayout của Next: html/body + fonts sống ở
 * index.html/main.tsx; đây chỉ còn Outlet + hành vi scroll-to-top khi
 * đổi route (SPA không tự cuộn như điều hướng full-page).
 */
export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Outlet />;
}
