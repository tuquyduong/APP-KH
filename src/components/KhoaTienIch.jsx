import { bam } from './bam.js';

/** Dòng khoá (chủ quán chốt 29.10, KH-UI-3c): 🔒 + chữ. Ô tiện ích tự nhận làm dòng phụ thay chỗ chữ của nó — không phủ lên chữ nào. */
export function DongKhoa() {
  return <><span aria-hidden="true">🔒</span> Đăng nhập để mở khoá chức năng</>;
}

// Khoá tiện ích (chủ quán chốt 29.10): bọc MỘT ô tiện ích cần tài khoản (Kế hoạch và nhắc việc…) bằng viên nhãn giữa ô.
// Ô nhỏ nửa hàng (Trắc nghiệm ở Trang chủ) KHÔNG dùng viên này — nó dùng DongKhoa làm dòng phụ.
// Đã đăng nhập → hiện bình thường. Chưa → ô giữ nguyên hình / chữ / vị trí nhưng MỜ, kèm khoá;
// chạm → moDangNhap(tiep) = /dangnhap?tiep=<trang tiện ích>, đăng nhập xong quay về đúng tiện ích đó.
export default function KhoaTienIch({ dangNhap, tiep, moDangNhap, children }) {
  if (dangNhap) return children;
  return (
    <div className="khoa-tien-ich" {...bam(() => moDangNhap(tiep))}>
      <div className="khoa-ben-trong" aria-hidden="true" inert={true}>{children}</div>
      <div className="khoa-nhan"><DongKhoa /></div>
    </div>
  );
}
