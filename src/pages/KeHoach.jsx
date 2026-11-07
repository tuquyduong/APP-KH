import { useState } from 'react';
import '../giaoDien/ke_hoach.css';
import { bayGio } from '../bayGio.js';
import { ghepMon } from '../tracNghiem.js';
import { TU_KHOA_MON } from '../noiDung/theChat.js';
import { BANNER, HOM_NAY } from '../noiDung/trangChu.js';
import {
  homNayTuGio, ngayChuoi, docNgay, theNgay, luoiThang, leTrongThang, chuThich, viecNgay, nhacHomNay, themViec, doiXong, xoaViec,
  anBannerHomNay, bannerDangAn, CO_NHAC, KHONG_NHAC,
} from '../kehoach.js';
import Man from '../components/Man.jsx';
import { Ico, DenLong } from '../components/BieuTuong.jsx';
import { AnhMon } from '../components/MonO.jsx';
import BannerNho from '../components/BannerNho.jsx';
import ThemViec from '../components/ThemViec.jsx';
import Thongbao from '../components/Thongbao.jsx';
import { bam } from '../components/bam.js';
import { dungKeHoach, layNgayMo } from '../components/dungKeHoach.js';

const LOI_KHO = 'Trình duyệt không cho lưu trên máy này (cửa sổ riêng tư?) — việc chưa được lưu';
const LOI_CHUA_BIET = 'Đang lấy thông tin tài khoản, thử lại sau ít giây';
const TIEN_ICH = [['theomua', 'Theo mùa', 'fan'], ['ngayle', 'Ngày lễ', 'lantern'], ['saptoi', 'Sắp tới', 'sprig']]; // 5 tiện ích của KH-UI-5c chưa hiện

/** Biểu tượng tranh tròn (demo EN): file the-chat-<tên>.svg tách từ demo; đèn lồng vẽ thẳng. */
export function TranhTron({ ten, s }) {
  return ten === 'lantern' ? <DenLong s={s} /> : <img className="en" src={`/anh/the-chat-${ten}.svg`} width={s} height={s} alt="" />;
}

/** Đầu màn con kiểu demo (nút quay lại + tiêu đề + nút phải). */
export function DauMan({ tieuDe, phu, lui, phai }) {
  return (
    <div className="topbar" style={{ justifyContent: 'flex-start', gap: 12 }}>
      <div className="back-btn" aria-label="Quay lại" {...bam(lui)}><Ico ten="back" s={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}><h1>{tieuDe}</h1><div className="sub">{phu}</div></div>
      {phai}
    </div>
  );
}

