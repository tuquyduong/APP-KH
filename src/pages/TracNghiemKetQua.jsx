import { useState } from 'react';
import { DL, MENU, THE_CHAT, TU_KHOA_MON } from '../noiDung/theChat.js';
import { KET_QUA as CHU } from '../noiDung/tracNghiemChu.js';
import { moTaKetQua, goiYMon, soanGopY } from '../tracNghiem.js';
import { gioVn } from '../menuLuu.js';
import Man, { DauManCon } from '../components/Man.jsx';
import MonO from '../components/MonO.jsx';
import KhoiTheChat from '../components/KhoiTheChat.jsx';
import AnhTheChat from '../components/AnhTheChat.jsx';
import Thongbao from '../components/Thongbao.jsx';
import { Ico, IcoVe } from '../components/BieuTuong.jsx';

// Ghi chú ở đầu kết quả (demo tcrNotes). "Trao đổi với quán" chỉ có khi quán đã khai cách liên hệ (`moHoTro` rỗng thì ẩn).
function GhiChu({ kl, moHoTro }) {
  const lienKet = moHoTro && <span className="tc-link" role="button" tabIndex={0} onClick={moHoTro} onKeyDown={(e) => { if (e.key === 'Enter') moHoTro(); }}>{CHU.traoDoi}</span>;
  return (
    <div>
      {kl.conflict && <div className="tc-note"><Ico ten="chat" s={16} /><div>{CHU.xungDot}{lienKet}</div></div>}
      {kl.many && <div className="tc-note"><Ico ten="warning" s={16} /><div>{CHU.nhieuThe}{lienKet}</div></div>}
      {kl.anToan.length > 0 && <div className="tc-note warn"><Ico ten="warning" s={16} /><div>{CHU.anToanTruoc}<b>{kl.anToan.join('; ')}</b>{CHU.anToanSau}</div></div>}
    </div>
  );
}

function KhoiChinh({ kl, ds, tra }) {
  const { kind, picks, tendOk, t } = kl;
  if (kind === 'binh') return <><KhoiTheChat khoa="bh" nhan={CHU.nhomChinh} />{tendOk.slice(0, 1).map((g) => <KhoiTheChat key={g} khoa={g} nhan={CHU.nhomNhe} nhe ds={ds} tra={tra} />)}</>;
  if (kind === 'none') return <KhoiTheChat khoa="bh" nhan={CHU.goiYTam} />;
  return (
    <>
      <KhoiTheChat khoa={picks[0]} nhan={CHU.nhomChinh} nhe={kind === 'tend'} ds={ds} tra={tra} />
      {picks[1] && <KhoiTheChat khoa={picks[1]} nhan={CHU.nhomPhu} nhe={kind === 'tend' || t[picks[1]] < 40} ds={ds} tra={tra} />}
    </>
  );
}

