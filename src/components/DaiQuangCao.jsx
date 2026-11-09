import '../giaoDien/dai_quang_cao.css';
import { bam } from './bam.js';

/** Dải quảng cáo mảnh (KH-UI-5d, kiểu A chủ quán chọn 09.11): nhãn "HÔM NAY" · MỘT dòng chữ · "Xem ›". `chon` rỗng = chữ thuần, không bấm được, không "Xem ›". */
export default function DaiQuangCao({ chu, chon }) {
  return (
    <div className="dai-qc fx-a" {...(chon ? bam(chon) : {})}>
      <span className="dai-qc-nhan">HÔM NAY</span>
      <span className="dai-qc-chu">{chu}</span>
      {chon && <span className="dai-qc-xem">Xem ›</span>}
    </div>
  );
}
