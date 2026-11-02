// Đặt đơn (KH-MUA-1b, hợp đồng v5): dựng thân yêu cầu, đọc trả lời, luật lỗi, vòng gửi lại, ghi nhớ lần gửi chưa rõ — MỌI tên trường đặt đơn ở MỘT chỗ này.
// Gọi mạng qua api.js. App KHÔNG tính tiền: tạm tính / giảm / tổng / ví giữ / QR còn lại lấy NGUYÊN từ POS.
// Cờ DAT_ONLINE (noiDung/caiDat.js) là công tắc tắt khẩn: tắt → không gọi cửa ghi nào, nút đặt hiện CHU_CHUA_MO.
import { DAT_ONLINE } from './noiDung/caiDat.js';
import { baoGiaGio, datDonApp, huyDonApp, layChiTietDon } from './api.js';
import { mocTuChuoi } from './bayGio.js';

export const CHU_CHUA_MO = 'Đặt online sắp mở — mời bạn đặt tại quầy';
const canMo = (f) => (...a) => (DAT_ONLINE ? f(...a) : Promise.reject(Object.assign(new Error(CHU_CHUA_MO), { code: 'CHUA_MO' })));

const so = (n) => typeof n === 'number' && Number.isFinite(n);
const chu = (s) => String(s || '').trim();

/** Thân `POST /gio/bao-gia`: mon[] { ma, so_luong, ghi_chu? }, ma_giam (khi có), cach_nhan "tai_quan" (giao tận nơi: KH-MUA-2). Không gửi giá. */
export function thanBaoGia(gio, { maGiam } = {}) {
  const t = { mon: gio.map(({ ma, so_luong, ghi_chu }) => (chu(ghi_chu) ? { ma, so_luong, ghi_chu } : { ma, so_luong })) };
  if (chu(maGiam)) t.ma_giam = chu(maGiam);
  t.cach_nhan = 'tai_quan';
  return t;
}

const CACH_TRA = ['qr', 'vi', 'vi_qr'];
/** Thân `POST /don`: thân báo giá + cach_tra + khoa_gui + tong_da_xem (= `tong` của báo giá đang hiện); `pin` CHỈ khi vi / vi_qr (không lưu ở đâu). */
export function thanDatDon(gio, tuy, { cachTra, pin, khoaGui, tongDaXem } = {}) {
  const t = { ...thanBaoGia(gio, tuy), cach_tra: CACH_TRA.includes(cachTra) ? cachTra : 'qr', khoa_gui: khoaGui, tong_da_xem: tongDaXem };
  if (t.cach_tra !== 'qr') t.pin = pin;
  return t;
}

