interface ScenePosterProps {
  /** Ghi chú hiển thị giữa poster (mặc định: thông báo reduced-motion) */
  note?: string;
}

/**
 * Fallback tĩnh dùng chung: hiện khi user bật prefers-reduced-motion,
 * khi WebGL không khả dụng, hoặc làm placeholder trong lúc chunk three.js tải.
 * Silhouette đường kẻ ngang gợi ridgeline — trung tính đủ cho mọi concept.
 */
export function ScenePoster({
  note = "Bản xem tĩnh — thiết bị đang bật giảm chuyển động",
}: ScenePosterProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_14px,rgba(232,232,232,0.05)_14px,rgba(232,232,232,0.05)_15px)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <p className="relative z-10 max-w-xs px-4 text-center font-mono text-[11px] tracking-wide text-neutral-500">
        {note}
      </p>
    </div>
  );
}
