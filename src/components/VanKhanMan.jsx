import { useState } from 'react';
import { Ico } from './BieuTuong.jsx';
import BangNoi from './BangNoi.jsx';
import { nd, ndDau, ndHien } from '../noiDung/nd.js';
import { TranhTienIch } from './BieuTuongTienIch.jsx';
import { bam } from './bam.js';
import { CO_NHAC, thuNgayNgan, datThongTinVk, thongTinVk, tickLeVat, doiNhacDip, doiCoChu } from '../kehoach.js';
import { dipSapXep, vkNext, dienBai, gioSapToi, chuConLai, timDip } from '../vanKhan.js';
import { lichAm, jd, tuJd } from '../kehoachLap.js';
import { GHI_CHU_DANH_SACH, GHI_CHU_BAI } from '../noiDung/vanKhan.js';

const CHU_KHONG_GIO = 'Thêm ngày giỗ ở “Ngày cần nhớ”';
const amDm = (j) => { const l = lichAm(j); return `${l.d}/${l.m}`; };

/** [tiêu đề, dòng phụ] của đầu màn một dịp (demo renderVkOne.tHead). */
export function dauDip(v, homNay, bang) {
  const j = vkNext(v, homNay, bang.nguoi);
  return [v.n, j ? `${thuNgayNgan(j, homNay)} · âm lịch ${amDm(j)} · ${chuConLai(j, homNay)}` : CHU_KHONG_GIO];
}

export function NutNhac({ bat, doi, lon = false }) {
  return <button type="button" className={`tl-rm${lon ? ' big' : ''}${bat ? ' on' : ''}`} aria-pressed={bat} onClick={(e) => { e.stopPropagation(); doi(); }}><Ico ten="bell" s={12} /> {bat ? 'Đang nhắc' : CO_NHAC}</button>;
}
const baoNhac = (bang, id) => (bang.vk.nhac[id] ? 'Đã tắt nhắc' : 'Đã bật nhắc · hiện khi bạn mở app');

const TRUONG = [['ten', 'vk.tinChu', 'vk.goiYTen'], ['ho', 'vk.hoGia', 'vk.goiYHo'], ['dc', 'vk.diaChi', 'vk.goiYDc']];
/** Ba ô Tín chủ · Họ gia tiên · Địa chỉ (E1): hiện giá trị đang dùng (khách đã sửa, hoặc mặc định từ tài khoản); gõ là lưu trên máy, KHÔNG gửi đi. `lay` = chỗ cần đặt con trỏ trước. */
function OThongTin({ bang, luu, hoSo, lay }) {
  const tt = thongTinVk(bang.vk, hoSo);
  return (
    <div className="vk-info">
      {TRUONG.map(([t, nhan, goiY]) => (
        <div className={`vk-ii${t === 'dc' ? ' w' : ''}`} key={t}><small {...ndDau(nhan)}>{nd(nhan)}</small>
          <input value={tt[t]} placeholder={nd(goiY)} aria-label={nd(nhan)} autoFocus={lay === t} onChange={(e) => luu(datThongTinVk(bang, { [t]: e.target.value }), '')} /></div>
      ))}
    </div>
  );
}

/** Danh sách dịp cúng (demo nhánh 'vk'): khung thông tin gia đình (E1) + thẻ lớn "Sắp tới" + các dịp còn lại theo ngày; mỗi dịp có nút nhắc (trừ Cúng giỗ). */
export function DanhSachDip({ homNay, bang, luu, moDip, hoSo = {} }) {
  const ds = dipSapXep(homNay, bang.nguoi), dau = ds[0];
  return (
    <>
      {ndHien('hien.vkKhung') && (
        <div className="vk-khung"><div className="sec-head"><h2 {...ndDau('vk.khungTieu')}>{nd('vk.khungTieu')}</h2></div>
          <OThongTin bang={bang} luu={luu} hoSo={hoSo} /><div className="tl-note" {...ndDau('vk.khungNote')}>{nd('vk.khungNote')}</div></div>
      )}
      <div className="vk-hero" {...bam(() => moDip(dau.v.id))}>
        <div className="vk-k">Sắp tới</div><b>{dau.v.n}</b>
        <span>{thuNgayNgan(dau.j, homNay)} · âm lịch {amDm(dau.j)} · {chuConLai(dau.j, homNay)}</span><em>Xem lễ vật &amp; văn khấn ›</em>
      </div>
      {ds.slice(1).map(({ v, j }) => (
        <div className="tl-row" key={v.id} {...bam(() => moDip(v.id))}>
          <div className="tl-ri"><TranhTienIch ten={v.ic} s={34} /></div>
          <div className="tl-rt"><b>{v.n}</b><small>{j ? `${thuNgayNgan(j, homNay)} · âm ${amDm(j)} · ${chuConLai(j, homNay)}` : CHU_KHONG_GIO}</small></div>
          {!v.gio && <NutNhac bat={!!bang.vk.nhac[v.id]} doi={() => luu(doiNhacDip(bang, v.id), baoNhac(bang, v.id))} />}
        </div>
      ))}
      <div className="care-disclaimer" style={{ marginTop: 12 }}>{GHI_CHU_DANH_SACH}</div>
    </>
  );
}

