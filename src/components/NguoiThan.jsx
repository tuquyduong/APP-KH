import { useState } from 'react';
import { Ico } from './BieuTuong.jsx';
import { bam } from './bam.js';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import { BanhNgayThang } from './BanhXoay.jsx';
import { soNgayThang } from '../kehoachLap.js';
import { themNguoi, suaNguoi, xoaNguoi, nguoiSapXep, tronTuoi, thuNgayNgan, dayThang, conLai, CO_NHAC, NHAC_NGUOI, TEN_NGUOI_TOI_DA, TOI_DA_NGUOI } from '../kehoach.js';

const MAC_DINH = { loai: 'sn', ten: '', cal: 'duong', nam: '', nhac: -240 }; // demo pplForm: Sinh nhật · Dương lịch · nhắc 1 ngày trước
const Chip = ({ on, f, children }) => <button type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={f}>{children}</button>;
const chuLoai = (p) => (p.loai === 'gio' ? 'Giỗ ' : 'Sinh nhật ') + p.ten;

/** Tab "Người thân" của Ngày cần nhớ (demo nhánh 'ppl'): sinh nhật + giỗ, gần nhất trước. Không có "Tặng thẻ quà" (chưa có thẻ quà). */
export function DanhSachNguoi({ homNay, bang, luu, moSua, moVanKhanGio }) {
  const [hoi, datHoi] = useState('');
  const ds = nguoiSapXep(bang, homNay);
  if (!ds.length) return <div className="empty-note">Chưa có ai. Bấm “＋ Thêm” để nhớ sinh nhật, ngày giỗ của người thân.</div>;
  return (
    <>
      <div className="tl-note">Nhắc khi bạn đang mở App. Chưa tự báo về điện thoại khi đóng App.</div>
      {ds.map(({ p, j }) => {
        const bat = p.nhac !== null;
        return (
          <div className="tl-row" key={p.id} style={{ cursor: 'default' }}>
            <div className={`tl-date ${p.loai}`}><b>{dayThang(j)}</b><small>{conLai(j, homNay)}</small></div>
            <div className="tl-rt">
              <b {...bam(() => moSua(p))} style={{ cursor: 'pointer' }}>{chuLoai(p)}</b>
              <small>{p.cal === 'am' ? `Âm lịch ${p.d}/${p.m} · ` : ''}{thuNgayNgan(j, homNay)}{tronTuoi(p, j)}</small>
              <div className="tl-acts">
                {p.loai === 'gio' && <span {...bam(() => moVanKhanGio(p.ten))}>Văn khấn giỗ ›</span>}
                <span {...bam(() => datHoi(p.id))}>Xoá</span>
              </div>
              {hoi === p.id && <HoiXoa loai={p.loai === 'gio' ? 'ngày giỗ' : 'sinh nhật'} tieu={p.ten} huy={() => datHoi('')} xoa={() => { luu(xoaNguoi(bang, p.id), `Đã xoá «${chuLoai(p)}»`); datHoi(''); }} />}
            </div>
            <button type="button" className={`tl-rm${bat ? ' on' : ''}`} aria-pressed={bat} onClick={() => luu({ ...bang, nguoi: bang.nguoi.map((x) => (x.id === p.id ? { ...x, nhac: bat ? null : -240 } : x)) }, bat ? 'Đã tắt nhắc' : 'Đã bật nhắc · hiện khi bạn mở app')}>
              <Ico ten="bell" s={12} /> {bat ? 'Đang nhắc' : CO_NHAC}
            </button>
          </div>
        );
      })}
    </>
  );
}

