// Đặt đơn (KH-MUA-1b, hợp đồng v5; KH-MUA-1c theo v9): dựng thân yêu cầu, đọc trả lời, luật lỗi, vòng gửi lại, ghi nhớ lần gửi chưa rõ — MỌI tên trường đặt đơn ở MỘT chỗ này.
// Gọi mạng qua api.js. App KHÔNG tính tiền: tạm tính / giảm / tổng / ví giữ / QR còn lại lấy NGUYÊN từ POS.
// Cờ DAT_ONLINE (noiDung/caiDat.js) là công tắc tắt khẩn: tắt → không gọi cửa ghi nào, nút đặt hiện câu `loi.CHUA_MO` (danh mục nội dung).
import { DAT_ONLINE } from './noiDung/caiDat.js';
import { baoGiaGio, datDonApp, huyDonApp, layChiTietDon } from './api.js';
import { mocTuChuoi } from './bayGio.js';
import { cauTienVe } from './hoaDon.js';
import { nd } from './noiDung/nd.js';
import { laThe, coDoUong } from './gio.js';

const canMo = (f) => (...a) => (DAT_ONLINE ? f(...a) : Promise.reject(Object.assign(new Error(nd('loi.CHUA_MO')), { code: 'CHUA_MO' })));

const so = (n) => typeof n === 'number' && Number.isFinite(n);
const chu = (s) => String(s || '').trim();

/** Một dòng giỏ → dòng thân: thẻ ĐÚNG { loai, hang_id, so_thang } (v13 — không ma / ghi chú / giá / số lượng); món { ma, so_luong, ghi_chu? } KHÔNG có `loai`. */
const dongGui = (d) => (laThe(d) ? { loai: 'the', hang_id: d.hang_id, so_thang: d.so_thang } : chu(d.ghi_chu) ? { ma: d.ma, so_luong: d.so_luong, ghi_chu: d.ghi_chu } : { ma: d.ma, so_luong: d.so_luong });