/** Khoá gửi mới (16–64 ký tự A-Z a-z 0-9 -): randomUUID, máy cũ thì 32 số hex từ getRandomValues. Mỗi lần khách BẤM đặt một khoá. */
export function taoKhoaGui(cr = globalThis.crypto) {
  if (cr && typeof cr.randomUUID === 'function') return cr.randomUUID();
  return Array.from(cr.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Trả lời báo giá → { tamTinh, giam[] { loai, soTien }, phiGiao, tong, maGiamLoi { code, error } | null }. Không có `tong` là số → null. */
export function docBaoGia(r) {
  if (!r || !so(r.tong)) return null;
  const ml = r.ma_giam_loi;
  return {
    tamTinh: so(r.tam_tinh) ? r.tam_tinh : null,
    giam: (Array.isArray(r.giam) ? r.giam : []).filter((g) => g && so(g.so_tien)).map((g) => ({ loai: chu(g.loai), soTien: g.so_tien })),
    phiGiao: so(r.phi_giao) ? r.phi_giao : null,
    tong: r.tong,
    maGiamLoi: ml && chu(ml.error) ? { code: chu(ml.code), error: chu(ml.error) } : null,
  };
}

/** Tên dòng giảm theo demo (checkout "Giảm giá (voucher)", giỏ "Ưu đãi hạng …", nhãn "Giờ vàng"); loại lạ → "Giảm giá". */
export function tenGiam(loai, tenHang) {
  if (loai === 'ma_giam') return 'Giảm giá (voucher)';
  if (loai === 'hang') return chu(tenHang) ? `Ưu đãi hạng ${chu(tenHang)}` : 'Ưu đãi hạng';
  if (loai === 'gio_vang') return 'Giờ vàng';
  return 'Giảm giá';
}

const docQR = (q) => (q && chu(q.chuoi) ? { chuoi: String(q.chuoi), hetHan: chu(q.het_han) } : null);

/** Trả lời `POST /don` → { ma, tong, giuVi, conLai, tienTrinh, qr, trung }; thiếu ma_don → null (= "chưa rõ"). */
export function docDatDon(r) {
  if (!r || !chu(r.ma_don)) return null;
  return {
    ma: String(r.ma_don), tong: so(r.tong) ? r.tong : null, giuVi: so(r.giu_vi) ? r.giu_vi : null, conLai: so(r.con_lai) ? r.con_lai : null,
    tienTrinh: chu(r.tien_trinh), qr: docQR(r.qr), trung: r.trung === true,
  };
}

/** Trả lời `GET /don/:ma` → { ma, ngay, tong, tienTrinh, qr, thanhToan, tienVeChoDoiSoat, mon[] }. Bước đơn chỉ đọc `tien_trinh`. */
export function docDon(r) {
  const d = r && r.don;
  if (!d || !chu(d.ma)) return null;
  const mon = (Array.isArray(d.mon) ? d.mon : []).map((m) => ({ ma: chu(m.ma), ten: chu(m.ten), so_luong: m.so_luong, thanh_tien: m.thanh_tien, ghi_chu: chu(m.ghi_chu) }));
  return {
    ma: String(d.ma), ngay: chu(d.ngay), tong: so(d.tong) ? d.tong : null, tienTrinh: chu(d.tien_trinh), qr: docQR(d.qr),
    thanhToan: d.thanh_toan == null ? null : d.thanh_toan, tienVeChoDoiSoat: d.tien_ve_cho_doi_soat === true, mon,
  };
}

export const baoGia = canMo((than) => baoGiaGio(than).then(docBaoGia));
export const xemDon = (ma) => layChiTietDon(ma).then(docDon);
export const huyDon = canMo((ma) => huyDonApp(ma));

/**
 * Luật 4xx của hợp đồng v5: MỌI trả lời 4xx CÓ `code` = chắc chắn chưa tạo đơn, chưa giữ / trừ ví → 'chua_tao' (khách sửa rồi bấm lại, khoá mới).
 * Còn lại — mất mạng / hết giờ chờ (status 0), 5xx, 4xx không code, 200 thiếu mã đơn — → 'khong_biet' (đơn CÓ THỂ đã tạo).
 */
export function loaiLoi(e) {
  if (e && e.code === 'CHUA_MO') return 'chua_tao';
  return e && e.status >= 400 && e.status < 500 && e.code ? 'chua_tao' : 'khong_biet';
}

const MS_GUI_LAI = 2000;  // chờ giữa hai lần tự gửi lại
const LAN_GUI_LAI = 3;    // "chưa rõ" thường: tự gửi lại tối đa ngần này lần
const LAN_DANG_XU_LY = 30; // DANG_XU_LY: gửi lại tới khoảng 1 phút (30 × 2 giây) như hợp đồng v5
const choThat = (ms) => new Promise((x) => setTimeout(x, ms));
export const CHU_CHUA_RO = 'Chưa rõ quán đã nhận đơn chưa.';

/**
 * Gửi `POST /don` an toàn: MỌI lần gửi dùng ĐÚNG đối tượng `than` (cùng khoa_gui, cùng thân, cùng PIN trong bộ nhớ của lần gọi này).
 * Nhận đơn (kể cả trung) → trả đơn; 'chua_tao' → ném lỗi POS; 'khong_biet' → chờ ~2 giây gửi lại; hết lượt → ném { code: 'KHONG_BIET' }.
 */
export async function guiDonAnToan(than, { gui = canMo(datDonApp), cho = choThat, khiGuiLai = () => {} } = {}) {
  let lan = 0, lanXuLy = 0;
  for (;;) {
    let loi;
    try {
      const don = docDatDon(await gui(than));
      if (don) return don;
      loi = { status: 200 };
    } catch (e) { loi = e; }
    if (loaiLoi(loi) === 'chua_tao') throw loi;
    const xuLy = loi.code === 'DANG_XU_LY';
    if (xuLy ? ++lanXuLy > LAN_DANG_XU_LY : ++lan > LAN_GUI_LAI) throw Object.assign(new Error(CHU_CHUA_RO), { code: 'KHONG_BIET' });
    khiGuiLai();
    await cho(MS_GUI_LAI);
  }
}

/** Cách trả được chọn theo số dư /toi mới và tổng báo giá: ví đủ → vi; 0 < dư < tổng → vi_qr. Số thật (giu_vi, con_lai) do POS trả. */
export function cachTraDuoc(tong, soDu) {
  const co = so(tong) && so(soDu);
  return { vi: co && soDu >= tong, viQr: co && soDu > 0 && soDu < tong };
}

/** Ví còn thiếu bao nhiêu so với tổng POS báo (0 = đủ). Thiếu số → null. */
export const viThieu = (tong, soDu) => (so(tong) && so(soDu) ? Math.max(0, tong - soDu) : null);

// Ghi nhớ lần gửi (D3): `kh_don_gui` = { khoa_gui, than KHÔNG pin, cach_tra, luc } ghi TRƯỚC lần gửi đầu; nhận đơn → thêm ma_don, giu_vi, con_lai
// (đúng số POS trả, để tải lại trên cùng máy vẫn hiện dòng ví + QR); chắc chưa tạo → xoá. Còn bản ghi mà chưa có ma_don = "chưa rõ" → chặn đặt mới.
export const KHOA_DON_GUI = 'kh_don_gui';
const NGAY_MS = 24 * 3600 * 1000; // POS nhớ khoá gửi 24 giờ
const khoMay = () => localStorage;
const layKho = (k) => (typeof k === 'function' ? k() : k);

/** Bản ghi từ thân vừa dựng — bỏ `pin`. */
export function banGhiGui(than, luc = Date.now()) {
  const { pin, ...con } = than;
  return { khoa_gui: than.khoa_gui, than: con, cach_tra: than.cach_tra, luc };
}
// Kho bị chặn (cửa sổ riêng tư…): bản ghi vẫn giữ trong BỘ NHỚ TRANG để "chưa rõ" còn chặn đặt mới — ghi vẫn trả false (không báo đã lưu).
let banGhiBoNho = null;
const quaHanLuc = (g, bay) => ({ ...g, quaHan: !(bay - g.luc < NGAY_MS) });

/** Đọc bản ghi (+ quaHan: quá 24 giờ). Không có / hỏng → null; kho chặn → bản trong bộ nhớ trang. */
export function docGuiDo(k = khoMay, bay = Date.now()) {
  let tho;
  try { tho = layKho(k).getItem(KHOA_DON_GUI); } catch { return banGhiBoNho && quaHanLuc(banGhiBoNho, bay); }
  try {
    const g = JSON.parse(tho);
    return g && chu(g.khoa_gui) && g.than ? quaHanLuc(g, bay) : null;
  } catch { return null; }
}
/** Ghi bản ghi; null = xoá. Kho chặn → false (không báo đã lưu), bản ghi giữ trong bộ nhớ trang. */
export function ghiGuiDo(g, k = khoMay) {
  const con = g ? (({ quaHan, ...x }) => x)(g) : null;
  banGhiBoNho = con;
  try {
    if (con) layKho(k).setItem(KHOA_DON_GUI, JSON.stringify(con)); else layKho(k).removeItem(KHOA_DON_GUI);
    return true;
  } catch { return false; }
}

/** Thẻ đơn ở Lịch sử mở Theo dõi đơn khi đơn App còn đang chạy; xong / huỷ / bill quầy → Chi tiết đơn. */
export const moTheoDoi = (tt) => ['cho_tra', 'da_tra', 'dang_lam'].includes(tt);

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

/** Một lần bấm = một lần gửi: đang gửi (kể cả đang tự gửi lại) thì lần bấm sau trả null, không gọi thêm. */
export function khoaGui(f) {
  let dang = false;
  return (...a) => {
    if (dang) return null;
    dang = true;
    return Promise.resolve().then(() => f(...a)).finally(() => { dang = false; });
  };
}
