import { useEffect, useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { bayGio } from '../bayGio.js';
import { ghepMon } from '../tracNghiem.js';
import { TU_KHOA_MON } from '../noiDung/theChat.js';
import { homNayTuGio, ngayChuoi, docNgay, theNgay, luoiThang, leTrongThang, chuThich, upList, bangCoNhac, conLai, dayThang } from '../kehoach.js';
import { viecNgay, nhacDangCo, quaHan, danhDauNgay, timViec, tickLan, jd, dm } from '../kehoachLap.js';
import Man from '../components/Man.jsx';
import { Ico, DenLong } from '../components/BieuTuong.jsx';
import { AnhMon } from '../components/MonO.jsx';
import BangNgay, { HangViec } from '../components/BangNgay.jsx';
import BangQuaHan from '../components/BangQuaHan.jsx';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import { THU_NGAN } from '../noiDung/coDinh/lich.js';
import Thongbao from '../components/Thongbao.jsx';
import { bam } from '../components/bam.js';
import { TranhTienIch } from '../components/BieuTuongTienIch.jsx';
import { dungKeHoach, dungPhut, layNgayMo, SU_KIEN_MO_NGAY, hoSoKhach, moMucSapToi, tienIchCuaNhac, ocHien } from '../components/dungKeHoach.js';

// Lưới 6 ô của demo (patch35 TOOLS): [mã tiện ích, tên, biểu tượng, mã nhãn chuThich].
const TIEN_ICH = [['theomua', 'fan', 'mua'], ['vankhan', 'book', 'vk'], ['ngaycannho', 'gift', 'ngay'], ['xeco', 'scooter', 'xe'], ['uongthuoc', 'mortar', 'thuoc'], ['chuky', 'moon', 'chuky']]; // tên ô: khoá kh.o.<mã>

/** Biểu tượng tranh tròn (demo EN): file the-chat-<tên>.svg tách từ demo; đèn lồng vẽ thẳng. */
export function TranhTron({ ten, s }) {
  return ten === 'lantern' ? <DenLong s={s} /> : <img className="en" src={`/anh/the-chat-${ten}.svg`} width={s} height={s} alt="" />;
}

/** Đầu màn con kiểu demo (nút quay lại + tiêu đề + nút phải). */
export function DauMan({ tieuDe, phu, lui, phai, khoaTieuDe, khoaPhu }) {
  return (
    <div className="topbar" style={{ justifyContent: 'flex-start', gap: 12 }}>
      <div className="back-btn" aria-label={nd('khung.quayLai')} {...bam(lui)}><Ico ten="back" s={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}><h1 {...(khoaTieuDe ? ndDau(khoaTieuDe) : {})}>{tieuDe}</h1><div className="sub" {...(khoaPhu ? ndDau(khoaPhu) : {})}>{phu}</div></div>
      {phai}
    </div>
  );
}

/** Màn Kế hoạch và nhắc việc (demo màn `lich`). `san` = đã biết khách là ai. */
export default function KeHoach({ san = true, lui, moTienIch, moTracNghiem, coKetQuaTn = false, ds = [], chonMon, homNay: homNayCho, gio: gioCho, xungHo: xungCho }) {
  dungPhut(); // chữ đếm "10 phút nữa" vẽ lại mỗi khi phút (giờ POS) đổi
  const homNay = homNayCho || homNayTuGio(bayGio());
  const { bang, luu, xoaHet } = dungKeHoach(san);
  const [mo0] = useState(layNgayMo); // { ngay, moBang }: mở từ "Sắp tới" / dải nhắc việc / kết quả tìm
  const [chon, datChon] = useState(() => docNgay(mo0.ngay) || homNay);
  const [thang, datThang] = useState(() => ({ y: chon.y, m: chon.m }));
  const [bangNgay, datBangNgay] = useState(mo0.moBang && !!docNgay(mo0.ngay));
  const [bangQua, datBangQua] = useState(false);
  const [tim, datTim] = useState('');
  const [tb, datTb] = useState('');
  const [hoiXoa, datHoiXoa] = useState(false);

  // Lưu + báo (chủ quán 09.11: xoá rồi thì xoá luôn; tick nhầm thì bấm lại ô tròn).
  const lam = (moi, chu) => {
    if (!san) { datTb(nd('ti.chuaSan')); return false; }
    if (!luu(moi)) { datTb(nd('kh.loiKho')); return false; }
    datTb(chu);
    return true;
  };
  const moNgay = (d, m, y) => { chonNgay(d, m, y); datBangNgay(true); };
  useEffect(() => {
    const nhay = () => { const { ngay, moBang } = layNgayMo(); const n = docNgay(ngay); if (n) { datChon(n); datThang({ y: n.y, m: n.m }); datBangNgay(!!moBang); datBangQua(false); } };
    window.addEventListener(SU_KIEN_MO_NGAY, nhay);
    return () => window.removeEventListener(SU_KIEN_MO_NGAY, nhay);
  }, []);
  const doiThang = (n) => { let m = thang.m + n, y = thang.y; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } datThang({ y, m }); };
  const chonNgay = (d, m, y) => { datChon({ d, m, y }); if (m !== thang.m) datThang({ y, m }); };
  const veHomNay = () => { datChon(homNay); datThang({ y: homNay.y, m: homNay.m }); };
  const xungKh = xungCho !== undefined ? xungCho : hoSoKhach().xung_ho;
  const bangNhac = bangCoNhac(bang, homNay, xungKh); // + sinh nhật, giỗ, dịp cúng đã bật nhắc (việc ảo chỉ để tính chuông / nhắc)
  const dauNgay = (() => { const l0 = jd({ d: 1, m: thang.m, y: thang.y }) - 7; return danhDauNgay(bangNhac, l0, l0 + 50, homNay); })(); // phủ cả ô tháng trước / sau trên lưới
  const coViec = (d, m, y) => dauNgay.get(jd({ d, m, y }));

  const the = theNgay(chon, homNay);
  const o = luoiThang(thang.y, thang.m, homNay, chon, coViec);
  const viec = viecNgay(bang, ngayChuoi(chon));
  const nhac = nhacDangCo(bangNhac, gioCho || bayGio(), homNay);
  const nQua = quaHan(bang, homNay).length, ketQuaTim = timViec(bang, tim).slice(0, 20);
  const xung = xungKh, sapToi = upList(homNay, bang, xung);
  const monTiet = [];
  the.tip[1].forEach((id) => ghepMon(ds, [TU_KHOA_MON[id]], TU_KHOA_MON).forEach((m) => monTiet.includes(m) || monTiet.push(m)));

  return (
    <Man id="lich">
      <DauMan tieuDe={nd('kh.tieuDe')} phu={nd('kh.phu')} khoaTieuDe="kh.tieuDe" khoaPhu="kh.phu" lui={lui}
        phai={<div className="today-btn" {...bam(veHomNay)} {...ndDau('kh.homNay')}>{nd('kh.homNay')}</div>} />
      <div id="calNoti">
        {nhac.map((x) => <div key={x.v.id + x.ngay} className="nt-bar on" {...bam(() => { const di = tienIchCuaNhac(x.v); if (di) { moTienIch(di); return; } const n = docNgay(x.ngay); moNgay(n.d, n.m, n.y); })}><span>🔔 {x.chu}</span></div>)}
      </div>
      {nQua > 0 && <div className="nt-state qua-han" id="calQuaHan" role="button" tabIndex={0} {...bam(() => datBangQua(true))}><span {...ndDau('kh.quaHan')}>{ndPhan('kh.quaHan', { so: nQua })}</span><span>›</span></div>}
      <div className="tim-viec"><input type="search" id="timViec" placeholder={nd('kh.timGoiY')} aria-label={nd('kh.timAria')} value={tim} onChange={(e) => datTim(e.target.value)} /></div>
      {tim.trim() && (
        <div id="timKetQua">
          {ketQuaTim.length
            ? ketQuaTim.map((v) => <div key={v.id} className="tl-row" {...bam(() => { const n = docNgay(v.ngay); chonNgay(n.d, n.m, n.y); datBangNgay(true); })}><div className="tl-rt"><b>{v.tieu}</b><small>{dm(jd(docNgay(v.ngay)), null)}{v.gio ? ' · ' + v.gio : ''}{v.lap ? ' · ↻' : ''}</small></div></div>)
            : <div className="empty-note" {...ndDau('kh.timKhong')}>{nd('kh.timKhong')}</div>}
        </div>
      )}

      <div className="cal-hero" id="calHero" {...ndDau('kh.lich')}>
        <div className="ch-ring"><TranhTron ten={the.mua.ic} s={40} /></div>
        <div className="ch-l"><div className="wd">{the.thu}</div><div className="big">{the.lon}</div><div className="my">{the.thang}</div></div>
        <div className="ch-r"><div className="k" {...ndDau('kh.am')}>{nd('kh.am')}</div><div className="ld">{the.ngayAm}<small>{the.thangAm}</small></div>
          <div className="cc">{the.namCanChi}<br />{the.thangNgayCanChi}</div></div>
        <div className="ch-term"><span className="tchip"><TranhTron ten="sprig" s={16} /> {the.chip}</span><span className="tleft">{the.conLai}</span></div>
        {the.le && <div className="ch-hol"><Ico ten="flag" s={13} /> {the.le}</div>}
      </div>

      <div className="tl-grid" id="toolGrid">
        <div className="tl-h" {...ndDau('kh.tienIch')}>{nd('kh.tienIch')}</div>
        <div className="tl-g six">
          {TIEN_ICH.filter(([id]) => ocHien(id, xung)).map(([id, ic, nhan]) => (
            <div key={id} className="tl" {...bam(() => moTienIch(id))}>
              <div className="tl-ic"><TranhTienIch ten={ic} s={38} /></div><b {...ndDau(`kh.o.${id}`)}>{nd(`kh.o.${id}`)}</b><small>{chuThich(nhan, homNay, bang)}</small>
            </div>
          ))}
        </div>
        <div className="up-strip">
          <div className="up-h"><b {...ndDau('kh.sapToi')}>{nd('kh.sapToi')}</b>{sapToi.length ? <span {...bam(() => moTienIch('saptoi'))} {...ndDau('kh.xemTatCa')}>{ndPhan('kh.xemTatCa', { so: sapToi.length })}</span> : <span />}</div>
          {sapToi.slice(0, 3).map((e, i) => (
            <div className="up-r" key={`${e.j}-${i}`} {...bam(() => moMucSapToi(e, { moViec: (ngay) => { const n = docNgay(ngay); chonNgay(n.d, n.m, n.y); }, moTienIch }))}>
              <i>{dayThang(e.j)}</i><span>{e.t}</span><small>{conLai(e.j, homNay)}</small>
            </div>
          ))}
          {!sapToi.length && <div className="up-r"><span className="muted" {...ndDau('kh.sapToiTrong')}>{nd('kh.sapToiTrong')}</span></div>}
        </div>
      </div>

      <div className="cal-card">
        <div className="cal-nav"><span aria-label={nd('kh.thangTruoc')} {...bam(() => doiThang(-1))}>‹</span><b {...ndDau('kh.thang')}>{ndPhan('kh.thang', { m: thang.m, y: thang.y })}</b><span aria-label={nd('kh.thangSau')} {...bam(() => doiThang(1))}>›</span></div>
        <div className="cal-wd" {...ndDau('kh.lich')}>{[...THU_NGAN.slice(1), THU_NGAN[0]].map((t, i) => <span key={t} className={i === 6 ? 'sun' : undefined}>{t}</span>)}</div>
        <div className="cal-grid">
          {o.map((c) => (
            <div key={`${c.y}-${c.m}-${c.d}`} className={`cd ${[c.ngoai ? 'out' : '', c.homNay ? 'today' : '', c.chon ? 'sel' : '', c.cn ? 'sun' : '', c.le ? 'hol' : ''].join(' ')}`} {...bam(() => moNgay(c.d, c.m, c.y))}>
              <b>{c.d}</b><small>{c.am}</small>{c.tiet && <em>{c.tiet}</em>}
              <span className="dots">{c.coViec && <Ico ten="bell" s={10} lop={`cd-chuong ${c.coViec}`} />}{c.le && <i className="dh" />}</span>
            </div>
          ))}
        </div>
        <div className="cal-legend"><span><Ico ten="bell" s={10} lop="cd-chuong viec" /><span {...ndDau('kh.chuViec')}>{nd('kh.chuViec')}</span></span><span><i className="dh" /><span {...ndDau('kh.chuLe')}>{nd('kh.chuLe')}</span></span><span><em>Aa</em><span {...ndDau('kh.chuTiet')}>{nd('kh.chuTiet')}</span></span></div>
      </div>

      <div className="ds-card" id="calTip">
        <div className="ds-h" {...ndDau('kh.duongSinh')}>{ndPhan('kh.duongSinh', { tiet: the.tiet })}</div>
        <div className="ds-t">{the.tip[0]}</div>
        {monTiet.length > 0 && (
          <>
            <div className="ds-k" {...ndDau('kh.monHop')}>{nd('kh.monHop')}</div>
            <div className="ds-prods">{monTiet.map((m) => <div key={m.ma} className="ds-p" style={{ background: 'var(--cream)' }} {...bam(() => chonMon(m))}><AnhMon mon={m} s={30} /><span>{m.ten}</span></div>)}</div>
          </>
        )}
        {!coKetQuaTn && moTracNghiem && <div className="ds-tc cta" {...bam(moTracNghiem)}><TranhTron ten="fan" s={22} /> <span {...ndDau('kh.khaoSat')}>{nd('kh.khaoSat')}</span></div>}
      </div>

      <div className="sec-head" id="calAgendaHead"><h2 {...ndDau('kh.viecCua')}>{ndPhan('kh.viecCua', { d: chon.d, m: chon.m })}</h2><span className="more" {...bam(() => datBangNgay(true))}><Ico ten="plus" s={13} /> <span {...ndDau('kh.themViec')}>{nd('kh.themViec')}</span></span></div>
      <div id="calAgenda">
        {viec.length ? viec.map((v) => (
          <HangViec key={v.id} v={v} homNay={homNay} mo={() => datBangNgay(true)}
            tick={() => lam(tickLan(bang, v.id, v.ngay, homNay), v.xong ? nd('kh.boDau') : nd('kh.daXong', { tieu: v.tieu }))} />
        )) : <div className="empty-note" {...ndDau('kh.viecTrong')}>{nd('kh.viecTrong')}</div>}
      </div>

      <div className="sec-head"><h2 {...ndDau('kh.leThang')}>{nd('kh.leThang')}</h2></div>
      <div className="hol-list" id="calHols" {...ndDau('kh.leDuong')}>
        {(() => {
          const le = leTrongThang(thang.y, thang.m);
          return le.length ? le.map((h) => <div key={h.n} className="hl" {...bam(() => chonNgay(h.d, thang.m, thang.y))}><b>{h.d}/{thang.m}</b><span>{h.n}{h.al}</span></div>) : <div className="empty-note" {...ndDau('kh.leTrong')}>{nd('kh.leTrong')}</div>;
        })()}
      </div>
      <div className="care-disclaimer" style={{ marginTop: 14 }} {...ndDau('kh.ghiChuLich')}>{nd('kh.ghiChuLich')}</div>
      <div className="care-disclaimer" style={{ marginTop: 8 }} {...ndDau('kh.ghiChuLuu')}>{nd('kh.ghiChuLuu')}</div>
      <div className="tl-acts" style={{ justifyContent: 'center', marginTop: 10 }}>
        {hoiXoa
          ? <span {...bam(() => { datTb(xoaHet() ? nd('kh.daXoaHet') : nd('kh.khongXoaDuoc')); datHoiXoa(false); })} {...ndDau('kh.xoaHoiLai')}>{nd('kh.xoaHoiLai')}</span>
          : <span {...bam(() => datHoiXoa(true))} {...ndDau('kh.xoaHet')}>{nd('kh.xoaHet')}</span>}
      </div>

      {bangNgay && <BangNgay ngay={ngayChuoi(chon)} homNay={homNay} bang={bang} lam={lam} dong={() => datBangNgay(false)} />}
      {bangQua && <BangQuaHan homNay={homNay} bang={bang} lam={lam} dong={() => datBangQua(false)} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
