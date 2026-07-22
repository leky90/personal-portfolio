/**
 * 6 ADR CÓ THẬT trong 12 năm nghề (2014 tới nay) — nguồn sự thật DUY NHẤT
 * sinh ra: hình học rail 3D, card diff DOM, và HUD chi phí.
 * 2019 ở TESO; 2021 trở đi ở Treehouse (nền tảng DeFi/RWA, sản phẩm tETH).
 * Giá nhánh bỏ viết định tính: không bịa con số đo được.
 */
export interface ArchDecision {
  id: string;
  year: number;
  title: string;
  /** Dòng + trong diff: lựa chọn đã đi */
  chosen: string;
  /** Dòng - trong diff: con đường không đi */
  rejected: string;
  /** Giá ước tính của nhánh bỏ — hiện khi materialize bóng ma */
  rejectedCost: string;
  /** Dòng # trong diff: hệ quả đo được */
  consequence: string;
  /** Nhánh ma rẽ trái hay phải trên rail */
  side: "left" | "right";
}

export const DECISIONS: ArchDecision[] = [
  {
    id: "optimize-legacy",
    year: 2019,
    title: "Rescue the legacy codebase",
    chosen: "Measure the slow paths and optimize the legacy code in place",
    rejected: "Rewrite from scratch while clients kept running the old build",
    rejectedCost: "nothing shippable for months, then one all or nothing cutover",
    consequence: "client work kept shipping while the old code got faster",
    side: "left",
  },
  {
    id: "dapp-stack",
    year: 2021,
    title: "Pick the stack for the dApp",
    chosen: "React with TypeScript and Next.js for the whole product",
    rejected: "Plain JavaScript, a different pattern per feature",
    rejectedCost: "no types on money math, every refactor done by hand",
    consequence: "on-chain shapes typed once, reused across every screen",
    side: "right",
  },
  {
    id: "ethers-boundary",
    year: 2021,
    title: "One way to talk to the chain",
    chosen: "Ethers.js as the single wallet and contract boundary",
    rejected: "Raw JSON-RPC glue written per wallet provider",
    rejectedCost: "a bespoke adapter to maintain for every new wallet",
    consequence: "adding a wallet stopped touching product code",
    side: "left",
  },
  {
    id: "onchain-read-layer",
    year: 2022,
    title: "Keep the chain out of the components",
    chosen: "A dedicated on-chain read layer, components only render",
    rejected: "Contract calls written inline in each dashboard widget",
    rejectedCost: "duplicated reads, caching and error handling per screen",
    consequence: "price, yield and TVL views share one data path",
    side: "right",
  },
  {
    id: "coding-standards",
    year: 2023,
    title: "Standards before the team grew",
    chosen: "Written front-end standards plus daily code review",
    rejected: "Let everyone keep their own style, review only on request",
    rejectedCost: "the same review notes forever, one dialect per folder",
    consequence: "eight engineers shipping into one readable codebase",
    side: "left",
  },
  {
    id: "onboarding-docs",
    year: 2024,
    title: "Onboard from docs, not from me",
    chosen: "Onboarding docs plus knowledge sharing workshops for the team",
    rejected: "Walking every new engineer through the code one on one",
    rejectedCost: "a senior pulled off delivery for each new joiner",
    consequence: "new engineers open their first PR without a shadow session",
    side: "right",
  },
];
