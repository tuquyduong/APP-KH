// Khung chung cho màn tải dữ liệu: đang tải (khung xám nhẹ) / lỗi (có nút thử lại) / nội dung. Không bao giờ trắng màn.
export default function TrangTai({ tai, children }) {
  if (tai.dangTai && !tai.dl) {
    return <div aria-busy="true"><div className="khung-tai" /><div className="khung-tai" /></div>;
  }
  if (tai.loi) {
    return (
      <div>
        <div className="loi">{tai.loi}</div>
        <button className="nut" onClick={tai.taiLai}>Thử lại</button>
      </div>
    );
  }
  return children(tai.dl);
}
