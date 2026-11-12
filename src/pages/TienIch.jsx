import { useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { bayGio } from '../bayGio.js';
import { ghepMon } from '../tracNghiem.js';
import { TU_KHOA_MON } from '../noiDung/theChat.js';
import { SS, SS_F, GIFT_HOL } from '../noiDung/keHoach.js';
import {
  homNayTuGio, holList, upList, muaNgay, conLai, dayThang, thuNgayNgan, doiNhacLe, docNgay,
  tenTiet, CO_NHAC, datThongTinVk,
} from '../kehoach.js';
import Man from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { AnhMon } from '../components/MonO.jsx';
import Thongbao from '../components/Thongbao.jsx';
import { bam } from '../components/bam.js';
import { dungKeHoach, datNgayMo, diDen, luiDen, hoSoKhach, moMucSapToi } from '../components/dungKeHoach.js';
import { DanhSachNguoi, FormNguoi } from '../components/NguoiThan.jsx';
import MotDip, { DanhSachDip, dauDip } from '../components/VanKhanMan.jsx';
import { timDip } from '../vanKhan.js';
import { docDuongDan, taoDuongDan } from '../duongDan.js';
import { DauMan } from './KeHoach.jsx';
import XeCo from '../components/XeCo.jsx';
import UongThuoc from '../components/UongThuoc.jsx';
import ChuKy from '../components/ChuKy.jsx';

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

// "Sắp tới" (nhánh 'up'): việc của tôi, sinh nhật, giỗ, ngày cúng, ngày lễ trong 30 ngày. Bấm một dòng → mở đúng chỗ (moMucSapToi).
function SapToi({ homNay, bang, mo }) {
  const ds = upList(homNay, bang, hoSoKhach().xung_ho);
  if (!ds.length) return <div className="empty-note">30 ngày tới chưa có việc gì.</div>;
  return ds.map((e, i) => (
    <div className="tl-row" key={`${e.j}-${i}`} {...bam(() => mo(e))}>
      <div className="tl-date"><b>{dayThang(e.j)}</b><small>{conLai(e.j, homNay)}</small></div>
      <div className="tl-rt"><b>{e.t}</b><small>{e.s}</small></div><span className="up-tag">{e.k}</span>
    </div>
  ));
}

const DAU = {
  theomua: ['Chăm sóc theo mùa', 'Dưỡng sinh theo bốn mùa · Ngũ hành'],
  ngayle: ['Ngày cần nhớ', 'Bật nhắc ngày bạn muốn chuẩn bị'],
  ngaycannho: ['Ngày cần nhớ', 'Sinh nhật, ngày giỗ · âm hay dương lịch đều nhắc đúng'],
  vankhan: ['Văn khấn & lễ cúng', 'Ngày cúng, lễ vật, bài khấn tự điền tên của bạn'],
  saptoi: ['Sắp tới', '30 ngày tới · gộp từ mọi tiện ích'],
};
const DUONG_VAN_KHAN = taoDuongDan('tienich', { tienich: 'vankhan' });

/** Màn tiện ích của Kế hoạch (demo màn `tool`): `id` = theomua | ngayle | ngaycannho | vankhan | saptoi. Nút quay lại về /kehoach (`veLich`).
 *  `dip` = dịp cúng đang mở (/kehoach/vankhan/<dịp>): không truyền thì đọc từ địa chỉ trình duyệt (App chỉ truyền `id`). */
function TienIchChung({ id, san = true, veLich, moTienIch, ds = [], chonMon, homNay: homNayCho, dip: dipCho, tenKhach: tenCho }) {
  const homNay = homNayCho || homNayTuGio(bayGio());
  const { bang, luu } = dungKeHoach(san);
  const hoSo = tenCho !== undefined ? { ten: tenCho } : hoSoKhach(); // Tín chủ / Họ / Địa chỉ điền sẵn lấy từ tài khoản (E1)
  const [tb, datTb] = useState('');
  const [tab, datTab] = useState(id === 'ngayle' ? 'hol' : 'ppl'); // Ngày cần nhớ: 'ppl' Người thân · 'hol' Ngày lễ
  const [form, datForm] = useState(null); // null | { nguoi? } — bảng thêm / sửa người thân
  const dipId = id === 'vankhan' ? (dipCho !== undefined ? dipCho : typeof window !== 'undefined' ? docDuongDan(window.location.pathname).tham.dip : '') : '';
  const dipMo = dipId ? timDip(dipId) : null;
  const luuVaBao = (moi, chu) => {
    if (!san) { datTb('Đang lấy thông tin tài khoản, thử lại sau ít giây'); return false; }
    const ok = luu(moi);
    if (!ok) datTb(LOI_KHO); else if (chu) datTb(chu); // chu rỗng = lưu lặng lẽ (gõ chữ, tick lễ vật)
    return ok;
  };
  const gio = id === 'ngayle' || id === 'ngaycannho';
  const [tieuDe, phu] = dipMo ? dauDip(dipMo, homNay, bang) : gio && tab === 'hol' ? ['Ngày cần nhớ', 'Bật nhắc ngày bạn muốn chuẩn bị'] : DAU[id];
  const them = gio && tab === 'ppl' ? <div className="today-btn" {...bam(() => datForm({}))}>＋ Thêm</div> : null;
  const moVanKhanGio = (ten) => { luuVaBao(datThongTinVk(bang, { nm: ten }), ''); diDen(taoDuongDan('tienich', { tienich: 'vankhan', dip: 'gio' })); };
  const moDip = (dipMoi) => diDen(taoDuongDan('tienich', { tienich: 'vankhan', dip: dipMoi }));
  return (
    <Man id="tool">
      <DauMan tieuDe={tieuDe} phu={phu} lui={dipMo ? () => luiDen(DUONG_VAN_KHAN) : veLich} phai={them} />
      <div id="toolBody">
        {id === 'theomua' && <TheoMua homNay={homNay} ds={ds} chonMon={chonMon} veLich={veLich} />}
        {gio && (
          <>
            <div className="ss-tabs">{[['ppl', 'Người thân'], ['hol', 'Ngày lễ']].map(([k, ten]) => <button type="button" key={k} className={k === tab ? 'on' : ''} onClick={() => datTab(k)}>{ten}</button>)}</div>
            {tab === 'ppl' && <DanhSachNguoi homNay={homNay} bang={bang} luu={luuVaBao} moSua={(nguoi) => datForm({ nguoi })} moVanKhanGio={moVanKhanGio} />}
            {tab === 'hol' && <NgayLe homNay={homNay} bang={bang} doiNhac={(ten) => luuVaBao(doiNhacLe(bang, ten), bang.leNhac[ten] ? 'Đã tắt nhắc' : 'Đã bật nhắc · hiện khi bạn mở app')} />}
          </>
        )}
        {id === 'vankhan' && !dipMo && <DanhSachDip homNay={homNay} bang={bang} luu={luuVaBao} moDip={moDip} hoSo={hoSo} />}
        {dipMo && <MotDip dip={dipMo.id} homNay={homNay} bang={bang} hoSo={hoSo} luu={luuVaBao} />}
        {id === 'saptoi' && <SapToi homNay={homNay} bang={bang} mo={(e) => moMucSapToi(e, { moViec: (ngay) => { if (docNgay(ngay)) datNgayMo(ngay); veLich(); }, moTienIch })} />}
      </div>
      {form && <FormNguoi homNay={homNay} bang={bang} nguoi={form.nguoi} luu={luuVaBao} dong={() => datForm(null)} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}

const MAN_RIENG = { xeco: XeCo, uongthuoc: UongThuoc, chuky: ChuKy }; // ba tiện ích có màn riêng (KH-UI-5f), mỗi màn tự giữ trạng thái

/** Màn tiện ích: Xe cộ · Uống thuốc · Chu kỳ là màn riêng; còn lại dùng màn chung ở trên. */
export default function TienIch(props) {
  const Rieng = MAN_RIENG[props.id];
  return Rieng ? <Rieng homNay={props.homNay || homNayTuGio(bayGio())} san={props.san !== false} veLich={props.veLich} /> : <TienIchChung {...props} />;
}
