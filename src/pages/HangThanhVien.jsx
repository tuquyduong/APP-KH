import { useState } from 'react';
import { dungGia } from '../heThong.js';
import { dungCua, cuaToi } from '../duLieuKhach.js';
import { bayGio } from '../bayGio.js';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { hangCoGiam, goiBan, goiMacDinh, tietKiem, nutMua, tietKiemMotTrieu, giaCot, coDacBiet, trangThaiTheUuDai } from '../giaHang.js';
import { nd, ndDau, ndHien } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import { Ico, MedHang } from '../components/BieuTuong.jsx';
import '../giaoDien/the_hang.css';

// Màn "Hạng thành viên" (/uudai/hang?h=<id>) theo bản thiết kế chủ quán duyệt 14.11 (Màn 2, KH-THE-2): So sánh nhanh ở NGAY dưới đầu màn (chạm một cột = chọn hạng),
// gói + "Mua ngay" ngay dưới bảng (đi thẳng Thanh toán thẻ — không qua giỏ), "<hạng> còn có", ghi chú cộng dồn. Khách vãng lai xem được; chỉ Mua cần đăng nhập.
// Số liệu CHỈ từ /hang (tên, %, gói, quyền lợi) + /toi (hạng, hạn) của POS; "Chi 1 triệu, tiết kiệm" và "Tiết kiệm" của gói App tự tính để hiện.
const POS = ndDau('tier.pos'), TU_TINH = ndDau('tier.tutinh');
const ngay = (s) => dinhDangNgay(String(s || '').slice(0, 10));

/** Dòng phụ đầu màn = tình trạng của khách; CHỈ vẽ khi App đã biết khách (`daBiet` — chỉ khi đó mới đọc /toi). */
function PhuToi({ ds }) {
  const toi = dungCua(cuaToi);
  if (!Array.isArray(ds)) return null; // /hang chưa về: chưa biết hạng của khách là hạng bán hay quán tặng
  const tt = trangThaiTheUuDai(ds, toi.dl && toi.dl.khach ? toi.dl.khach.hang : null, bayGio());
  const h = tt && tt.hang;
  const [k, bien] = !tt || tt.kieu === 'chua' ? ['tier.phu.thuong'] : tt.kieu === 'tang' ? [h.het_han === null ? 'tier.phu.tangKhongHan' : 'tier.phu.tang', { hang: h.ten }]
    : h.het_han ? ['tier.phu.hang', { hang: h.ten, ngay: ngay(h.het_han) }] : ['tier.phu.hangKhongHan', { hang: h.ten }];
  return <span {...ndDau(k)}>{nd(k, bien)}</span>;
}

/** Một ô của bảng: `k` = khoá chữ (mục danh mục) hoặc `pos` (số POS / App tự tính đã định dạng). */
const O = ({ lop = '', dau, children }) => <span className={`o ${lop}`} {...dau}>{children}</span>;