const NHAN_CHO = { ten: 'vk.tinChu', ho: 'vk.hoGia', dc: 'vk.diaChi' };

/** Một dịp (demo renderVkOne): dòng gọn Tín chủ · Địa chỉ (sửa ›), lễ vật đánh dấu đã sắm, cách sắp lễ, bài khấn tự điền (chạm chỗ tô màu → đúng ô nhập), cỡ chữ. Không "Đọc to", không "Đặt hoa quả, trà" (chưa có). */
export default function MotDip({ dip, homNay, bang, tenKhach, hoSo: hoSoCho, luu }) {
  const [sua, datSua] = useState(null); // null | 'ten' | 'ho' | 'dc' — bảng sửa thông tin gia đình, con trỏ ở ô tương ứng
  const v = timDip(dip);
  if (!v) return null;
  const hoSo = hoSoCho || { ten: tenKhach };
  const j = vkNext(v, homNay, bang.nguoi), jj = j || jd(homNay), vk = bang.vk;
  const nm = vk.nm ?? ((v.gio ? (gioSapToi(bang.nguoi, homNay) || {}).ten : '') || '');
  const tt = thongTinVk(vk, hoSo);
  const bai = dienBai(v, { ten: tt.ten, dc: tt.dc, ho: tt.ho, nm }, jj);
  const le = v.le.split('\n').filter(Boolean), nam = tuJd(jj).y, dat = vk.tick[`${v.id}:${nam}`] || [];
  const thieu = ['ten', 'dc'].filter((t) => !tt[t].trim()).map((t) => nd(NHAN_CHO[t]));
  const cham = (d, i) => {
    if (!d.mark) return d.t;
    if (!d.p || !['ten', 'ho', 'dc', 'nm'].includes(d.p)) return <mark key={i}>{d.t}</mark>;
    const mo = () => (d.p === 'nm' ? document.getElementById('vk-nm') && document.getElementById('vk-nm').focus() : datSua(d.p));
    return <mark key={i} className={d.t ? 'cham' : 'cham trong'} data-cho={d.p} {...bam(mo)}>{d.t || nd('vk.chamDien', { cho: d.p === 'nm' ? '' : nd(NHAN_CHO[d.p]) })}</mark>;
  };
  return (
    <>
      <div className="vk-dong"><span>{nd('vk.dongTin', { ten: tt.ten || '…', dc: tt.dc || '…' })}</span><em {...bam(() => datSua('ten'))} {...ndDau('vk.sua')}>{nd('vk.sua')}</em></div>
      {v.needNm && (
        <div className="vk-info"><div className="vk-ii w"><small>{v.gio ? 'Người được giỗ' : 'Hương linh'}</small>
          <input id="vk-nm" value={nm} placeholder="VD: cụ ông Nguyễn Văn A" aria-label={v.gio ? 'Người được giỗ' : 'Hương linh'} onChange={(e) => luu(datThongTinVk(bang, { nm: e.target.value }), '')} /></div></div>
      )}
      {thieu.length > 0 && <div className="tl-note" {...ndDau('vk.nhacThieu')}>{nd('vk.nhacThieu', { thieu: thieu.join(', ') })}</div>}
      <div className="sec-head"><h2>Lễ vật</h2><span className="more">{dat.filter((i) => i < le.length).length}/{le.length} đã sắm</span></div>
      <div className="vk-le">
        {le.map((t, i) => (
          <label key={i} className={dat.includes(i) ? 'ok' : ''} {...bam(() => luu(tickLeVat(bang, v.id, nam, i), ''))} role="checkbox" aria-checked={dat.includes(i)}>
            <i>{dat.includes(i) ? <Ico ten="check" s={12} /> : null}</i>{t}
          </label>
        ))}
      </div>
      {ndHien('hien.vkGoiYLe') && <div className="vk-goiy" {...ndDau('vk.leVatGoiY')}>{nd('vk.leVatGoiY')}</div>}
      <div className="sec-head"><h2>Cách sắp lễ</h2></div><div className="vk-cach">{v.cach}</div>
      <div className="sec-head"><h2>Văn khấn</h2>
        <span className="vk-fs"><button type="button" aria-label="Chữ nhỏ lại" onClick={() => luu(doiCoChu(bang, -1), '')}>A−</button><button type="button" aria-label="Chữ to lên" onClick={() => luu(doiCoChu(bang, 1), '')}>A+</button></span>
      </div>
      <div className="vk-txt" id="vkTxt" style={{ fontSize: vk.fs }}>{bai.map((dong, i) => <span key={i}>{i > 0 && <br />}{dong.map((d, k) => cham(d, k))}</span>)}</div>
      {!v.gio && <div style={{ margin: '12px 0' }}><NutNhac lon bat={!!vk.nhac[v.id]} doi={() => luu(doiNhacDip(bang, v.id), baoNhac(bang, v.id))} /></div>}
      <div className="care-disclaimer">{GHI_CHU_BAI}</div>
      {sua && <BangNoi tieuDe={nd('vk.suaTieu')} dong={() => datSua(null)} nhan={nd('vk.khungTieu')}><OThongTin bang={bang} luu={luu} hoSo={hoSo} lay={sua} /></BangNoi>}
    </>
  );
}
