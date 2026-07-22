/**
 * Bản đồ những hệ thống mình thật sự đã dựng, từ site WordPress freelance ở
 * Huế (2014) tới dApp DeFi/RWA của Treehouse hôm nay — nguồn sự thật duy nhất
 * cho graph. Trường `year` là mốc của chặng nghề mà hệ thống thuộc về (trục x
 * = trục thời gian), không phải ngày launch chính xác của từng dự án.
 */
export interface SystemNode {
  id: string;
  name: string;
  stack: string;
  /** Dòng mô tả ngắn hiện trên HUD khi hover — định tính, không phải số bịa */
  metric: string;
  /** Năm hệ thống ra đời — trục x của graph là trục thời gian */
  year: number;
}

export const SYSTEMS: SystemNode[] = [
  // 2014–2016 · freelance ở Huế (tài khoản Freelancer.com mở 11/07/2012 thời sinh viên)
  { id: "wp-client-sites", name: "Site khách WordPress", stack: "PHP · WordPress", metric: "Freelancer 4.9/5 · 125 review", year: 2014 },
  { id: "static-frontends", name: "Frontend tĩnh cho khách", stack: "HTML · CSS · JS · jQuery", metric: "cross-browser · responsive mobile", year: 2014 },

  // 2017–2018 · Synova Solutions, TP.HCM — full-stack PHP end-to-end
  { id: "php-cms-sites", name: "Site doanh nghiệp CMS", stack: "Laravel · CakePHP · Drupal", metric: "design → web động + tích hợp API", year: 2017 },
  { id: "legacy-frameworks", name: "Dự án framework cũ", stack: "CodeIgniter · Zend · Yii", metric: "nhận và nuôi codebase có sẵn", year: 2017 },
  { id: "ecommerce-php", name: "eCommerce PHP", stack: "Magento · OpenCart", metric: "cửa hàng cho khách doanh nghiệp", year: 2018 },
  { id: "ciga-storefront", name: "Ciga.fr", stack: "eCommerce storefront", metric: "storefront bán hàng", year: 2018 },

  // 2019–2021 · TESO, Huế remote — sang JavaScript/React, bắt đầu dẫn dắt
  { id: "legacy-refactor", name: "Tối ưu codebase legacy", stack: "JavaScript · profiling", metric: "chủ trì hiệu năng + độ tin cậy", year: 2019 },
  { id: "controllermodz", name: "Controllermodz", stack: "React · eCommerce", metric: "tay cầm game tuỳ biến", year: 2019 },
  { id: "foodmap", name: "FoodMap", stack: "React · Node.js", metric: "marketplace nông sản", year: 2020 },
  { id: "native-travel", name: "Native", stack: "React · REST API", metric: "du lịch & trải nghiệm", year: 2020 },
  { id: "build-to-rent", name: "Build-to-Rent", stack: "React · Node.js · Admin", metric: "web app bất động sản + trang quản trị", year: 2021 },

  // 08/2021–nay · Treehouse (Singapore, remote) — DeFi/RWA, lead frontend
  { id: "treehouse-dapp", name: "Treehouse dApp", stack: "Next.js · TypeScript · React", metric: "DeFi/RWA · dẫn đội 8 kỹ sư", year: 2021 },
  { id: "onchain-layer", name: "Lớp on-chain", stack: "Ethers.js · ví Web3", metric: "đọc/ghi on-chain theo từng ví", year: 2022 },
  { id: "teth-dashboard", name: "Dashboard tETH", stack: "React · WebSocket", metric: "giá · yield · TVL thời gian thực", year: 2023 },
];

/**
 * Cạnh liên-cụm: hệ thống sau kế thừa nền tảng, stack hoặc kinh nghiệm của hệ
 * thống trước — đúng thứ tự nghề đã đi qua, không phải call graph runtime.
 */
export const ARCH_LINKS: [string, string][] = [
  ["static-frontends", "wp-client-sites"],
  ["php-cms-sites", "wp-client-sites"],
  ["legacy-frameworks", "php-cms-sites"],
  ["ecommerce-php", "php-cms-sites"],
  ["ciga-storefront", "ecommerce-php"],
  ["ciga-storefront", "static-frontends"],
  ["legacy-refactor", "legacy-frameworks"],
  ["controllermodz", "ecommerce-php"],
  ["controllermodz", "legacy-refactor"],
  ["foodmap", "legacy-refactor"],
  ["native-travel", "foodmap"],
  ["build-to-rent", "foodmap"],
  ["build-to-rent", "native-travel"],
  ["treehouse-dapp", "build-to-rent"],
  ["treehouse-dapp", "static-frontends"],
  ["onchain-layer", "treehouse-dapp"],
  ["teth-dashboard", "treehouse-dapp"],
  ["teth-dashboard", "onchain-layer"],
];

export function systemIndexById(id: string): number {
  const index = SYSTEMS.findIndex((system) => system.id === id);
  if (index < 0) {
    throw new Error(`Hệ thống "${id}" không tồn tại trong SYSTEMS`);
  }
  return index;
}
