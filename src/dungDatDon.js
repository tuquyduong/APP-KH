// Hook của luồng đặt đơn (React): hỏi báo giá gộp, theo dõi đơn hỏi lại định kỳ. Quy tắc / tên trường ở datDon.js.
import { useEffect, useRef, useState } from 'react';
import { baoGia, thanBaoGia, taoGop, xemDon, xongChua } from './datDon.js';

const MS_GOP = 600;          // đổi giỏ / mã liền tay: hỏi báo giá ≤ 1 lần mỗi ngần này ms
const GIAY_HOI_QR = 3;       // đang chờ trả QR: hỏi trạng thái đơn mỗi ngần này giây
const GIAY_HOI_DON = 10;     // đơn chưa xong: hỏi lại mỗi ngần này giây

/** { bg, loi } — báo giá của POS cho giỏ + tuỳ chọn; `bat` false (chưa đăng nhập, giỏ có món hết…) → không hỏi. Đổi giỏ → bỏ số cũ, hỏi lại. */
export function dungBaoGia(gio, tuy, bat) {
  const [tt, datTt] = useState({ bg: null, loi: '' });
  const gop = useRef(null);
  if (!gop.current) gop.current = taoGop(MS_GOP);
  const khoa = JSON.stringify([gio, tuy, bat]);
  useEffect(() => {
    datTt({ bg: null, loi: '' });
    if (!bat) return undefined;
    let huy = false;
    gop.current(() => baoGia(thanBaoGia(gio, tuy)).then(
      (bg) => { if (!huy) datTt({ bg, loi: '' }); },
      (e) => { if (!huy) datTt({ bg: null, loi: e.code === 'CHUA_MO' ? '' : e.message }); },
    ));
    return () => { huy = true; };
  }, [khoa]);
  useEffect(() => () => gop.current.huy(), []);
  return tt;
}

/** { don, loi, taiLai } — GET /don/:ma khi mở màn, hỏi lại mỗi 3 giây (`nhanh`: đang chờ trả QR) hoặc 10 giây cho tới khi đơn xong / huỷ. */
export function dungTheoDoi(ma, nhanh) {
  const [tt, datTt] = useState({ don: null, loi: '' });
  const [lan, datLan] = useState(0);
  useEffect(() => {
    let huy = false;
    xemDon(ma).then((don) => { if (!huy) datTt({ don, loi: '' }); }, (e) => { if (!huy) datTt((t) => ({ ...t, loi: e.message })); });
    return () => { huy = true; };
  }, [ma, lan]);
  const ketThuc = xongChua(tt.don && tt.don.tienTrinh);
  useEffect(() => {
    if (ketThuc) return undefined;
    const id = setInterval(() => { if (!document.hidden) datLan((n) => n + 1); }, (nhanh ? GIAY_HOI_QR : GIAY_HOI_DON) * 1000);
    return () => clearInterval(id);
  }, [ma, nhanh, ketThuc]);
  return { ...tt, taiLai: () => datLan((n) => n + 1) };
}
