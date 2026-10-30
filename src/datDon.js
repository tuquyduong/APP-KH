// Cổng đặt đơn (KH-MUA-1): dựng thân yêu cầu, đọc trả lời — MỌI tên trường / đường dẫn cửa đặt đơn ở MỘT chỗ này.
// Tên cửa theo bản DỰ KIẾN của POS (thiet_ke/trao_doi/TRA_LOI_POS_31102026.md mục 3); hợp đồng /api/kh chưa có các cửa này nên api.js CHƯA có hàm gọi.
// Gọi mạng qua MỘT hàm tiêm vào `datCongDatDon(fn)`, fn(phuongThuc, duong, than) → Promise (cùng dạng `goi` của api.js). KH-MUA-1b: thêm cửa vào
// api.js, tiêm, bật cờ DAT_ONLINE. App KHÔNG tính tiền: tạm tính / giảm / phí / tổng lấy NGUYÊN từ POS.
import { DAT_ONLINE } from './noiDung/caiDat.js';
import { mocTuChuoi } from './bayGio.js';

export const CHU_CHUA_MO = 'Đặt online sắp mở — mời bạn đặt tại quầy';
export const DUONG_DAT_DON = {
  baoGia: '/gio/bao-gia',
  don: '/don',
  xem: (ma) => `/don/${encodeURIComponent(ma)}`,
  huy: (ma) => `/don/${encodeURIComponent(ma)}/huy`,
};

let cong = null;
export const datCongDatDon = (fn) => { cong = fn; };

function goiCong(phuongThuc, duong, than) {
  if (!DAT_ONLINE || !cong) {
    const e = new Error(CHU_CHUA_MO); e.code = 'CHUA_MO';
    return Promise.reject(e);
  }
  return cong(phuongThuc, duong, than);
}

const so = (n) => typeof n === 'number' && Number.isFinite(n);
const chu = (s) => String(s || '').trim();

/** Thân `POST /gio/bao-gia`: mon[] { ma, so_luong, ghi_chu }, ma_giam (khi có), cach_nhan, dia_chi (chỉ khi giao). Không gửi giá. */
export function thanBaoGia(gio, { maGiam, cachNhan, diaChi } = {}) {
  const t = { mon: gio.map(({ ma, so_luong, ghi_chu }) => ({ ma, so_luong, ghi_chu })) };
  if (chu(maGiam)) t.ma_giam = chu(maGiam);
  t.cach_nhan = cachNhan === 'giao' ? 'giao' : 'tai_quan';
  if (t.cach_nhan === 'giao' && chu(diaChi)) t.dia_chi = chu(diaChi);
  return t;
}

/** Thân `POST /don`: thân báo giá + cach_tra ("qr" | "vi"); `pin` CHỈ khi trả ví (không lưu ở đâu). */
export function thanDatDon(gio, tuy, { cachTra, pin } = {}) {
  const t = { ...thanBaoGia(gio, tuy), cach_tra: cachTra === 'vi' ? 'vi' : 'qr' };
  if (t.cach_tra === 'vi') t.pin = pin;
  return t;
}

/** Trả lời báo giá → { tamTinh, giam[] { loai, soTien }, phiGiao, tong }. Không có `tong` là số → null (không hiện tổng). */
export function docBaoGia(r) {
  if (!r || !so(r.tong)) return null;
  return {
    tamTinh: so(r.tam_tinh) ? r.tam_tinh : null,
    giam: (Array.isArray(r.giam) ? r.giam : []).filter((g) => g && so(g.so_tien)).map((g) => ({ loai: chu(g.loai), soTien: g.so_tien })),
    phiGiao: so(r.phi_giao) ? r.phi_giao : null,
    tong: r.tong,
  };
}

/** Trả lời `POST /don` → { ma, tong, trangThai, qr { chuoi, hetHan } | null }; thiếu mã đơn → null. */
export function docDatDon(r) {
  if (!r || !chu(r.ma_don)) return null;
  const qr = r.qr && chu(r.qr.chuoi) ? { chuoi: String(r.qr.chuoi), hetHan: chu(r.qr.het_han) } : null;
  return { ma: String(r.ma_don), tong: so(r.tong) ? r.tong : null, trangThai: chu(r.trang_thai), qr };
}

/** Trả lời `GET /don/:ma` → { ma, ngay, tong, tienTrinh, mon[] { ma, ten, so_luong, thanh_tien, ghi_chu } }. */
export function docDon(r) {
  const d = r && r.don;
  if (!d || !chu(d.ma)) return null;
  const mon = (Array.isArray(d.mon) ? d.mon : []).map((m) => ({ ma: chu(m.ma), ten: chu(m.ten), so_luong: m.so_luong, thanh_tien: m.thanh_tien, ghi_chu: chu(m.ghi_chu) }));
  return { ma: String(d.ma), ngay: chu(d.ngay), tong: so(d.tong) ? d.tong : null, tienTrinh: chu(d.tien_trinh), mon };
}

