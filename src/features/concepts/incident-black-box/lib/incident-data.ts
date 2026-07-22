/**
 * KỊCH BẢN MINH HOẠ, KHÔNG PHẢI SỰ CỐ CÓ THẬT.
 *
 * Portfolio này không công bố dữ liệu sự cố của bất kỳ công ty hay khách hàng
 * nào (kể cả Treehouse). Những gì dưới đây là một kịch bản chung do chính chủ
 * dựng ra để minh hoạ cách đọc telemetry và thứ tự ra quyết định khi trực sự
 * cố: không tên hệ thống thật, không mốc giờ thật, không số đo thật.
 *
 * Mọi con số ở đây là số tròn của kịch bản (chọn cho dễ đọc), không phải phép
 * đo. Trục thời gian dùng offset tương đối "T+phút" thay cho giờ tường để
 * không ai nhầm nó với một dòng log có thật.
 *
 * Đây vẫn là nguồn sự thật duy nhất cho ba lớp render: băng WebGL, panel
 * annotation DOM và phần postmortem.
 */

/** Câu disclaimer bắt buộc hiển thị kèm concept này (hero + postmortem). */
export const SCENARIO_DISCLAIMER =
  "Kịch bản minh hoạ do tôi dựng, không phải sự cố có thật của Treehouse hay của bất kỳ khách hàng nào. Số liệu là số tròn của kịch bản, không phải phép đo.";

export interface IncidentMeta {
  title: string;
  sev: string;
  date: string;
  /** Độ dài kịch bản, phút. Số tròn tự đặt, không phải đo đạc. */
  durationMin: number;
  /** Từ lúc pager kêu tới lúc mitigation có hiệu lực, trong kịch bản. */
  mttrMin: number;
  /** Luôn true: nhắc mọi consumer rằng đây là dữ liệu dựng, không phải log. */
  isScenario: boolean;
  disclaimer: string;
}

export const INCIDENT: IncidentMeta = {
  title: "Kịch bản: p99 checkout leo thang trong giờ cao điểm",
  sev: "SEV-1 (kịch bản)",
  date: "Không gắn với công ty nào",
  durationMin: 60,
  mttrMin: 20,
  isScenario: true,
  disclaimer: SCENARIO_DISCLAIMER,
};

export type EventKind = "signal" | "alert" | "decision" | "deploy" | "resolve";

export interface TapeEvent {
  id: string;
  /** Vị trí trên băng [0,1] — trục thời gian của kịch bản */
  t: number;
  kind: EventKind;
  label: string;
  note: string;
}

/**
 * 13 mốc của kịch bản. Nhãn dùng offset T+phút, không phải giờ tường.
 * Cố ý không có ms, phần trăm hay số lần retry: kịch bản không cần giả vờ
 * chính xác, thứ đáng kể là trình tự ra quyết định.
 */
