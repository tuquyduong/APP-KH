// Bảng sửa TỰ SINH từ MỘT mục danh mục nội dung (KH-ADMIN-1 D3) — không làm tay từng màn. Kiểm bằng CHÍNH hopLe của nd.js (một luật với khách).
// Không cắt khoảng trắng đầu / cuối (vài chữ cố ý có dấu cách). Ảnh: cắt đúng tiLe + nén WebP bằng canvas (như cmsPic của demo) → POST /anh → url.
import { useState } from 'react';
import { hopLe, choDien, duongAnh, banDangDung, anhDung, dongTrung } from '../noiDung/nd.js';
import { DICH } from '../noiDung/nd/index.js';
import { luuNhap, boNhap, taiAnhLen, GIOI_HAN } from '../noiDung/khoNoiDung.js';
import { qt } from '../noiDung/quanTri.js';

const sao = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
/** Giá trị của mục `m` trong một bộ giá trị (bản đang chạy / một phiên bản) — sai luật hoặc thiếu → macDinh. */
export const giaTriTrong = (m, giaTri) => { const g = giaTri ? giaTri[m.khoa] : undefined; return g !== undefined && hopLe(m, g) ? g : m.macDinh; };
export const giaTriChay = (m) => giaTriTrong(m, banDangDung().gia_tri);
/** Tên người của nháp / phiên bản: hợp đồng v1 chưa ghi dạng `nguoi` → nhận chuỗi hoặc { ten_hien, ten_dang_nhap }; khác → rỗng (không vẽ object). */
export const tenNguoi = (n) => (typeof n === 'string' ? n : n && typeof n === 'object' ? String(n.ten_hien || n.ten_dang_nhap || '') : '');
const cat = (s) => { const t = String(s); return t.length > 70 ? t.slice(0, 70) + '…' : t; };

/** Giá trị để xem nhanh (Xem lại, Lịch sử) — luôn là CHỮ / ảnh, không HTML. */
export function hienGiaTri(m, v) {
  if (!m) return <span>{cat(JSON.stringify(v))}</span>;
  if (m.loai === 'anh') return anhDung(v) ? <img className="cs-mini" src={duongAnh(v)} alt="" /> : <span>{qt('trong')}</span>;
  if (m.loai === 'battat') return <span>{v === false ? qt('an') : qt('hien')}</span>;
  if (m.loai === 'nut') return <span>{cat(v && v.chu)} → {((DICH.find((d) => d[0] === (v && v.dich)) || [])[1]) || ''}</span>;
  if (m.loai === 'danhsach') return <span>{qt('soDong', { so: Array.isArray(v) ? v.length : 0 })}{Array.isArray(v) && v.length ? ' · ' + cat(v.map((x) => Object.values(x)[0]).join(', ')) : ''}</span>;
  return <span>{v === '' ? qt('trong') : cat(v)}</span>;
}

/** Cắt giữa theo tỉ lệ "a:b" ("tự do" = giữ nguyên tỉ lệ), nén WebP (trình duyệt không xuất được WebP → JPEG) tới ≤ GIOI_HAN.anh_toi_da_byte. */
export async function nenAnh(tep, tiLe) {
  const url = URL.createObjectURL(tep);
  try {
    const im = await new Promise((ok, hong) => { const i = new Image(); i.onload = () => ok(i); i.onerror = hong; i.src = url; });
    const t = /^(\d+):(\d+)$/.exec(tiLe || '');
    const ratio = t ? t[1] / t[2] : im.width / im.height;
    let w = ratio > 1 ? 1080 : 640;
    if (!t) w = Math.min(w, im.width);
    const sr = im.width / im.height;
    let sw = im.width, sh = im.height, sx = 0, sy = 0;
    if (sr > ratio) { sw = im.height * ratio; sx = (im.width - sw) / 2; } else { sh = im.width / ratio; sy = (im.height - sh) / 2; }
    const cv = document.createElement('canvas');
    const ra = (loai, q) => new Promise((ok) => cv.toBlob(ok, loai, q));
    for (let q = 0.8; w >= 160;) {
      cv.width = Math.round(w); cv.height = Math.round(w / ratio);
      cv.getContext('2d').drawImage(im, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
      let b = await ra('image/webp', q);
      if (!b || b.type !== 'image/webp') b = await ra('image/jpeg', q);
      if (b && b.size <= GIOI_HAN.anh_toi_da_byte) return b;
      if (q > 0.5) q -= 0.15; else w *= 0.8;
    }
    throw new Error(qt('anhLon', { kb: Math.round(GIOI_HAN.anh_toi_da_byte / 1024) }));
  } finally { URL.revokeObjectURL(url); }
}

/** Ô chọn ảnh: chọn → nén → tải lên kho → `doi(url)`. */
function ChonAnh({ v, tiLe, doi, bao, nho }) {
  const [dang, datDang] = useState(false);
  const chon = async (e) => {
    const tep = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!tep) return;
    datDang(true); bao(qt('anhDangNen'));
    try {
      const b = await nenAnh(tep, tiLe);
      const r = await taiAnhLen(b, b.type === 'image/webp' ? 'anh.webp' : 'anh.jpg');
      doi(r.url);
      bao(qt('anhXong', { truoc: Math.round(tep.size / 1024), sau: Math.round(b.size / 1024) }));
    } catch (x) { bao((x && x.message) || qt('anhLoi')); }
    datDang(false);
  };
  return (
    <div className="cs-img">
      {anhDung(v) ? <img src={duongAnh(v)} alt="" className={/^\d+:\d+$/.test(tiLe || '') ? '' : 'tu-do'} style={nho ? { width: 56, height: 56 } : undefined} /> : <div className="cs-ph" />}
      <div>
        <label className="cs-up">{dang ? qt('anhDangNen') : v ? qt('anhDoi') : qt('anhChon')}<input type="file" accept="image/*" onChange={chon} disabled={dang} /></label>
        {tiLe && <div className="cs-hint">{qt('tiLe', { tiLe })}</div>}
      </div>
    </div>
  );
}

