import { useRef } from 'react';
import '../giaoDien/dai_quang_cao.css';
import { bam } from './bam.js';
import { dungAnhSangLuot } from './anhSangLuot.js';
import { tachBieuTuong } from '../quangCao.js';
import { ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';

/** Dải quảng cáo mảnh (KH-UI-5d kiểu A, ánh sáng lướt như banner KH-UI-5g): nhãn "HÔM NAY" · biểu tượng · MỘT dòng chữ · "Xem ›". `khoa` = khoá nội dung của dòng (quangCao.js: câu App tự viết hay lời POS). `chon` rỗng = chữ thuần, không bấm được, không "Xem ›". */
export default function DaiQuangCao({ chu, khoa = 'qc.pos', chon }) {
  const the = useRef(null);
  const { bieuTuong, chu: dong } = tachBieuTuong(chu);
  dungAnhSangLuot(the, [chu, !!chon]);
  return (
    <div className="dai-qc fx-a" ref={the} {...(chon ? bam(chon) : {})}>
      <i className="gl gl-a" />
      <span className="dai-qc-nhan gl gl-t"><span className="dot" /><Chu k="today.k" /></span>
      {bieuTuong && <span className="dai-qc-bt" aria-hidden="true">{bieuTuong}</span>}
      <span className="dai-qc-chu gl gl-t" {...ndDau(khoa)}>{dong}</span>
      {chon && <span className="dai-qc-xem gl gl-b"><Chu k="qc.xem" /></span>}
    </div>
  );
}
