import { useEffect, useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { bayGio } from '../bayGio.js';
import { ghepMon } from '../tracNghiem.js';
import { TU_KHOA_MON } from '../noiDung/theChat.js';
import { MUA } from '../noiDung/coDinh/lich.js';
import { nd, ndPhan, ndDs, ndDau } from '../noiDung/nd.js';
import {
  homNayTuGio, holList, upList, muaNgay, conLai, dayThang, thuNgayNgan, doiNhacLe, docNgay,
  tenTiet, leCoQua, datThongTinVk,
} from '../kehoach.js';
import Man from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { AnhMon } from '../components/MonO.jsx';
import Thongbao from '../components/Thongbao.jsx';
import { bam } from '../components/bam.js';
import { dungKeHoach, datNgayMo, diDen, luiDen, hoSoKhach, moMucSapToi, ocHien } from '../components/dungKeHoach.js';
import { DanhSachNguoi, FormNguoi } from '../components/NguoiThan.jsx';
import MotDip, { DanhSachDip, dauDip } from '../components/VanKhanMan.jsx';
import { timDip } from '../vanKhan.js';
import { docDuongDan, taoDuongDan } from '../duongDan.js';
import { DauMan } from './KeHoach.jsx';
import XeCo from '../components/XeCo.jsx';
import UongThuoc from '../components/UongThuoc.jsx';
import ChuKy from '../components/ChuKy.jsx';

// "Theo mùa" (demo renderTool nhánh 'mua'): bốn thẻ mùa, món hợp mùa ghép với menu POS (món không có / hết thì ẩn), liên kết về lịch tiết khí.
function TheoMua({ homNay, ds, chonMon, veLich }) {
  const hien = muaNgay(homNay).n;
  const [sel, datSel] = useState(hien);
  const z = ndDs('mua.noiDung').find((x) => x.mua === sel);
  const mon = [];
  z.p.split(',').map((id) => id.trim()).filter(Boolean).forEach((id) => ghepMon(ds, [TU_KHOA_MON[id]], TU_KHOA_MON).forEach((m) => mon.includes(m) || mon.push(m)));
  return (
    <>
      <div className="ss-tabs" {...ndDau('kh.lich')}>{MUA.map((k) => <button type="button" key={k} className={k === sel ? 'on' : ''} onClick={() => datSel(k)}>{k}{k === hien ? nd('mua.nay') : ''}</button>)}</div>
      <div className="ss-card">
        {['tang', 'an', 'uong', 'sh', 'tt', 'han'].map((f) => <div className="ss-f" key={f}><small {...ndDau(`mua.nhan.${f}`)}>{nd(`mua.nhan.${f}`)}</small><div {...ndDau('mua.noiDung')}>{z[f]}</div></div>)}
        {mon.length > 0 && (
          <>
            <div className="ds-k" style={{ marginTop: 12 }} {...ndDau('mua.mon')}>{ndPhan('mua.mon', { mua: sel })}</div>
            <div className="ds-prods">{mon.map((m) => <div key={m.ma} className="ds-p" style={{ background: 'var(--cream)' }} {...bam(() => chonMon(m))}><AnhMon mon={m} s={30} /><span>{m.ten}</span></div>)}</div>
          </>
        )}
      </div>
      <div className="tl-row" {...bam(veLich)}><div className="tl-rt"><b {...ndDau('mua.tiet')}>{ndPhan('mua.tiet', { tiet: tenTiet(homNay) })}</b><small {...ndDau('mua.tietPhu')}>{nd('mua.tietPhu')}</small></div></div>
      <div className="care-disclaimer" {...ndDau('mua.ghiChu')}>{nd('mua.ghiChu')}</div>
    </>
  );
}

// "Ngày lễ" (nhánh 'hol'): sắp theo ngày gần nhất; bật / tắt nhắc từng ngày. Gợi ý quà chỉ là chữ (chưa có thẻ quà — không nút mua).
function NgayLe({ homNay, bang, doiNhac }) {
  return (
    <>
      <div className="tl-note" {...ndDau('ngc.leGhiChu')}>{nd('ngc.leGhiChu')}</div>
      {holList(homNay).map((h) => {
        const bat = !!bang.leNhac[h.n];
        return (
          <div className="tl-row" key={h.n}>
            <div className="tl-date"><b>{dayThang(h.j)}</b><small>{conLai(h.j, homNay)}</small></div>
            <div className="tl-rt"><b>{h.n}</b><small>{h.cal} · {thuNgayNgan(h.j, homNay)}</small>
              {leCoQua().includes(h.n) && <div className="tl-acts"><span style={{ cursor: 'default' }} {...ndDau('ngc.goiYQua')}>{nd('ngc.goiYQua')}</span></div>}</div>
            <button type="button" className={`tl-rm${bat ? ' on' : ''}`} aria-pressed={bat} onClick={() => doiNhac(h.n)} {...ndDau(bat ? 'kh.dangNhac' : 'kh.coNhac')}><Ico ten="bell" s={12} /> {nd(bat ? 'kh.dangNhac' : 'kh.coNhac')}</button>
          </div>
        );
      })}
    </>
  );
}

// "Sắp tới" (nhánh 'up'): việc của tôi, sinh nhật, giỗ, ngày cúng, ngày lễ trong 30 ngày. Bấm một dòng → mở đúng chỗ (moMucSapToi).
function SapToi({ homNay, bang, mo }) {
  const ds = upList(homNay, bang, hoSoKhach().xung_ho);
  if (!ds.length) return <div className="empty-note" {...ndDau('sap.trong')}>{nd('sap.trong')}</div>;
  return ds.map((e, i) => (
    <div className="tl-row" key={`${e.j}-${i}`} {...bam(() => mo(e))}>
      <div className="tl-date"><b>{dayThang(e.j)}</b><small>{conLai(e.j, homNay)}</small></div>
      <div className="tl-rt"><b>{e.t}</b><small>{e.s}</small></div><span className="up-tag">{e.k}</span>
    </div>
  ));
}

const DAU = { // [khoá tiêu đề, khoá dòng phụ] của đầu màn từng tiện ích
  theomua: ['mua.tieuDe', 'mua.phu'],
  ngayle: ['ngc.tieuDe', 'ngc.phuLe'],
  ngaycannho: ['ngc.tieuDe', 'ngc.phuNguoi'],
  vankhan: ['vk.tieuDe', 'vk.phu'],
  saptoi: ['sap.tieuDe', 'sap.phu'],
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
    if (!san) { datTb(nd('ti.chuaSan')); return false; }
    const ok = luu(moi);
    if (!ok) datTb(nd('ti.loiKho')); else if (chu) datTb(chu); // chu rỗng = lưu lặng lẽ (gõ chữ, tick lễ vật)
    return ok;
  };
  const gio = id === 'ngayle' || id === 'ngaycannho';
  const khoaDau = gio && tab === 'hol' ? DAU.ngayle : DAU[id];
  const [tieuDe, phu] = dipMo ? dauDip(dipMo, homNay, bang) : khoaDau.map((k) => nd(k));
  const them = gio && tab === 'ppl' ? <div className="today-btn" {...bam(() => datForm({}))} {...ndDau('ngc.them')}>{nd('ngc.them')}</div> : null;
  const moVanKhanGio = (ten) => { luuVaBao(datThongTinVk(bang, { nm: ten }), ''); diDen(taoDuongDan('tienich', { tienich: 'vankhan', dip: 'gio' })); };
  const moDip = (dipMoi) => diDen(taoDuongDan('tienich', { tienich: 'vankhan', dip: dipMoi }));
  return (
    <Man id="tool">
      <DauMan tieuDe={tieuDe} phu={phu} khoaTieuDe={dipMo ? undefined : khoaDau[0]} khoaPhu={dipMo ? undefined : khoaDau[1]} lui={dipMo ? () => luiDen(DUONG_VAN_KHAN) : veLich} phai={them} />
      <div id="toolBody">
        {id === 'theomua' && <TheoMua homNay={homNay} ds={ds} chonMon={chonMon} veLich={veLich} />}
        {gio && (
          <>
            <div className="ss-tabs">{[['ppl', 'ngc.tabNguoi'], ['hol', 'ngc.tabLe']].map(([k, khoa]) => <button type="button" key={k} className={k === tab ? 'on' : ''} onClick={() => datTab(k)} {...ndDau(khoa)}>{nd(khoa)}</button>)}</div>
            {tab === 'ppl' && <DanhSachNguoi homNay={homNay} bang={bang} luu={luuVaBao} moSua={(nguoi) => datForm({ nguoi })} moVanKhanGio={moVanKhanGio} />}
            {tab === 'hol' && <NgayLe homNay={homNay} bang={bang} doiNhac={(ten) => luuVaBao(doiNhacLe(bang, ten), nd(bang.leNhac[ten] ? 'kh.daTatNhac' : 'kh.daBatNhac'))} />}
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
  const xung = props.xungHo !== undefined ? props.xungHo : hoSoKhach().xung_ho;
  const an = !!Rieng && !ocHien(props.id, xung); // ô đã ẩn (xưng hô anh / chú / bác / ông, hoặc tắt ở /admin) thì đường dẫn cũng không mở: thay bằng /kehoach, Back không kẹt (B1)
  useEffect(() => { if (an && props.thayVeLich) props.thayVeLich(); }, [an]);
  if (an) return null;
  return Rieng ? <Rieng homNay={props.homNay || homNayTuGio(bayGio())} san={props.san !== false} veLich={props.veLich} /> : <TienIchChung {...props} />;
}