/** Ô chữ (một dòng / nhiều dòng) + chip chỗ điền + đếm ký tự. */
function OChu({ m, v, doi, nhieuDong }) {
  const bien = m.bien || [];
  const co = choDien(v);
  const O = nhieuDong ? 'textarea' : 'input';
  return (
    <>
      <O className={nhieuDong ? 'cs-ta' : 'cs-in'} rows={nhieuDong ? 4 : undefined} value={v} onChange={(e) => doi(e.target.value)} aria-label={m.ten} />
      <div className="cs-hint">{m.toiDa ? qt('kyTu', { so: v.length, toiDa: m.toiDa }) : qt('kyTuKhong', { so: v.length })}</div>
      {bien.length > 0 && (
        <>
          <div className="cs-l">{qt('chipCan')}</div>
          <div className="cs-chips">{bien.map((b) => <button type="button" key={b} className={co.includes(b) ? 'on' : ''} onClick={() => doi(v + `{${b}}`)}>{`{${b}}`}</button>)}</div>
        </>
      )}
    </>
  );
}

/** Lý do chưa Lưu được (chỉ để hiện — luật thật là hopLe). */
function lyDo(m, v) {
  if (hopLe(m, v)) return '';
  const chu = m.loai === 'nut' ? v && v.chu : v;
  if (['chu', 'doan', 'nut'].includes(m.loai) && typeof chu === 'string') {
    const co = choDien(chu), can = m.bien || [];
    const thieu = can.filter((b) => !co.includes(b)), thua = [...new Set(co.filter((b) => !can.includes(b)))];
    if (thieu.length) return qt('thieuChip', { ds: thieu.map((b) => `{${b}}`).join(' ') });
    if (thua.length) return qt('thuaChip', { ds: thua.map((b) => `{${b}}`).join(' ') });
    if (m.toiDa && chu.length > m.toiDa) return qt('quaDai', { toiDa: m.toiDa });
  }
  if (m.loai === 'danhsach' && Array.isArray(v) && dongTrung(m, v)) return qt('trungDong');
  return qt('khongHopLe');
}

