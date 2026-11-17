import { useEffect, useRef, useState } from 'react';
import { layVi } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungCua, cuaToi, cuaGoiNap } from '../duLieuKhach.js';
import { dinhDangGia } from '../dinhDang.js';
import { nd, ndDau, ndHien, ndPhan } from '../noiDung/nd.js';
import { dongVi, gioNgayVi, goiNapDs, khoaDongVi, nhanLoaiVi, thuongGoi } from '../viTien.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import { KhungLoi } from '../components/TrangTai.jsx';
import BangNoi from '../components/BangNoi.jsx';
import { Ico, IcoVe } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';
import '../giaoDien/vi_tien.css';

// Ví của tôi (/uudai/vi, KH-NAP-1 — bản thiết kế 16.11 Màn 2–3): số dư (/toi), nút Nạp tiền (ẩn khi /goi-nap đang tải / lỗi / rỗng — N4 a), lịch sử ví
// (GET /vi trang 1 khi mở màn, "Xem thêm" nối trang sau, khuôn Lịch sử đơn), bảng chọn gói (`nap` = đường dẫn có ?nap=1 — Back của điện thoại đóng bảng).
// Mọi số tiền từ POS; App chỉ trừ vao − tra cho nhãn thưởng (N3).
const layTrang1 = () => layVi(1);
const TRANG_SAU_RONG = { ds: [], trang: 1, conNua: null, dang: false, loi: '' };
const sach = (dl) => (dl && Array.isArray(dl.data) ? dl.data.map(dongVi).filter(Boolean) : []);
const coDau = (n) => `${n < 0 ? '−' : '+'}${dinhDangGia(Math.abs(n))}`;
const pos = ndDau('vt.pos');

function DongVi({ d, moDon }) {
  const ten = nhanLoaiVi(d.loai);
  const lop = d.loai === 'dieu_chinh' ? 'dc' : d.soTien < 0 ? 'ra' : 'vao';
  const phu = [gioNgayVi(d.ngay), ten ? d.ghiChu : ''].filter(Boolean).join(' · ');
  return (
    <div className={`tx-item${d.maDon ? ' vt-mo' : ''}`} {...(d.maDon ? bam(() => moDon(d.maDon)) : {})}>
      <div className={`ic vt-ic ${lop}`}>{lop === 'dc' ? <IcoVe ten="wallet" s={22} /> : <Ico ten={lop === 'ra' ? 'minus' : 'plus'} s={22} />}</div>
      <div className="info">
        <div className="t" {...(ten ? ndDau(ten) : pos)}>{ten ? nd(ten) : d.ghiChu}</div>
        <div className="d" {...pos}>{phu}</div>
        {d.loai === 'nap' && d.thuong > 0 && <div className="vt-thuong" {...ndDau('vt.dong.thuong')}>{nd('vt.dong.thuong', { thuong: dinhDangGia(d.thuong) })}</div>}
      </div>
      <div className={`amt ${d.soTien < 0 ? 'minus vt-tru' : 'plus vt-cong'}`} {...pos}>{coDau(d.soTien)}</div>
      {d.maDon && <span className="vt-chev" aria-hidden="true">›</span>}
    </div>
  );
}

/** Bảng chọn gói (Màn 3, N2 a): mỗi gói một ô chọn theo đúng thứ tự /goi-nap; chưa chọn → nút mờ. Không có ô tự gõ số tiền. */
function BangGoi({ ds, dong, chon }) {
  const [ma, datMa] = useState(null);
  const g = ds.find((x) => x.ma === ma) || null;
  return (
    <BangNoi tieuDe={nd('vt.goi.tieuDe')} phu={nd('vt.goi.phu')} dong={dong}>
      <div className="vt-goi-ds" role="radiogroup" aria-label={nd('vt.goi.tieuDe')}>
        {ds.map((x) => {
          const th = thuongGoi(x), dang = x.ma === ma;
          return (
            <div key={x.ma} className={`vt-goi${dang ? ' chon' : ''}`} {...bam(() => datMa(x.ma))} role="radio" aria-checked={dang}>
              <span className="vt-goi-o">{dang && <Ico ten="check" s={14} />}</span>
              <div className="vt-goi-chu">
                <div className="vt-goi-ten" {...ndDau('vt.goi.pos')}>{x.ten}</div>
                <div className="vt-goi-so" {...ndDau('vt.goi.so')}>{ndPhan('vt.goi.so', { tra: dinhDangGia(x.tra), vao: <b key="vao" {...ndDau('vt.goi.pos')}>{dinhDangGia(x.vao)}</b> })}</div>
              </div>
              {th > 0 && <span className="vt-goi-thuong" {...ndDau('vt.goi.thuong')}>{nd('vt.goi.thuong', { thuong: dinhDangGia(th) })}</span>}
            </div>
          );
        })}
      </div>
      <button type="button" className={`checkout-btn vt-tiep${g ? '' : ' btn-disabled'}`} aria-disabled={!g} onClick={() => { if (g) chon(g); }}>
        <span {...ndDau(g ? 'vt.goi.tiep' : 'vt.goi.chon')}>{g ? nd('vt.goi.tiep', { tra: dinhDangGia(g.tra) }) : nd('vt.goi.chon')}</span><span>→</span>
      </button>
      <Chu k="vt.goi.nho" as="div" className="vt-goi-nho" />
    </BangNoi>
  );
}

