import { useState } from 'react';
import { DL } from './noiDung/theChat.js';
import { locCau, chamDiem, ketLuan } from './tracNghiem.js';
import { rutGon, ghiKetQua, docKetQua, xoaKetQua } from './tracNghiemLuu.js';
import { gioVn } from './menuLuu.js';

// Trạng thái trắc nghiệm của cả app (giữ ở App để đổi tab / bấm Back không mất bài đang làm). Mọi thứ chỉ nằm trên máy khách.
//   bai  = bài đang làm { gioiTinh, ds, tra[], i, cuoi, khiHau, anToan[] }
//   moi  = kết quả vừa làm xong { kl, ds, tra, ngay, daLuu } — còn câu trả lời TRONG BỘ NHỚ trang để "Xem lại từng câu", không bao giờ ghi ra máy
//   luu  = bản đã lưu trên máy (tracNghiemLuu.js); mở lại từ đây thì không còn câu trả lời

export function dungTracNghiem() {
  const [luu, datLuu] = useState(() => docKetQua(DL));
  const [gioiTinh, datGioiTinh] = useState(null);
  const [bai, datBai] = useState(null);
  const [moi, datMoi] = useState(null);

  /** Bắt đầu bài mới (giới tính đã chọn ở màn giới thiệu, hoặc truyền vào khi "Làm lại"); chưa chọn giới tính → false. */
  const batDau = (g = gioiTinh) => {
    if (!g) return false;
    const ds = locCau(DL, g);
    datGioiTinh(g);
    datBai({ gioiTinh: g, ds, tra: new Array(ds.length).fill(null), i: 0, cuoi: false, khiHau: 'deu', anToan: [] });
    datMoi(null); // "Kết quả đã lưu" luôn mở đúng bản đã lưu, không phải bản làm lại chưa lưu
    return true;
  };
  const sua = (f) => datBai((b) => (b ? { ...b, ...f(b) } : b));
  const chon = (giaTri) => sua((b) => ({ tra: b.tra.map((x, j) => (j === b.i ? giaTri : x)) }));
  const tiep = () => sua((b) => (b.i < b.ds.length - 1 ? { i: b.i + 1 } : { cuoi: true }));
  /** Về câu trước; đang ở câu đầu thì trả false (trang hỏi xác nhận rồi mới thoát). */
  const lui = () => {
    if (!bai) return false;
    if (bai.cuoi) { sua(() => ({ cuoi: false })); return true; }
    if (bai.i > 0) { sua((b) => ({ i: b.i - 1 })); return true; }
    return false;
  };
  const datKhiHau = (khiHau) => sua(() => ({ khiHau }));
  const batTatAnToan = (chu) => sua((b) => ({ anToan: b.anToan.includes(chu) ? b.anToan.filter((x) => x !== chu) : [...b.anToan, chu] }));
  const bo = () => datBai(null);
  const xong = () => {
    if (!bai) return;
    datMoi({ kl: ketLuan(DL, chamDiem(DL, bai.ds, bai.tra).t, bai), ds: bai.ds, tra: bai.tra, ngay: gioVn(), daLuu: false });
    datBai(null);
  };
  const luuLai = () => {
    if (!moi) return;
    const ban = rutGon(moi.kl, moi.ngay);
    ghiKetQua(ban); // kho bị chặn thì kết quả vẫn xem được trong phiên
    datLuu({ gioiTinh: ban.gioiTinh, ngay: ban.ngay, diem: ban.diem, khiHau: ban.khiHau, anToan: ban.anToan });
    datMoi({ ...moi, daLuu: true });
  };
  const xoa = () => { xoaKetQua(); datLuu(null); datMoi(null); };
  /** Đăng xuất / hết phiên: bỏ hết, kể cả bản trên máy (thiết bị dùng chung không để lộ kết quả của người trước). */
  const donSach = () => { xoaKetQua(); datLuu(null); datMoi(null); datBai(null); datGioiTinh(null); };

  const klLuu = luu ? ketLuan(DL, luu.diem, luu) : null;
  const hien = moi || (luu ? { kl: klLuu, ds: null, tra: null, ngay: luu.ngay, daLuu: true } : null);
  return { luu, klLuu, hien, gioiTinh, datGioiTinh, bai, batDau, chon, tiep, lui, datKhiHau, batTatAnToan, bo, xong, luuLai, xoa, donSach };
}