// Màn kết quả (demo `tcr`). `hien` = { kl, ds, tra, ngay, daLuu }: vừa làm xong thì còn câu trả lời trong bộ nhớ (để "Xem lại từng câu"), mở lại bản đã lưu thì không.
// `menu` = menu của App (món của quán: ghép tên với "nên chọn"; không có menu thì chỉ hiện phần chữ — không giả lập món).
export default function TracNghiemKetQua({ tn, menu, lui, lamLai, chonMon, moHoTro, veGioiThieu }) {
  const { hien } = tn;
  const [thongBao, datThongBao] = useState('');
  const [gopY, datGopY] = useState('');
  if (!hien) return null;
  const { kl, ds, tra, daLuu } = hien;
  const { t, picks } = kl, G = DL.groups;
  const mo = moTaKetQua(DL, kl);
  const dsMenu = menu.dl ? menu.dl.data : null;
  const gy = goiYMon(DL, MENU, TU_KHOA_MON, kl, dsMenu, gioVn());
  const the = THE_CHAT[picks[0]];
  const thu = kl.kind === 'main' || kl.kind === 'tend';

  const luu = () => datThongBao(tn.luuLai() ? CHU.daLuuToast : CHU.khongLuuDuoc);
  const xoa = () => { tn.xoa(); veGioiThieu(); };
  const saoChep = () => {
    const chu = soanGopY(DL, kl, tra, gopY);
    (navigator.clipboard ? navigator.clipboard.writeText(chu) : Promise.reject()).then(() => datThongBao(CHU.daSaoChep), () => datThongBao(CHU.chuanBiGopY));
  };

  return (
    <Man id="tcr">
      <DauManCon canTrai tieuDe={CHU.tieuDe} phu={CHU.phu} lui={lui} />
      <div className="tcr-hero">
        <div className="tcr-medal" style={{ '--c': the.mau }}><AnhTheChat khoa={picks[0]} s={88} /></div>
        <div className="k">{kl.kind === 'none' ? CHU.ketQuaCuaBan : CHU.coXuHuong}</div>
        <div className="h">{mo.tieuDe}</div>
        {thu && <div className="h2">{picks.map((g) => THE_CHAT[g].han).join(' · ')}</div>}
        <div className="lvl">{mo.huy}</div>
        <div className="s">{mo.phu}</div>
      </div>
      <GhiChu kl={kl} moHoTro={moHoTro} />
      <div className="card tcr-sec"><div className="tt">{CHU.tongThe}</div><div className="tx">{mo.tong}</div></div>
      <KhoiChinh kl={kl} ds={ds} tra={tra} />
      {kl.dropped.length > 0 && (
        <div className="tc-note"><IcoVe ten="help" s={16} /><div><b>{CHU.deRieng}</b> nhóm {kl.dropped.map((g) => G[g].name).join(', ')} có điểm khá cao, nhưng bạn cho biết mình {kl.khiHau === 'lanh' ? 'chịu nóng tốt hơn, sợ lạnh' : 'chịu lạnh tốt hơn, sợ nóng'}, nên chưa đưa vào kết luận. Nếu muốn rõ hơn, bạn có thể trao đổi trực tiếp.</div></div>
      )}

      {dsMenu && (
        <>
          <div className="sec-head"><h2>{CHU.monQuan} · {gy.mon.length} món</h2></div>
          <div className="grid2">
            {gy.mon.length ? gy.mon.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />) : <div className="empty-note" style={{ gridColumn: '1/-1' }}>{CHU.hoiNhanVien}</div>}
          </div>
        </>
      )}
      <div className="card tcr-sec" style={{ marginTop: 12 }}>
        <div className="tt">{CHU.nenChon}</div><ul className="tb-ul ok">{gy.nen.map((x) => <li key={x}>{x}</li>)}</ul>
        {gy.tranh.length > 0 && <><div className="tt">{CHU.nenHanChe}</div><ul className="tb-ul no">{gy.tranh.map((x) => <li key={x}>{x}</li>)}</ul></>}
        <div className="care-disclaimer">{gy.an ? CHU.luuYAnToan : CHU.luuYThuong}</div>
      </div>

      <div className="card tcr-sec">
        <div className="tt">{CHU.diemTungNhom}</div>
        <div className="care-disclaimer" style={{ margin: '0 0 8px' }}>{CHU.chuThichDiem}</div>
        <div>
          {['bh', ...kl.ranked].map((g) => (
            <div key={g} className={`sbar${picks.includes(g) ? ' on' : ''}${g === 'bh' ? ' bh' : ''}`}>
              <div className="sl"><b>{G[g].name}</b><small>{THE_CHAT[g].han}</small></div>
              <div className="st"><i style={{ width: `${Math.max(2, t[g])}%`, background: THE_CHAT[g].mau }} /></div>
              <div className="sv">{t[g]}<small>{g === 'bh' ? kl.bhLevel : kl.muc[g]}</small></div>
            </div>
          ))}
        </div>
      </div>

      {ds && (
        <details className="card tcr-sec tcr-det"><summary>{CHU.xemLai}</summary>
          <table className="ans-t"><tbody>
            {ds.map((q, i) => {
              const o = q.options.find((x) => x.value === tra[i]);
              return <tr key={q.id}><td>{i + 1}. {q.text}<br /><small>{q.scales.map((s) => G[s.group].name + (s.reverse ? CHU.tinhNguoc : '')).join(', ')}</small></td><td>{o ? `${o.label}. ${o.text}` : ''}</td></tr>;
            })}
          </tbody></table>
        </details>
      )}
      <details className="card tcr-sec tcr-det"><summary>{CHU.gopY}</summary>
        <textarea className="note-in" style={{ minHeight: 80, marginTop: 8 }} placeholder={CHU.gopYMau} value={gopY} onChange={(e) => datGopY(e.target.value)} aria-label={CHU.gopY} />
        <button type="button" className="hq-b" style={{ marginTop: 8 }} onClick={saoChep}>{CHU.saoChep}</button>
      </details>

      {daLuu ? (
        <>
          <div className="save-ok" role="status"><Ico ten="check" s={14} /> {CHU.daLuu}</div>
          <div className="hq-btns"><button type="button" className="hq-b ghost" onClick={xoa}>{CHU.xoa}</button></div>
        </>
      ) : (
        <div className="save-box"><div><b>{CHU.luuTieuDe}</b><small>{CHU.luuPhu}</small></div><button type="button" className="hq-b" onClick={luu}>{CHU.dongYLuu}</button></div>
      )}
      <button type="button" className="ghost-btn" onClick={lamLai}>{CHU.lamLai}</button>
      <div className="tcr-src">{CHU.nguon}</div>
      <Thongbao chu={thongBao} het={() => datThongBao('')} />
    </Man>
  );
}
