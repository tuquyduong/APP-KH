import { bam } from './bam.js';

/** Thẻ mời đăng nhập, cùng dáng thẻ vàng hội viên của demo (points-card). `chu` = { tieuDe, phu, nut } từ noiDung/dangNhap.js. */
export default function TheMoi({ chu, moDangNhap }) {
  return (
    <div className="points-card pc-mini the-moi">
      <div className="card-top">
        <div className="hang-logo"><img className="tqd-logo tqd-mini" src="/anh/logo-nho.webp" alt="" /><div className="brand">{chu.tieuDe}</div></div>
      </div>
      <div className="card-bottom">
        <div className="phu">{chu.phu}</div>
        <span className="nut" {...bam(moDangNhap)}>{chu.nut}</span>
      </div>
    </div>
  );
}