/** Bảng sửa một mục. `nhap` = nháp trên máy chủ của khoá này (nếu có); `khiGo(v)` = xem trước trên trang; `khiDaLuu()` = tải lại nháp. */
export default function CheDoSuaBang({ m, nhap, soBan, coSua, canhBao, khiGo, khiDaLuu, bao, dong }) {
  const [v, datV] = useState(() => sao(nhap && hopLe(m, nhap.gia_tri) ? nhap.gia_tri : giaTriChay(m))); // nháp sai dạng (danh mục đổi loại…) → không vỡ bảng
  const [dang, datDang] = useState(false);
  const doi = (x) => { datV(x); khiGo(x); };
  const ly = lyDo(m, v);
  const lam = async (f, chu) => {
    datDang(true);
    try { await f(); bao(chu); await khiDaLuu(); } catch (e) { bao(e.message); }
    datDang(false);
  };
  const luu = (gt) => lam(() => luuNhap(m.khoa, gt, soBan), qt('daLuu'));
  const boThayDoi = () => lam(async () => {
    try { await boNhap(m.khoa); } catch (e) { if (e.status !== 404) throw e; }
    const goc = sao(giaTriChay(m)); datV(goc); khiGo(undefined);
  }, qt('daBo'));
  const veMacDinh = () => { const g = sao(m.macDinh); datV(g); khiGo(g); luu(g); };

  let o = null;
  if (m.loai === 'chu' || m.loai === 'doan') o = <OChu m={m} v={v} doi={doi} nhieuDong={m.loai === 'doan'} />;
  else if (m.loai === 'nut') {
    o = (
      <div className="cs-feat">
        <OChu m={m} v={v.chu} doi={(chu) => doi({ ...v, chu })} />
        <div className="cs-l">{qt('dich')}</div>
        <select value={v.dich} onChange={(e) => doi({ ...v, dich: e.target.value })} aria-label={qt('dich')}>{DICH.map(([ma, ten]) => <option key={ma} value={ma}>{ten}</option>)}</select>
      </div>
    );
  } else if (m.loai === 'anh') o = <ChonAnh v={v} tiLe={m.tiLe} doi={doi} bao={bao} />;
  else if (m.loai === 'battat') {
    o = <label className="cs-bat"><input type="checkbox" checked={v !== false} onChange={(e) => doi(e.target.checked)} /> {v !== false ? qt('hien') : qt('an')}</label>;
  } else if (m.loai === 'danhsach') {
    const kc = m.khoaCauTruc || [];
    const doiDong = (i, t, x) => doi(v.map((d, j) => (j === i ? { ...d, [t]: x } : d)));
    const doiCho = (i, j) => { const a = v.slice(); [a[i], a[j]] = [a[j], a[i]]; doi(a); };
    o = (
      <div>
        {v.map((d, i) => (
          <div className="cs-dong" key={i}>
            {Object.keys(m.truong).map((t) => (
              <div key={t}>
                <div className="cs-l">{t}{kc.includes(t) ? ` · ${qt('khoaCauTruc')}` : ''}</div>
                {m.truong[t] === 'anh' && !kc.includes(t)
                  ? <ChonAnh v={d[t]} tiLe={m.tiLe || '1:1'} doi={(x) => doiDong(i, t, x)} bao={bao} nho />
                  : <input className="cs-in" value={d[t] ?? ''} readOnly={kc.includes(t)} onChange={(e) => doiDong(i, t, e.target.value)} aria-label={t} />}
              </div>
            ))}
            {!kc.length && (
              <div className="cs-go">
                <button type="button" disabled={i === 0} onClick={() => doiCho(i, i - 1)} aria-label={qt('len')}>{qt('len')}</button>
                <button type="button" disabled={i === v.length - 1} onClick={() => doiCho(i, i + 1)} aria-label={qt('xuong')}>{qt('xuong')}</button>
                <button type="button" onClick={() => doi(v.filter((_, j) => j !== i))} aria-label={qt('boDong')}>{qt('boDong')}</button>
              </div>
            )}
          </div>
        ))}
        {!kc.length && <button type="button" className="cs-undo" onClick={() => doi([...v, Object.fromEntries(Object.keys(m.truong).map((t) => [t, '']))])}>{qt('themDong')}</button>}
      </div>
    );
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={m.ten} data-bang-sua={m.khoa}>
      <div className="cs-h"><b>{m.ten}</b><button type="button" onClick={dong}>{qt('xong')}</button></div>
      {canhBao && <div className="cs-hint loi">{canhBao}</div>}
      {nhap && !canhBao && <div className="cs-hint">{qt('coNhap', { nguoi: tenNguoi(nhap.nguoi), luc: nhap.luc })}</div>}
      {m.goiY && <div className="cs-hint">{m.goiY}</div>}
      <div style={{ marginTop: 10 }}>{o}</div>
      {ly && <div className="cs-hint loi">{ly}</div>}
      <button type="button" className="cs-next" disabled={!!ly || dang || !coSua} onClick={() => luu(v)}>{dang ? qt('dangLuu') : qt('luu')}</button>
      <button type="button" className="cs-undo" disabled={dang || !coSua || !nhap} onClick={boThayDoi}>{qt('boThayDoi')}</button>
      <button type="button" className="cs-undo" disabled={dang || !coSua} onClick={veMacDinh}>{qt('veMacDinh')}</button>
    </div>
  );
}
