import { LUNAR } from '../lich.js';
import { thuTrongTuan } from '../kehoach.js';
import { WD } from '../noiDung/keHoach.js';
import { IcoVe } from './BieuTuong.jsx';
import { bam } from './bam.js';

/** Ô "KẾ HOẠCH VÀ NHẮC VIỆC" ở Trang chủ (demo renderToday → #utilCal): ngày dương lớn + thứ, ngày âm, tiết khí, số việc hôm nay chưa xong. */
export default function OKeHoach({ homNay, soViec, mo }) {
  const l = LUNAR.solar2lunar(homNay.d, homNay.m, homNay.y), tm = LUNAR.term(l.jd);
  return (
    <div className="util cal" {...bam(mo)}>
      <div className="u-tag" style={{ display: 'flex' }}><IcoVe ten="clock" s={11} /> KẾ HOẠCH VÀ NHẮC VIỆC</div>
      <div className="u-row">
        <div className="u-cal"><b>{homNay.d}</b><span>{WD[thuTrongTuan(homNay)]}</span></div>
        <div className="u-as"><b>Trợ lý của bạn</b><span>Miễn phí</span></div>
      </div>
      <div className="u-k">Âm lịch {l.d}/{l.m}{l.leap ? ' nhuận' : ''}</div>
      <div className="u-h">Tiết {tm.name}</div>
      {soViec !== null && <div className="u-s">{soViec} việc hôm nay ›</div>}
    </div>
  );
}
