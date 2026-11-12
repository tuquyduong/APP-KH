import { useState } from 'react';
import { DL, MENU, THE_CHAT, TU_KHOA_MON } from '../noiDung/theChat.js';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import { moTaKetQua, goiYMon, soanGopY } from '../tracNghiem.js';
import { bayGio } from '../bayGio.js';
import Man, { DauManCon } from '../components/Man.jsx';
import MonO from '../components/MonO.jsx';
import KhoiTheChat from '../components/KhoiTheChat.jsx';
import AnhTheChat from '../components/AnhTheChat.jsx';
import Thongbao from '../components/Thongbao.jsx';
import { Ico, IcoVe } from '../components/BieuTuong.jsx';

// Ghi chú ở đầu kết quả (demo tcrNotes). "Trao đổi với quán" chỉ có khi quán đã khai cách liên hệ (`moHoTro` rỗng thì ẩn).
function GhiChu({ kl, moHoTro }) {
  const lienKet = moHoTro && <span className="tc-link" role="button" tabIndex={0} onClick={moHoTro} onKeyDown={(e) => { if (e.key === 'Enter') moHoTro(); }} {...ndDau('tnk.traoDoi')}>{nd('tnk.traoDoi')}</span>;
  return (
    <div>
      {kl.conflict && <div className="tc-note"><Ico ten="chat" s={16} /><div><Chu k="tnk.xungDot" />{lienKet}</div></div>}
      {kl.many && <div className="tc-note"><Ico ten="warning" s={16} /><div><Chu k="tnk.nhieuThe" />{lienKet}</div></div>}
      {kl.anToan.length > 0 && <div className="tc-note warn"><Ico ten="warning" s={16} /><div><Chu k="tnk.anToanTruoc" />{' '}<b {...ndDau('tnl.cauHoi')}>{kl.anToan.join('; ')}</b><Chu k="tnk.anToanSau" /></div></div>}
    </div>
  );
}

