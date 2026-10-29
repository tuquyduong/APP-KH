import { bam } from './bam.js';

// Khoá tiện ích (chủ quán chốt 29.10): bọc MỘT ô tiện ích cần tài khoản (Trắc nghiệm, Kế hoạch và nhắc việc…).
// Đã đăng nhập → hiện bình thường. Chưa → ô giữ nguyên hình / chữ / vị trí nhưng MỜ, kèm khoá + "Đăng nhập để mở khoá chức năng";
// chạm → moDangNhap(tiep) = /dangnhap?tiep=<trang tiện ích>, đăng nhập xong quay về đúng tiện ích đó.
export default function KhoaTienIch({ dangNhap, tiep, moDangNhap, children }) {
  if (dangNhap) return children;
  return (
    <div className="khoa-tien-ich" {...bam(() => moDangNhap(tiep))}>
      <div className="khoa-ben-trong" aria-hidden="true" inert="">{children}</div>
      <div className="khoa-nhan"><span aria-hidden="true">🔒</span> Đăng nhập để mở khoá chức năng</div>
    </div>
  );
}
