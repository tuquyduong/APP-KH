import { Ico } from './BieuTuong.jsx';
import { TranhTienIch } from './BieuTuongTienIch.jsx';
import { bam } from './bam.js';
import { CO_NHAC, thuNgayNgan, datThongTinVk, tickLeVat, doiNhacDip, doiCoChu } from '../kehoach.js';
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

function NutNhac({ bat, doi, lon = false }) {
  return <button type="button" className={`tl-rm${lon ? ' big' : ''}${bat ? ' on' : ''}`} aria-pressed={bat} onClick={(e) => { e.stopPropagation(); doi(); }}><Ico ten="bell" s={12} /> {bat ? 'Đang nhắc' : CO_NHAC}</button>;
}
const baoNhac = (bang, id) => (bang.vk.nhac[id] ? 'Đã tắt nhắc' : 'Đã bật nhắc · hiện khi bạn mở app');

/** Danh sách dịp cúng (demo nhánh 'vk'): thẻ lớn "Sắp tới" + các dịp còn lại theo ngày; mỗi dịp có nút nhắc (trừ Cúng giỗ). */
export function DanhSachDip({ homNay, bang, luu, moDip }) {
  const ds = dipSapXep(homNay, bang.nguoi), dau = ds[0];
  return (
    <>
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

const Mark = ({ d }) => (d.mark ? <mark>{d.t}</mark> : d.t);

/** Một dịp (demo renderVkOne): thông tin Tín chủ, lễ vật đánh dấu đã sắm, cách sắp lễ, bài khấn tự điền, cỡ chữ. Không "Đọc to", không "Đặt hoa quả, trà" (chưa có). */
export default function MotDip({ dip, homNay, bang, tenKhach, luu }) {
  const v = timDip(dip);
  if (!v) return null;
  const j = vkNext(v, homNay, bang.nguoi), jj = j || jd(homNay), vk = bang.vk;
  const nm = vk.nm || (v.gio ? (gioSapToi(bang.nguoi, homNay) || {}).ten : '') || '';
  const ten = vk.ten || tenKhach || '';
  const bai = dienBai(v, { ten, dc: vk.dc, ho: vk.ho, nm }, jj);
  const le = v.le.split('\n').filter(Boolean), nam = tuJd(jj).y, dat = vk.tick[`${v.id}:${nam}`] || [];
  const o = (nhan, gtri, truong, rong = false, goiY = '') => (
    <div className={`vk-ii${rong ? ' w' : ''}`}><small>{nhan}</small><input value={gtri} placeholder={goiY} aria-label={nhan} onChange={(e) => luu(datThongTinVk(bang, { [truong]: e.target.value }), '')} /></div>
  );
  return (
    <>
      <div className="vk-info">
        {o('Tín chủ', ten, 'ten')}{o('Họ gia tiên', vk.ho, 'ho')}{o('Địa chỉ', vk.dc, 'dc', true)}
        {v.needNm && o(v.gio ? 'Người được giỗ' : 'Hương linh', nm, 'nm', true, 'VD: cụ ông Nguyễn Văn A')}
        <div className="tl-note" style={{ margin: '6px 0 0' }}>Điền một lần, mọi bài khấn tự dùng. Ngày âm và năm tự điền theo lịch.</div>
      </div>
      <div className="sec-head"><h2>Lễ vật</h2><span className="more">{dat.filter((i) => i < le.length).length}/{le.length} đã sắm</span></div>
      <div className="vk-le">
        {le.map((t, i) => (
          <label key={i} className={dat.includes(i) ? 'ok' : ''} {...bam(() => luu(tickLeVat(bang, v.id, nam, i), ''))} role="checkbox" aria-checked={dat.includes(i)}>
            <i>{dat.includes(i) ? <Ico ten="check" s={12} /> : null}</i>{t}
          </label>
        ))}
      </div>
      <div className="sec-head"><h2>Cách sắp lễ</h2></div><div className="vk-cach">{v.cach}</div>
      <div className="sec-head"><h2>Văn khấn</h2>
        <span className="vk-fs"><button type="button" aria-label="Chữ nhỏ lại" onClick={() => luu(doiCoChu(bang, -1), '')}>A−</button><button type="button" aria-label="Chữ to lên" onClick={() => luu(doiCoChu(bang, 1), '')}>A+</button></span>
      </div>
      <div className="vk-txt" id="vkTxt" style={{ fontSize: vk.fs }}>{bai.map((dong, i) => <span key={i}>{i > 0 && <br />}{dong.map((d, k) => <Mark key={k} d={d} />)}</span>)}</div>
      {!v.gio && <div style={{ margin: '12px 0' }}><NutNhac lon bat={!!vk.nhac[v.id]} doi={() => luu(doiNhacDip(bang, v.id), baoNhac(bang, v.id))} /></div>}
      <div className="care-disclaimer">{GHI_CHU_BAI}</div>
    </>
  );
}
