// Dữ liệu của khách đang đăng nhập — MỘT kho chung cho cả app mỗi cửa GET (/toi, /diem, /voucher không ?all, /don trang 1). Các màn chỉ ĐỌC kho.
// Có dữ liệu thì hiện ngay; lấy mới NGẦM khi: màn mở mà bản quá 5 phút, khách quay lại app sau 60 giây, mỗi 5 phút, ngay sau thao tác đổi dữ liệu.
// Đổi phiên → xoá sạch kho (kết quả của lệnh bay từ phiên cũ bị bỏ). Thanh toán, Theo dõi đơn, Chi tiết đơn KHÔNG đọc kho (luôn lấy mới).
import { useEffect } from 'react';
import { layToi, layDiem, layVoucher, layDon } from './api.js';
import { taoKho, dungKho } from './kho.js';
import { dauVet, docChu, cungKhach } from './luuMay.js';
import { rutTomTat, ghiTomTat, docTomTat, tomTatCuaKhach } from './tomTatLuu.js';

export const PHUT_CON_MOI = 5;  // màn mở / đều đặn: bản chưa quá ngần này phút thì không hỏi lại POS
export const GIAY_QUAY_LAI = 60; // khách quay lại app: bản quá ngần này giây thì lấy lại

/** Bản lấy lúc `luc` (ms) còn mới trong `giay` giây tính tới `bay`? Chưa lấy (0) → cũ. */
export const conMoi = (luc, bay, giay) => luc > 0 && bay >= luc && bay - luc < giay * 1000;

/** Trạng thái màn hiện: có dữ liệu → không khung chờ, không báo lỗi. `that` = bỏ qua bản gieo từ máy (cần sdt / qr / địa chỉ thật). */
export function hienCua(s, that = false) {
  const dl = that && s.dl && s.dl.tuMay ? null : s.dl;
  return { dl, loi: dl ? '' : s.loi, dangTai: !dl && !s.loi };
}

/** Một cửa: kho { dl, luc, loi } + lay() dùng chung lệnh đang chờ (không bao giờ ném: lỗi → null). */
export function taoCua(ham) {
  const RONG = { dl: null, luc: 0, loi: '' };
  const kho = taoKho(RONG);
  let cho = null, phien = 0;
  const lay = () => {
    if (cho) return cho;
    const p = phien;
    if (kho.lay().loi) kho.dat({ ...kho.lay(), loi: '' });
    const xong = () => { if (p === phien) cho = null; };
    cho = ham().then(
      (dl) => { xong(); if (p !== phien) return null; kho.dat({ dl, luc: Date.now(), loi: '' }); return dl; },
      (e) => { xong(); if (p === phien) kho.dat({ ...kho.lay(), loi: e.message }); return null; },
    );
    return cho;
  };
  return {
    kho, lay,
    napNeuCu: (giay = PHUT_CON_MOI * 60, bay = Date.now()) => (conMoi(kho.lay().luc, bay, giay) ? Promise.resolve(kho.lay().dl) : lay()),
    xoa: () => { phien++; cho = null; kho.dat(RONG); },
  };
}

export const cuaToi = taoCua(layToi);
export const cuaDiem = taoCua(layDiem);
export const cuaVoucher = taoCua(() => layVoucher(false));
export const cuaDon = taoCua(() => layDon(1));
export const CUA_KHACH = [cuaToi, cuaDiem, cuaVoucher, cuaDon];

export const lamMoi = (ds) => ds.forEach((c) => c.lay());
export const xoaKhoKhach = () => CUA_KHACH.forEach((c) => c.xoa());
/** Khách quay lại app: kho đã có mà quá 60 giây → lấy lại. */
export const lamMoiKhiQuayLai = (ds, bay = Date.now()) => ds.forEach((c) => { if (c.kho.lay().dl) c.napNeuCu(GIAY_QUAY_LAI, bay); });

/** Lưu hồ sơ xong: POS trả hồ sơ → gộp vào kho (không gọi lại); không trả → lấy lại /toi. */
export function gopToi(cua, khach) {
  const s = cua.kho.lay();
  if (!khach || !Object.keys(khach).length || !s.dl || !s.dl.khach || s.dl.tuMay) { cua.lay(); return; }
  cua.kho.dat({ ...s, dl: { ...s.dl, khach: { ...s.dl.khach, ...khach } } });
}

/** Gieo bản tóm tắt trên máy vào kho /toi, /diem (luc = 0 → vẫn lấy mới ngay). Chỉ bản của đúng khách đang giữ máy (`kh_chu`). */
export function napTomTat() {
  const ban = tomTatCuaKhach(docTomTat(), docChu());
  if (!ban) return;
  const { ten, xung_ho, hang, so_du_vi, points } = ban;
  if (!cuaToi.kho.lay().dl) cuaToi.kho.dat({ dl: { tuMay: true, khach: { ten, xung_ho, hang, so_du_vi } }, luc: 0, loi: '' });
  if (typeof points === 'number' && !cuaDiem.kho.lay().dl) cuaDiem.kho.dat({ dl: { tuMay: true, points }, luc: 0, loi: '' });
}

/** Ghi bản tóm tắt khi có hồ sơ THẬT của đúng khách đang giữ máy (khác khách: chờ luuMay.doiKhach dọn trước). */
export function luuTomTat() {
  const toi = cuaToi.kho.lay().dl;
  const sdt = toi && !toi.tuMay && toi.khach && toi.khach.sdt;
  if (!sdt || cungKhach(sdt) !== true) return;
  const ban = rutTomTat(toi, cuaDiem.kho.lay().dl, dauVet(sdt), Date.now());
  if (ban) ghiTomTat(ban);
}
cuaToi.kho.dangKy(luuTomTat);
cuaDiem.kho.dangKy(luuTomTat);

/** Màn đọc một cửa: { dl, loi, dangTai, taiLai } (cùng dạng dungTai → dùng được TrangTai). Mở màn → lấy ngầm nếu bản quá 5 phút. */
export function dungCua(cua, { that = false } = {}) {
  const s = dungKho(cua.kho);
  useEffect(() => { cua.napNeuCu(); }, [cua]);
  return { ...hienCua(s, that), taiLai: cua.lay };
}

/** Gọi ở App: có phiên → quay lại app sau 60 giây thì lấy lại; app đang hiện thì mỗi 5 phút. */
export function dungLamMoiNgam(dangNhap) {
  useEffect(() => {
    if (!dangNhap) return undefined;
    const khiHien = () => { if (!document.hidden) lamMoiKhiQuayLai(CUA_KHACH); };
    const id = setInterval(() => { if (!document.hidden) lamMoi(CUA_KHACH); }, PHUT_CON_MOI * 60000);
    document.addEventListener('visibilitychange', khiHien);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', khiHien); };
  }, [dangNhap]);
}
