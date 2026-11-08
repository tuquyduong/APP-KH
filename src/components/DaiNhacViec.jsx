import { useEffect, useRef, useState } from 'react';
import { bayGio } from '../bayGio.js';
import { dungKeHoach, datNgayMo } from './dungKeHoach.js';
import { mocNhacTrong, phutTuGio, chuoiJd, dmNgan } from '../kehoachLap.js';
import { Ico } from './BieuTuong.jsx';
import '../giaoDien/bao_don.css';

const GIAY_HOI = 15; // so mốc nhắc với giờ POS mỗi ngần này giây
// Dải "🔔 … " trên cùng MỌI màn khi App đang mở và vừa TỚI mốc nhắc của một việc (KH-UI-5c C2). Khuôn dải BaoDonXong (cùng lớp CSS), không dùng chung code.
// Mỗi mốc chỉ báo một lần (nhớ trong bộ nhớ trang); mốc đã qua lúc chưa mở App không báo ở đây — thanh nhắc đầu màn Kế hoạch lo phần đó.
export default function DaiNhacViec({ san, moNgay }) {
  const { bang } = dungKeHoach(san);
  const [dai, datDai] = useState(null);
  const truoc = useRef(phutTuGio(bayGio())), daBao = useRef(new Set()), mayBang = useRef(bang);
  mayBang.current = bang;
  useEffect(() => {
    const hoi = () => {
      const nay = phutTuGio(bayGio());
      if (Number.isNaN(nay) || nay <= truoc.current) return;
      const moi = mocNhacTrong(mayBang.current, truoc.current, nay).filter((x) => { const k = `${x.v.id}|${x.j}|${x.v.nhac}`; if (daBao.current.has(k)) return false; daBao.current.add(k); return true; });
      truoc.current = nay;
      if (moi.length) {
        const x = moi[moi.length - 1];
        datDai({ ngay: chuoiJd(x.j), chu: moi.length > 1 ? `${moi.length} việc cần nhớ — ${x.v.tieu}` : `${x.v.tieu} (${x.v.gio || dmNgan(x.j)})` });
        if (navigator.vibrate) { try { navigator.vibrate([200, 100, 200]); } catch { /* máy không cho rung */ } }
      }
    };
    const id = setInterval(hoi, GIAY_HOI * 1000);
    document.addEventListener('visibilitychange', hoi);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', hoi); };
  }, []);
  if (!dai) return null;
  return (
    <div className="nt-state on bao-don dai-nhac" role="status">
      <Ico ten="bell" s={18} />
      <div>Nhắc việc: {dai.chu}</div>
      <button type="button" className="bao-don-xem" onClick={() => { datNgayMo(dai.ngay, true); moNgay(); datDai(null); }}>Xem</button>
      <button type="button" className="bao-don-tat" aria-label="Tắt thông báo" onClick={() => datDai(null)}><Ico ten="close" s={14} /></button>
    </div>
  );
}
