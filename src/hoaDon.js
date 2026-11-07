// Đọc tờ hoá đơn giao khách do POS dựng sẵn (`don.hoa_don[]`, hợp đồng v7). Hàm thuần: KHÔNG tính tiền, KHÔNG sắp lại, KHÔNG bỏ dòng.
const NHOM = {
  dau: ['ten_quan', 'dia_chi', 'so_bill', 'nhan', 'gio', 'khach'],
  canh_bao: ['canh_bao'],
  mon: ['mon'],
  tien: ['gia_goc', 'giam_hang', 'giam_flash', 'giam_ma', 'phi_giao', 'tong'],
  tieu_de: ['tieu_de'],
  tra: ['tu_tk', 'tu_tk_me', 'ck', 'tm', 'ma_gd', 'ghi_no', 'dua_tra'],
  diem: ['diem_truoc', 'diem_doi', 'diem_cong', 'diem_co'],
  chan: ['chan'],
};

const chu = (v) => (typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : '');

/** Nhóm hiển thị của một `loai` — chỉ để chọn kiểu vẽ; loại lạ → 'la'. */
export function nhomHoaDon(loai) {
  return Object.keys(NHOM).find((n) => NHOM[n].includes(loai)) || 'la';
}

/** Số đơn HIỆN cho khách (v11): `so_hd` của POS (`APP0016`, `HD0016`, `012`); chưa có → mã App `#<ma>` như trước. `ma` vẫn là mã để gọi API. */
export function soDon(soHd, ma) {
  const so = chu(soHd).trim();
  return so || `#${chu(ma)}`;
}

/** Câu tiền về muộn (v11): POS đã cộng tiền vào ví và gửi câu — App hiện NGUYÊN câu, không tự ghép; thiếu một trong hai → ''. */
export function cauTienVe(don) {
  const tien = don && don.tien_ve_da_cong_vi;
  return typeof tien === 'number' && tien > 0 ? chu(don.thong_bao_tien_ve).trim() : '';
}

/** `don` (trả về của GET /don/:ma) → các dòng `{ loai, trai, phai, dam, gach, ghiChu }` theo đúng thứ tự POS; không có tờ → []. App KHÔNG BAO GIỜ hiện `ghi_no` → bỏ ở đây (hết dòng = coi như không có tờ). */
export function docHoaDon(don) {
  const ds = don && Array.isArray(don.hoa_don) ? don.hoa_don : [];
  return ds
    .filter((d) => d && typeof d === 'object' && !Array.isArray(d) && d.loai !== 'ghi_no')
    .map((d) => ({ loai: chu(d.loai), trai: chu(d.trai), phai: chu(d.phai), dam: d.dam === true, gach: chu(d.gach), ghiChu: chu(d.ghi_chu) }));
}
