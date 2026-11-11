import { LUNAR } from '../lich.js';
import { thuTrongTuan } from '../kehoach.js';
import { WD } from '../noiDung/keHoach.js';
import { IcoVe } from './BieuTuong.jsx';
import { bam } from './bam.js';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';

/** Ô "KẾ HOẠCH VÀ NHẮC VIỆC" ở Trang chủ (demo renderToday → #utilCal): ngày dương lớn + thứ, ngày âm, tiết khí, số việc hôm nay chưa xong. */
export default function OKeHoach({ homNay, soViec, quaHan = 0, mo }) {
  const l = LUNAR.solar2lunar(homNay.d, homNay.m, homNay.y), tm = LUNAR.term(l.jd);
  return (
    <div className="util cal" {...bam(mo)}>
      <div className="u-tag" style={{ display: 'flex' }}><IcoVe ten="clock" s={11} /> <Chu k="home.cal.tag" /></div>
      <div className="u-row">
        <div className="u-cal" {...ndDau('home.lich')}><b>{homNay.d}</b><span>{WD[thuTrongTuan(homNay)]}</span></div>
        <div className="u-as"><Chu k="home.cala" as="b" /><Chu k="home.calb" /></div>
      </div>
      <Chu k="home.cal.am" as="div" className="u-k" bien={{ ngay: l.d, thang: l.m, nhuan: l.leap ? nd('home.cal.nhuan') : '' }} />
      <Chu k="home.cal.tiet" as="div" className="u-h" bien={{ tiet: tm.name }} />
      {soViec !== null && <div className="u-s" {...ndDau('home.cal.viec')}>{ndPhan('home.cal.viec', { so: soViec })}{quaHan > 0 && <span className="u-qh" aria-label={nd('home.cal.quaHan', { so: quaHan })}>{quaHan}</span>}</div>}
    </div>
  );
}
