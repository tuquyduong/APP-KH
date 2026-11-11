import { useRef } from 'react';
import { ndDau } from '../noiDung/nd.js';
import { dungAnhSangLuot } from './anhSangLuot.js';
import { bam } from './bam.js';
import Chu from './Chu.jsx';

// Banner khuyến mãi "Hôm nay" (demo todayCard, bản trên ảnh thật), LUÔN hiện ở Trang chủ. `qc` = kết quả chonQuangCao (tính một lần ở App, dùng chung với dải):
// chữ từ POS gắn khoá "pos"; chữ mặc định sửa ở danh mục today.*. Không hiện ngày vì chưa có giờ POS (bay_gio — KH-API-2 v2).
// Ánh sáng lướt chéo: bộ đo dùng chung với dải (anhSangLuot.js). Không có nút ✕ (chủ quán 09.11, KH-UI-5d).
export default function BannerHomNay({ anh, qc, chon }) {
  const the = useRef(null);
  const { tieuDe, phu, nut, macDinh } = qc;
  const dau = (khoa) => (macDinh ? ndDau(khoa) : ndDau('qc.pos'));
  dungAnhSangLuot(the, [tieuDe, phu, nut]);

  return (
    <div className="today fx-a photo" ref={the} {...(chon ? bam(chon) : {})}>
      <div className="t-bg" {...ndDau('today.bg')}><img className="t-img" src={anh} alt="" /></div>
      <div className="t-shade" />
      <i className="gl gl-a" />
      <div className="t-txt">
        <div className="t-k gl gl-t"><span className="dot" /><Chu k="today.k" /></div>
        <b className="gl gl-t" {...dau('today.t')}>{tieuDe}</b>
        {phu && <span className="t-s gl gl-t" {...dau('today.s')}>{phu}</span>}
      </div>
      {nut && chon && <span className="t-cta gl gl-b" {...dau('today.cta')}>{nut}</span>}
    </div>
  );
}
