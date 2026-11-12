import { bam } from './bam.js';
import { ndDau } from '../noiDung/nd.js';

/** Thẻ mời đăng nhập, cùng dáng thẻ vàng hội viên của demo (points-card). `chu` = { tieuDe, phu, nut }; `anh` = đường dẫn ảnh (người gọi truyền, theo khoá nội dung của mình); `khoa` = { tieuDe, phu, nut, anh } khoá nội dung để đánh dấu chỗ sửa. */
export default function TheMoi({ chu, khoa = {}, anh, moDangNhap }) {
  const dau = (t) => (khoa[t] ? ndDau(khoa[t]) : {});
  return (
    <div className="points-card pc-mini the-moi">
      <div className="card-top">
        <div className="hang-logo"><img className="tqd-logo tqd-mini" src={anh} alt="" {...dau('anh')} /><div className="brand" {...dau('tieuDe')}>{chu.tieuDe}</div></div>
      </div>
      <div className="card-bottom">
        <div className="phu" {...dau('phu')}>{chu.phu}</div>
        <span className="nut" {...bam(moDangNhap)} {...dau('nut')}>{chu.nut}</span>
      </div>
    </div>
  );
}
