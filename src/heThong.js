// Nạp ba cửa công khai của hợp đồng v2 MỘT chỗ (hạng, Giờ vàng, giờ hoạt động + "bây giờ" của POS) và để các màn chỉ ĐỌC.
// Cửa nào lỗi / chậm: giữ bản đã có (chưa từng có = null → phần giao diện của cửa đó ẩn); không báo lỗi cho khách, không làm hỏng app.
import { useContext, useEffect, useMemo, useState, createContext } from 'react';
import { layHang, layGioVang, layGioHoatDong as hoiGioHoatDong } from './api.js';
import { taoKho, dungKho } from './kho.js';
import { datBayGio, bayGio } from './bayGio.js';
import { datGioHoatDong } from './gioHoatDong.js';
import { trangThaiGioVang, maGioVang } from './gioVang.js';

export const khoHang = taoKho(null);
export const khoGioVang = taoKho(null);

export const PHUT_HOI_LAI = 1; // hỏi lại ba cửa mỗi ngần này phút khi app đang mở
const GIAY_HOI_LAI_GIOI_HAN = 5; // hết khung / tới giờ mà POS chưa báo: hỏi lại /gio-vang, không dồn dập quá ngần này giây

const napHang = () => layHang().then((d) => { if (Array.isArray(d.data)) khoHang.dat(d.data); }, () => {});
const napGioHoatDong = () => hoiGioHoatDong().then((d) => { datBayGio(d.bay_gio); datGioHoatDong(d); }, () => {});
let lanGvCuoi = 0;
export function napGioVang() {
  if (Date.now() - lanGvCuoi < GIAY_HOI_LAI_GIOI_HAN * 1000) return Promise.resolve();
  lanGvCuoi = Date.now();
  return layGioVang().then((d) => khoGioVang.dat(d), () => {});
}

/** Gọi ở App: nạp khi mở app, hỏi lại mỗi phút (và khi khách quay lại tab). */
export function dungHeThong() {
  useEffect(() => {
    const nap = () => { napGioHoatDong(); napHang(); lanGvCuoi = 0; napGioVang(); }; // ba cửa độc lập: cửa nào chậm chỉ ẩn phần của nó (A3)
    nap();
    const id = setInterval(() => { if (!document.hidden) nap(); }, PHUT_HOI_LAI * 60000);
    const khiHien = () => { if (!document.hidden) nap(); };
    document.addEventListener('visibilitychange', khiHien);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', khiHien); };
  }, []);
}

// Ngữ cảnh giá cho cả app: Giờ vàng (pha / % / khung — KHÔNG dùng conLai ở đây, đếm giây do GvDem), mã món Giờ vàng, danh sách hạng, hạng khách.
export const NguCanhGia = createContext({ tt: null, maGv: new Set(), dsHang: null, hangToi: null });
export const dungGia = () => useContext(NguCanhGia);

/** Gọi ở App: trạng thái Giờ vàng theo "bây giờ" của POS, tự đổi pha (đang → đã kết thúc) mà không cần tải lại. */
export function dungNguCanhGia(ds, hangToi) {
  const gv = dungKho(khoGioVang);
  const dsHang = dungKho(khoHang);
  const [, ve] = useState(0);
  const tt = trangThaiGioVang(gv, bayGio());
  const pha = tt ? tt.pha : '';
  useEffect(() => {
    if (!gv) return undefined;
    const id = setInterval(() => { const n = trangThaiGioVang(gv, bayGio()); if ((n ? n.pha : '') !== pha) ve((x) => x + 1); }, 1000);
    return () => clearInterval(id);
  }, [gv, pha]);
  // `soMon` = số món POS báo (dùng khi chưa có menu để đối chiếu); `coMenu` = đã có menu → đếm theo món ghép được (E4).
  return useMemo(() => ({ tt, maGv: tt ? maGioVang(gv, ds) : new Set(), dsHang, hangToi, coMenu: ds.length > 0, soMon: gv && Array.isArray(gv.mon) ? gv.mon.length : 0 }), [pha, gv, ds, dsHang, hangToi]);
}
