import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DL } from '../noiDung/theChat.js';
import { nd, ndPhan, ndDs, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man from '../components/Man.jsx';

const GIAY_CHUYEN_CAU = 170; // demo tcPick: tô đáp án rồi sang câu sau sau ngần này mili giây
const GIAY_MOI_CAU = 7.5;    // demo: ước lượng 7,5 giây một câu cho dòng "còn khoảng N phút"

// Hỏi xác nhận khi thoát giữa chừng (bảng đáy như .sheet của demo).
function HoiThoat({ thoat, o }) {
  return createPortal(
    <div className="sheet show" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) o(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={nd('tnl.thoatT')}>
        <Chu k="tnl.thoatT" as="h3" style={{ textAlign: 'center' }} />
        <Chu k="tnl.thoatPhu" as="div" className="pin-sub" />
        <button type="button" className="checkout-btn giua" onClick={o} {...ndDau('tnl.thoatO')}>{nd('tnl.thoatO')}</button>
        <button type="button" className="ghost-btn" onClick={thoat} {...ndDau('tnl.thoatDi')}>{nd('tnl.thoatDi')}</button>
      </div>
    </div>,
    document.querySelector('.phone') || document.body,
  );
}

// Màn câu hỏi (demo `tcq`): thanh tiến độ, 4 mức A–D, quay lại câu trước; "Hai câu cuối" = kiểm tra chéo nóng / lạnh + tình trạng đặc biệt theo giới.
// Bấm quay lại ở câu đầu → hỏi xác nhận rồi thoát (bài chưa làm xong không được lưu).
export default function TracNghiemLam({ tn, thoat, xemKetQua }) {
  const b = tn.bai;
  const [hoi, datHoi] = useState(false);
  const cho = useRef(null);
  useEffect(() => () => clearTimeout(cho.current), []);
  if (!b) return null;

  const n = b.ds.length;
  const quayLai = () => { if (!tn.lui()) { if (b.tra.some((x) => x !== null)) datHoi(true); else thoat(); } };
  const chon = (v) => {
    if (cho.current) return;
    tn.chon(v);
    cho.current = setTimeout(() => { cho.current = null; tn.tiep(); }, GIAY_CHUYEN_CAU);
  };
  const q = b.ds[b.i];
  const con = Math.max(1, Math.round((n - b.i) * GIAY_MOI_CAU / 60));
  const khoaTua = b.cuoi ? 'tnl.cuoi' : 'tnl.cau';
  const tuaDe = nd(khoaTua, { so: b.i + 1, tong: n });
  const tienDo = b.cuoi ? 100 : Math.round(b.i / n * 100);

  return (
    <Man id="tcq">
      <div className="topbar trai">
        <button type="button" className="back-btn" aria-label={nd('khung.quayLai')} onClick={quayLai}><svg className="ico" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-back" /></svg></button>
        <div style={{ flex: 1 }}><h1 {...ndDau(khoaTua)}>{tuaDe}</h1><div className="tcq-bar"><i style={{ width: `${tienDo}%` }} /></div></div>
      </div>
      {b.cuoi ? (
        <>
          <div className="tcq-card safe"><Chu k="tnl.kiemTraCheo" as="div" className="k" /><Chu k="tnl.hoiKhiHau" as="div" className="q" /></div>
          <div className="tcq-opts">
            {ndDs('tnl.khiHau').map(({ ma: v, nhan }) => <button type="button" key={v} className={`tc-opt${b.khiHau === v ? ' on' : ''}`} aria-pressed={b.khiHau === v} onClick={() => tn.datKhiHau(v)} {...ndDau('tnl.khiHau')}><i className="rd" />{nhan}</button>)}
            <div className="tcq-card safe" style={{ marginTop: 14, minHeight: 0 }}><Chu k="tnl.cauAnToan" as="div" className="k" /><Chu k="tnl.hoiAnToan" as="div" className="q" style={{ fontSize: 16 }} /><Chu k="tnl.chuAnToan" as="div" className="tcq-sub" /></div>
            {DL.safetyChecklist[b.gioiTinh].map((t) => {
              const bat = b.anToan.includes(t);
              return <button type="button" key={t} className={`tc-opt chkopt${bat ? ' on' : ''}`} aria-pressed={bat} onClick={() => tn.batTatAnToan(t)}><i className="cb">{bat ? '✓' : ''}</i><span {...ndDau('tnl.cauHoi')}>{t}</span></button>;
            })}
            <button type="button" className="checkout-btn giua" onClick={() => { tn.xong(); xemKetQua(); }} {...ndDau('tnl.xemKetQua')}>{nd('tnl.xemKetQua')}</button>
          </div>
        </>
      ) : (
        <>
          <div className="tcq-card">
            <div className="k"><Chu k="tnl.ba" />{q.only && <> · <Chu k={q.only === 'nu' ? 'tnl.danhChoNu' : 'tnl.danhChoNam'} className="tag-sex" /></>}<span className="tleft2" {...ndDau('tnl.conLai')}>{ndPhan('tnl.conLai', { so: con })}</span></div>
            <div className="q" {...ndDau('tnl.cauHoi')}>{q.text}</div>
          </div>
          <div className="tcq-opts">
            {q.options.map((o) => (
              <button type="button" key={o.value} className={`tc-opt abcd${b.tra[b.i] === o.value ? ' on' : ''}`} aria-pressed={b.tra[b.i] === o.value} onClick={() => chon(o.value)}><i className="let">{o.label}</i><span className="ot" {...ndDau('tnl.cauHoi')}>{o.text}</span></button>
            ))}
          </div>
          <Chu k="tnl.luuY" as="div" className="care-disclaimer" style={{ textAlign: 'center', marginTop: 14 }} />
        </>
      )}
      {hoi && <HoiThoat o={() => datHoi(false)} thoat={() => { datHoi(false); thoat(); }} />}
    </Man>
  );
}
