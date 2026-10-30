// Giờ vàng — hàm thuần. Dữ liệu từ `/gio-vang` của POS (dang_chay, bat_dau, ket_thuc, phan_tram, mon[]); "bây giờ" truyền vào (bayGio.js).
// App KHÔNG tự quyết Giờ vàng có đang giảm hay không: đúng cờ `dang_chay` của POS mới là "đang giảm". Đồng hồ chỉ dùng để đếm ngược / đổi sang "đã kết thúc".
// POS không đếm suất → không có chữ nào về suất. Khung giờ nhận cả dạng giờ đầy đủ (YYYY-MM-DDTHH:mm:ss) lẫn "HH:mm" (hợp đồng chưa ghi dạng).
import { mocTuChuoi } from './bayGio.js';

const NGAY_GIAY = 86400;

const docGio = (chuoi, homNay) => {
  const ngan = /^(\d{1,2}):(\d{2})$/.exec(String(chuoi || ''));
  return ngan ? homNay + +ngan[1] * 3600 + +ngan[2] * 60 : mocTuChuoi(chuoi) / 1000;
};

/** "2026-10-30T20:00:00" / "20:00" → "20:00"; không đọc được → "". */
export const gioPhut = (chuoi) => { const m = /(\d{1,2}):(\d{2})(?::\d{2})?\s*$/.exec(String(chuoi || '')); return m ? `${m[1].padStart(2, '0')}:${m[2]}` : ''; };

/** [bắt đầu, kết thúc] tính bằng giây (giờ VN đọc như UTC). Khung qua nửa đêm đã tính. */
function khungGio(gv, bayGiay) {
  const homNay = Math.floor(bayGiay / NGAY_GIAY) * NGAY_GIAY;
  let a = docGio(gv.bat_dau, homNay), b = docGio(gv.ket_thuc, homNay);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (b <= a) { if (bayGiay < b) a -= NGAY_GIAY; else b += NGAY_GIAY; }
  return [a, b];
}

/**
 * { pha, conLai (giây), phanTram, batDau, ketThuc } hoặc null (tắt / không % / không món / hỏng → ẨN mọi chỗ Giờ vàng).
 * pha: 'dang' (POS báo đang chạy, còn trong khung) · 'truoc' (chưa tới giờ) · 'sau' (đã hết khung) · 'cho' (tới giờ nhưng POS chưa báo — sắp hỏi lại).
 */
export function trangThaiGioVang(gv, bay) {
  if (!gv || !gv.bat_dau || !gv.ket_thuc || !(gv.phan_tram > 0) || !Array.isArray(gv.mon) || gv.mon.length === 0) return null;
  const bayGiay = mocTuChuoi(bay) / 1000;
  const khung = Number.isFinite(bayGiay) ? khungGio(gv, bayGiay) : null;
  if (!khung) return null;
  const [a, b] = khung;
  const chung = { phanTram: Math.round(gv.phan_tram), batDau: gioPhut(gv.bat_dau), ketThuc: gioPhut(gv.ket_thuc) };
  if (gv.dang_chay === true && bayGiay < b) return { pha: 'dang', conLai: b - bayGiay, ...chung };
  if (bayGiay < a) return { pha: 'truoc', conLai: a - bayGiay, ...chung };
  return { pha: bayGiay < b ? 'cho' : 'sau', conLai: 0, ...chung };
}

/** 5400 → "1:30:00". */
export function chuDemNguoc(giay) {
  const t = Math.max(0, Math.floor(giay)), p2 = (n) => String(n).padStart(2, '0');
  return `${Math.floor(t / 3600)}:${p2(Math.floor(t % 3600 / 60))}:${p2(t % 60)}`;
}

/** Chữ trạng thái (demo gvText): kieu 'tile' (ô nhóm Menu) · 'short' (ô Trang chủ, ghi chú món) · 'long' (đầu khối Giờ vàng). */
export function chuGioVang(tt, kieu) {
  if (tt.pha === 'dang') return `Còn ${kieu === 'tile' ? chuDemNguoc(tt.conLai).replace(/:\d\d$/, '') : chuDemNguoc(tt.conLai)}`;
  if (tt.pha === 'truoc') return kieu === 'tile' ? tt.batDau : kieu === 'long' ? `Mở lúc ${tt.batDau} · sau ${chuDemNguoc(tt.conLai)}` : `Mở lúc ${tt.batDau}`;
  if (tt.pha === 'cho') return 'Sắp bắt đầu';
  return 'Đã kết thúc';
}

/** Nhãn trên ô món (demo gvTag, bỏ "còn N suất"): đang → "Giờ vàng −50%"; ngoài giờ → "Giờ vàng −50% từ 20:00". */
export const chuNhanMon = (tt) => (tt.pha === 'dang' ? `Giờ vàng −${tt.phanTram}%` : `Giờ vàng −${tt.phanTram}% từ ${tt.batDau}`);

/** Mã món Giờ vàng CÓ trong menu (E4: mã không có trong menu → bỏ qua, không lỗi). */
export function maGioVang(gv, ds) {
  const mon = gv && Array.isArray(gv.mon) ? new Set(gv.mon) : new Set();
  return new Set((Array.isArray(ds) ? ds : []).map((m) => m.ma).filter((ma) => mon.has(ma)));
}
