import { dungGia } from '../heThong.js';
import { dungCua, cuaToi } from '../duLieuKhach.js';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { hangCoGiam, goiBan, goiMacDinh, tietKiem, nutMua, lopHang, laHangChiCap } from '../giaHang.js';
import { nd, ndDau, ndHien } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { useState } from 'react';
import '../giaoDien/the_hang.css';

// Màn "Hạng thành viên" (/uudai/hang?h=<id>) — chép demo #buycard `renderTier` bản cuối (KH-THE-1). Khách vãng lai xem được; chỉ Mua cần đăng nhập.
// Số liệu CHỈ từ /hang (tên, %, gói, quyền lợi) + /toi (hạng, hạn) của POS; tiết kiệm App tự tính để hiện. KHÔNG có (POS chưa có dữ liệu — lý do (a)):
// hàng "Điểm ×…", "Giao nội thành" của bảng so sánh, khối "Điều kiện lên Kim cương", dải "Demo · xem như khách hạng".
const POS = ndDau('tier.pos');
const goiChu = (h) => goiBan(h).map((g) => nd('tier.thang', { so: g.so_thang })).join(nd('tier.hoac'));

/** Thẻ "Hạng hiện tại" (đã đăng nhập). `hang` = /toi.khach.hang (null = Thường). */
function TheHienTai({ hang, dsHang, banDau }) {
  const phu = !hang ? (banDau ? nd('tier.moiMua', { hang: banDau.ten }) : '')
    : laHangChiCap(dsHang, hang.id) ? nd('ud.hang.tang') : hang.het_han ? nd('tier.conHan', { ngay: dinhDangNgay(String(hang.het_han).slice(0, 10)) }) : hang.het_han === null ? nd('ud.hang.khongHan') : '';
  const kPhu = !hang ? 'tier.moiMua' : laHangChiCap(dsHang, hang.id) ? 'ud.hang.tang' : hang.het_han ? 'tier.conHan' : 'ud.hang.khongHan';
  return (
    <div className={`ti-card ${lopHang(hang, dsHang)}`}>
      <Chu k="tier.hienTai" as="small" />
      <b {...(hang ? POS : ndDau('tier.thuong'))}>{hang ? hang.ten : nd('tier.thuong')}</b>
      {phu && <span {...ndDau(kPhu)}>{phu}</span>}
    </div>
  );
}

