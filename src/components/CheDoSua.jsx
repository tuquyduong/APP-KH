// Chế độ sửa của /admin (KH-ADMIN-1 D1–D8) — phủ lên CHÍNH App khách khi có vé quản trị và đang bật sửa.
// Chạm bút ✎ mới mở bảng sửa; chạm chỗ khác App chạy như khách (QĐ 11.11). Bút ✎ / 🔒 vẽ ở MỘT lớp phủ riêng (portal) theo vị trí phần tử [data-nd] —
// KHÔNG chèn phần tử vào nút do React của màn quản lý. Lệnh ghi /api/kh bị chặn ở api.js (goi); nút làm thật không qua mạng chặn ở đây theo NUT_KHOA_KHI_SUA.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DANH_MUC } from '../noiDung/nd/index.js';
import { nd, banDangDung, datLopNhap, ngheNoiDung } from '../noiDung/nd.js';
import { dangSua, batSua, coQuyen, docVe, layNhap, capNhat, boNhap, hoiBanMoi, GIOI_HAN } from '../noiDung/khoNoiDung.js';
import { DS_MAN, taoDuongDan, slugMon } from '../duongDan.js';
import { cuaDon } from '../duLieuKhach.js';
import { dungKho } from '../kho.js';
import { qt, NUT_KHOA_KHI_SUA, NUT_CHI_TRONG_HOI_LAI, CHAN_KHI_SUA } from '../noiDung/quanTri.js';
import Thongbao from './Thongbao.jsx';
import CheDoSuaBang, { hienGiaTri, giaTriChay, tenNguoi, laToi } from './CheDoSuaBang.jsx';

const MUC = new Map(DANH_MUC.map((m) => [m.khoa, m]));
const NGOAI = '.cms-lop, .cms-bar, #sheetCms, .toast';
const loiKhoa = (m) => (!m ? '' : m.khoaBoi === 'pos' ? qt('khoaPos', { chiDuong: m.chiDuong }) : m.khoaBoi === 'tutinh' ? qt('khoaTuTinh') : qt('khoaKhach'));
const giaTriNhap = (bang) => Object.fromEntries(Object.values(bang).map((x) => [x.khoa, x.gia_tri]));

/** Vị trí mọi phần tử [data-nd] đang THẤY trong khung .phone (bị che / ẩn / ngoài màn → bỏ). */
function quetBut(phone) {
  const p = phone.getBoundingClientRect(), ra = [];
  phone.querySelectorAll('[data-nd]').forEach((el) => {
    if (el.closest(NGOAI)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < p.left || cx > p.right || cy < p.top || cy > p.bottom) return;
    const h = document.elementFromPoint(cx, cy);
    if (!h || !(el === h || el.contains(h) || h.closest('.cms-lop'))) return;
    ra.push({ khoa: el.dataset.nd, khoaBoi: el.dataset.ndKhoa || '', x: Math.round(Math.min(r.right - p.left - 12, p.width - 24)), y: Math.round(Math.max(r.top - p.top - 10, 0)), nho: r.height < 40 });
  });
  return ra;
}

/** Đường dẫn cho "Đi tới màn": tham số lấy giá trị có thật đầu tiên; không có → bỏ màn đó. */
function dsManDi(ds, don) {
  const ra = [], da = new Set();
  for (const e of DS_MAN) {
    const tham = {};
    const ok = [...e.mau.matchAll(/:(\w+)/g)].every(([, t]) => {
      if (t === 'slug') tham.slug = ds && ds[0] ? slugMon(ds[0], ds) : '';
      else if (t === 'ma') tham.ma = don && don[0] ? don[0].ma : '';
      else if (e.cho) tham[t] = (Array.isArray(e.cho) ? e.cho : e.cho[t] || [])[0] || '';
      return !!tham[t];
    });
    const duong = ok && taoDuongDan(e.trang, tham);
    if (!duong || da.has(duong)) continue;
    da.add(duong);
    ra.push({ duong, ten: nd(e.tieuDe) + (tham.tienich ? ` · ${tham.tienich}` : ''), dn: !!e.canDN });
  }
  return ra;
}

/** Khung bảng nổi (demo #sheetCms) — role="dialog" để dangKySW không tự tải lại khi đang gõ. */
const Tam = ({ dong, children, lop = '' }) => (
  <div className="sheet show" id="sheetCms" onClick={(e) => { if (e.target === e.currentTarget) dong(); }}>
    <div className={`panel ${lop}`} role="dialog" aria-modal="true">{children}</div>
  </div>
);

