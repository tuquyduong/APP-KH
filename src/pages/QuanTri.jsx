// Khu quản trị /admin (KH-ADMIN-1 C, E) — main.jsx dựng RIÊNG (không vỏ App khách, không thanh tab, không link nào từ App khách tới).
//   /admin          đăng nhập tài khoản POS → bảng quản trị (bật Chế độ sửa, lịch sử, xuất / nhập, Kiểm khớp POS, thoát)
//   /admin/lichsu   phiên bản (xem, so với bản đang chạy, quay lại, tải về) + Xuất / Nhập toàn bộ
//   /admin/kiemkhop trang Kiểm khớp POS (KH-KHOP-1, chỉ đọc, dùng token KHÁCH trên máy như trước — vé /api/nd không dùng ở /api/kh)
// Chưa có vé → màn đăng nhập; xong ở lại đúng trang (hoặc về `?tiep=` — 401 giữa lúc sửa trên màn khách). quyen[] chỉ để ẩn / hiện nút — máy chủ quyết.
import { useEffect, useState } from 'react';
import { DANH_MUC } from '../noiDung/nd/index.js';
import { nd } from '../noiDung/nd.js';
import { coVe, docVe, coQuyen, dangNhapQT, thoatQuanTri, batSua, layBanDangChay, layNhap, layDsPhienBan, layPhienBan, quayLai, xuatToanBo, nhapToanBo, GIOI_HAN } from '../noiDung/khoNoiDung.js';
import { docDuongDan, tiepHopLe } from '../duongDan.js';
import { qt } from '../noiDung/quanTri.js';
import Man from '../components/Man.jsx';
import Thongbao from '../components/Thongbao.jsx';
import KiemKhop from './KiemKhop.jsx';
import { hienGiaTri, giaTriTrong } from '../components/CheDoSuaBang.jsx';

const MUC = new Map(DANH_MUC.map((m) => [m.khoa, m]));

/** `?tiep=` sau đăng nhập quản trị: trang quản trị → ở lại trang đó; trang khách hợp lệ → bật sửa rồi tới đó; lạ / ra ngoài → ''. */
export function tiepQuanTri(tiep) {
  if (typeof tiep !== 'string' || !/^\/(?![/\\])/.test(tiep)) return '';
  const r = docDuongDan(tiep);
  return r.quanTri ? r.chuan : tiepHopLe(tiep);
}

/** Tải một đối tượng về máy thành tệp JSON. */
function taiVe(dl, ten) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(dl, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = ten; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DangNhapQT({ xong }) {
  const [ten, datTen] = useState('');
  const [mk, datMk] = useState('');
  const [loi, datLoi] = useState('');
  const [dang, datDang] = useState(false);
  const gui = async (e) => {
    e.preventDefault();
    datDang(true); datLoi('');
    try { await dangNhapQT(ten, mk); datMk(''); xong(); } catch (x) { datLoi(x.message); }
    datDang(false);
  };
  return (
    <form className="qt-khung" onSubmit={gui} id="qt-dang-nhap">
      <h1>{qt('dnTieu')}</h1>
      <div className="cs-hint">{qt('dnPhu')}</div>
      <div className="cs-l">{qt('dnTen')}</div>
      <input className="cs-in" name="ten" autoComplete="username" value={ten} onChange={(e) => datTen(e.target.value)} />
      <div className="cs-l">{qt('dnMatKhau')}</div>
      <input className="cs-in" name="mat_khau" type="password" autoComplete="current-password" value={mk} onChange={(e) => datMk(e.target.value)} />
      {loi && <div className="cs-hint loi" role="alert">{loi}</div>}
      <button type="submit" className="cs-pub" disabled={dang || !ten || !mk}>{dang ? qt('dnDang') : qt('dnNut')}</button>
    </form>
  );
}

function BangQuanTri({ thoat }) {
  const v = docVe();
  const [so, datSo] = useState(null);
  const [soNhap, datSoNhap] = useState(null);
  const [loi, datLoi] = useState('');
  useEffect(() => {
    layBanDangChay().then((d) => datSo(d.so_ban), (e) => datLoi(e.message));
    layNhap().then((d) => datSoNhap((d.nhap || []).length), (e) => datLoi(e.message));
  }, []);
  const ten = (v.nguoi && (v.nguoi.ten_hien || v.nguoi.ten_dang_nhap)) || '';
  return (
    <div className="qt-khung" id="qt-bang">
      <h1>{qt('chao', { ten })}</h1>
      <div className="cs-hint">{so === null ? qt('dangTai') : so ? qt('banChay', { so }) : qt('khoTrong')}</div>
      {soNhap !== null && <div className="cs-hint">{soNhap ? qt('soNhap', { so: soNhap }) : qt('khongNhap')}</div>}
      {v.het_han && <div className="cs-hint">{qt('hetHan', { luc: v.het_han })}</div>}
      {loi && <div className="cs-hint loi">{loi}</div>}
      <button type="button" className="cs-next" onClick={() => { batSua(true); location.assign('/trangchu'); }}>{qt('nutSua')}</button>
      <button type="button" className="cs-pub" onClick={() => location.assign('/admin/lichsu')}>{qt('nutLichSu')}</button>
      {coQuyen('nd_xuat_nhap') && <button type="button" className="cs-pub" onClick={() => location.assign('/admin/lichsu#xuat-nhap')}>{qt('nutXuatNhap')}</button>}
      <button type="button" className="cs-pub" onClick={() => location.assign('/admin/kiemkhop')}>{qt('nutKiemKhop')}</button>
      <button type="button" className="cs-undo" onClick={thoat}>{qt('nutThoat')}</button>
    </div>
  );
}

/** Các khoá khác nhau giữa hai bộ giá trị (theo giá trị khách thật thấy — sai luật tính như macDinh). */
function khac(a, b) {
  const khoa = [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])];
  return khoa.filter((k) => { const m = MUC.get(k); return m ? JSON.stringify(giaTriTrong(m, a)) !== JSON.stringify(giaTriTrong(m, b)) : JSON.stringify((a || {})[k]) !== JSON.stringify((b || {})[k]); });
}
const tenMuc = (k) => (MUC.get(k) || {}).ten || k;

