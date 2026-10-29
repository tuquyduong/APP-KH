import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { noiDungMon } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { AnhMon, NhanHetHang } from '../components/MonO.jsx';

// Trang món: ảnh, tên, giá, nhóm + mô tả / thành phần / công dụng nếu có trong src/noiDung/mon.js. Không nút giỏ, không topping.
const KHOI = [['moTa', 'Mô tả'], ['thanhPhan', 'Thành phần'], ['congDung', 'Công dụng']];

export default function TrangMon({ mon }) {
  const nd = noiDungMon(MON, mon.ma);
  return (
    <div>
      <AnhMon ma={mon.ma} lop="anh-chi-tiet" />
      <h1>{mon.ten}</h1>
      <div className="so-lon">{dinhDangGia(mon.gia)}</div>
      <div className="phu">{mon.nhom || 'Khác'}</div>
      <NhanHetHang mon={mon} />
      {mon.ton_cu && mon.ton_luc && <div className="phu">theo số lúc {dinhDangNgay(mon.ton_luc)}</div>}
      {nd && KHOI.filter(([k]) => nd[k]).map(([k, ten]) => (
        <div className="khoi-chu" key={k}><h3>{ten}</h3><p>{nd[k]}</p></div>
      ))}
    </div>
  );
}
