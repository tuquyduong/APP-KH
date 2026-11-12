import { Fragment } from 'react';
import { DL, THE_CHAT, THU_TU_NHOM } from '../noiDung/theChat.js';
import { nd, ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import { dinhDangNgay } from '../dinhDang.js';
import Man, { DauManCon } from '../components/Man.jsx';
import AnhTheChat from '../components/AnhTheChat.jsx';
import { bam } from '../components/bam.js';

const META = ['tn.meta1', 'tn.meta2', 'tn.meta3']; // ba viên nhỏ dưới huy hiệu (khoá nội dung)

// Màn giới thiệu (demo `tc`): chọn Nam / Nữ → "Bắt đầu làm bài"; có kết quả đã lưu thì thẻ "Kết quả đã lưu · <ngày>" mở lại kết quả.
// Câu trả lời và kết quả chỉ nằm trên máy khách (dungTracNghiem.js) — màn này không gửi gì đi.
export default function TracNghiem({ tn, lui, vaoLam, moKetQua }) {
  const { luu, klLuu, gioiTinh } = tn;
  const bat = () => { if (tn.batDau()) vaoLam(); };
  const the = klLuu ? THE_CHAT[klLuu.picks[0]] : null;
  return (
    <Man id="tc">
      <DauManCon canTrai tieuDe={nd('tn.tieuDe')} phu={nd('tn.phu')} lui={lui} />
      <div className="pt-hero">
        <div className="pt-medal"><img src={ndAnh('tn.anh')} width="70" height="70" alt="" {...ndDau('tn.anh')} /></div>
        <Chu k="tn.nhan" as="div" className="pt-k" />
        <Chu k="tn.dong1" as="div" className="pt-h" />
        <Chu k="tn.dong2" as="div" className="pt-s" />
        <div className="pt-meta">{META.map((m, i) => <Fragment key={m}>{i > 0 && <i />}<Chu k={m} /></Fragment>)}</div>
      </div>
      <div className="pt-src">
        <div className="pt-src-h"><img src={ndAnh('tn.seal')} width="26" height="26" alt="" {...ndDau('tn.seal')} /> <Chu k="tn.coSo.t" /></div>
        <p><Chu k="tn.coSo1.a" /> <b {...ndDau('tn.coSo1.b')}>{nd('tn.coSo1.b')}</b><Chu k="tn.coSo1.c" /></p>
        <p className="pt-by"><Chu k="tn.coSo2.a" /> <b {...ndDau('tn.coSo2.b')}>{nd('tn.coSo2.b')}</b> <Chu k="tn.coSo2.c" /></p>
      </div>
      <div className="pt-step">
        <div className="pt-step-h"><Chu k="tn.buoc1.a" /> <Chu k="tn.buoc1.b" as="div" style={{ display: 'inline' }} /></div>
        <div className="sex-row">
          {['nam', 'nu'].map((ma) => (
            <button type="button" key={ma} className={`sex${gioiTinh === ma ? ' on' : ''}`} aria-pressed={gioiTinh === ma} onClick={() => tn.datGioiTinh(ma)}><Chu k={`tn.${ma}.t`} as="b" /><Chu k={`tn.${ma}.phu`} as="small" /></button>
          ))}
        </div>
      </div>
      <button type="button" className={`checkout-btn${gioiTinh ? '' : ' btn-disabled'}`} style={{ justifyContent: 'center' }} aria-disabled={!gioiTinh} onClick={bat} {...ndDau('tn.batDau')}>{nd('tn.batDau')}</button>
      <Chu k="tn.camKet" as="div" className="care-disclaimer" style={{ textAlign: 'center', marginTop: 8 }} />
      {the && (
        <div className="tc-prev" {...bam(moKetQua)}>
          <AnhTheChat khoa={klLuu.picks[0]} s={44} />
          <div style={{ flex: 1 }}><div className="k"><span {...ndDau('tn.daLuu')}>{nd('tn.daLuu')}</span> · {dinhDangNgay(luu.ngay.slice(0, 10))}</div><div className="h" {...ndDau('tn.the')}>{the.phai} <span>{the.han}</span></div></div>
          <div className="chev">›</div>
        </div>
      )}
      <div className="sec-head"><Chu k="tn.chin" as="h2" /></div>
      <div className="tc-types" {...ndDau('tn.the')}>
        {THU_TU_NHOM.map((k) => <div className="tc-type" key={k}><AnhTheChat khoa={k} s={32} /><b>{DL.groups[k].name}</b><small>{THE_CHAT[k].han}</small></div>)}
      </div>
    </Man>
  );
}
