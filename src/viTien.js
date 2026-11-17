// Ví của khách (KH-NAP-1, hợp đồng v17): hàm thuần cho gói nạp (GET /goi-nap) và lịch sử ví (GET /vi) — không đụng DOM / mạng (bài thử cong_cu/thu_KHNAP1.js nạp thẳng).
// App KHÔNG tính tiền: giá, số vào ví, số dư, số đã nạp đều từ POS. Ngoại lệ DUY NHẤT (chủ quán N3 16.11): nhãn thưởng của gói = vao − tra.

const soNguyen = (n) => Number.isInteger(n);
const chuoi = (s) => (typeof s === 'string' ? s.trim() : '');

/** Nhãn thưởng của một gói: `vao − tra` khi cả hai là số nguyên và vao > tra; còn lại 0 (không hiện nhãn). */
export const thuongGoi = (g) => (g && soNguyen(g.tra) && soNguyen(g.vao) && g.vao > g.tra ? g.vao - g.tra : 0);

/** Danh sách gói từ trả lời /goi-nap — giữ ĐÚNG thứ tự quầy, bỏ dòng hỏng (mã không phải số nguyên ≥ 1, tên rỗng, số tiền không nguyên). */
export function goiNapDs(dl) {
  const ds = dl && Array.isArray(dl.data) ? dl.data : [];
  return ds.filter((g) => g && soNguyen(g.ma) && g.ma >= 1 && chuoi(g.ten) && soNguyen(g.tra) && soNguyen(g.vao)).map((g) => ({ ma: g.ma, ten: chuoi(g.ten), tra: g.tra, vao: g.vao }));
}

const NHAN = { nap: 'vt.loai.nap', tra_don: 'vt.loai.tra_don', hoan_don: 'vt.loai.hoan_don', dieu_chinh: 'vt.loai.dieu_chinh' };
/** Loại dòng /vi → KHOÁ chữ tên dòng (danh mục nội dung); loại lạ (vd qua_chao_mung của QUA-1) → null: màn hiện nguyên `ghi_chu` POS làm tên. */
export const nhanLoaiVi = (loai) => NHAN[loai] || null;

/** Một dòng /vi → { ngay, loai, soTien, thuong, maDon, ghiChu }; `so_tien` không phải số nguyên → null (bỏ dòng, màn không vỡ). */
export function dongVi(d) {
  if (!d || typeof d !== 'object' || !soNguyen(d.so_tien)) return null;
  return { ngay: chuoi(d.ngay), loai: chuoi(d.loai), soTien: d.so_tien, thuong: soNguyen(d.thuong) ? d.thuong : 0, maDon: chuoi(d.ma_don) || null, ghiChu: chuoi(d.ghi_chu) };
}
/** Khoá so trùng giữa hai trang /vi (phân trang OFFSET, dòng không có mã riêng). */
export const khoaDongVi = (d) => JSON.stringify([d.ngay, d.loai, d.soTien, d.maDon, d.ghiChu]);

/** Giờ VN của POS "2026-11-16T14:05:00" → "14:05 · 16/11/2026" (đọc chuỗi, không new Date). Không đọc được → "". */
export function gioNgayVi(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(chuoi(s));
  return m ? `${m[4]}:${m[5]} · ${m[3]}/${m[2]}/${m[1]}` : '';
}

/** Dòng nạp của ĐÚNG đơn `ma` trong trả lời /vi (màn "Đã nạp"); không có → null (màn hiện câu chung, không số). */
export function dongNapCuaDon(dl, ma) {
  const ds = dl && Array.isArray(dl.data) ? dl.data.map(dongVi).filter(Boolean) : [];
  return ds.find((d) => d.loai === 'nap' && d.maDon !== null && d.maDon === String(ma)) || null;
}
