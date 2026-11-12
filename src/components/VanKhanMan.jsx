import { useState } from 'react';
import { Ico } from './BieuTuong.jsx';
import BangNoi from './BangNoi.jsx';
import { nd, ndPhan, ndDau, ndHien } from '../noiDung/nd.js';
import { TranhTienIch } from './BieuTuongTienIch.jsx';
import { bam } from './bam.js';
import { thuNgayNgan, datThongTinVk, thongTinVk, tickLeVat, doiNhacDip, doiCoChu } from '../kehoach.js';
import { dipSapXep, vkNext, dienBai, gioSapToi, chuConLai, timDip, tenDip, leVatDip, cachSapDip } from '../vanKhan.js';
import { lichAm, jd, tuJd } from '../kehoachLap.js';

const amDm = (j) => { const l = lichAm(j); return `${l.d}/${l.m}`; };

/** [tiêu đề, dòng phụ] của đầu màn một dịp (demo renderVkOne.tHead). */
export function dauDip(v, homNay, bang) {
  const j = vkNext(v, homNay, bang.nguoi);
  return [tenDip(v), j ? nd('vk.dauDip', { thu: thuNgayNgan(j, homNay), am: amDm(j), con: chuConLai(j, homNay) }) : nd('vk.khongGio')];
}

export function NutNhac({ bat, doi, lon = false }) {
  return <button type="button" className={`tl-rm${lon ? ' big' : ''}${bat ? ' on' : ''}`} aria-pressed={bat} onClick={(e) => { e.stopPropagation(); doi(); }}><Ico ten="bell" s={12} /> <span {...ndDau(bat ? 'kh.dangNhac' : 'kh.coNhac')}>{nd(bat ? 'kh.dangNhac' : 'kh.coNhac')}</span></button>;
}
const baoNhac = (bang, id) => nd(bang.vk.nhac[id] ? 'kh.daTatNhac' : 'kh.daBatNhac');

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
        <div className="vk-k" {...ndDau('vk.sapToi')}>{nd('vk.sapToi')}</div><b {...ndDau(`vkd.${dau.v.id}.ten`)}>{tenDip(dau.v)}</b>
        <span {...ndDau('vk.dauDip')}>{ndPhan('vk.dauDip', { thu: thuNgayNgan(dau.j, homNay), am: amDm(dau.j), con: chuConLai(dau.j, homNay) })}</span><em {...ndDau('vk.xemLe')}>{nd('vk.xemLe')}</em>
      </div>
      {ds.slice(1).map(({ v, j }) => (
        <div className="tl-row" key={v.id} {...bam(() => moDip(v.id))}>
          <div className="tl-ri"><TranhTienIch ten={v.ic} s={34} /></div>
          <div className="tl-rt"><b {...ndDau(`vkd.${v.id}.ten`)}>{tenDip(v)}</b><small {...ndDau(j ? 'vk.dongDip' : 'vk.khongGio')}>{j ? nd('vk.dongDip', { thu: thuNgayNgan(j, homNay), am: amDm(j), con: chuConLai(j, homNay) }) : nd('vk.khongGio')}</small></div>
          {!v.gio && <NutNhac bat={!!bang.vk.nhac[v.id]} doi={() => luu(doiNhacDip(bang, v.id), baoNhac(bang, v.id))} />}
        </div>
      ))}
      <div className="care-disclaimer" style={{ marginTop: 12 }} {...ndDau('vk.ghiChuDs')}>{nd('vk.ghiChuDs')}</div>
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
  const le = leVatDip(v).split('\n').filter(Boolean), nam = tuJd(jj).y, dat = vk.tick[`${v.id}:${nam}`] || [];
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
        <div className="vk-info"><div className="vk-ii w"><small {...ndDau(v.gio ? 'vk.nguoiGio' : 'vk.huongLinh')}>{nd(v.gio ? 'vk.nguoiGio' : 'vk.huongLinh')}</small>
          <input id="vk-nm" value={nm} placeholder={nd('vk.nmGoiY')} aria-label={nd(v.gio ? 'vk.nguoiGio' : 'vk.huongLinh')} onChange={(e) => luu(datThongTinVk(bang, { nm: e.target.value }), '')} /></div></div>
      )}
      {thieu.length > 0 && <div className="tl-note" {...ndDau('vk.nhacThieu')}>{nd('vk.nhacThieu', { thieu: thieu.join(', ') })}</div>}
      <div className="sec-head"><h2 {...ndDau('vk.leVat')}>{nd('vk.leVat')}</h2><span className="more" {...ndDau('vk.daSam')}>{ndPhan('vk.daSam', { da: dat.filter((i) => i < le.length).length, tong: le.length })}</span></div>
      <div className="vk-le" {...ndDau(`vkd.${v.id}.le`)}>
        {le.map((t, i) => (
          <label key={i} className={dat.includes(i) ? 'ok' : ''} {...bam(() => luu(tickLeVat(bang, v.id, nam, i), ''))} role="checkbox" aria-checked={dat.includes(i)}>
            <i>{dat.includes(i) ? <Ico ten="check" s={12} /> : null}</i>{t}
          </label>
        ))}
      </div>
      {ndHien('hien.vkGoiYLe') && <div className="vk-goiy" {...ndDau('vk.leVatGoiY')}>{nd('vk.leVatGoiY')}</div>}
      <div className="sec-head"><h2 {...ndDau('vk.cachSap')}>{nd('vk.cachSap')}</h2></div><div className="vk-cach" {...ndDau(`vkd.${v.id}.cach`)}>{cachSapDip(v)}</div>
      <div className="sec-head"><h2 {...ndDau('vk.vanKhan')}>{nd('vk.vanKhan')}</h2>
        <span className="vk-fs"><button type="button" aria-label={nd('vk.chuNho')} onClick={() => luu(doiCoChu(bang, -1), '')}>A−</button><button type="button" aria-label={nd('vk.chuTo')} onClick={() => luu(doiCoChu(bang, 1), '')}>A+</button></span>
      </div>
      <div className="vk-txt" id="vkTxt" style={{ fontSize: vk.fs }} {...ndDau(`vkd.${v.id}.khan`)}>{bai.map((dong, i) => <span key={i}>{i > 0 && <br />}{dong.map((d, k) => cham(d, k))}</span>)}</div>
      {!v.gio && <div style={{ margin: '12px 0' }}><NutNhac lon bat={!!vk.nhac[v.id]} doi={() => luu(doiNhacDip(bang, v.id), baoNhac(bang, v.id))} /></div>}
      <div className="care-disclaimer" {...ndDau('vk.ghiChuBai')}>{nd('vk.ghiChuBai')}</div>
      {sua && <BangNoi tieuDe={nd('vk.suaTieu')} dong={() => datSua(null)} nhan={nd('vk.khungTieu')}><OThongTin bang={bang} luu={luu} hoSo={hoSo} lay={sua} /></BangNoi>}
    </>
  );
}