export const EVENTS: TapeEvent[] = [
  { id: "baseline", t: 0.05, kind: "signal", label: "T+00 nền ổn định", note: "hình dạng của một ngày bình thường, ghi lại để sau này có cái mà so" },
  { id: "early-drift", t: 0.16, kind: "signal", label: "T+05 connection pool bắt đầu trôi", note: "số kết nối giữ mỗi pod nhích lên trước khi có bất kỳ cảnh báo nào: tín hiệu đã nằm trên băng rồi" },
  { id: "cache-miss", t: 0.24, kind: "signal", label: "T+09 tỉ lệ cache hit tụt", note: "một nhóm request đi vòng qua tập cache ấm, không ai để ý vì chưa ai đau" },
  { id: "first-alert", t: 0.33, kind: "alert", label: "T+15 PAGE p99 vượt ngưỡng", note: "pager kêu sau tín hiệu đầu tiên mười phút, vì ngưỡng canh giá trị chứ không canh độ dốc" },
  { id: "sev-declared", t: 0.38, kind: "decision", label: "T+18 tuyên bố SEV-1", note: "tuyên bố sớm để thu hẹp bán kính của sự bối rối, hạ cấp sau vẫn rẻ hơn im lặng" },
  { id: "hypothesis-1", t: 0.44, kind: "decision", label: "T+22 giả thuyết: cạn connection pool", note: "hai biểu đồ đồng ý, một biểu đồ không: giữ lấy chỗ không đồng ý đó, đừng vứt" },
  { id: "mitigate-first", t: 0.5, kind: "decision", label: "T+28 chọn cầm máu trước", note: "chuyển bớt read traffic sang replica trước khi biết nguyên nhân: dừng chảy máu trước đã" },
  { id: "shed-deploy", t: 0.55, kind: "deploy", label: "T+35 mitigation có hiệu lực", note: "error rate gãy xuống ngay sau khi đổi, đủ để cả phòng thở và nghĩ tiếp" },
  { id: "root-cause", t: 0.64, kind: "decision", label: "T+41 nguyên nhân gốc: retry storm", note: "client tự thử lại khi pool timeout, không jitter, nên nó tự khuếch đại chính nó" },
  { id: "fix-deploy", t: 0.72, kind: "deploy", label: "T+47 cap retry và thêm jitter", note: "một thay đổi config nhỏ, vẫn để hai người review giữa sự cố, vì đó là lúc dễ sai nhất" },
  { id: "recovery", t: 0.81, kind: "signal", label: "T+52 p99 hạ nhiệt", note: "băng nguội dần: đường cong đi xuống và ở lại dưới" },
  { id: "steady", t: 0.88, kind: "signal", label: "T+56 về trạng thái ổn định", note: "pool utilization trở lại mức thường ngày, không ai phải canh nữa" },
  { id: "all-clear", t: 0.95, kind: "resolve", label: "T+60 all clear", note: "hết kịch bản, phần còn lại thuộc về postmortem chứ không thuộc về ca trực" },
];

export const METRIC_SAMPLES = 128;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Độ nghiêm trọng tại t [0,1] — đỉnh trong cửa sổ sự cố, nguội hai đầu. */
export function severityAt(t: number): number {
  const rise = smooth(0.28, 0.42, t);
  const fall = 1 - smooth(0.55, 0.85, t);
  return Math.min(rise, fall);
}

function smooth(edge0: number, edge1: number, x: number): number {
  const u = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return u * u * (3 - 2 * u);
}

/**
 * 3 metric × METRIC_SAMPLES mẫu [0,1], row-major theo metric:
 * hàng 0 = p99 latency, hàng 1 = error rate, hàng 2 = throughput.
 * Đường cong sinh bằng hàm, không phải dữ liệu đo: nó chỉ cần đúng HÌNH DẠNG
 * của một sự cố để người xem đọc được câu chuyện.
 */
export function buildMetrics(): Float32Array {
  const rand = mulberry32(43);
  const data = new Float32Array(3 * METRIC_SAMPLES);
  for (let i = 0; i < METRIC_SAMPLES; i += 1) {
    const t = i / (METRIC_SAMPLES - 1);
    const sev = severityAt(t);
    const noise = () => (rand() - 0.5) * 0.05;
    // p99: nền thấp, phi lên trong sự cố
    data[i] = Math.min(1, 0.18 + sev * 0.72 + noise());
    // error rate: gần 0, bùng giữa cửa sổ, gãy xuống sau mitigation (t>0.55)
    const bend = t > 0.55 ? 0.35 : 1;
    data[METRIC_SAMPLES + i] = Math.min(1, Math.max(0, 0.04 + sev * 0.85 * bend + noise()));
    // throughput: nền cao, sụt trong sự cố
    data[2 * METRIC_SAMPLES + i] = Math.min(1, Math.max(0, 0.78 - sev * 0.5 + noise()));
  }
  return data;
}
