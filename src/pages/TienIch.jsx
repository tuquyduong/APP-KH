import { useState } from 'react';
import '../giaoDien/ke_hoach.css';
import { bayGio } from '../bayGio.js';
import { ghepMon } from '../tracNghiem.js';
import { TU_KHOA_MON } from '../noiDung/theChat.js';
import { BANNER, HOM_NAY } from '../noiDung/trangChu.js';
import { SS, SS_F, GIFT_HOL } from '../noiDung/keHoach.js';
import {
  homNayTuGio, holList, upList, muaNgay, conLai, dayThang, thuNgayNgan, bannerDangAn, doiNhacLe, docNgay,
  tenTiet, CO_NHAC,
} from '../kehoach.js';
import Man from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { AnhMon } from '../components/MonO.jsx';
import BannerNho from '../components/BannerNho.jsx';
import Thongbao from '../components/Thongbao.jsx';
import { bam } from '../components/bam.js';
import { dungKeHoach, datNgayMo } from '../components/dungKeHoach.js';
import { DauMan } from './KeHoach.jsx';

const LOI_KHO = 'Trình duyệt không cho lưu trên máy này (cửa sổ riêng tư?) — chưa lưu được';

// "Theo mùa" (demo renderTool nhánh 'mua'): bốn thẻ mùa, món hợp mùa ghép với menu POS (món không có / hết thì ẩn), liên kết về lịch tiết khí.
function TheoMua({ homNay, ds, chonMon, veLich }) {
  const hien = muaNgay(homNay).n;
  const [sel, datSel] = useState(hien);
  const z = SS[sel];
  const mon = [];
  z.p.forEach((id) => ghepMon(ds, [TU_KHOA_MON[id]], TU_KHOA_MON).forEach((m) => mon.includes(m) || mon.push(m)));
  return (
    <>
      <div className="ss-tabs">{Object.keys(SS).map((k) => <button type="button" key={k} className={k === sel ? 'on' : ''} onClick={() => datSel(k)}>{k}{k === hien ? ' · nay' : ''}</button>)}</div>
      <div className="ss-card">
        {SS_F.map(([f, l]) => <div className="ss-f" key={f}><small>{l}</small><div>{z[f]}</div></div>)}
        {mon.length > 0 && (
          <>
            <div className="ds-k" style={{ marginTop: 12 }}>Món Tứ Quý Đường hợp mùa {sel}</div>
            <div className="ds-prods">{mon.map((m) => <div key={m.ma} className="ds-p" style={{ background: 'var(--cream)' }} {...bam(() => chonMon(m))}><AnhMon mon={m} s={30} /><span>{m.ten}</span></div>)}</div>
          </>
        )}
      </div>
      <div className="tl-row" {...bam(veLich)}><div className="tl-rt"><b>Dưỡng sinh theo tiết {tenTiet(homNay)}</b><small>Lời khuyên chi tiết cho 15 ngày của tiết khí hiện tại ›</small></div></div>
      <div className="care-disclaimer">Cuối mỗi mùa có khoảng 18 ngày Tỳ vượng (Trường hạ): ăn uống điều độ, bớt đồ ngọt béo, giữ ấm bụng. Gợi ý mang tính tham khảo theo dưỡng sinh truyền thống.</div>
    </>
  );
}

// "Ngày lễ" (nhánh 'hol'): sắp theo ngày gần nhất; bật / tắt nhắc từng ngày. Gợi ý quà chỉ là chữ (chưa có thẻ quà — không nút mua).
function NgayLe({ homNay, bang, doiNhac }) {
  return (
    <>
      <div className="tl-note">Nhắc hiện khi bạn mở app. Chưa tự báo về điện thoại khi đóng app.</div>
      {holList(homNay).map((h) => {
        const bat = !!bang.leNhac[h.n];
        return (
          <div className="tl-row" key={h.n}>
            <div className="tl-date"><b>{dayThang(h.j)}</b><small>{conLai(h.j, homNay)}</small></div>
            <div className="tl-rt"><b>{h.n}</b><small>{h.cal} · {thuNgayNgan(h.j, homNay)}</small>
              {GIFT_HOL.includes(h.n) && <div className="tl-acts"><span style={{ cursor: 'default' }}>Gợi ý quà tặng cho dịp này</span></div>}</div>
            <button type="button" className={`tl-rm${bat ? ' on' : ''}`} aria-pressed={bat} onClick={() => doiNhac(h.n)}><Ico ten="bell" s={12} /> {bat ? 'Đang nhắc' : CO_NHAC}</button>
          </div>
        );
      })}
    </>
  );
}

// "Sắp tới" (nhánh 'up'): việc của tôi + ngày lễ trong 30 ngày. Bấm việc → mở lịch đúng ngày; bấm lễ → Ngày lễ.
function SapToi({ homNay, bang, moViec, moLe }) {
  const ds = upList(homNay, bang.viec);
  if (!ds.length) return <div className="empty-note">30 ngày tới chưa có việc gì.</div>;
  return ds.map((e, i) => (
    <div className="tl-row" key={`${e.j}-${i}`} {...bam(() => (e.k === 'Việc' ? moViec(e.ngay) : moLe()))}>
      <div className="tl-date"><b>{dayThang(e.j)}</b><small>{conLai(e.j, homNay)}</small></div>
      <div className="tl-rt"><b>{e.t}</b><small>{e.s}</small></div><span className="up-tag">{e.k}</span>
    </div>
  ));
}

const DAU = {
  theomua: ['Chăm sóc theo mùa', 'Dưỡng sinh theo bốn mùa · Ngũ hành'],
  ngayle: ['Ngày lễ trong năm', 'Bật nhắc những ngày bạn muốn chuẩn bị'],
  saptoi: ['Sắp tới', '30 ngày tới · gộp từ mọi tiện ích'],
};

/** Màn tiện ích của Kế hoạch (demo màn `tool`): `id` = theomua | ngayle | saptoi. Nút quay lại về /kehoach (`veLich`). */
export default function TienIch({ id, san = true, veLich, moTienIch, moBanner, ds = [], chonMon, banner = { ...HOM_NAY, anh: BANNER.anh }, homNay: homNayCho }) {
  const homNay = homNayCho || homNayTuGio(bayGio());
  const { bang, luu } = dungKeHoach(san);
  const [tb, datTb] = useState('');
  const [tieuDe, phu] = DAU[id];
  const luuVaBao = (moi, chu) => datTb(!san ? 'Đang lấy thông tin tài khoản, thử lại sau ít giây' : luu(moi) ? chu : LOI_KHO);
  return (
    <Man id="tool">
      <DauMan tieuDe={tieuDe} phu={phu} lui={veLich} />
      <BannerNho banner={banner} an={bannerDangAn(bang, homNay)} chon={moBanner} />
      <div id="toolBody">
        {id === 'theomua' && <TheoMua homNay={homNay} ds={ds} chonMon={chonMon} veLich={veLich} />}
        {id === 'ngayle' && <NgayLe homNay={homNay} bang={bang} doiNhac={(ten) => luuVaBao(doiNhacLe(bang, ten), bang.leNhac[ten] ? 'Đã tắt nhắc' : 'Đã bật nhắc · hiện khi bạn mở app')} />}
        {id === 'saptoi' && <SapToi homNay={homNay} bang={bang} moViec={(ngay) => { if (docNgay(ngay)) datNgayMo(ngay); veLich(); }} moLe={() => moTienIch('ngayle')} />}
      </div>
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
