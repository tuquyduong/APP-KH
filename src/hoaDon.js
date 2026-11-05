// Đọc tờ hoá đơn giao khách do POS dựng sẵn (`don.hoa_don[]`, hợp đồng v7). Hàm thuần: KHÔNG tính tiền, KHÔNG sắp lại, KHÔNG bỏ dòng.
const NHOM = {
  dau: ['ten_quan', 'dia_chi', 'so_bill', 'nhan', 'gio', 'khach'],
  canh_bao: ['canh_bao'],
  mon: ['mon'],
  tien: ['gia_goc', 'giam_hang', 'giam_flash', 'giam_ma', 'phi_giao', 'tong'],
  tieu_de: ['tieu_de'],
  tra: ['tu_tk', 'tu_tk_me', 'ck', 'tm', 'ghi_no', 'dua_tra'],
  diem: ['diem_truoc', 'diem_doi', 'diem_cong', 'diem_co'],
  chan: ['chan'],
};

const chu = (v) => (typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : '');

/** Nhóm hiển thị của một `loai` — chỉ để chọn kiểu vẽ; loại lạ → 'la'. */
export function nhomHoaDon(loai) {
  return Object.keys(NHOM).find((n) => NHOM[n].includes(loai)) || 'la';
}

/** `don` (trả về của GET /don/:ma) → các dòng `{ loai, trai, phai, dam, gach, ghiChu }` theo đúng thứ tự POS; không có tờ → []. */
export function docHoaDon(don) {
  const ds = don && Array.isArray(don.hoa_don) ? don.hoa_don : [];
  return ds
    .filter((d) => d && typeof d === 'object' && !Array.isArray(d))
    .map((d) => ({ loai: chu(d.loai), trai: chu(d.trai), phai: chu(d.phai), dam: d.dam === true, gach: chu(d.gach), ghiChu: chu(d.ghi_chu) }));
}
