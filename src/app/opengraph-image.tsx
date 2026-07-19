import { ImageResponse } from "next/og";
import { SITE } from "@/lib/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.title}`;

/** Đường ridgeline tĩnh cho OG — motif terrain, không cần WebGL. */
const RIDGES = [
  "M0 90 L90 82 L180 60 L270 74 L360 38 L450 52 L540 20 L630 44 L720 30 L810 58 L900 46 L990 70 L1080 62 L1200 78",
  "M0 120 L100 112 L200 96 L300 106 L400 74 L500 88 L600 58 L700 80 L800 68 L900 92 L1000 84 L1100 100 L1200 108",
  "M0 150 L110 144 L220 132 L330 140 L440 116 L550 126 L660 104 L770 120 L880 112 L990 130 L1100 124 L1200 138",
  "M0 180 L120 176 L240 168 L360 174 L480 156 L600 164 L720 148 L840 160 L960 154 L1080 168 L1200 172",
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#050505",
          padding: 80,
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="240"
          viewBox="0 0 1200 240"
          style={{ position: "absolute", top: 60, left: 0, opacity: 0.55 }}
        >
          {RIDGES.map((d, index) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={index === 1 ? "#ffb454" : "#e8e8e8"}
              strokeWidth={index === 1 ? 2.5 : 1.5}
              opacity={index === 1 ? 0.9 : 0.5}
            />
          ))}
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#ffb454",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          2016 — 2026
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 96,
            fontWeight: 700,
            color: "#f5f5f5",
            letterSpacing: -2,
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 36,
            color: "#a3a3a3",
          }}
        >
          {SITE.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 24,
            color: "#737373",
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    size,
  );
}
