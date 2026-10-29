// Một màn như demo: nền "aurora" mờ + nội dung nằm trên. `hien` = màn đang xem (các màn khác ẩn nhưng giữ nguyên trạng thái, như demo).
export default function Man({ id, hien = true, children }) {
  return (
    <div className={`screen${hien ? ' active' : ''}`} id={id}>
      <div className="aurora-bg"><span className="a1" /><span className="a2" /><span className="a3" /><span className="a4" /></div>
      <div className="trong-man">{children}</div>
    </div>
  );
}

/** Thanh đầu màn con như demo: nút tròn quay lại + tiêu đề. `canTrai` = tiêu đề sát nút (demo "Thông tin cá nhân"), mặc định giãn hai đầu (demo "Lịch sử đơn hàng"). */
export function DauManCon({ tieuDe, phu, lui, canTrai = false }) {
  return (
    <div className={`topbar${canTrai ? ' trai' : ''}`}>
      <button type="button" className="back-btn" aria-label="Quay lại" onClick={lui}><svg className="ico" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-back" /></svg></button>
      <div><h1>{tieuDe}</h1>{phu && <div className="sub">{phu}</div>}</div>
    </div>
  );
}

/** Nút QR tròn góc phải như demo (qr-header-btn). */
export function NutQR({ moQR }) {
  return (
    <button type="button" className="qr-header-btn" aria-label="Mã QR thành viên" onClick={moQR}>
      <svg className="ico" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-qr" /></svg>
    </button>
  );
}