/** Màn Kế hoạch và nhắc việc (demo màn `lich`). `san` = đã biết khách là ai; `banner` = chữ banner "hôm nay" (mặc định của Trang chủ). */
export default function KeHoach({ san = true, lui, moTienIch, moBanner, moTracNghiem, coKetQuaTn = false, ds = [], chonMon, banner = { ...HOM_NAY, anh: BANNER.anh }, homNay: homNayCho }) {
  const homNay = homNayCho || homNayTuGio(bayGio());
  const { bang, luu, xoaHet } = dungKeHoach(san);
  const [chon, datChon] = useState(() => docNgay(layNgayMo()) || homNay);
  const [thang, datThang] = useState(() => ({ y: chon.y, m: chon.m }));
  const [them, datThem] = useState(false);
  const [tb, datTb] = useState('');
  const [hoiXoa, datHoiXoa] = useState(false);

  const luuVaBao = (moi, chu) => datTb(!san ? LOI_CHUA_BIET : luu(moi) ? chu : LOI_KHO);
  const doiThang = (n) => { let m = thang.m + n, y = thang.y; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } datThang({ y, m }); };
  const chonNgay = (d, m, y) => { datChon({ d, m, y }); if (m !== thang.m) datThang({ y, m }); };
  const veHomNay = () => { datChon(homNay); datThang({ y: homNay.y, m: homNay.m }); };
  const coViec = (d, m, y) => viecNgay(bang, ngayChuoi({ d, m, y })).length > 0;

  const the = theNgay(chon, homNay);
  const o = luoiThang(thang.y, thang.m, homNay, chon, coViec);
  const viec = viecNgay(bang, ngayChuoi(chon));
  const nhac = nhacHomNay(bang, homNay);
  const monTiet = [];
  the.tip[1].forEach((id) => ghepMon(ds, [TU_KHOA_MON[id]], TU_KHOA_MON).forEach((m) => monTiet.includes(m) || monTiet.push(m)));

  const luuViec = (v) => {
    if (!san) return LOI_CHUA_BIET;
    const moi = themViec(bang, v);
    if (!moi) return !v.tieu.trim() ? 'Nhập tên việc trước nhé' : !docNgay(v.ngay) ? 'Ngày chưa đúng, chọn lại nhé' : 'Đã đủ số việc lưu trên máy này, xoá bớt việc cũ nhé';
    const ok = luu(moi);
    datThem(false);
    const n = docNgay(v.ngay);
    if (n) { datChon(n); datThang({ y: n.y, m: n.m }); }
    datTb(ok ? (v.nhac ? 'Đã lưu · ' + CO_NHAC.toLowerCase() : 'Đã lưu việc') : LOI_KHO);
    return '';
  };

  return (
    <Man id="lich">
      <DauMan tieuDe="Kế Hoạch và Nhắc Việc" phu="Việc của tôi · âm dương lịch · dưỡng sinh theo tiết khí" lui={lui}
        phai={<div className="today-btn" {...bam(veHomNay)}>Hôm nay</div>} />
      <div id="calNoti">
        {nhac.length > 0 && (
          <div className="nt-bar on"><Ico ten="bell" s={14} /> <span>Hôm nay nhắc: {nhac.map((v) => v.gio + ' ' + v.tieu).join(' · ')}</span></div>
        )}
      </div>
      <BannerNho banner={banner} an={bannerDangAn(bang, homNay)} khiAn={() => { luuVaBao(anBannerHomNay(bang, homNay), 'Ẩn ở Lịch và tiện ích đến hết hôm nay'); }} chon={moBanner} />

      <div className="cal-hero" id="calHero">
        <div className="ch-ring"><TranhTron ten={the.mua.ic} s={40} /></div>
        <div className="ch-l"><div className="wd">{the.thu}</div><div className="big">{the.lon}</div><div className="my">{the.thang}</div></div>
        <div className="ch-r"><div className="k">Âm lịch</div><div className="ld">{the.ngayAm}<small>{the.thangAm}</small></div>
          <div className="cc">{the.namCanChi}<br />{the.thangNgayCanChi}</div></div>
        <div className="ch-term"><span className="tchip"><TranhTron ten="sprig" s={16} /> {the.chip}</span><span className="tleft">{the.conLai}</span></div>
        {the.le && <div className="ch-hol"><Ico ten="flag" s={13} /> {the.le}</div>}
      </div>

      <div className="tl-grid" id="toolGrid">
        <div className="tl-h">Tiện ích</div>
        <div className="tl-g six">
          {TIEN_ICH.map(([id, ten, ic]) => (
            <div key={id} className="tl" {...bam(() => moTienIch(id))}>
              <div className="tl-ic"><TranhTron ten={ic} s={38} /></div><b>{ten}</b><small>{chuThich(id === 'ngayle' ? 'hol' : id === 'saptoi' ? 'up' : 'mua', homNay, bang.viec)}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="cal-card">
        <div className="cal-nav"><span aria-label="Tháng trước" {...bam(() => doiThang(-1))}>‹</span><b>Tháng {thang.m} · {thang.y}</b><span aria-label="Tháng sau" {...bam(() => doiThang(1))}>›</span></div>
        <div className="cal-wd"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="sun">CN</span></div>
        <div className="cal-grid">
          {o.map((c) => (
            <div key={`${c.y}-${c.m}-${c.d}`} className={`cd ${[c.ngoai ? 'out' : '', c.homNay ? 'today' : '', c.chon ? 'sel' : '', c.cn ? 'sun' : '', c.le ? 'hol' : ''].join(' ')}`} {...bam(() => chonNgay(c.d, c.m, c.y))}>
              <b>{c.d}</b><small>{c.am}</small>{c.tiet && <em>{c.tiet}</em>}
              <span className="dots">{c.coViec && <i className="dm" />}{c.le && <i className="dh" />}</span>
            </div>
          ))}
        </div>
        <div className="cal-legend"><span><i className="dm" />Việc của tôi</span><span><i className="dh" />Ngày lễ</span><span><em>Aa</em>Tiết khí</span></div>
      </div>

      <div className="ds-card" id="calTip">
        <div className="ds-h">Dưỡng sinh tiết {the.tiet}</div>
        <div className="ds-t">{the.tip[0]}</div>
        {monTiet.length > 0 && (
          <>
            <div className="ds-k">Món hợp tiết này</div>
            <div className="ds-prods">{monTiet.map((m) => <div key={m.ma} className="ds-p" style={{ background: 'var(--cream)' }} {...bam(() => chonMon(m))}><AnhMon mon={m} s={30} /><span>{m.ten}</span></div>)}</div>
          </>
        )}
        {!coKetQuaTn && moTracNghiem && <div className="ds-tc cta" {...bam(moTracNghiem)}><TranhTron ten="fan" s={22} /> <span>Làm khảo sát thể chất để nhận gợi ý riêng cho bạn ›</span></div>}
      </div>

      <div className="sec-head" id="calAgendaHead"><h2>Việc của tôi · {chon.d}/{chon.m}</h2><span className="more" {...bam(() => datThem(true))}><Ico ten="plus" s={13} /> Thêm việc</span></div>
      <div id="calAgenda">
        {viec.length ? viec.map((v) => (
          <div key={v.id} className={`ag${v.xong ? ' done' : ''}`}>
            <span className="ck" aria-label={v.xong ? 'Bỏ đánh dấu xong' : 'Đánh dấu xong'} {...bam(() => luuVaBao(doiXong(bang, v.id), v.xong ? 'Đã bỏ đánh dấu xong' : 'Đã đánh dấu xong'))}>{v.xong ? <Ico ten="check" s={12} /> : null}</span>
            <span className="tm">{v.gio}</span>
            <div className="ti"><b>{v.tieu}</b><small><Ico ten="bell" s={11} /> {v.nhac ? CO_NHAC : KHONG_NHAC}</small></div>
            <span className="del" aria-label="Xoá việc" {...bam(() => luuVaBao(xoaViec(bang, v.id), 'Đã xoá việc'))}><Ico ten="close" s={12} /></span>
          </div>
        )) : <div className="empty-note">Chưa có việc nào. Bấm “Thêm việc” để ghi lại và nhận nhắc nhở.</div>}
      </div>

      <div className="sec-head"><h2>Ngày lễ trong tháng</h2></div>
      <div className="hol-list" id="calHols">
        {(() => {
          const le = leTrongThang(thang.y, thang.m);
          return le.length ? le.map((h) => <div key={h.n} className="hl" {...bam(() => chonNgay(h.d, thang.m, thang.y))}><b>{h.d}/{thang.m}</b><span>{h.n}{h.al}</span></div>) : <div className="empty-note">Tháng này không có ngày lễ lớn.</div>;
        })()}
      </div>
      <div className="care-disclaimer" style={{ marginTop: 14 }}>Lịch hiển thị âm dương lịch, tiết khí và ngày lễ. Gợi ý dưỡng sinh mang tính tham khảo theo thói quen ăn uống truyền thống.</div>
      <div className="care-disclaimer" style={{ marginTop: 8 }}>Việc và nhắc của bạn chỉ lưu trên máy này, không gửi đi đâu. Nhắc hiện khi bạn mở app.</div>
      <div className="tl-acts" style={{ justifyContent: 'center', marginTop: 10 }}>
        {hoiXoa
          ? <span {...bam(() => { datTb(xoaHet() ? 'Đã xoá dữ liệu Kế hoạch trên máy này' : 'Trình duyệt không cho xoá dữ liệu trên máy này'); datHoiXoa(false); })}>Bấm lần nữa để xoá hết việc và nhắc lễ trên máy này</span>
          : <span {...bam(() => datHoiXoa(true))}>Xoá toàn bộ dữ liệu Kế hoạch trên máy này</span>}
      </div>

      {them && <ThemViec ngay={ngayChuoi(chon)} luu={luuViec} dong={() => datThem(false)} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