export default function CheDoSua({ di, ds }) {
  const [bat, datBat] = useState(dangSua);
  const [nhap, datNhapBang] = useState({}); // khoá → { khoa, gia_tri, nguoi, luc, ban_goc } trên máy chủ
  const [soBan, datSoBan] = useState(() => banDangDung().so_ban);
  const [buts, datButs] = useState([]);
  const [bang, datBang] = useState(null); // { loai: 'sua', khoa, canhBao } | { loai: 'xemLai' | 'diToi' | 'chuMan' }
  const [ghiChu, datGhiChu] = useState('');
  const [dang, datDang] = useState(false);
  const [tb, datTb] = useState('');
  const nhapRef = useRef({});
  const khoDon = dungKho(cuaDon.kho);
  const [phone, datPhone] = useState(null); // khung .phone của App — chỉ có sau lần gắn đầu
  useLayoutEffect(() => { datPhone(document.querySelector('.phone')); }, []);

  const datNhap = (b) => { nhapRef.current = b; datNhapBang(b); datLopNhap(giaTriNhap(b)); };
  const taiNhap = async () => {
    try {
      const d = await layNhap();
      const b = Object.fromEntries((d.nhap || []).map((x) => [x.khoa, x]));
      datSoBan(d.so_ban);
      if (d.so_ban !== banDangDung().so_ban) await hoiBanMoi();
      if (!dangSua()) return b; // đã tắt / thoát trong lúc chờ → KHÔNG bật lại lớp nháp (D4)
      datNhap(b);
      return b;
    } catch (e) { datTb(e.message); return nhapRef.current; }
  };

  // bật / tắt: lớp cms-on trên khung, tải nháp
  useEffect(() => {
    if (!bat || !phone) return undefined;
    phone.classList.add('cms-on');
    taiNhap();
    return () => phone.classList.remove('cms-on');
  }, [bat, phone]);

  // lớp phủ bút: vẽ lại khi cuộn / đổi cỡ / DOM màn đổi / bản nội dung đổi (gộp một khung hình)
  useLayoutEffect(() => {
    if (!bat || !phone) return undefined;
    let hen = 0, cu = '';
    const ve = () => { hen = 0; const b = quetBut(phone), s = JSON.stringify(b); if (s !== cu) { cu = s; datButs(b); } };
    const hoi = () => { if (!hen) hen = requestAnimationFrame(ve); };
    const mo = new MutationObserver((ds) => { if (ds.some((x) => !(x.target.closest ? x.target : x.target.parentElement)?.closest(NGOAI))) hoi(); });
    mo.observe(phone, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
    window.addEventListener('resize', hoi);
    phone.addEventListener('scroll', hoi, true);
    phone.addEventListener('load', hoi, true);
    phone.addEventListener('transitionend', hoi, true);
    const bo = ngheNoiDung(hoi);
    hoi();
    return () => { mo.disconnect(); window.removeEventListener('resize', hoi); phone.removeEventListener('scroll', hoi, true); phone.removeEventListener('load', hoi, true); phone.removeEventListener('transitionend', hoi, true); bo(); cancelAnimationFrame(hen); };
  }, [bat, phone]);

  // nút làm thật không qua mạng (Đăng xuất, xoá trên máy): chặn ở pha bắt
  useEffect(() => {
    if (!bat || !phone) return undefined;
    const chan = (e) => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target.closest && e.target.closest('[data-nd]');
      if (!el || !NUT_KHOA_KHI_SUA.includes(el.dataset.nd)) return;
      if (NUT_CHI_TRONG_HOI_LAI.includes(el.dataset.nd) && !el.closest('.hoi-xoa')) return; // chỉ mở hỏi lại → cho đi tới bước kế
      e.preventDefault(); e.stopPropagation(); datTb(CHAN_KHI_SUA);
    };
    phone.addEventListener('click', chan, true);
    phone.addEventListener('keydown', chan, true);
    return () => { phone.removeEventListener('click', chan, true); phone.removeEventListener('keydown', chan, true); };
  }, [bat, phone]);

  if (!phone) return null;
  if (!bat) return tb ? <Thongbao chu={tb} het={() => datTb('')} /> : null;

  const n = Object.keys(nhap).length;
  const tat = () => { batSua(false); datBang(null); datBat(false); datTb(qt('tatSuaXong')); };
  const dongBang = () => { datBang(null); datLopNhap(giaTriNhap(nhapRef.current)); };
  const moSua = async (khoa) => {
    const cu = nhapRef.current[khoa];
    const moi = (await taiNhap())[khoa];
    const doi = moi && (!cu || cu.luc !== moi.luc) && !laToi(moi.nguoi, docVe()); // nháp đổi do NGƯỜI KHÁC từ lần đọc trước
    datBang({ loai: 'sua', khoa, canhBao: doi ? qt('nguoiKhacLuu', { luc: moi.luc, nguoi: tenNguoi(moi.nguoi) }) : '' });
  };
  // tập màn chụp LÚC BẤM (bảng nổi che màn → lớp bút tính lại thành rỗng)
  const moChuMan = () => datBang({ loai: 'chuMan', man: [...new Set(buts.map((b) => (MUC.get(b.khoa) || {}).man).filter(Boolean))] });
  const moXemLai = async () => { await taiNhap(); datBang({ loai: 'xemLai' }); }; // đọc lại nháp: người khác có thể vừa lưu
  const chamBut = (b) => (b.khoaBoi ? datTb(loiKhoa(MUC.get(b.khoa))) : moSua(b.khoa));
  const toiCho = (khoa) => {
    const el = phone.querySelector(`[data-nd="${CSS.escape(khoa)}"]`);
    if (el) { datBang(null); el.scrollIntoView({ block: 'center' }); } else datTb(qt('oMan', { man: (MUC.get(khoa) || {}).man }));
  };
  const bo = async (khoa) => { try { await boNhap(khoa); } catch (e) { if (e.status !== 404) datTb(e.message); } await taiNhap(); };
  const capNhatHet = async () => {
    datDang(true);
    try {
      const r = await capNhat(soBan, ghiChu);
      await hoiBanMoi();
      await taiNhap();
      datGhiChu(''); datBang(null); datTb(qt('daCapNhat', { so: r.so_ban }));
    } catch (e) {
      if (e.code === 'CO_BAN_MOI_HON') { await hoiBanMoi(); await taiNhap(); datTb(qt('coBanMoi')); } else datTb(e.message);
    }
    datDang(false);
  };

  let noi = null;
  if (bang && bang.loai === 'sua') {
    const m = MUC.get(bang.khoa);
    noi = (
      <Tam dong={dongBang}>
        <CheDoSuaBang key={bang.khoa + (nhap[bang.khoa] ? nhap[bang.khoa].luc : '')} m={m} nhap={nhap[bang.khoa]} soBan={soBan} coSua={coQuyen('nd_sua')} canhBao={bang.canhBao}
          khiGo={(v) => datLopNhap({ ...giaTriNhap(nhapRef.current), ...(v === undefined ? {} : { [m.khoa]: v }) })} khiDaLuu={async () => { await taiNhap(); datBang((b) => (b && b.loai === 'sua' ? { ...b, canhBao: '' } : b)); }} bao={datTb} dong={dongBang} />
      </Tam>
    );
  } else if (bang && bang.loai === 'xemLai') {
    const dsNhap = Object.values(nhap);
    const dai = ghiChu.length > GIOI_HAN.ghi_chu_toi_da;
    noi = (
      <Tam dong={() => datBang(null)}>
        <div className="cs-h"><b>{dsNhap.length ? qt('xemLaiTieu', { so: dsNhap.length }) : qt('khongThayDoi')}</b><button type="button" onClick={() => datBang(null)}>{qt('dong')}</button></div>
        {dsNhap.map((x) => {
          const m = MUC.get(x.khoa);
          return (
            <div className="cs-ch" key={x.khoa} data-xem-lai={x.khoa}>
              <div className="cs-cw"><b>{m ? m.ten : x.khoa}</b><div><del>{m ? hienGiaTri(m, giaTriChay(m)) : null}</del></div><div><ins>{hienGiaTri(m, x.gia_tri)}</ins></div>
                <small>{tenNguoi(x.nguoi)} · {x.luc}</small></div>
              <div className="cs-cb"><button type="button" onClick={() => toiCho(x.khoa)}>{qt('toiCho')}</button><button type="button" className="dg" disabled={!coQuyen('nd_sua')} onClick={() => bo(x.khoa)}>{qt('bo')}</button></div>
            </div>
          );
        })}
        {dsNhap.length > 0 && (
          <>
            <div className="cs-l">{qt('ghiChu')}</div>
            <textarea className="cs-ta" rows={2} value={ghiChu} onChange={(e) => datGhiChu(e.target.value)} aria-label={qt('ghiChu')} />
            {dai && <div className="cs-hint loi">{qt('ghiChuDai', { toiDa: GIOI_HAN.ghi_chu_toi_da })}</div>}
            {!coQuyen('nd_cap_nhat') && <div className="cs-hint loi">{qt('khongQuyenCapNhat')}</div>}
            <button type="button" className="cs-pub" disabled={dang || dai || !coQuyen('nd_cap_nhat')} onClick={capNhatHet}>{qt('capNhatBan', { so: dsNhap.length, ban: soBan + 1 })}</button>
            <div className="cs-hint" style={{ textAlign: 'center' }}>{qt('capNhatGoi')}</div>
          </>
        )}
      </Tam>
    );
  } else if (bang && bang.loai === 'diToi') {
    noi = (
      <Tam dong={() => datBang(null)} lop="short">
        <div className="cs-h"><b>{qt('diToiTieu')}</b><button type="button" onClick={() => datBang(null)}>{qt('dong')}</button></div>
        <div className="cs-go">{dsManDi(ds, khoDon.dl && khoDon.dl.data).map((x) => <button type="button" key={x.duong} onClick={() => { datBang(null); di(x.duong); }}>{x.ten}</button>)}</div>
      </Tam>
    );
  } else if (bang && bang.loai === 'chuMan') {
    const ds2 = DANH_MUC.filter((m) => bang.man.includes(m.man));
    noi = (
      <Tam dong={() => datBang(null)}>
        <div className="cs-h"><b>{qt('chuManTieu', { so: ds2.length })}</b><button type="button" onClick={() => datBang(null)}>{qt('dong')}</button></div>
        <div className="cs-hint">{ds2.length ? qt('chuManPhu') : qt('chuManTrong')}</div>
        {ds2.map((m) => (
          <div className="cs-todo" key={m.khoa} data-chu-man={m.khoa} role="button" tabIndex={0} onClick={() => (m.khoaBoi ? datTb(loiKhoa(m)) : moSua(m.khoa))}>
            <b>{m.khoaBoi ? '🔒 ' : nhap[m.khoa] ? '● ' : ''}{m.ten}</b><span>›</span>
            <small>{m.khoaBoi ? loiKhoa(m) : hienGiaTri(m, nhap[m.khoa] ? nhap[m.khoa].gia_tri : giaTriChay(m))}</small>
          </div>
        ))}
      </Tam>
    );
  }

  return createPortal(
    <>
      <div className="cms-lop" aria-hidden={false}>
        {buts.map((b, i) => (
          <button type="button" key={b.khoa + i} className={`cms-pen${b.khoaBoi ? ' khoa' : nhap[b.khoa] ? ' ch' : ''}${b.nho ? ' nho' : ''}`} style={{ left: b.x, top: b.y }}
            data-but={b.khoa} aria-label={(MUC.get(b.khoa) || {}).ten} onClick={() => chamBut(b)}>{b.khoaBoi ? '🔒' : '✎'}</button>
        ))}
      </div>
      <div className="cms-bar show" role="toolbar" aria-label={qt('dangSua')}>
        <span className="cb-t">{qt('dangSua')}<small>{n ? qt('soNhap', { so: n }) : qt('banChay', { so: soBan })}</small></span>
        <button type="button" className="mn" onClick={() => datBang({ loai: 'diToi' })}>{qt('diToi')}</button>
        <button type="button" className="mn" onClick={moChuMan}>{qt('chuMan')}</button>
        <button type="button" onClick={moXemLai}>{qt('xemLai')}</button>
        <button type="button" className="pri" disabled={!n || !coQuyen('nd_cap_nhat')} onClick={moXemLai}>{qt('capNhatN', { so: n })}</button>
        <button type="button" className="x" aria-label={qt('tatSua')} onClick={tat}>✕</button>
      </div>
      {noi}
      <Thongbao chu={tb} het={() => datTb('')} />
    </>,
    phone,
  );
}