function KhoiChinh({ kl, ds, tra }) {
  const { kind, picks, tendOk, t } = kl;
  if (kind === 'binh') return <><KhoiTheChat khoa="bh" nhan={nd('tnk.nhomChinh')} />{tendOk.slice(0, 1).map((g) => <KhoiTheChat key={g} khoa={g} nhan={nd('tnk.nhomNhe')} nhe ds={ds} tra={tra} />)}</>;
  if (kind === 'none') return <KhoiTheChat khoa="bh" nhan={nd('tnk.goiYTam')} />;
  return (
    <>
      <KhoiTheChat khoa={picks[0]} nhan={nd('tnk.nhomChinh')} nhe={kind === 'tend'} ds={ds} tra={tra} />
      {picks[1] && <KhoiTheChat khoa={picks[1]} nhan={nd('tnk.nhomPhu')} nhe={kind === 'tend' || t[picks[1]] < 40} ds={ds} tra={tra} />}
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
  const gy = goiYMon(DL, MENU, TU_KHOA_MON, kl, dsMenu, bayGio());
  const the = THE_CHAT[picks[0]];
  const thu = kl.kind === 'main' || kl.kind === 'tend';

  const luu = () => datThongBao(tn.luuLai() ? nd('tnk.daLuuToast') : nd('tnk.khongLuuDuoc'));
  const xoa = () => { tn.xoa(); veGioiThieu(); };
  const saoChep = () => {
    const chu = soanGopY(DL, kl, tra, gopY);
    (navigator.clipboard ? navigator.clipboard.writeText(chu) : Promise.reject()).then(() => datThongBao(nd('tnk.daSaoChep')), () => datThongBao(nd('tnk.chuanBiGopY')));
  };

  return (
    <Man id="tcr">
      <DauManCon canTrai tieuDe={nd('tnk.tieuDe')} phu={nd('tnk.phu')} lui={lui} />
      <div className="tcr-hero">
        <div className="tcr-medal" style={{ '--c': the.mau }}><AnhTheChat khoa={picks[0]} s={88} /></div>
        <Chu k={kl.kind === 'none' ? 'tnk.ketQuaCuaBan' : 'tnk.coXuHuong'} as="div" className="k" />
        <div className="h" {...ndDau('tnk.the')}>{mo.tieuDe}</div>
        {thu && <div className="h2" {...ndDau('tnk.the')}>{picks.map((g) => THE_CHAT[g].han).join(' · ')}</div>}
        <div className="lvl" {...ndDau('tnk.the')}>{mo.huy}</div>
        <div className="s" {...ndDau('tnk.the')}>{mo.phu}</div>
      </div>
      <GhiChu kl={kl} moHoTro={moHoTro} />
      <div className="card tcr-sec"><Chu k="tnk.tongThe" as="div" className="tt" /><div className="tx" {...ndDau('tnk.the')}>{mo.tong}</div></div>
      <KhoiChinh kl={kl} ds={ds} tra={tra} />
      {kl.dropped.length > 0 && (
        <div className="tc-note"><IcoVe ten="help" s={16} /><div><b {...ndDau('tnk.deRieng')}>{nd('tnk.deRieng')}</b>{' '}<span {...ndDau('tnk.deRiengCau')}>{nd('tnk.deRiengCau', { nhom: kl.dropped.map((g) => G[g].name).join(', '), khiHau: nd(kl.khiHau === 'lanh' ? 'tnk.khiHauLanh' : 'tnk.khiHauNong') })}</span></div></div>
      )}

      {dsMenu && (
        <>
          <div className="sec-head"><h2><span {...ndDau('tnk.monQuan')}>{nd('tnk.monQuan')}</span> · <span {...ndDau('tnk.soMon')}>{ndPhan('tnk.soMon', { so: gy.mon.length })}</span></h2></div>
          <div className="grid2">
            {gy.mon.length ? gy.mon.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />) : <Chu k="tnk.hoiNhanVien" as="div" className="empty-note" style={{ gridColumn: '1/-1' }} />}
          </div>
        </>
      )}
      <div className="card tcr-sec" style={{ marginTop: 12 }}>
        <Chu k="tnk.nenChon" as="div" className="tt" /><ul className="tb-ul ok" {...ndDau('tnk.mon')}>{gy.nen.map((x) => <li key={x}>{x}</li>)}</ul>
        {gy.tranh.length > 0 && <><Chu k="tnk.nenHanChe" as="div" className="tt" /><ul className="tb-ul no" {...ndDau('tnk.mon')}>{gy.tranh.map((x) => <li key={x}>{x}</li>)}</ul></>}
        <Chu k={gy.an ? 'tnk.luuYAnToan' : 'tnk.luuYThuong'} as="div" className="care-disclaimer" />
      </div>

      <div className="card tcr-sec">
        <Chu k="tnk.diemTungNhom" as="div" className="tt" />
        <Chu k="tnk.chuThichDiem" as="div" className="care-disclaimer" style={{ margin: '0 0 8px' }} />
        <div {...ndDau('tnk.diem')}>
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
        <details className="card tcr-sec tcr-det"><summary {...ndDau('tnk.xemLai')}>{nd('tnk.xemLai')}</summary>
          <table className="ans-t" {...ndDau('tnk.diem')}><tbody>
            {ds.map((q, i) => {
              const o = q.options.find((x) => x.value === tra[i]);
              return <tr key={q.id}><td>{i + 1}. {q.text}<br /><small>{q.scales.map((s) => G[s.group].name + (s.reverse ? ` ${nd('tnk.tinhNguoc')}` : '')).join(', ')}</small></td><td>{o ? `${o.label}. ${o.text}` : ''}</td></tr>;
            })}
          </tbody></table>
        </details>
      )}
      <details className="card tcr-sec tcr-det"><summary {...ndDau('tnk.gopY')}>{nd('tnk.gopY')}</summary>
        <textarea className="note-in" style={{ minHeight: 80, marginTop: 8 }} placeholder={nd('tnk.gopYMau')} value={gopY} onChange={(e) => datGopY(e.target.value)} aria-label={nd('tnk.gopY')} />
        <button type="button" className="hq-b" style={{ marginTop: 8 }} onClick={saoChep} {...ndDau('tnk.saoChep')}>{nd('tnk.saoChep')}</button>
      </details>

      {daLuu ? (
        <>
          <div className="save-ok" role="status"><Ico ten="check" s={14} /> <span {...ndDau('tnk.daLuu')}>{nd('tnk.daLuu')}</span></div>
          <div className="hq-btns"><button type="button" className="hq-b ghost" onClick={xoa} {...ndDau('tnk.xoa')}>{nd('tnk.xoa')}</button></div>
        </>
      ) : (
        <div className="save-box"><div><Chu k="tnk.luuTieuDe" as="b" /><Chu k="tnk.luuPhu" as="small" /></div><button type="button" className="hq-b" onClick={luu} {...ndDau('tnk.dongYLuu')}>{nd('tnk.dongYLuu')}</button></div>
      )}
      <button type="button" className="ghost-btn" onClick={lamLai} {...ndDau('tnk.lamLai')}>{nd('tnk.lamLai')}</button>
      <Chu k="tnk.nguon" as="div" className="tcr-src" />
      <Thongbao chu={thongBao} het={() => datThongBao('')} />
    </Man>
  );
}
