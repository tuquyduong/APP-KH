// Voucher ở Giỏ hàng / Thanh toán (KH-VC-2, hợp đồng v15): App dựng MỘT mảng mã gửi POS theo thứ tự, POS xét và trả từng dòng `giam[]` / từng `voucher_loi[]`.
// App KHÔNG tính số giảm, KHÔNG đoán voucher nào áp được. Thứ tự gửi chính là luật ưu tiên (V5): mã khách vừa chạm đứng đầu, rồi hạn sớm trước.

export const SO_MA_TOI_DA = 10; // hợp đồng v15: `vouchers` ≤ 10 mã
/** Lựa chọn của khách trong bộ nhớ trang: `boTay` = mã khách đã bỏ; `chonTay` = mã khách chạm chọn, MỚI chạm đứng ĐẦU. */
export const CHON_RONG = { boTay: [], chonTay: [] };

const hoa = (s) => String(s || '').trim().toUpperCase();
export const coMa = (ds, ma) => (ds || []).some((x) => hoa(x) === hoa(ma));
const boMa = (ds, ma) => (ds || []).filter((x) => hoa(x) !== hoa(ma));

/** Voucher giảm phí giao (đơn App hôm nay nhận tại quán → không gửi, hiện mờ). */
export const laShip = (v) => !!v && (v.kieu === 'ship_tien' || v.kieu === 'ship_phan_tram' || (Number(v.giam_ship) || 0) !== 0);

// Hạn là chuỗi giờ VN của POS (`YYYY-MM-DDTHH:mm:ss`) — so chuỗi, không `new Date` (CLAUDE.md §6). Không hạn / sai dạng → sau cùng.
const han = (v) => (/^\d{4}-\d{2}-\d{2}/.test(String(v.expires_at || '')) ? String(v.expires_at) : '￿');

/** Mảng mã gửi POS từ ví (`data[]` của GET /voucher): bỏ ship, bỏ mã bỏ tay; chọn tay trước (đúng thứ tự `chonTay`), rồi hạn sớm; không trùng; ≤ 10. */
export function dsGui(vi, { boTay = [], chonTay = [] } = {}) {
  const viTri = (v) => { const i = chonTay.findIndex((x) => hoa(x) === hoa(v.code)); return i < 0 ? Infinity : i; };
  const xep = (Array.isArray(vi) ? vi : []).filter((v) => v && hoa(v.code) && !laShip(v) && !coMa(boTay, v.code))
    .map((v, i) => ({ v, i }))
    .sort((a, b) => viTri(a.v) - viTri(b.v) || (han(a.v) < han(b.v) ? -1 : han(a.v) > han(b.v) ? 1 : 0) || a.i - b.i);
  const ra = [];
  for (const { v } of xep) if (!coMa(ra, v.code) && ra.length < SO_MA_TOI_DA) ra.push(String(v.code).trim());
  return ra;
}

/** Trạng thái một mã theo báo giá đã đọc (docBaoGia): 'dung' (POS tính) · { loi } (POS báo lý do) · 'cho' (chưa có báo giá / không gửi). */
export function trangThaiVoucher(ma, bg) {
  if (!bg) return 'cho';
  if ((bg.giam || []).some((g) => g.loai === 'voucher' && hoa(g.ma) === hoa(ma))) return 'dung';
  const l = (bg.voucherLoi || []).find((x) => hoa(x.ma) === hoa(ma));
  return l ? { loi: l.error } : 'cho';
}

/** Khách chạm một ô: đang tích → bỏ (vào boTay); không tích → chọn (đứng ĐẦU chonTay, ra khỏi boTay). */
export const chamVoucher = ({ boTay, chonTay }, ma, dangTich) => (dangTich
  ? { boTay: [...boMa(boTay, ma), ma], chonTay: boMa(chonTay, ma) }
  : { boTay: boMa(boTay, ma), chonTay: [ma, ...boMa(chonTay, ma)] });