export default function ViTien({ nap, lui, moNap, dongNap, chonGoi, moDon }) {
  const toi = dungCua(cuaToi);
  const dsGoi = goiNapDs(dungCua(cuaGoiNap).dl);
  const coNap = dsGoi.length > 0 && ndHien('hien.vt.nap');
  const dau = dungTai(layTrang1);
  const [sau, datSau] = useState(TRANG_SAU_RONG);
  // Trang 1 tải lại mà danh sách ĐỔI (dòng mới đẩy dòng cũ sang trang sau — OFFSET): bỏ các trang sau đã xem (khuôn Lịch sử đơn).
  const ds1 = sach(dau.dl);
  const khoa1 = ds1.map(khoaDongVi).join('|');
  const khoaTruoc = useRef(khoa1);
  useEffect(() => {
    if (khoaTruoc.current && khoa1 !== khoaTruoc.current) datSau(TRANG_SAU_RONG);
    khoaTruoc.current = khoa1;
  }, [khoa1]);
  const conNua = sau.conNua === null ? !!(dau.dl && dau.dl.con_nua) : sau.conNua;
  const ds = ds1.concat(sau.ds).filter((d, i, a) => a.findIndex((c) => khoaDongVi(c) === khoaDongVi(d)) === i);
  const dang = dau.dangTai || sau.dang;
  const loi = dau.loi || sau.loi;
  async function xemThem() {
    const t = sau.trang + 1;
    datSau((s) => ({ ...s, dang: true, loi: '' }));
    try {
      const r = await layVi(t);
      datSau((s) => ({ ds: [...s.ds, ...sach(r)], trang: t, conNua: !!r.con_nua, dang: false, loi: '' }));
    } catch (e) {
      datSau((s) => ({ ...s, dang: false, loi: e.message }));
    }
  }
  const soDu = toi.dl && toi.dl.khach ? dinhDangGia(toi.dl.khach.so_du_vi) : '';
  return (
    <Man id="wallet">
      <DauManCon tieuDe={nd('vt.tieuDe')} phu={nd('vt.phu')} lui={lui} canTrai />
      <div className="vt-hero">
        <Chu k="vt.soDu" as="div" className="lbl" />
        <div className="amt" {...(soDu ? pos : ndDau('vt.chuaSo'))}>{soDu || nd('vt.chuaSo')}</div>
        {coNap && <button type="button" className="vt-hero-nut" onClick={moNap} {...ndDau('vt.nap')}><Ico ten="plus" s={18} />{nd('vt.nap')}</button>}
      </div>
      {ndHien('hien.vt.luat') && <Chu k="vt.luat" as="div" className="vt-luat" />}
      <div className="sec-head"><Chu k="vt.lichSu" as="h2" /></div>
      {ds.length === 0 && !dang && !loi && <Chu k="vt.rong" as="div" className="empty-note" />}
      {ds.length > 0 && <div className="card vt-ds">{ds.map((d) => <DongVi key={khoaDongVi(d)} d={d} moDon={moDon} />)}</div>}
      {dang && <div className="khung-tai" aria-busy="true" />}
      {loi && <KhungLoi loi={loi} thuLai={dau.loi ? dau.taiLai : xemThem} />}
      {conNua && !dang && !loi && <Chu k="vt.xemThem" as="button" type="button" className="ghost-btn vt-them" onClick={xemThem} />}
      {nap && coNap && <BangGoi ds={dsGoi} dong={dongNap} chon={chonGoi} />}
    </Man>
  );
}