export const baoGia = (than) => goiCong('POST', DUONG_DAT_DON.baoGia, than).then(docBaoGia);
export const taoDon = (than) => goiCong('POST', DUONG_DAT_DON.don, than).then(docDatDon);
export const xemDon = (ma) => goiCong('GET', DUONG_DAT_DON.xem(ma)).then(docDon);
export const huyDon = (ma) => goiCong('POST', DUONG_DAT_DON.huy(ma));

/** Ví còn thiếu bao nhiêu so với tổng POS báo (0 = đủ). Thiếu số → null (không cho chọn ví). */
export const viThieu = (tong, soDu) => (so(tong) && so(soDu) ? Math.max(0, tong - soDu) : null);

/** Chặn đặt biết trước theo /gio-hoat-dong: ngừng nhận đơn / quán đóng → câu hiện cho khách; được đặt / chưa biết → ''. POS vẫn là bên chặn. */
export function chanDat(gh) {
  if (!gh || (gh.nhan_don !== false && gh.dang_mo !== false)) return '';
  return chu(gh.thong_bao) || 'Quán đang ngoài giờ nhận đơn online.';
}

/** Giây còn lại của mã QR: het_han và "bây giờ" đều là giờ VN của POS. Không đọc được → null. */
export function conLaiQR(hetHan, bayGioChuoi) {
  const a = mocTuChuoi(hetHan), b = mocTuChuoi(bayGioChuoi);
  return Number.isFinite(a) && Number.isFinite(b) ? Math.max(0, Math.round((a - b) / 1000)) : null;
}

// Các bước theo dõi đơn (`tien_trinh` của GET /don/:ma). Giao tận nơi (KH-MUA-2) có bước giao.
const BUOC = {
  cho_tra: { t: 'Chờ thanh toán', ic: 'qr' },
  da_tra: { t: 'Đã thanh toán', ic: 'check' },
  dang_lam: { t: 'Quán đang pha chế', ic: 'cat-coffee' },
  xong: { t: 'Sẵn sàng — mời bạn ra quầy nhận', s: 'Đọc số đơn cho nhân viên', ic: 'bell' },
  dang_giao: { t: 'Đang giao đến bạn', ic: 'package' },
  da_giao: { t: 'Đã giao thành công', ic: 'flag' },
  da_huy: { t: 'Đã huỷ', ic: 'close' },
};
const TAI_QUAN = ['cho_tra', 'da_tra', 'dang_lam', 'xong'];
const GIAO = ['cho_tra', 'da_tra', 'dang_lam', 'dang_giao', 'da_giao'];
const KET_THUC = ['xong', 'da_giao', 'da_huy'];
const DA_XONG = ['da_tra', 'xong', 'da_giao']; // trạng thái là "đã làm xong bước đó" (khác "đang làm": cho_tra, dang_lam, dang_giao)

/** { ds[] { ma, t, s, ic }, hien, xongBuocHien } — `hien` = chỉ số bước đang ở; `xongBuocHien` = bước đó đã xong. */
export function buocTienTrinh(tt) {
  const ma = tt === 'da_huy' ? ['da_huy'] : GIAO.slice(3).includes(tt) ? GIAO : TAI_QUAN;
  return { ds: ma.map((m) => ({ ma: m, ...BUOC[m] })), hien: Math.max(0, ma.indexOf(tt)), xongBuocHien: DA_XONG.includes(tt) };
}
export const xongChua = (tt) => KET_THUC.includes(tt);

/** "Đặt lại" một đơn cũ: món có `ma` còn trong menu → dòng giỏ; còn lại đếm `boQua`. */
export function monDatLai(don, ds) {
  const them = [];
  let boQua = 0;
  ((don && don.mon) || []).forEach((m) => {
    if (m.ma && (ds || []).some((x) => x.ma === m.ma) && Number.isInteger(m.so_luong) && m.so_luong > 0) them.push({ ma: m.ma, so_luong: m.so_luong, ghi_chu: chu(m.ghi_chu) });
    else boQua++;
  });
  return { them, boQua };
}

/** Gộp: nhiều lần gọi liền trong `ms` → chỉ chạy lần cuối (hỏi báo giá ≤ 1 lần / 600 ms). */
export function taoGop(ms) {
  let h = null;
  const gop = (f) => { clearTimeout(h); h = setTimeout(f, ms); };
  gop.huy = () => clearTimeout(h);
  return gop;
}

/** Một lần bấm = một lần gửi: đang gửi thì lần bấm sau trả null, không gọi lại. Lỗi (kể cả mất mạng) không tự gửi lại. */
export function khoaGui(f) {
  let dang = false;
  return (...a) => {
    if (dang) return null;
    dang = true;
    return Promise.resolve().then(() => f(...a)).finally(() => { dang = false; });
  };
}