function LichSu({ bao }) {
  const [ds, datDs] = useState(null);
  const [chay, datChay] = useState(null); // { so_ban, gia_tri } đang chạy
  const [mo, datMo] = useState(null); // { ban, xem: 'xem' | 'so' }
  const [hoi, datHoi] = useState(false);
  const [dang, datDang] = useState(false);
  const tai = async () => {
    try {
      const [p, c] = await Promise.all([layDsPhienBan(), layBanDangChay()]);
      datDs(p.data || []); datChay({ so_ban: c.so_ban, gia_tri: c.gia_tri || {} });
    } catch (e) { bao(e.message); datDs([]); }
  };
  useEffect(() => { tai(); }, []);
  const moBan = async (so, xem) => {
    try { const r = await layPhienBan(so); datMo({ ban: r.ban, xem }); datHoi(false); } catch (e) { bao(e.message); }
  };
  const quay = async () => {
    datDang(true);
    try { const r = await quayLai(mo.ban.so_ban, chay.so_ban); bao(qt('lsQuayLaiXong', { cu: mo.ban.so_ban, so: r.so_ban })); datMo(null); await tai(); } catch (e) {
      if (e.code === 'CO_BAN_MOI_HON') { await tai(); bao(qt('coBanMoi')); } else bao(e.message);
    }
    datDang(false); datHoi(false);
  };
  const cu = mo && chay ? khac(chay.gia_tri, mo.ban.gia_tri) : [];
  return (
    <div className="qt-khung" id="qt-lich-su">
      <h1>{qt('lsTieu')}</h1>
      {ds === null ? <div className="cs-hint">{qt('dangTai')}</div> : !ds.length ? <div className="cs-hint">{qt('lsTrong')}</div> : ds.map((b) => (
        <div key={b.so_ban} data-ban={b.so_ban}>
          <div className="cs-hi" role="button" tabIndex={0} onClick={() => moBan(b.so_ban, 'xem')}>
            <i className={b.dang_chay ? 'live' : ''}>{b.so_ban}</i>
            <div><b>{b.tom_tat || b.ghi_chu || '—'}</b><small>{b.luc} · {(b.nguoi && b.nguoi.ten_hien) || b.nguoi}{b.dang_chay ? ` · ${qt('lsDangChay')}` : ''}{b.tu_ban ? ` · ${qt('lsTuBan', { so: b.tu_ban })}` : ''}{b.ghi_chu && b.tom_tat ? ` · ${b.ghi_chu}` : ''}</small></div>
          </div>
          {mo && mo.ban.so_ban === b.so_ban && (
            <div className="cs-dong" id="qt-mot-ban">
              <div className="cs-go">
                <button type="button" onClick={() => datMo({ ...mo, xem: 'xem' })}>{qt('lsXem')}</button>
                <button type="button" onClick={() => datMo({ ...mo, xem: 'so' })}>{qt('lsSo')}</button>
                <button type="button" onClick={() => taiVe(mo.ban, `noi-dung-ban-${mo.ban.so_ban}.json`)}>{qt('lsTai')}</button>
                {coQuyen('nd_cap_nhat') && !mo.ban.dang_chay && <button type="button" onClick={() => datHoi(true)}>{qt('lsQuayLai')}</button>}
              </div>
              {hoi && <div><div className="cs-hint loi">{qt('lsQuayLaiHoi', { so: mo.ban.so_ban })}</div><button type="button" className="cs-next" disabled={dang} onClick={quay}>{qt('lsQuayLaiCo')}</button></div>}
              {mo.xem === 'xem' ? (
                <>
                  <div className="cs-hint">{qt('lsSoMuc', { so: Object.keys(mo.ban.gia_tri || {}).length })}</div>
                  {Object.entries(mo.ban.gia_tri || {}).map(([k, v]) => <div className="cs-ch" key={k}><div className="cs-cw"><b>{tenMuc(k)}</b><div>{hienGiaTri(MUC.get(k), v)}</div></div></div>)}
                </>
              ) : (
                <>
                  {!cu.length && <div className="cs-hint">{qt('lsKhongKhac')}</div>}
                  {cu.map((k) => {
                    const m = MUC.get(k);
                    return (
                      <div className="cs-ch" key={k} data-khac={k}><div className="cs-cw"><b>{tenMuc(k)}</b>
                        <div>{qt('lsCu')}: <del>{hienGiaTri(m, m ? giaTriTrong(m, chay.gia_tri) : chay.gia_tri[k])}</del></div>
                        <div>{qt('lsMoi', { so: mo.ban.so_ban })}: <ins>{hienGiaTri(m, m ? giaTriTrong(m, mo.ban.gia_tri) : mo.ban.gia_tri[k])}</ins></div></div></div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <XuatNhap bao={bao} xong={tai} />
    </div>
  );
}

function XuatNhap({ bao, xong }) {
  if (!coQuyen('nd_xuat_nhap')) return <div className="cs-hint" id="xuat-nhap">{qt('xnKhongQuyen')}</div>;
  const xuat = async () => { try { const d = await xuatToanBo(); taiVe(d, `noi-dung-app-${String(d.xuat_luc || '').replace(/[^\dT]/g, '')}.json`); } catch (e) { bao(e.message); } };
  const nhap = async (e) => {
    const tep = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!tep) return;
    if (tep.size > GIOI_HAN.nhap_toan_bo_toi_da_byte) { bao(qt('xnTepLon', { mb: Math.round(GIOI_HAN.nhap_toan_bo_toi_da_byte / 1048576) })); return; }
    let dl;
    try { dl = JSON.parse(await tep.text()); } catch { bao(qt('xnTepHong')); return; }
    try {
      const r = await nhapToanBo(dl);
      bao(qt('xnXong', { ban: r.so_luong_ban, nhap: r.so_nhap, anh: r.so_anh, nk: r.so_nhat_ky }));
      xong();
    } catch (x) { bao(x.message); } // 409 KHO_DA_CO_DU_LIEU (kho không trống) và lỗi khác: hiện NGUYÊN lời POS
  };
  return (
    <div id="xuat-nhap">
      <div className="cs-l">{qt('xnTieu')}</div>
      <div className="cs-hint">{qt('xnPhu')}</div>
      <button type="button" className="cs-next" onClick={xuat}>{qt('xnXuat')}</button>
      <label className="cs-up" style={{ marginTop: 10 }}>{qt('xnNhap')}<input type="file" accept="application/json,.json" onChange={nhap} /></label>
    </div>
  );
}

export default function QuanTri({ duong }) {
  const [co, datCo] = useState(coVe);
  const [tb, datTb] = useState('');
  const trang = duong.trang;
  useEffect(() => {
    if (location.pathname !== duong.chuan) history.replaceState(null, '', duong.chuan + location.search + location.hash);
    if (!document.querySelector('meta[name="robots"]')) document.head.append(Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' }));
    document.title = trang === 'quantrikiemkhop' ? nd('tieuDe.mau', { man: nd('tieuDe.kiemkhop') }) : qt(trang === 'quantrilichsu' ? 'tieuDeLichSu' : 'tieuDe');
  }, [trang]);
  const daDangNhap = () => {
    const t = tiepQuanTri(new URLSearchParams(location.search).get('tiep'));
    if (t && !docDuongDan(t).quanTri) { batSua(true); location.assign(t); return; }
    if (t && t !== location.pathname) { location.assign(t); return; }
    history.replaceState(null, '', duong.chuan);
    datCo(true);
  };
  if (co && trang === 'quantrikiemkhop') return <KiemKhop />;
  return (
    <div className="phone">
      <div className="screens">
        <Man id="quantri">
          {!co ? <DangNhapQT xong={daDangNhap} />
            : trang === 'quantrilichsu' ? <><button type="button" className="cs-undo" style={{ margin: '12px 16px 0' }} onClick={() => location.assign('/admin')}>{qt('veBang')}</button><LichSu bao={datTb} /></>
              : <BangQuanTri thoat={() => { thoatQuanTri(); datCo(false); }} />}
        </Man>
      </div>
      <Thongbao chu={tb} het={() => datTb('')} />
    </div>
  );
}