function SoSanh({ ds, h, doiHang }) {
  const db = coDacBiet(ds);
  // Ô số: phần tử ngoài gắn khoá POS / App tự tính; chữ định dạng ("{phanTram}%", "/ tháng", "—") gắn đúng khoá của nó (sửa được ở /admin).
  const pt = (x, lop) => (typeof x === 'number' && x > 0 ? <span className={lop} {...ndDau('tier.cmp.pt')}>{nd('tier.cmp.pt', { phanTram: x })}</span> : <span {...ndDau('tier.cmp.trong')}>{nd('tier.cmp.trong')}</span>);
  const gia = (x) => { const c = giaCot(x); return c.gia === null ? <O dau={ndDau(c.k)}><span className="ss-gia">{nd(c.k)}</span></O> : <O dau={POS}><span className="ss-gia">{dinhDangGia(c.gia)}</span><span className="ss-phu" {...ndDau(c.k)}>{nd(c.k, { so: c.so })}</span></O>; };
  const loi = (x) => { const t = tietKiemMotTrieu(x); return <O dau={TU_TINH}>{t === null ? <span {...ndDau('tier.cmp.trong')}>{nd('tier.cmp.trong')}</span> : <span className="ss-loi">{dinhDangGia(t)}</span>}</O>; };
  return (
    <div className="ss-khung">
      <div className={`ss${ds.length > 3 ? ' ss-rong' : ''}`} role="radiogroup" aria-label={nd('tier.cmp')} style={{ '--cot': ds.length + 1 }}>
        <div className="ss-nhan">
          <span className="o o-dau" />
          <Chu k="tier.cmp.giam" className="o" />
          {db && <Chu k="tier.cmp.db" className="o" />}
          <Chu k="tier.cmp.loi" className="o" />
          <Chu k="tier.cmp.gia" className="o" />
        </div>
        <div className="ss-cot c-thuong">
          <span className="o o-dau"><Chu k="tier.cmp.thuong" className="ss-ten" /><Chu k="tier.cmp.khongHang" className="ss-phu" /></span>
          <Chu k="tier.cmp.trong" className="o mo" />
          {db && <Chu k="tier.cmp.trong" className="o mo" />}
          <Chu k="tier.cmp.khong" className="o mo" />
          <O dau={ndDau('tier.cmp.mienPhi')}><span className="ss-gia">{nd('tier.cmp.mienPhi')}</span></O>
        </div>
        {ds.map((x) => {
          const on = x.id === h.id;
          return (
            <button type="button" key={x.id} role="radio" aria-checked={on} className={`ss-cot ${x.chi_cap === true ? 'l2' : 'l1'}${on ? ' on' : ''}`} onClick={() => doiHang(x.id)}>
              {on && <Chu k="tier.cmp.dang" className="ss-dang" />}
              <O lop="o-dau"><MedHang tang={x.chi_cap === true} s={22} /><span className="ss-ten" {...POS}>{x.ten}</span></O>
              <O dau={POS}>{pt(x.phan_tram, 'ss-so')}</O>
              {db && <O dau={POS}>{pt(x.phan_tram_nhom_dac_biet, 'ss-so nho')}</O>}
              {loi(x)}
              {gia(x)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HangThanhVien({ daBiet, hId, doiHang, lui, mua }) {
  const { dsHang, hangToi } = dungGia(); // hangToi { id, ten } do App đọc /toi (đã đăng nhập, đã biết khách)
  const ds = hangCoGiam(dsHang);
  const h = ds.find((x) => String(x.id) === String(hId)) || (hangToi && ds.find((x) => x.id === hangToi.id)) || ds.find((x) => goiBan(x).length) || ds[0] || null;
  const [chon, datChon] = useState(null); // { id hạng, so_thang } gói khách vừa bấm
  const goi = goiBan(h);
  const g = (chon && h && chon.id === h.id && goi.find((x) => x.so_thang === chon.so_thang)) || goiMacDinh(h);
  const nut = nutMua(dsHang, hangToi, h);
  const benPos = h && Array.isArray(h.quyen_loi) ? h.quyen_loi.filter((x) => typeof x === 'string' && x.trim()) : [];
  const lyDo = nut.lyDo === 'chiCap' ? ['tier.mo.tang'] : nut.lyDo === 'caoHon' ? ['tier.mo.caoHon', { hang: nut.hang }] : nut.lyDo === 'chuaBan' ? ['tier.mo.chuaBan'] : null;
  const [kNut, bienNut] = nut.kieu === 'giaHan' ? ['tier.nut.giaHan', { hang: h.ten, so: g.so_thang }] : nut.kieu === 'mua' ? ['tier.nut.mua', { hang: h.ten, so: g.so_thang }] : ['tier.nut.mo', { hang: h ? h.ten : '' }];
  return (
    <Man id="buycard">
      <DauManCon tieuDe={nd('tier.tieuDe')} phu={daBiet ? <PhuToi ds={dsHang} /> : <span {...ndDau('tier.phu.thuong')}>{nd('tier.phu.thuong')}</span>} lui={lui} canTrai />
      {h && (
        <>
          {ndHien('hien.tier.cmp') && (
            <>
              <div className="ss-dau"><Chu k="tier.cmp" as="h2" /><Chu k="tier.cmp.chon" as="small" /></div>
              <SoSanh ds={ds} h={h} doiHang={doiHang} />
            </>
          )}
          {goi.length > 0 && nut.kieu !== 'mo' && (
            <>
              <div className="ti-goi" {...ndDau('tier.goi')}>{nd('tier.goi', { hang: h.ten })}</div>
              <div className="ti-buy" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(3, goi.length))},minmax(0,1fr))` }}>
                {goi.map((x) => {
                  const tk = tietKiem(goi, x);
                  return (
                    <button type="button" key={x.so_thang} aria-pressed={!!g && g.so_thang === x.so_thang} className={g && g.so_thang === x.so_thang ? 'on' : ''} onClick={() => datChon({ id: h.id, so_thang: x.so_thang })}>
                      <small {...ndDau('tier.thang')}>{nd('tier.thang', { so: x.so_thang })}</small><b {...POS}>{dinhDangGia(x.gia)}</b>
                      {tk && <em {...ndDau('tier.tietKiem')}>{nd('tier.tietKiem', { gia: dinhDangGia(tk) })}</em>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <button type="button" className={`checkout-btn${nut.kieu === 'mo' ? ' btn-disabled' : ''}`} aria-disabled={nut.kieu === 'mo'} onClick={nut.kieu === 'mo' ? undefined : () => mua(h, g)}>
            <span {...ndDau(kNut)}>{nd(kNut, bienNut)}</span>{nut.kieu !== 'mo' && <span {...POS}>{dinhDangGia(g.gia)}</span>}
          </button>
          {lyDo ? <div className="tl-note" role="note" {...ndDau(lyDo[0])}>{nd(lyDo[0], lyDo[1])}</div>
            : <div className="ti-qr"><Ico ten="qr" s={14} /><Chu k="tier.qr" /></div>}
          {ndHien('hien.tier.ben') && (
            <div className="ti-ben">
              <div className="ti-ben-t" {...ndDau('tier.ben')}>{nd('tier.ben', { hang: h.ten })}</div>
              <div><Ico ten="check" s={16} /><Chu k="tier.ben.chung" /></div>
              {benPos.map((t, i) => <div key={i} {...POS}><Ico ten="check" s={16} /><span>{t}</span></div>)}
            </div>
          )}
          {ndHien('hien.tier.note') && <Chu k="tier.note" as="div" className="ti-note" />}
        </>
      )}
    </Man>
  );
}
