export interface CoverProject {
  id: string;
  title: string;
  role: string;
  /** Hue HSL [0, 360) cho texture nguồn procedural của cover */
  hue: number;
}

/** 3 case study giả cho hàng SELECTED WORK — thay bằng project thật sau. */
export const COVER_PROJECTS: CoverProject[] = [
  {
    id: "atlas",
    title: "Atlas Platform",
    role: "Lead Engineer · 2021—2024",
    hue: 210,
  },
  {
    id: "pulse",
    title: "Pulse Analytics",
    role: "Staff Engineer · 2019—2021",
    hue: 24,
  },
  {
    id: "relay",
    title: "Relay Payments",
    role: "Senior Engineer · 2017—2019",
    hue: 152,
  },
];