/** Bảng nổi "Thêm sinh nhật hoặc ngày giỗ" (demo pplForm) — cũng dùng để sửa (`nguoi` có = đang sửa). `luu(bangMoi, chữ)` trả true nếu ghi được. */
export function FormNguoi({ homNay, bang, nguoi, luu, dong }) {
  const [f, datF] = useState(() => (nguoi ? { loai: nguoi.loai, ten: nguoi.ten, cal: nguoi.cal, nam: nguoi.nam ? String(nguoi.nam) : '', nhac: nguoi.nhac, d: nguoi.d, m: nguoi.m } : { ...MAC_DINH, d: homNay.d, m: homNay.m }));
  const [loi, datLoi] = useState('');
  const doi = (o) => datF({ ...f, ...o });
  const doiLoai = (loai) => { const cal = nguoi ? f.cal : loai === 'gio' ? 'am' : 'duong'; doi({ loai, cal, d: Math.min(f.d, cal === 'am' ? 30 : soNgayThang(f.m, 2000)) }); }; // giỗ mặc định Âm, sinh nhật mặc định Dương (B3)
  const doiLich = (cal) => doi({ cal, d: Math.min(f.d, cal === 'am' ? 30 : soNgayThang(f.m, 2000)) });
  const gui = () => {
    const nhap = { ...f, nam: f.loai === 'sn' ? f.nam : '' };
    const moi = nguoi ? suaNguoi(bang, nguoi.id, nhap) : themNguoi(bang, nhap);
    if (!moi) { datLoi(!f.ten.trim() ? 'Nhập tên trước nhé' : bang.nguoi.length >= TOI_DA_NGUOI && !nguoi ? 'Đã đủ số người lưu trên máy này, xoá bớt nhé' : 'Ngày hoặc tháng chưa đúng'); return; }
    if (luu(moi, nguoi ? 'Đã lưu' : `Đã thêm: ${chuLoai(nhap)}`)) dong(); else datLoi('Chưa lưu được — chữ bạn gõ vẫn còn đây');
  };
  return (
    <BangNoi tieuDe={nguoi ? 'Sửa sinh nhật hoặc ngày giỗ' : 'Thêm sinh nhật hoặc ngày giỗ'} dong={dong} nhan="Sinh nhật hoặc ngày giỗ">
      <div className="pf-chips sm" style={{ marginTop: 12 }}><Chip on={f.loai === 'sn'} f={() => doiLoai('sn')}>Sinh nhật</Chip><Chip on={f.loai === 'gio'} f={() => doiLoai('gio')}>Ngày giỗ</Chip></div>
      <label className="tl-lb">Tên / quan hệ</label>
      <input className="tl-in" type="text" aria-label="Tên" placeholder="VD: Bố, Bà ngoại, Lan" maxLength={TEN_NGUOI_TOI_DA} value={f.ten} onChange={(e) => { doi({ ten: e.target.value }); datLoi(''); }} />
      <div className="pf-chips sm" style={{ marginTop: 10 }}><Chip on={f.cal === 'duong'} f={() => doiLich('duong')}>Dương lịch</Chip><Chip on={f.cal === 'am'} f={() => doiLich('am')}>Âm lịch</Chip></div>
      <BanhNgayThang d={f.d} m={f.m} cal={f.cal} doi={(d, m) => doi({ d, m })} />
      {f.loai === 'sn' && (
        <>
          <label className="tl-lb">Năm sinh (không bắt buộc)</label>
          <input className="tl-in" type="number" inputMode="numeric" aria-label="Năm sinh" placeholder="VD: 1960" value={f.nam} onChange={(e) => doi({ nam: e.target.value })} />
        </>
      )}
      <label className="tl-lb">Nhắc trước</label><div className="pf-chips sm">{NHAC_NGUOI.map(([ten, ph]) => <Chip key={ten} on={f.nhac === ph} f={() => doi({ nhac: ph })}>{ten}</Chip>)}</div>
      {loi && <div className="loi-nho" role="alert" style={{ fontSize: 12, color: 'var(--pink-dark)', margin: '6px 2px' }}>{loi}</div>}
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui}>Lưu</button>
    </BangNoi>
  );
}
