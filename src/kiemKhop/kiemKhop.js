// Hàm thuần của trang /kiemkhop (bài thử nạp thẳng): so trường, xếp nhóm, đọc kết quả gọi. Không gọi mạng, không đụng DOM.
import { mocTuChuoi } from '../bayGio.js';

const GIO_VN_LECH = 7 * 3600000;

/** Trường `a.b[].c` có trong `du` không? 'co' | 'thieu' | 'rong' (mảng rỗng / tầng giữa null → chưa kiểm được, KHÔNG coi là có). */
export function kiemTruong(du, duong) {
  const doan = duong.split('.');
  let hien = [du];
  for (let i = 0; i < doan.length; i++) {
    const mang = doan[i].endsWith('[]'), khoa = mang ? doan[i].slice(0, -2) : doan[i], cuoi = i === doan.length - 1;
    const tiep = [];
    for (const o of hien) {
      if (!o || typeof o !== 'object') return 'thieu';
      const v = o[khoa];
      if (v === undefined || (mang && !Array.isArray(v))) return 'thieu';
      if (cuoi) continue;
      if (mang) tiep.push(...v); else if (v !== null) tiep.push(v);
    }
    if (!cuoi && !tiep.length) return 'rong';
    hien = tiep;
  }
  return 'co';
}

const cho = (chu) => ({ tt: 'cho', chu });

/** Trạng thái một mục. kq = { ok, dl } | { ok:false, loi:{status,code,message} } | { trong:true } | undefined (chưa có). tt: ok·thieu·loi·cho·rong·hd·dn·dang */
export function trangThaiMuc(m, kq, dangNhap) {
  if (!m.co) return cho(`POS đang làm: ${m.viec_pos}`);
  if (!m.cua.startsWith('GET')) return { tt: 'hd', chu: 'Có trong hợp đồng (không gọi thử)' };
  if (m.token === true && !dangNhap) return { tt: 'dn', chu: 'Đăng nhập để kiểm' };
  if (!kq) return { tt: 'dang', chu: 'Đang kiểm…' };
  if (kq.trong) return { tt: 'rong', chu: 'Chưa kiểm được: chưa có dữ liệu để xem (vd chưa có đơn nào)' };
  if (!kq.ok) return kq.loi.status === 401 && m.token === 'tuy_chon' ? cho(`POS còn đòi đăng nhập ở cửa này — chờ ${m.viec_pos}`) : { tt: 'loi', chu: kq.loi.message };
  const xet = m.truong.map((t) => [t, kiemTruong(kq.dl, t)]);
  const thieu = xet.filter(([, r]) => r === 'thieu').map(([t]) => t);
  if (thieu.length) return m.moi ? cho(`POS chưa trả: ${thieu.join(', ')} — chờ ${m.viec_pos}`) : { tt: 'thieu', chu: `Thiếu: ${thieu.join(', ')}` };
  if (xet.some(([, r]) => r === 'rong')) return { tt: 'rong', chu: 'Chưa kiểm được: danh sách đang trống' };
  return { tt: 'ok', chu: 'Đủ trường' };
}

/** Hai nhóm theo thứ tự "Trước khai trương" → "Sau khai trương", giữ thứ tự trong nhóm. */
export const xepNhom = (ds) => [['truoc_kt', 'Trước khai trương'], ['sau_kt', 'Sau khai trương']].map(([khi, ten]) => ({ khi, ten, ds: ds.filter((m) => m.khi === khi) }));

/** Các cửa GET phải gọi, mỗi cửa MỘT lần (nhiều mục dùng chung cửa); cửa cần token chỉ khi đã đăng nhập. */
export const cuaCanGoi = (ds, dangNhap) => [...new Set(ds.filter((m) => m.co && m.cua.startsWith('GET') && (m.token !== true || dangNhap)).map((m) => m.cua))];

/** Kết quả gọi /gio-hoat-dong → { tt: thong·chan·chua_cau_hinh·loi·dang, chu } bằng lời thường. */
export function phanLoaiKetNoi(kq) {
  if (!kq) return { tt: 'dang', chu: 'Đang kiểm…' };
  if (kq.ok) return { tt: 'thong', chu: 'Thông — POS trả lời bình thường' };
  if (kq.loi.code === 'MANG_LOI') return { tt: 'chan', chu: 'Không gọi được POS (mất mạng, hoặc trình duyệt chặn khác nguồn). Kiểm địa chỉ POS ở trên có "www" chưa.' };
  if (kq.loi.code === 'KH_CHUA_CAU_HINH') return { tt: 'chua_cau_hinh', chu: 'POS chưa bật App khách — thiếu khoá trên Render' };
  return { tt: 'loi', chu: kq.loi.message };
}

/** Giây POS nhanh hơn đồng hồ máy (âm = chậm hơn); `bay_gio` là giờ VN không hậu tố nên đọc bằng mocTuChuoi. Không đọc được → null. */
export function doLechGiay(bayGio, mayMs) {
  const moc = mocTuChuoi(bayGio);
  return Number.isFinite(moc) ? Math.round((moc - GIO_VN_LECH - mayMs) / 1000) : null;
}
