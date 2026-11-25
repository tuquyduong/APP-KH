// Hook của luồng đặt đơn (React): hỏi báo giá gộp, theo dõi đơn hỏi lại định kỳ. Quy tắc / tên trường ở datDon.js.
import { useEffect, useRef, useState } from 'react';
import { layChiTietDon, ngam } from './api.js';
import { baoGia, thanBaoGia, taoGop, docDon, xongChua } from './datDon.js';

const MS_GOP = 600;          // đổi giỏ / mã liền tay: hỏi báo giá ≤ 1 lần mỗi ngần này ms
const GIAY_HOI_QR = 3;       // đang chờ trả QR: hỏi trạng thái đơn mỗi ngần này giây
const GIAY_HOI_DON = 10;     // đơn chưa xong: hỏi lại mỗi ngần này giây

/**
 * { bg, bgCu, dangTinh, loi, datBg } — báo giá của POS cho giỏ + tuỳ chọn; `bat` false (chưa đăng nhập, giỏ có món hết…) → không hỏi. Đổi giỏ / mã → `bg` = null
 * tới khi báo giá MỚI về (nút đặt khoá, tong_da_xem luôn là số của báo giá mới). `dangTinh` = đang chờ báo giá cho đúng giỏ + mã hiện tại; `bgCu` = báo giá
 * gần nhất của màn này — CHỈ để hiện mờ trong lúc tính lại (KH-NHANH-2 B1), không bao giờ để trả tiền. `datBg` thay bằng báo giá POS gửi kèm lỗi GIA_DA_DOI.
 */
export function dungBaoGia(gio, tuy, bat) {
  const khoa = JSON.stringify([gio, tuy, bat]);
  const [tt, datTt] = useState({ bg: null, loi: '', khoa, xong: false });
  const cu = useRef(null);
  if (tt.bg) cu.current = tt.bg;
  const gop = useRef(null);
  if (!gop.current) gop.current = taoGop(MS_GOP);
  useEffect(() => {
    datTt({ bg: null, loi: '', khoa, xong: false });
    if (!bat) return undefined;
    let huy = false;
    gop.current(() => baoGia(thanBaoGia(gio, tuy)).then(
      (bg) => { if (!huy) datTt({ bg, loi: '', khoa, xong: true }); },
      (e) => { if (!huy) datTt({ bg: null, loi: e.code === 'CHUA_MO' ? '' : e.message, khoa, xong: true }); },
    ));
    return () => { huy = true; };
  }, [khoa]);
  useEffect(() => () => gop.current.huy(), []);
  const dung = tt.khoa === khoa; // kết quả của đúng giỏ + mã hiện tại; khác (vừa đổi, chưa hỏi lại) → coi như đang tải
  return { bg: dung ? tt.bg : null, bgCu: bat ? cu.current : null, dangTinh: bat && !(dung && tt.xong), loi: dung ? tt.loi : '', datBg: (bg) => datTt({ bg, loi: '', khoa, xong: true }) };
}

// GET /don/:ma + tờ hoá đơn POS (`hoa_don[]`, v7) gắn thô vào don — docDon của datDon.js không chuyển trường này; màn vẽ bằng docHoaDon làm sạch.
const xemDonCoTo = (ma) => layChiTietDon(ma).then((r) => { const don = docDon(r); return don && { ...don, hoa_don: r.don.hoa_don }; });

/** { don, loi, taiLai } — GET /don/:ma khi mở màn, hỏi lại mỗi 3 giây (đơn đang chờ trả) hoặc 10 giây cho tới khi đơn xong / huỷ. */
export function dungTheoDoi(ma) {
  const [tt, datTt] = useState({ don: null, loi: '' });
  const [lan, datLan] = useState(0);
  const dongHo = useRef(false); // lượt hỏi lại do đồng hồ (3 s / 10 s) → ngầm, không hiện vòng chờ (KH-NHANH-2 A1)
  useEffect(() => {
    let huy = false;
    const xem = () => xemDonCoTo(ma);
    (dongHo.current ? ngam(xem) : xem()).then((don) => { if (!huy) datTt({ don, loi: '' }); }, (e) => { if (!huy) datTt((t) => ({ ...t, loi: e.message })); });
    dongHo.current = false;
    return () => { huy = true; };
  }, [ma, lan]);
  const ketThuc = xongChua(tt.don && tt.don.tienTrinh);
  const nhanh = !!tt.don && tt.don.tienTrinh === 'cho_tra';
  useEffect(() => {
    if (ketThuc) return undefined;
    const id = setInterval(() => { if (!document.hidden) { dongHo.current = true; datLan((n) => n + 1); } }, (nhanh ? GIAY_HOI_QR : GIAY_HOI_DON) * 1000);
    return () => clearInterval(id);
  }, [ma, nhanh, ketThuc]);
  return { ...tt, taiLai: () => datLan((n) => n + 1) };
}
