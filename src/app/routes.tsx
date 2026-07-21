import {
  Suspense,
  lazy,
  useMemo,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Route, Routes, useParams } from "react-router";
import { NotFoundPage } from "@/app/not-found-page";
import { RootLayout } from "@/app/root-layout";
import { PageMeta, type PageMetadata } from "@/lib/page-meta";

interface PageModule {
  default: ComponentType;
  metadata?: PageMetadata;
}

/**
 * Bảng route SPA thay cho App Router. Mỗi page giữ nguyên convention
 * `export const metadata`; wrapper lazy đọc metadata từ module và render
 * <PageMeta> để set document.title — page KHÔNG phải sửa gì.
 */
function lazyPage(load: () => Promise<PageModule>) {
  const Page = lazy(async () => {
    const mod = await load();
    const Component = mod.default;
    return {
      default: () => (
        <>
          <PageMeta meta={mod.metadata} />
          <Component />
        </>
      ),
    };
  });
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
}

/** 26 trang concept: một route động + glob thay vì liệt kê tay. */
const conceptPageModules = import.meta.glob<PageModule>(
  "./concepts/*/page.tsx",
);
const conceptPageCache = new Map<
  string,
  LazyExoticComponent<ComponentType>
>();

function ConceptPageResolver() {
  const { conceptId } = useParams();
  const loader = conceptPageModules[`./concepts/${conceptId}/page.tsx`];

  const Page = useMemo(() => {
    if (!conceptId || !loader) return null;
    let cached = conceptPageCache.get(conceptId);
    if (!cached) {
      cached = lazy(async () => {
        const mod = await loader();
        const Component = mod.default;
        return {
          default: () => (
            <>
              <PageMeta meta={mod.metadata} />
              <Component />
            </>
          ),
        };
      });
      conceptPageCache.set(conceptId, cached);
    }
    return cached;
  }, [conceptId, loader]);

  if (!Page) return <NotFoundPage />;
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={lazyPage(() => import("@/app/page"))} />
        <Route path="lab" element={lazyPage(() => import("@/app/lab/page"))} />
        <Route path="concepts/:conceptId" element={<ConceptPageResolver />} />
        <Route
          path="writing"
          element={lazyPage(() => import("@/app/writing/page"))}
        />
        <Route
          path="writing/:slug"
          element={lazyPage(() => import("@/app/writing/writing-post-page"))}
        />
        <Route
          path="projects/:slug"
          element={lazyPage(() => import("@/app/projects/case-study-page"))}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
