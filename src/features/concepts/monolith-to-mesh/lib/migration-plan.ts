/**
 * Lịch sử tách khối theo 14 năm nghề thật (2012 tới nay) — nguồn sự thật sinh
 * ra thứ tự tách khối, lý do (ADR whisper khi hover) và nhịp "gộp ngược" 2021.
 * Bốn chặng có thật ánh xạ vào timeline: 2012-2016 freelance (PHP, WordPress),
 * 2017-2018 Synova (eCommerce, CMS), 2019-2021 TESO (React, dự án khách),
 * 2021 tới nay Treehouse (dApp DeFi/RWA, sản phẩm tETH).
 * 36 service, 5 ở lại core. Lý do viết định tính, không bịa số đo.
 */
export interface ServicePlan {
  id: string;
  name: string;
  /** Năm tách khỏi monolith; null = ở lại core */
  splitYear: number | null;
  /** Một dòng lý do — hiện trên HUD khi hover mảnh */
  reason: string;
}

/** Ca tách non duy nhất: ra 2018, gộp ngược 2021, ở lại core từ đó. */
export const PREMATURE_SPLIT = {
  id: "search-index",
  outYear: 2018,
  backYear: 2021,
};

const CORE_REASON = "stayed in the core: every product still stands on it";

export const SERVICES: ServicePlan[] = [
  { id: "app-shell", name: "app-shell", splitYear: null, reason: CORE_REASON },
  { id: "design-system", name: "design-system", splitYear: null, reason: CORE_REASON },
  { id: "routing", name: "routing", splitYear: null, reason: CORE_REASON },
  { id: "state-store", name: "state-store", splitYear: null, reason: CORE_REASON },
  { id: "api-client", name: "api-client", splitYear: null, reason: CORE_REASON },
  { id: "wp-theme", name: "wp-theme", splitYear: 2013, reason: "2013: client sites needed a theme layer instead of edited page copies" },
  { id: "responsive-grid", name: "responsive-grid", splitYear: 2015, reason: "2015: phone layouts outgrew the desktop stylesheet" },
  { id: "browser-shims", name: "browser-shims", splitYear: 2016, reason: "2016: cross browser fixes belong in one place, not in every page" },
  { id: "catalog", name: "catalog", splitYear: 2017, reason: "2017: product data left the page templates" },
  { id: "checkout", name: "checkout", splitYear: 2017, reason: "2017: the money path could not ship on the catalog schedule" },
  { id: "cms-admin", name: "cms-admin", splitYear: 2017, reason: "2017: editors needed a surface that was not the developer build" },
  { id: "search-index", name: "search-index", splitYear: 2018, reason: "2018: split too early, folded back in 2021 when one small team owned all of it" },
  { id: "payment-gateway", name: "payment-gateway", splitYear: 2018, reason: "2018: card and bank integrations changed on the provider clock" },
  { id: "order-flow", name: "order-flow", splitYear: 2018, reason: "2018: fulfilment rules differed per store, the cart did not" },
  { id: "media-library", name: "media-library", splitYear: 2018, reason: "2018: product images outgrew the theme folder" },
  { id: "api-integrations", name: "api-integrations", splitYear: 2018, reason: "2018: third party APIs broke on their own schedule" },
  { id: "react-spa", name: "react-spa", splitYear: 2019, reason: "2019: the client apps moved to React while the PHP views stayed" },
  { id: "admin-panel", name: "admin-panel", splitYear: 2019, reason: "2019: operators wanted their own app, not a hidden route" },
  { id: "listings", name: "listings", splitYear: 2019, reason: "2019: rental listings stopped fitting a generic product model" },
  { id: "booking", name: "booking", splitYear: 2020, reason: "2020: travel bookings carry state a shopping cart never had" },
  { id: "marketplace", name: "marketplace", splitYear: 2020, reason: "2020: produce sellers needed their own side of the app" },
  { id: "storefront", name: "storefront", splitYear: 2020, reason: "2020: the storefront had to render without the admin bundle" },
  { id: "configurator", name: "configurator", splitYear: 2020, reason: "2020: the controller configurator was a product, not a page" },
  { id: "image-pipeline", name: "image-pipeline", splitYear: 2021, reason: "2021: resizing and cropping left the request path" },
  { id: "wallet-connect", name: "wallet-connect", splitYear: 2021, reason: "2021: connecting a wallet is its own protocol surface" },
  { id: "chain-rpc", name: "chain-rpc", splitYear: 2022, reason: "2022: one RPC client, with retries and fallbacks in a single place" },
  { id: "contract-abi", name: "contract-abi", splitYear: 2022, reason: "2022: ABIs and typed bindings generated once for the whole team" },
  { id: "staking-teth", name: "staking-teth", splitYear: 2022, reason: "2022: the tETH staking flow is the product, it owns its own path" },
  { id: "portfolio-view", name: "portfolio-view", splitYear: 2022, reason: "2022: positions read from many contracts and aggregate in one view" },
  { id: "price-feed", name: "price-feed", splitYear: 2023, reason: "2023: price reads have a refresh rate nothing else needs" },
  { id: "yield-engine", name: "yield-engine", splitYear: 2023, reason: "2023: yield math gets tested on its own, far away from the UI" },
  { id: "tvl-dashboard", name: "tvl-dashboard", splitYear: 2023, reason: "2023: TVL panels aggregate reads the rest of the app never makes" },
  { id: "tx-queue", name: "tx-queue", splitYear: 2023, reason: "2023: pending transactions outlive the screen that started them" },
  { id: "realtime-stream", name: "realtime-stream", splitYear: 2024, reason: "2024: live prices arrive over sockets, not over page loads" },
  { id: "rwa-registry", name: "rwa-registry", splitYear: 2024, reason: "2024: tokenised real world assets carry metadata a plain token never did" },
  { id: "onboarding-flow", name: "onboarding-flow", splitYear: 2025, reason: "2025: first connect, first stake and first withdraw deserve their own path" },
];
