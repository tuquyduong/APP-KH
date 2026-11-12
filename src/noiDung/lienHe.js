// Liên hệ hỗ trợ: số điện thoại / Zalo / email của quán là mục sửa được ở danh mục nội dung (ht.dienThoai, ht.zalo, ht.email — src/noiDung/nd/taiKhoan.js).
// ĐỂ TRỐNG tới khi chủ quán điền số thật — trống thì mục Hỗ trợ ẩn. Không dùng số / email mẫu của demo. `LIEN_HE` đọc mỗi lần (đổi nội dung thì đổi theo).
import { nd } from './nd.js';

export const LIEN_HE = {
  get dienThoai() { return nd('ht.dienThoai').trim(); },
  get zalo() { return nd('ht.zalo').trim(); },
  get email() { return nd('ht.email').trim(); },
};

/** Có ít nhất một cách liên hệ thì mới hiện mục Hỗ trợ. */
export const coLienHe = (lh) => !!(lh && (lh.dienThoai || lh.zalo || lh.email));