/** Thân `POST /gio/bao-gia`: mon[] (dongGui, giữ thứ tự giỏ), ma_giam (khi có), cach_nhan "tai_quan" (giao tận nơi: KH-MUA-2). Không gửi giá. */
export function thanBaoGia(gio, { maGiam } = {}) {
  const t = { mon: gio.map(dongGui) };
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
  if (loai === 'ma_giam') return nd('giam.voucher');
  if (loai === 'hang') return chu(tenHang) ? nd('giam.hang', { hang: chu(tenHang) }) : nd('giam.hangTron');
  if (loai === 'gio_vang') return nd('giam.gioVang');
  return nd('giam.chung');
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

/**
 * Trả lời `GET /don/:ma` → { ma, soHd, ngay, tong, tienTrinh, qr, thanhToan, tienVeChoDoiSoat, cauTienVe, mon[], cachTra, giuVi, conLai }. Bước đơn chỉ đọc `tien_trinh`.
 * v7: `cach_tra` / `giu_vi` / `con_lai` — POS cũ chưa trả → cachTra undefined (màn dùng bản ghi trên máy); đơn quầy / giá trị lạ → null.
 */
export function docDon(r) {
  const d = r && r.don;
  if (!d || !chu(d.ma)) return null;
  const mon = (Array.isArray(d.mon) ? d.mon : []).map((m) => ({ ma: chu(m.ma), ten: chu(m.ten), so_luong: m.so_luong, thanh_tien: m.thanh_tien, ghi_chu: chu(m.ghi_chu), loai: chu(m.loai) }));
  return {
    ma: String(d.ma), soHd: chu(d.so_hd) || null, cauTienVe: cauTienVe(d), ngay: chu(d.ngay), tong: so(d.tong) ? d.tong : null, tienTrinh: chu(d.tien_trinh), qr: docQR(d.qr),
    thanhToan: d.thanh_toan == null ? null : d.thanh_toan, tienVeChoDoiSoat: d.tien_ve_cho_doi_soat === true, mon,
    cachTra: d.cach_tra === undefined ? undefined : CACH_TRA.includes(d.cach_tra) ? d.cach_tra : null,
    giuVi: so(d.giu_vi) ? d.giu_vi : null, conLai: so(d.con_lai) ? d.con_lai : null,
  };
}

export const baoGia = canMo((than) => baoGiaGio(than).then(docBaoGia));
export const xemDon = (ma) => layChiTietDon(ma).then(docDon);
export const huyDon = canMo((ma) => huyDonApp(ma));

// Luật lỗi `POST /don` — MỘT chỗ (hợp đồng v9 dòng 99–116 + code POS datDon; chủ quán duyệt 05.11):
//  'chua_tao'   4xx CÓ code mà POS trả TRƯỚC khi tạo phiên (PIN, giá đổi, hết hàng, ngoài giờ, 429…) → khách sửa rồi bấm lại (khoá mới).
//  'khong_biet' đơn CÓ THỂ đã tạo, tự gửi lại CÙNG khoá + thân: mất mạng / hết giờ chờ (status 0), 5xx, 4xx không code, 200 thiếu mã đơn,
//               và mã trong LUOT_GUI_LAI (KHO_BAN: POS có thể đã trừ ví rồi mới báo kho bận).
//  'dung'       đơn CÓ THỂ đã tạo, KHÔNG tự gửi lại: 401 (lớp xác thực trả TRƯỚC khi tra khoá — đăng nhập lại rồi "Gửi lại đúng đơn này"),
//               KHOA_GUI_DA_DUNG (khoá đã dùng / quá 24 giờ — mời xem Lịch sử đơn).
const MS_GUI_LAI = 2000;  // chờ giữa hai lần tự gửi lại
const LAN_GUI_LAI = 3;    // "chưa rõ" thường: tự gửi lại tối đa ngần này lần
// Mã POS hẹn "gửi lại cùng khoá" → tự gửi lại tối đa ngần này lần: DANG_XU_LY ≈ 1 phút (không tính lượt); KHO_BAN 8 lần ≈ 16 giây (CÓ tính lượt,
// 1 + 8 = 9 lần dưới trần 10 lần / 10 phút của POS).
const LUOT_GUI_LAI = { DANG_XU_LY: 30, KHO_BAN: 8 };
const MA_DUNG = ['KHOA_GUI_DA_DUNG'];
// Mã chặn mua thẻ (v13, 400 — trả TRƯỚC khi tạo đơn → loaiLoi 'chua_tao'): Thanh toán thẻ hiện nguyên lời POS, khoá nút, mời về Hạng thành viên.
export const MA_THE = ['NHIEU_THE', 'HANG_CHI_CAP', 'GOI_HANG_KHONG_BAN', 'DA_CO_HANG_CAO_HON'];
export const laLoiThe = (e) => !!e && MA_THE.includes(e.code);

export function loaiLoi(e) {
  if (e && e.code === 'CHUA_MO') return 'chua_tao';
  if (e && (e.status === 401 || MA_DUNG.includes(e.code))) return 'dung';
  return e && e.status >= 400 && e.status < 500 && e.code && !LUOT_GUI_LAI[e.code] ? 'chua_tao' : 'khong_biet';
}
const choThat = (ms) => new Promise((x) => setTimeout(x, ms));

/**
 * Gửi `POST /don` an toàn: MỌI lần gửi dùng ĐÚNG đối tượng `than` (cùng khoa_gui, cùng thân, cùng PIN trong bộ nhớ của lần gọi này).
 * Nhận đơn (kể cả trung) → trả đơn; 'chua_tao' ở lần gửi ĐẦU → ném lỗi POS; 'khong_biet' → chờ ~2 giây gửi lại (đếm lượt theo mã);
 * còn lại → ném { code: 'KHONG_BIET', goc: mã POS } (người gọi GIỮ bản ghi): 'dung', hết lượt, và 4xx đến SAU một lần chưa rõ — chuỗi đã có lần
 * POS có thể chạy dở nên 4xx sau đó không chứng minh chưa tạo (chủ quán 05.11).
 */
export async function guiDonAnToan(than, { gui = canMo(datDonApp), cho = choThat, khiGuiLai = () => {} } = {}) {
  const dem = {};
  for (let lan = 0; ; lan++) {
    let loi;
    try {
      const don = docDatDon(await gui(than));
      if (don) return don;
      loi = { status: 200 };
    } catch (e) { loi = e; }
    const loai = loaiLoi(loi);
    if (loai === 'chua_tao' && lan === 0) throw loi;
    const nhom = LUOT_GUI_LAI[loi.code] ? loi.code : '';
    dem[nhom] = (dem[nhom] || 0) + 1;
    if (loai !== 'khong_biet' || dem[nhom] > (LUOT_GUI_LAI[nhom] || LAN_GUI_LAI)) throw Object.assign(new Error(nd('loi.CHUA_RO')), { code: 'KHONG_BIET', goc: loi.code });
    khiGuiLai();
    await cho(MS_GUI_LAI);
  }
}

/**
 * Đơn sắp gửi có được dùng ví không — MỘT luật (chủ quán 14.11: thẻ hạng không trả bằng số dư — tiền nạp có thưởng): đơn có dòng thẻ → KHÔNG BAO GIỜ
 * (kể cả công tắc nhớ `kh_dung_vi` đang bật) → cách trả 'qr'; đơn đồ uống → theo công tắc (`congTac`) như cũ.
 */
export const dungViCho = (gio, congTac) => !!congTac && !gio.some(laThe);

/** Cách trả được chọn theo số dư /toi mới và tổng báo giá: ví đủ → vi; 0 < dư < tổng → vi_qr. Số thật (giu_vi, con_lai) do POS trả. */
export function cachTraDuoc(tong, soDu) {
  const co = so(tong) && so(soDu);
  return { vi: co && soDu >= tong, viQr: co && soDu > 0 && soDu < tong };
}

/** Ví còn thiếu bao nhiêu so với tổng POS báo (0 = đủ). Thiếu số → null. */
export const viThieu = (tong, soDu) => (so(tong) && so(soDu) ? Math.max(0, tong - soDu) : null);

// Ghi nhớ lần gửi (D3): `kh_don_gui` = { khoa_gui, than KHÔNG pin, cach_tra, luc } ghi TRƯỚC lần gửi đầu; nhận đơn → thêm ma_don, giu_vi, con_lai
// (đúng số POS trả — Theo dõi đơn dùng khi POS chưa trả các trường v7); chắc chưa tạo → xoá; KHOA_GUI_DA_DUNG → giữ, thêm da_dung.
// Còn bản ghi mà chưa có ma_don = "chưa rõ" → chặn đặt mới.
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
let ghiHong = false; // lần ghi cuối bị kho từ chối (chặn / đầy) → kho không có bản ghi (đã thử xoá bản cũ) thì đọc bản trong bộ nhớ trang
const quaHanLuc = (g, bay) => ({ ...g, quaHan: !(bay - g.luc < NGAY_MS) });

/** Đọc bản ghi (+ quaHan: quá 24 giờ). LUÔN đọc kho trước (tab khác có thể vừa ghi); kho không có → bản trong bộ nhớ trang nếu lần ghi cuối hỏng. */
export function docGuiDo(k = khoMay, bay = Date.now()) {
  const boNho = () => banGhiBoNho && quaHanLuc(banGhiBoNho, bay);
  let tho;
  try { tho = layKho(k).getItem(KHOA_DON_GUI); } catch { return boNho(); }
  try {
    const g = JSON.parse(tho);
    if (g && chu(g.khoa_gui) && g.than) return quaHanLuc(g, bay);
  } catch { /* hỏng → như không có */ }
  return ghiHong ? boNho() : null;
}
/** Ghi bản ghi; null = xoá. Kho chặn → false (không báo đã lưu), bản ghi giữ trong bộ nhớ trang. */
export function ghiGuiDo(g, k = khoMay) {
  const con = g ? (({ quaHan, ...x }) => x)(g) : null;
  banGhiBoNho = con;
  try {
    if (con) layKho(k).setItem(KHOA_DON_GUI, JSON.stringify(con)); else layKho(k).removeItem(KHOA_DON_GUI);
    ghiHong = false;
    return true;
  } catch {
    ghiHong = true;
    try { layKho(k).removeItem(KHOA_DON_GUI); } catch { /* chặn hẳn */ } // kho đầy vẫn xoá được: không để bản CŨ hơn bộ nhớ trang
    return false;
  }
}

/** Bộ nhớ trang quên bản ghi (đăng nhập mà không biết chủ cũ — luuMay.doiKhach). */
export const quenBoNho = () => { banGhiBoNho = null; ghiHong = false; };

/**
 * MỘT luật chặn đặt mới theo bản ghi (gọi ở ĐIỂM GỬI và khi vẽ): còn lần gửi chưa rõ, hoặc có đơn vừa đặt mà màn này chưa thấy
 * (`daThay` = khoá của bản ghi ĐÃ CÓ ĐƠN lúc mở màn / khách đã bấm "Đặt thêm đơn mới") → chặn.
 */
export const chanBoiBanGhi = (g, daThay) => !!g && (!g.ma_don || g.khoa_gui !== daThay);
/** "Gửi lại đúng đơn này" chỉ khi bản ghi HIỆN TẠI vẫn đúng khoá đó và vẫn chưa rõ (tab khác có thể đã giải / thay bằng đơn mới). */
export const conChuaRo = (g, khoa) => !!g && g.khoa_gui === khoa && !g.ma_don;
/** Bản ghi lần gửi của đúng đơn `ma` (đặt từ máy này), không có → null. */
export const banGhiCuaDon = (ma) => { const g = docGuiDo(); return g && g.ma_don === ma ? g : null; };

/** Đơn đã trả (tiền đã thu): có tiến trình, không còn chờ trả, không huỷ. MỘT điều kiện cho Theo dõi đơn và kho /don (C7). */
export const daThanhToan = (tt) => !!tt && tt !== 'cho_tra' && tt !== 'da_huy';
/** Bản ghi lần gửi (`kh_don_gui`) có đơn CHƯA dọn giỏ mà danh sách đơn (GET /don) thấy đơn đó đã trả → mã đơn; còn lại ''. */
export function maDonDaTra(g, ds) {
  if (!g || !g.ma_don || g.xong || !Array.isArray(ds)) return '';
  const d = ds.find((x) => x && String(x.ma) === String(g.ma_don));
  return d && daThanhToan(d.tien_trinh) ? String(g.ma_don) : '';
}
const theCuaBanGhi = (g) => (g && g.than && Array.isArray(g.than.mon) ? g.than.mon.find(laThe) : null) || null;
/** Hạng (bản ghi /hang) của dòng thẻ trong bản ghi lần gửi (`than.mon`); không có → null. ("Chào mừng hội viên …" không chờ /toi.) */
export function hangCuaDon(g, dsHang) {
  const the = theCuaBanGhi(g);
  return (the && Array.isArray(dsHang) ? dsHang.find((x) => x && x.id === the.hang_id) : null) || null;
}
/** "Tạo mã mới": đơn CHỈ thẻ → Thanh toán thẻ đúng hạng + gói của đơn đó; đơn khác / không bản ghi → Thanh toán giỏ. */
export function thamTaoMaMoi(g) {
  const the = g && g.than && laDonChiThe(g.than) ? theCuaBanGhi(g) : null;
  return the ? { trang: 'thanhtoanthe', tham: { h: the.hang_id, thang: the.so_thang } } : { trang: 'thanhtoan', tham: {} };
}
/** Đơn CHỈ có thẻ hạng (mọi dòng `mon[]` loai "the"). */
export const laDonChiThe = (don) => !!don && Array.isArray(don.mon) && don.mon.length > 0 && don.mon.every((m) => m && m.loai === 'the');
/** Chữ hạn mới của thẻ — NGUYÊN `ghi_chu` POS ở dòng `hoa_don[]` loai "the"; không có → ''. */
export const hanMoiThe = (don) => chu(((don && Array.isArray(don.hoa_don) ? don.hoa_don : []).find((d) => d && d.loai === 'the') || {}).ghi_chu);

/** Thẻ đơn ở Lịch sử mở Theo dõi đơn khi đơn App còn đang chạy; xong / huỷ / bill quầy → Chi tiết đơn. */
export const moTheoDoi = (tt) => ['cho_tra', 'da_tra', 'dang_lam'].includes(tt);

/** Chặn theo giờ cho ĐÚNG giỏ sắp gửi: giỏ không có đồ uống (chỉ thẻ) đặt mọi giờ (v13); có đồ uống → như chanDat. */
export const chanDatGio = (gh, gio) => (coDoUong(gio) ? chanDat(gh) : '');

/** Chặn đặt biết trước theo /gio-hoat-dong: ngừng nhận đơn / quán đóng → câu hiện cho khách; được đặt / chưa biết → ''. POS vẫn là bên chặn. */
export function chanDat(gh) {
  if (!gh || (gh.nhan_don !== false && gh.dang_mo !== false)) return '';
  return chu(gh.thong_bao) || nd('loi.NGOAI_GIO');
}

/** Giây còn lại của mã QR: het_han và "bây giờ" đều là giờ VN của POS. Không đọc được → null. */
export function conLaiQR(hetHan, bayGioChuoi) {
  const a = mocTuChuoi(hetHan), b = mocTuChuoi(bayGioChuoi);
  return Number.isFinite(a) && Number.isFinite(b) ? Math.max(0, Math.round((a - b) / 1000)) : null;
}

// Các bước theo dõi đơn (`tien_trinh` của GET /don/:ma). Giao tận nơi (KH-MUA-2) có bước giao.
// t / s = KHOÁ trong danh mục nội dung (td.buoc.<mã>), chữ đọc qua nd() lúc dựng bước.
const BUOC = {
  cho_tra: { t: 'td.buoc.cho_tra', ic: 'qr' },
  da_tra: { t: 'td.buoc.da_tra', ic: 'check' },
  dang_lam: { t: 'td.buoc.dang_lam', ic: 'cat-coffee' },
  xong: { t: 'td.buoc.xong', s: 'td.buoc.xong.s', ic: 'bell' },
  dang_giao: { t: 'td.buoc.dang_giao', ic: 'package' },
  da_giao: { t: 'td.buoc.da_giao', ic: 'flag' },
  da_huy: { t: 'td.buoc.da_huy', ic: 'close' },
};
const TAI_QUAN = ['cho_tra', 'da_tra', 'dang_lam', 'xong'];
const GIAO = ['cho_tra', 'da_tra', 'dang_lam', 'dang_giao', 'da_giao'];
const KET_THUC = ['xong', 'da_giao', 'da_huy'];
const DA_XONG = ['da_tra', 'xong', 'da_giao']; // trạng thái là "đã làm xong bước đó" (khác "đang làm": cho_tra, dang_lam, dang_giao)

/** { ds[] { ma, t, s, ic, kt, ks }, hien, xongBuocHien } — t / s = chữ hiện, kt / ks = khoá nội dung của chúng; `hien` = chỉ số bước đang ở; `xongBuocHien` = bước đó đã xong. */
export function buocTienTrinh(tt) {
  const ma = tt === 'da_huy' ? ['da_huy'] : GIAO.slice(3).includes(tt) ? GIAO : TAI_QUAN;
  return { ds: ma.map((m) => ({ ma: m, t: nd(BUOC[m].t), ic: BUOC[m].ic, kt: BUOC[m].t, ...(BUOC[m].s ? { s: nd(BUOC[m].s), ks: BUOC[m].s } : {}) })), hien: Math.max(0, ma.indexOf(tt)), xongBuocHien: DA_XONG.includes(tt) };
}
export const xongChua = (tt) => KET_THUC.includes(tt);

/** "Đặt lại" một đơn cũ: món có `ma` còn trong menu → dòng giỏ; món còn lại đếm `boQua`. Dòng thẻ hạng (v13) không đặt lại, không đếm là "không còn bán". */
export function monDatLai(don, ds) {
  const them = [];
  let boQua = 0;
  ((don && don.mon) || []).forEach((m) => {
    if (m.ma && (ds || []).some((x) => x.ma === m.ma) && Number.isInteger(m.so_luong) && m.so_luong > 0) them.push({ ma: m.ma, so_luong: m.so_luong, ghi_chu: chu(m.ghi_chu) });
    else if (m.loai !== 'the') boQua++;
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
