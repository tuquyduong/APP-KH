import { Fragment } from 'react';
import { DL, THE_CHAT, THU_TU_NHOM } from '../noiDung/theChat.js';
import { GIOI_THIEU as CHU } from '../noiDung/tracNghiemChu.js';
import { dinhDangNgay } from '../dinhDang.js';
import Man, { DauManCon } from '../components/Man.jsx';
import AnhTheChat from '../components/AnhTheChat.jsx';
import { bam } from '../components/bam.js';

// Màn giới thiệu (demo `tc`): chọn Nam / Nữ → "Bắt đầu làm bài"; có kết quả đã lưu thì thẻ "Kết quả đã lưu · <ngày>" mở lại kết quả.
// Câu trả lời và kết quả chỉ nằm trên máy khách (dungTracNghiem.js) — màn này không gửi gì đi.
export default function TracNghiem({ tn, lui, vaoLam, moKetQua }) {
  const { luu, klLuu, gioiTinh } = tn;
  const bat = () => { if (tn.batDau()) vaoLam(); };
  const the = klLuu ? THE_CHAT[klLuu.picks[0]] : null;
  return (
    <Man id="tc">
      <DauManCon canTrai tieuDe={CHU.tieuDe} phu={CHU.phu} lui={lui} />
      <div className="pt-hero">
        <div className="pt-medal"><img src="/anh/the-chat-scale.svg" width="70" height="70" alt="" /></div>
        <div className="pt-k">{CHU.nhan}</div>
        <div className="pt-h">{CHU.dong1}</div>
        <div className="pt-s">{CHU.dong2}</div>
        <div className="pt-meta">{CHU.meta.map((m, i) => <Fragment key={m}>{i > 0 && <i />}<span>{m}</span></Fragment>)}</div>
      </div>
      <div className="pt-src">
        <div className="pt-src-h"><img src="/anh/the-chat-seal.svg" width="26" height="26" alt="" /> {CHU.coSoTieuDe}</div>
        <p>{CHU.coSo1[0]}<b>{CHU.coSo1[1]}</b>{CHU.coSo1[2]}</p>
        <p className="pt-by">{CHU.coSo2[0]}<b>{CHU.coSo2[1]}</b>{CHU.coSo2[2]}</p>
      </div>
      <div className="pt-step">
        <div className="pt-step-h"><span>{CHU.buoc1[0]}</span>{CHU.buoc1[1]}</div>
        <div className="sex-row">
          {[['nam', CHU.nam], ['nu', CHU.nu]].map(([ma, [ten, phu]]) => (
            <button type="button" key={ma} className={`sex${gioiTinh === ma ? ' on' : ''}`} aria-pressed={gioiTinh === ma} onClick={() => tn.datGioiTinh(ma)}><b>{ten}</b><small>{phu}</small></button>
          ))}
        </div>
      </div>
      <button type="button" className={`checkout-btn${gioiTinh ? '' : ' btn-disabled'}`} style={{ justifyContent: 'center' }} aria-disabled={!gioiTinh} onClick={bat}>{CHU.batDau}</button>
      <div className="care-disclaimer" style={{ textAlign: 'center', marginTop: 8 }}>{CHU.camKet}</div>
      {the && (
        <div className="tc-prev" {...bam(moKetQua)}>
          <AnhTheChat khoa={klLuu.picks[0]} s={44} />
          <div style={{ flex: 1 }}><div className="k">{CHU.daLuu} · {dinhDangNgay(luu.ngay.slice(0, 10))}</div><div className="h">{the.phai} <span>{the.han}</span></div></div>
          <div className="chev">›</div>
        </div>
      )}
      <div className="sec-head"><h2>{CHU.chin}</h2></div>
      <div className="tc-types">
        {THU_TU_NHOM.map((k) => <div className="tc-type" key={k}><AnhTheChat khoa={k} s={32} /><b>{DL.groups[k].name}</b><small>{THE_CHAT[k].han}</small></div>)}
      </div>
    </Man>
  );
}