export default function HangThanhVien({ dangNhap, hId, doiHang, lui, mua }) {
  const { dsHang } = dungGia();
  const toi = dungCua(cuaToi);
  const hangToi = dangNhap && toi.dl && toi.dl.khach ? toi.dl.khach.hang || null : null;
  const ds = hangCoGiam(dsHang);
  const h = ds.find((x) => String(x.id) === String(hId)) || (hangToi && ds.find((x) => x.id === hangToi.id)) || ds.find((x) => goiBan(x).length) || ds[0] || null;
  const [chon, datChon] = useState(null); // { id hạng, so_thang } gói khách vừa bấm
  const goi = goiBan(h);
  const g = (chon && h && chon.id === h.id && goi.find((x) => x.so_thang === chon.so_thang)) || goiMacDinh(h);
  const nut = nutMua(dsHang, hangToi, h);
  const banDau = ds.find((x) => goiBan(x).length) || null;
  const benPos = h && Array.isArray(h.quyen_loi) ? h.quyen_loi.filter((x) => typeof x === 'string' && x.trim()) : [];
  const lop = (x) => (x.chi_cap === true ? 'l2' : 'l1');
  const lyDo = nut.lyDo === 'chiCap' ? ['ud.hang.tang'] : nut.lyDo === 'caoHon' ? ['tier.mo.caoHon', { hang: nut.hang }] : nut.lyDo === 'chuaBan' ? ['tier.mo.chuaBan'] : null;
  const [kNut, bienNut] = nut.kieu === 'giaHan' ? ['tier.nut.giaHan', { hang: h.ten, so: g.so_thang }] : nut.kieu === 'mua' ? ['tier.nut.mua', { hang: h.ten, so: g.so_thang }] : ['tier.nut.mo', { hang: h ? h.ten : '' }];
  return (
    <Man id="buycard">
      <DauManCon tieuDe={nd('tier.tieuDe')} phu={nd('tier.sub')} lui={lui} />
      {dangNhap && toi.dl && ndHien('hien.tier.card') && <TheHienTai hang={hangToi} dsHang={dsHang} banDau={banDau} />}
      {h && (
        <>
          <div className="ti-tabs">{ds.map((x) => <button type="button" key={x.id} className={x.id === h.id ? `on ${lop(x)}` : ''} onClick={() => doiHang(x.id)} {...POS}>{x.ten}</button>)}</div>
          <div className="ti-how" {...ndDau(h.chi_cap === true ? 'ud.hang.tang' : 'tier.how')}>{h.chi_cap === true ? nd('ud.hang.tang') : goi.length ? nd('tier.how', { goi: goiChu(h) }) : nd('tier.mo.chuaBan')}</div>
          {ndHien('hien.tier.ben') && (
            <div className="ti-ben">
              {benPos.length > 0
                ? benPos.map((t, i) => <div key={i} {...POS}><Ico ten="check" s={16} /><span>{t}</span></div>)
                : <>
                  <div {...ndDau('tier.ben.giam')}><Ico ten="check" s={16} /><span>{nd('tier.ben.giam', { phanTram: h.phan_tram })}</span></div>
                  {h.phan_tram_nhom_dac_biet > 0 && <div {...ndDau('tier.ben.db')}><Ico ten="check" s={16} /><span>{nd('tier.ben.db', { phanTram: h.phan_tram_nhom_dac_biet })}</span></div>}
                </>}
            </div>
          )}
          {goi.length > 0 && nut.kieu !== 'mo' && (
            <div className="ti-buy" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(3, goi.length))},1fr)` }}>
              {goi.map((x) => {
                const tk = tietKiem(goi, x);
                return (
                  <button type="button" key={x.so_thang} className={g && g.so_thang === x.so_thang ? 'on' : ''} onClick={() => datChon({ id: h.id, so_thang: x.so_thang })}>
                    <small {...ndDau('tier.thang')}>{nd('tier.thang', { so: x.so_thang })}</small><b {...POS}>{dinhDangGia(x.gia)}</b>
                    <em {...ndDau(tk ? 'tier.tutinh' : 'tier.tietKiem')}>{tk ? nd('tier.tietKiem', { gia: dinhDangGia(tk) }) : ' '}</em>
                  </button>
                );
              })}
            </div>
          )}
          <button type="button" className={`checkout-btn${nut.kieu === 'mo' ? ' btn-disabled' : ''}`} aria-disabled={nut.kieu === 'mo'} onClick={nut.kieu === 'mo' ? undefined : () => mua(h, g)} {...ndDau(kNut)}>{nd(kNut, bienNut)}</button>
          {lyDo && <div className="tl-note" role="note" {...ndDau(lyDo[0])}>{nd(lyDo[0], lyDo[1])}</div>}
          {!lyDo && ndHien('hien.tier.note') && <Chu k="tier.buynote" as="div" className="tl-note" />}
          {ndHien('hien.tier.cmp') && (
            <>
              <div className="sec-head"><Chu k="tier.cmp" as="h2" /></div>
              <table className="ti-cmp">
                <tbody>
                  <tr><th />{[{ id: '', ten: nd('tier.thuong') }, ...ds].map((x) => <th key={x.id || 'thuong'} className={x.id ? lop(x) : ''} {...(x.id ? POS : ndDau('tier.thuong'))}>{x.ten}</th>)}</tr>
                  <tr><Chu k="tier.cmp.gia" as="td" />
                    <td className={!hangToi ? 'me' : ''} {...ndDau('tier.cmp.giaThuong')}>{nd('tier.cmp.giaThuong')}</td>
                    {ds.map((x) => <td key={x.id} className={hangToi && hangToi.id === x.id ? 'me' : ''} {...POS}>{nd('tier.cmp.giam', { phanTram: x.phan_tram })}</td>)}
                  </tr>
                  <tr><Chu k="tier.cmp.cach" as="td" />
                    <td className={!hangToi ? 'me' : ''} {...ndDau('tier.cmp.macDinh')}>{nd('tier.cmp.macDinh')}</td>
                    {ds.map((x) => { const k = x.chi_cap === true ? 'tier.cmp.quanTang' : 'tier.cmp.muaThe'; return <td key={x.id} className={hangToi && hangToi.id === x.id ? 'me' : ''} {...ndDau(k)}>{nd(k)}</td>; })}
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </Man>
  );
}
