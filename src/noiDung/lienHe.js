// Liên hệ hỗ trợ. ĐỂ TRỐNG tới khi chủ quán gửi số thật — trống thì mục Hỗ trợ ẩn. Không dùng số / email mẫu của demo.
export const LIEN_HE = { dienThoai: '', zalo: '', email: '' };

/** Có ít nhất một cách liên hệ thì mới hiện mục Hỗ trợ. */
export const coLienHe = (lh) => !!(lh && (lh.dienThoai || lh.zalo || lh.email));
