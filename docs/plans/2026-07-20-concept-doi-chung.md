# Đối chứng concept — vòng chấm mù thống nhất 26 concept

> Ngày: 2026-07-20 · Phương pháp: 2 agent research web (kiểm chứng trend + prior-art) → 21 brief đầy đủ cho concept chưa build (5 concept đã build dùng brief chuẩn từ implementation) → 3 giám khảo cũ (hiring manager / graphics-perf / Awwwards) **chấm mù** cả 26 trên cùng rubric, không được xem hai bảng điểm trước đó.

## 1. Kết quả research đối chứng

**Kiểm chứng 4 nhận định trend (07/2026):** cả 4 đều CONFIRMED bằng nguồn mới —
- ASCII/dither/CRT vẫn fresh (Codrops "Efecto" 01/2026) **nhưng cửa sổ đang khép**: đã vào danh sách trend đại trà, Aceternity có component dither drop-in. Hệ quả: originality của Resolution/Compiled Light/Phosphor Lens giảm ở vòng này.
- Particle field / mouse-distortion: nay bị các guide 2026 xếp thẳng vào "AI-slop tells", nặng hơn cả "dated".
- Scroll-as-storytelling: chuẩn award-level (Awwwards SOTY 2025 Lando Norris; Bruno Simon 2025 SOTM).
- WebGPU-first + WebGL2 fallback: khuyến nghị mặc định 2026 (Safari 26 hoàn tất baseline; three/webgpu fallback zero-config).

**Câu hỏi mới — "trực quan hóa phán đoán kỹ nghệ":** cầu mạnh, cung mỏng, gap thật. Phía tuyển dụng chủ động đòi ADR/RFC/incident review ("real technical leadership leaves a trail" — Howdy; "decisions, not just tasks" — unicorn.io); ADR "having a comeback"; nhưng chưa có portfolio nổi bật nào biến nó thành centerpiece thị giác.

**Prior-art 8 concept mới:** Decision Diff **FRESH (whitespace mạnh nhất)**; Cost of Change fresh về thực thi; Incident Black Box / Maintenance Archaeology / Leverage Engine / Knowledge Relay / Monolith to Mesh: adjacent-exists; Constraint Prism **well-trodden về thị giác** (sẽ bị đọc là "another glass refraction demo").

## 2. Bảng xếp hạng thống nhất (chấm mù, cùng rubric)

Xem bảng sống tại `/lab` (nguồn: `src/features/concepts/registry.ts`). Top 10:

| # | Concept | Overall | Ghi chú đối chứng |
|---|---|---|---|
| 1 | Decision Diff (v2) | 8.7 | #1 ở cả bảng người dùng đưa (9.0) lẫn vòng mù → hội tụ 2 hội đồng độc lập; top-5 của cả 3 giám khảo |
| 2 | Monolith to Mesh (v2) | 8.7 | #1 của giám khảo feasibility + taste |
| 3 | Incident Black Box (v2) | 8.3 | top-5 cả 3 giám khảo |
| 4 | Ten Years of Terrain (v1, ĐÃ BUILD) | 8.0 | đứng đầu nhóm đã build; feasibility cao nhất bảng (9.0) |
| 5 | Maintenance Archaeology (v2) | 8.0 | senior-signal 9.0; effort thật ~12d |
| 6 | Request Lifecycle (v1) | 8.0 | feasibility lên 7.0 nhờ brief scoped-down trung thực (v1: 3.0) |
| 7 | Cost of Change (v2) | 7.7 | |
| 8 | The Daily Driver (v1) | 7.7 | |
| 9 | Constraint Prism (v2) | 7.3 | rủi ro look-alike cao nhất (glass demo) |
| 10 | Leverage Engine (v2) | 7.0 | |

**Biến động đáng chú ý so với 2 bảng trước:**
- Họ "phán đoán" (v2) chiếm 5/8 vị trí đầu — khớp research gap.
- **Resolution 7.7 → 6.7** và Compiled Light 7.3 → 5.7: trả giá cho việc ASCII đại trà hóa (originality 5.0/4.7).
- Terrain giữ vững top nhóm build được ngay; quyết định art direction hiện tại **không cần đảo**.
- Request Lifecycle: hai vòng trước chết vì feasibility (3.0/4.2) — vòng này brief scoped-down đưa lên 7.0; bài học: feasibility là thuộc tính của SPEC, không phải của Ý TƯỞNG.
- Đuôi bảng ổn định qua cả 3 vòng chấm: Galaxy/Lanyard/Signal-From-Noise — tín hiệu hội tụ tin được.

**Caveat thang đo:** điểm vòng mù chấm khắt hơn bảng v2 của người dùng (không so chéo tuyệt đối giữa các bảng; trong MỘT bảng thì so được).

## 3. Trạng thái lab

`/lab` giờ chứa đủ **26 concept**: 5 `ready` (đã build demo, giữ nguyên) + 21 `planned` (brief đầy đủ lưu trong output workflow, hàng không link + sketch placeholder). Trường `origin` đánh dấu v1/v2. Thứ tự build đề xuất theo rank: **Decision Diff + Monolith to Mesh** (batch kế tiếp), rồi Incident Black Box + Maintenance Archaeology, v.v.

## 4. Gợi ý chiến lược (không đổi so với khuyến nghị trước)

Terrain vẫn là art direction của site chính — hợp lệ theo mọi bảng. Họ "phán đoán" nên vào site qua **khung nội dung** (case study viết theo Decision Diff; writing theo Incident Black Box) và các concept top có thể được build làm demo lab để cân nhắc nâng cấp art direction sau khi thấy tận mắt.
