import { useEffect, useState } from 'react';
import { cuaDon } from '../duLieuKhach.js';
import { dungKho } from '../kho.js';
import { MS_HOI, daBao, docNho, ghiNho, tieuDeXong, xemDanhSach, xoaNho } from '../baoDonXong.js';
import { Ico } from './BieuTuong.jsx';
import '../giaoDien/bao_don.css';

// Dải "Đơn #… đã sẵn sàng — mời bạn ra quầy" trên cùng MỌI màn (KH-BAO-1). Hỏi qua kho `cuaDon` (GET /don trang 1, dùng chung lệnh đang chờ):
// mỗi 15 giây khi có đơn đang chạy và tab hiện; quay lại tab → hỏi ngay; không đơn chạy → không hỏi lặp. Luật chọn đơn ở baoDonXong.js.
const hoiNgay = () => { if (!document.hidden) cuaDon.lay(); };

export default function BaoDonXong({ moDon, datTieuDe }) {
  const s = dungKho(cuaDon.kho);
  const [nho, datNho] = useState(docNho);
  const kq = xemDanhSach(s.dl && s.dl.data, nho);
  const ma = kq.choBao[0] || '';
  // Đồng bộ mã "đã thấy" (chỉ phần thay; phần bao do nút tắt giữ — cập nhật theo bản mới nhất, không ghi đè bằng bản chụp cũ).
  useEffect(() => {
    if (kq.nho.thay.length === nho.thay.length && kq.nho.thay.every((x, i) => x === nho.thay[i])) return;
    datNho((n) => { const m = { thay: kq.nho.thay, bao: n.bao }; ghiNho(m); return m; });
  });
  useEffect(() => {
    if (!kq.dangChay) return undefined;
    const id = setInterval(hoiNgay, MS_HOI);
    return () => clearInterval(id);
  }, [kq.dangChay]);
  useEffect(() => {
    document.addEventListener('visibilitychange', hoiNgay);
    return () => { document.removeEventListener('visibilitychange', hoiNgay); xoaNho(); datTieuDe(''); }; // tháo ra = đăng xuất / hết phiên: không để lại cho khách sau
  }, []);
  useEffect(() => {
    datTieuDe(ma ? tieuDeXong(ma) : '');
    if (ma && navigator.vibrate) { try { navigator.vibrate([200, 100, 200]); } catch { /* máy không cho rung */ } }
  }, [ma]);
  if (!ma) return null;
  const tat = () => { const n = daBao(kq.nho, ma); datNho(n); ghiNho(n); };
  return (
    <div className="nt-state on bao-don" role="status">
      <Ico ten="check" s={18} />
      <div>Đơn #{ma} đã sẵn sàng — mời bạn ra quầy</div>
      <button type="button" className="bao-don-xem" onClick={() => { tat(); moDon(ma); }}>Xem đơn</button>
      <button type="button" className="bao-don-tat" aria-label="Tắt thông báo" onClick={tat}><Ico ten="close" s={14} /></button>
    </div>
  );
}
